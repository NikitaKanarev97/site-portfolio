from pathlib import Path
import json, shutil
folder=Path(__file__).resolve().parent
root=folder.parents[2]
rows=json.loads((folder/'B-wrap.json').read_text(encoding='utf-8'))
overrides={
 'Import and manual entry feed a shared specification':'A shared list',
 'Show the answer before asking for trust':'An answer comes first',
 'Publication preserves the owner’s copy':'The owner keeps a copy',
 'Завершение нужно подтвердить':'Завершить шаг',
}
files={
 '/work/agent-ops-console/':'src/copy/cases/agent-ops-console.ts',
 '/ru/work/agent-ops-console/':'src/copy/ru/cases/agent-ops-console.ts',
 '/work/partner-portal/':'src/copy/cases/partner-portal.ts',
 '/ru/work/partner-portal/':'src/copy/ru/cases/partner-portal.ts',
 '/work/learn/':'src/copy/cases/learn.ts','/ru/work/learn/':'src/copy/cases/learn.ts',
 '/work/vet-clinic/':'src/copy/cases/vet-clinic.ts','/ru/work/vet-clinic/':'src/copy/cases/vet-clinic.ts',
 '/ru/work/pawly/':'src/copy/cases/pawly.ts',
}
replacements={}
for row in rows:
    for old,value in row['headings'].items():
        selected=overrides.get(old,value['selected'])
        assert selected, old
        replacements.setdefault(files[row['route']],[]).append((old,selected))
        value['selected']=selected
paragraphs={
 'src/copy/cases/learn.ts':[
  ('The archive leads with courses, ratings and rewards. Returning to my work at DSSL / TRASSIR, I reframed entry around a question or programme, with the answer open before sign-in. The screens use invented account and document data.', 'The archive leads with courses and rewards. Revisiting my DSSL / TRASSIR work, I made the question or programme the entry point, with answers open before sign-in. Account and document data are invented.'),
  ('В архивном каталоге сначала идут курсы, рейтинги и награды. Я вернулся к своей работе в DSSL / TRASSIR и сделал входом рабочий вопрос или программу: ответ можно прочитать до авторизации. Данные аккаунтов и документов на экранах вымышлены.', 'В архивном каталоге сначала идут курсы и награды. Я вернулся к своей работе в DSSL / TRASSIR: входом стал вопрос или программа, ответ доступен до авторизации. Данные аккаунтов и документов вымышлены.'),
 ],
 'src/copy/cases/vet-clinic.ts':[
  ('The clinic is under NDA; names and clinical data shown here are invented. I separated a useful trace from the complete record. Thirty seconds between patients was the original constraint, not a measured speed of the new interface.', 'The clinic is under NDA; names and clinical data are invented. I separated a useful trace from the full record. Thirty seconds between patients was the design constraint, not a measured interface speed.'),
 ],
 'src/copy/cases/pawly.ts':[
  ('An owner at work hands over a pet, sometimes the keys. I framed trust as inspectable evidence: who can handle this dog, when they should return, and what has actually been received. Characters and scenario data shown here are invented.', 'Owners hand over a dog and sometimes keys. Trust rests on who can handle the dog, when it should return and which photos have arrived. Characters and scenario data are invented.'),
 ],
}
counts=[]
for rel,pairs in paragraphs.items():
    replacements.setdefault(rel,[]).extend(pairs)
    counts.extend({'file':rel,'words':len(new.split()),'text':new} for old,new in pairs)
for rel,pairs in replacements.items():
    p=root/rel
    backup=folder/'B-wrap-before'/rel
    backup.parent.mkdir(parents=True,exist_ok=True)
    if not backup.exists(): shutil.copy2(p,backup)
    text=p.read_text(encoding='utf-8')
    for old,new in pairs:
        assert old in text, old
        text=text.replace(old,new)
    p.write_text(text,encoding='utf-8',newline='')
(folder/'B-wrap.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
(folder/'B-paragraphs.json').write_text(json.dumps(counts,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Applied 19 headings and 4 paragraphs in {len(replacements)} owned files. Paragraph word counts: '+', '.join(str(x['words']) for x in counts))
