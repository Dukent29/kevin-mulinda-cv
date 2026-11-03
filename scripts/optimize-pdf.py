"""Compress exports without rasterizing text or removing hyperlinks."""
from pathlib import Path
import io, sys
from decimal import Decimal

root = Path(__file__).resolve().parent.parent
sys.path[:0] = [str(root / '.pdf-tools'), str(root / '.font-tools')]
import pikepdf
from PIL import Image
from fontTools.ttLib import TTFont
from fontTools import subset

for name in sys.argv[1:]:
    file = Path(name)
    with pikepdf.open(file) as pdf:
        # Browser geometry has excessive floating-point precision. One
        # thousandth of a CSS pixel is well below visible print resolution.
        for page in pdf.pages:
            instructions = []
            for operands, operator in pikepdf.parse_content_stream(page):
                operands = [round(value, 3) if isinstance(value, Decimal) else value for value in operands]
                instructions.append((operands, operator))
            page.Contents = pdf.make_stream(pikepdf.unparse_content_stream(instructions))
        for obj in pdf.objects:
            if not isinstance(obj, pikepdf.Stream):
                continue
            if obj.get('/Subtype') == '/Image' and obj.get('/Filter') == '/DCTDecode':
                # About 200 dpi at its small printed size; keep text as vectors.
                image = Image.open(io.BytesIO(obj.read_raw_bytes())).convert('RGB')
                image.thumbnail((180, 186), Image.Resampling.LANCZOS)
                buffer = io.BytesIO()
                image.save(buffer, format='JPEG', quality=65, optimize=True)
                if len(buffer.getvalue()) < len(obj.read_raw_bytes()):
                    obj.write(buffer.getvalue(), filter=pikepdf.Name.DCTDecode)
                    obj.ColorSpace = pikepdf.Name.DeviceRGB
                    obj.Width, obj.Height = image.size
            if '/Length1' in obj:
                # Keep glyph indices because PDF CID maps refer to them.
                font = TTFont(io.BytesIO(obj.read_bytes()))
                options = subset.Options()
                options.hinting = False
                options.retain_gids = True
                processor = subset.Subsetter(options=options)
                processor.populate(glyphs=font.getGlyphOrder())
                processor.subset(font)
                buffer = io.BytesIO()
                font.save(buffer)
                obj.write(buffer.getvalue())
                obj.Length1 = len(buffer.getvalue())
        pdf.remove_unreferenced_resources()
        output = file.with_suffix('.optimized.pdf')
        pdf.save(output, compress_streams=True, recompress_flate=True,
                 object_stream_mode=pikepdf.ObjectStreamMode.generate)
    size = output.stat().st_size
    if size >= 50_000:
        raise ValueError(f'{file.name}: {size} bytes exceeds the strict 50 KB budget')
    output.replace(file)
    print(f'{file.name}: {size:,} bytes (< 50,000)')
