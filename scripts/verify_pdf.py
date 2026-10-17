from pathlib import Path
from pypdf import PdfReader
import pypdfium2 as pdfium
import json
root=Path(__file__).resolve().parent.parent
results=[]
for lang in ['FR','EN']:
 texts=[]
 for theme in ['light','dark']:
  suffix='_DARK' if theme=='dark' else ''
  file=root/f'Kevin_Mulinda_Bruce_CV_{lang}{suffix}.pdf'
  reader=PdfReader(file)
  assert len(reader.pages)==1
  text='\n'.join(p.extract_text() for p in reader.pages)
  for phrase in ['Bouygues','Kotan Voyage','Horspiste','Espoir Jeunes','BearStudio','Oracle','Nuxt.js','Next.js','Smart Gardening']:
   assert phrase in text,phrase
  assert ('courant' if lang=='FR' else 'fluent') in text
  links=[a.get_object().get('/A',{}).get('/URI') for p in reader.pages for a in p.get('/Annots',[])]
  for link in ['mailto:mulindakevin7@gmail.com','tel:+33626993695','https://github.com/dukent29','https://www.linkedin.com/in/mulindakevin']:
   assert link in links,link
  doc=pdfium.PdfDocument(str(file))
  for i,p in enumerate(reader.pages):
   assert abs(float(p.mediabox.width)-595.28)<1 and abs(float(p.mediabox.height)-841.89)<1
   doc[i].render(scale=1.2).to_pil().save(root/f'artifacts/pdf-{lang}-{theme}-{i+1}.png')
  (root/f'artifacts/pdf-{lang}-{theme}.txt').write_text(text,encoding='utf-8')
  texts.append(text)
  results.append({'language':lang,'theme':theme,'pages':len(reader.pages),'bytes':file.stat().st_size,'characters':len(text),'links':links})
 assert texts[0]==texts[1]
 assert (root/f'Kevin_Mulinda_Bruce_CV_{lang}.pdf').read_bytes()!=(root/f'Kevin_Mulinda_Bruce_CV_{lang}_DARK.pdf').read_bytes()
(root/'artifacts/pdf-validation.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2))

