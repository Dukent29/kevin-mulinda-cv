from pathlib import Path
from fontTools import subset
root=Path(__file__).resolve().parent.parent
css=[]
for file in sorted((root/'fonts').glob('*.ttf')):
    options=subset.Options()
    options.flavor='woff2'
    font=subset.load_font(str(file),options)
    processor=subset.Subsetter(options=options)
    processor.populate(unicodes=list(range(0x20,0x250))+list(range(0x2000,0x2070))+list(range(0x2190,0x2200)))
    processor.subset(font)
    output=file.with_suffix('.woff2')
    subset.save_font(font,str(output),options)
    family,weight=file.stem.split('-')
    css.append("@font-face{font-family:'"+family.title()+"';font-style:normal;font-weight:"+weight+";font-display:swap;src:url('fonts/"+output.name+"') format('woff2');}")
(root/'fonts.css').write_text('\n'.join(css)+'\n',encoding='utf-8')
print('Compressed',len(css),'local fonts')
