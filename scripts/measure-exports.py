"""Local PDF open/render benchmark; not the operating system print dialog."""
from pathlib import Path
import json, statistics, sys, time
import pypdfium2 as pdfium

root = Path(__file__).resolve().parent.parent
results = []
for file in sorted(root.glob('Kevin_Mulinda_Bruce_CV*.pdf')):
    timings = []
    for _ in range(5):
        start = time.perf_counter()
        with pdfium.PdfDocument(file) as doc:
            for page in doc:
                bitmap = page.render(scale=1.5)
                bitmap.close()
                page.close()
        timings.append((time.perf_counter() - start) * 1000)
    results.append({'file': file.name, 'bytes': file.stat().st_size,
                    'open_and_render_median_ms': round(statistics.median(timings), 2)})
output = root / 'artifacts' / f'exports-{sys.argv[1]}.json'
output.write_text(json.dumps(results, indent=2), encoding='utf-8')
print(output.read_text())
