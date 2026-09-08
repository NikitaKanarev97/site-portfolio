import {fixture,check,ab,ev,dir,locale,width,pick,click,state,open,assert,shot} from './browser.mjs'
import {writeFileSync} from 'node:fs'
try {
  let examStart
  if(process.argv[4]==='tail') {
    const f=fixture('marina-19-answers','/home',s=>{s.activeExam.deadlineAt=new Date(Date.now()+1800000).toISOString();s.activeExam.index=19;return s})
    open(`/assessment?attemptId=${f.activeExam.id}`)
    examStart=state().activeExam
    const rows=ab('snapshot','-i').split('\n').filter(l=>l.includes('radio "'))
    ab('click','@'+rows[examStart.questions[19].correct].match(/ref=(e\d+)/)[1])
  } else {
  fixture('marina-one','/material/camera-count')
  check('material reading')
  const read = state()
  assert(read.history.length===2 && read.progress.proekt.doneUnitIds.length===1,'Reading changed completion')
  click('link',pick('Designing a system for 64+ cameras','Проектирование системы на 64+ камеры'))
  check('material to programme')
  click('button',pick('Continue','Продолжить'))
  check('resume second unit')
  assert(state().progress.proekt.doneUnitIds.length===1,'Player opening completed a unit')
  shot('player')
  click('button',pick('Complete and continue','Завершить и далее'))
  check('explicit completion advances player')
  const completed=state()
  assert(completed.progress.proekt.doneUnitIds.length===2 && completed.progress.proekt.cursor===2,'Completion failed')
  click('button',pick('My learning','Моё обучение'))
  check('personal space after completion')
  shot('my')
  open('/assessment/intro?trajectoryId=proekt')
  check('assessment gated before eligibility')
  assert(!state().activeExam,'Gate started exam')
  open('/practice?trajectoryId=proekt')
  check('practice initial')
  assert(checksMode()==='Project','Practice lost task colour')
  const options=ab('snapshot','-i').split('\n').filter(l=>l.includes('radio "'))
  assert(options.length===4,'Practice options missing')
  ab('click','@'+options[1].match(/ref=(e\d+)/)[1])
  click('button',pick('Check answer','Проверить ответ'))
  const wrong=check('practice wrong answer and explanation')
  assert(wrong.text.includes(pick('Your answer','Ваш ответ')) && wrong.text.includes(pick('Correct answer','Правильный ответ')),'Missing explanation')
  shot('practice-wrong')
  ab('reload')
  check('practice wrong answer survives reload')
  assert(state().progress.proekt.doneUnitIds.length===2 && !state().activeExam,'Practice changed eligibility')
  fixture('marina-ready','/assessment/intro?trajectoryId=proekt')
  check('eligible assessment rules')
  click('button',pick('Start assessment','Начать зачёт'))
  check('fresh assessment attempt')
  assert(checksMode()==='Neutral','Assessment not Neutral')
  examStart=state().activeExam
  const answer=(index)=>{
    const e=state().activeExam
    const rows=ab('snapshot','-i').split('\n').filter(l=>l.includes('radio "'))
    ab('click','@'+rows[e.questions[index].correct].match(/ref=(e\d+)/)[1])
  }
  answer(0)
  click('button',pick('Next','Далее'))
  ab('reload')
  const resumed=state().activeExam
  assert(resumed.id===examStart.id && resumed.deadlineAt===examStart.deadlineAt && resumed.index===1 && resumed.answers[0]===examStart.questions[0].correct,'Reload lost exam state')
  check('attempt reload retains answer cursor and deadline')
  shot('assessment')
  for(let i=1;i<examStart.questions.length;i++) {
    answer(i)
    if(i<examStart.questions.length-1) click('button',pick('Next','Далее'))
  }
  }
  click('button',pick('Submit answers','Отправить на проверку'))
  check('assessment submit confirmation')
  click('button',pick('Submit','Отправить'))
  ab('wait','800')
  check('assessment passed result')
  const passed=state(), result=passed.attempts.proekt.at(-1)
  assert(result.correct===20 && result.wrong===0 && result.skipped===0 && result.passed && result.id===examStart.id,'Score changed by locale')
  assert(passed.certificates.length===1 && passed.progress.proekt.doneUnitIds.length===9,'Missing completion or document')
  shot('result')
  click('button',pick('Open document','Открыть документ'))
  check('fresh certificate',['ООО Учебный пример'])
  shot('certificate')
  // Observe the actual Blob produced by the download button without changing it.
  ev(`window.__download=null;window.__createObjectURL=URL.createObjectURL;URL.createObjectURL=function(blob){window.__download=blob;return window.__createObjectURL(blob)};true`)
  click('button',pick('Download document · HTML','Скачать документ · HTML'))
  const html=ev('(async()=>await window.__download.text())()')
  writeFileSync(`${dir}${locale}-${width}-certificate.html`,html)
  assert(html.includes(`<html lang="${locale}">`) && html.includes(result.id) && html.includes(pick('September','сентября')),'Download locale/date/attempt failed')
  assert(locale!=='en'|| !/[А-Яа-яЁё]/.test(html.replaceAll('ООО Учебный пример','')),'Russian system copy in HTML')
  const legacy=fixture('marina-passed','/my')
  check('old RU fixture personal space',['ООО Учебный пример'])
  open(`/certificate?documentId=${legacy.certificates[0].id}`)
  check('old RU certificate translated',['ООО Учебный пример'])
  const restored=state()
  assert(JSON.stringify(restored.attempts.proekt[0].answers)===JSON.stringify(legacy.attempts.proekt[0].answers),'Saved answers changed')
  assert(restored.certificates[0].company===legacy.certificates[0].company,'User company translated')
  fixture('marina-passed','/my',s=>{
    s.session.name='Материал';s.session.company='Каталог';s.verification.company='Каталог';s.verification.role='Материал'
    s.certificates[0].owner='Материал';s.certificates[0].company='Каталог'
    return s
  })
  const personal=state()
  assert(personal.session.name==='Материал' && personal.session.company==='Каталог' && personal.certificates[0].owner==='Материал' && personal.certificates[0].company==='Каталог' && personal.verification.role==='Материал','Arbitrary personal data translated')
  writeFileSync(`${dir}${locale}-${width}-user-data.json`,JSON.stringify({session:personal.session,verification:personal.verification,certificate:personal.certificates[0]},null,2))
  console.log(`PASS ${locale} ${width} download and verbatim user data`)
} finally {ab('close')}
function checksMode(){return ev("document.querySelector('[data-content-mode]')?.getAttribute('data-content-mode')")}
