(() => {
  'use strict';
  const BANK = window.QUESTION_BANK;
  if (!BANK || !Array.isArray(BANK.questions) || BANK.questions.length !== 256) {
    document.body.innerHTML = '<p style="padding:2rem;font-family:sans-serif">No se pudo cargar el banco de preguntas.</p>';
    return;
  }
  const LETTERS = ['A','B','C','D'];
  const STORAGE_KEY = 'amatxopo_gipuzkoa_c1_2026_v2';
  const T = {
    es:{navHome:'Inicio',navTopics:'Temas',navFailed:'Falladas',navStats:'Estadísticas',
      official:'Banco oficial · 256 preguntas',start:'Empezar test',continue:'Continuar test',topics:'Temas',failed:'Falladas',stats:'Estadísticas',
      random:'Test aleatorio',randomSub:'Mezcla preguntas de los 8 temas.',simulator:'Simulacro',simulatorSub:'100 preguntas aleatorias · 110 minutos · sin soluciones hasta terminar.',topicTest:'Test por tema',topicSub:'Practica un bloque concreto.',failedSub:'Repite las que has fallado.',statsSub:'Consulta tu progreso y precisión.',
      questions:'preguntas',attempts:'Intentos',accuracy:'Acierto',failedCount:'Falladas pendientes',answered:'Preguntas vistas',
      topic:'Tema',range:'Preguntas',practice:'Practicar',allTopics:'Todos los temas',amount:'Número de preguntas',mode:'Modo',study:'Estudio',exam:'Examen',selection:'Selección',randomSelection:'Aleatorias',blocks:'Bloques consecutivos',all:'Todas',questionNumbers:'Números de pregunta',
      studyHelp:'Corrige cada pregunta al momento.',examHelp:'No muestra la solución hasta terminar.',shuffleQ:'Mezclar preguntas',shuffleA:'Mezclar respuestas',begin:'Comenzar',back:'Volver',
      question:'Pregunta',of:'de',exit:'Salir',next:'Siguiente',finish:'Finalizar',correct:'Correcta',incorrect:'Incorrecta',correctWas:'La correcta era',
      result:'Resultado',repeatFailed:'Repasar falladas',newTest:'Nuevo test',review:'Revisión',reset:'Borrar progreso',resetConfirm:'¿Seguro? Se borrarán estadísticas y falladas de esta oposición.',
      noFailed:'No tienes preguntas falladas pendientes.',noStats:'Todavía no hay estadísticas. Haz un test para empezar.',themePerformance:'Rendimiento por tema',simRules:'Configuración igual que en la app anterior: 100 preguntas, 110 minutos, +1 por acierto y 0 por fallo o blanco. El PDF aporta el banco y la plantilla de respuestas; no especifica estas reglas de examen.',prev:'Anterior',blank:'En blanco',finishSim:'Finalizar simulacro',time:'Tiempo',answeredSim:'Respondidas',
      source:'Fuente: conjunto oficial de preguntas C1 OP2026/15 y OP2026/16, Cuestionario A, 02/10/2026. No se añaden explicaciones externas.',
      selected:'seleccionadas',save:'El progreso se guarda solo en este navegador.',seen:'Vistas',right:'Aciertos',wrong:'Fallos',resetDone:'Progreso borrado.',noQuestions:'No hay preguntas disponibles para esta selección.'},
    eu:{navHome:'Hasiera',navTopics:'Gaiak',navFailed:'Hutsak',navStats:'Estatistikak',
      official:'Galdera-sorta ofiziala · 256 galdera',start:'Testa hasi',continue:'Testarekin jarraitu',topics:'Gaiak',failed:'Huts egindakoak',stats:'Estatistikak',
      random:'Ausazko testa',randomSub:'8 gaietako galderak nahasten ditu.',simulator:'Simulazioa',simulatorSub:'100 ausazko galdera · 110 minutu · amaitu arte erantzunik gabe.',topicTest:'Gaikako testa',topicSub:'Bloke zehatz bat landu.',failedSub:'Huts egin dituzunak errepikatu.',statsSub:'Zure aurrerapena eta zehaztasuna ikusi.',
      questions:'galdera',attempts:'Saiakerak',accuracy:'Asmatzeak',failedCount:'Huts egiteko daudenak',answered:'Ikusitako galderak',
      topic:'Gaia',range:'Galderak',practice:'Landu',allTopics:'Gai guztiak',amount:'Galdera kopurua',mode:'Modua',study:'Ikasketa',exam:'Azterketa',selection:'Hautaketa',randomSelection:'Ausazkoak',blocks:'Bloke jarraituak',all:'Denak',questionNumbers:'Galdera zenbakiak',
      studyHelp:'Galdera bakoitza berehala zuzentzen du.',examHelp:'Ez du erantzuna amaitu arte erakusten.',shuffleQ:'Galderak nahastu',shuffleA:'Erantzunak nahastu',begin:'Hasi',back:'Atzera',
      question:'Galdera',of:'/',exit:'Irten',next:'Hurrengoa',finish:'Amaitu',correct:'Zuzena',incorrect:'Okerra',correctWas:'Erantzun zuzena',
      result:'Emaitza',repeatFailed:'Hutsak berrikusi',newTest:'Test berria',review:'Berrikuspena',reset:'Aurrerapena ezabatu',resetConfirm:'Ziur? Oposizio honetako estatistikak eta hutsak ezabatuko dira.',
      noFailed:'Ez duzu huts egindako galderarik.',noStats:'Oraindik ez dago estatistikarik. Egin test bat hasteko.',themePerformance:'Emaitzak gaika',simRules:'Aurreko aplikazioaren konfigurazio bera: 100 galdera, 110 minutu, +1 asmatutakoagatik eta 0 hutsagatik edo erantzun gabeagatik. PDFak galdera-bankua eta erantzunen txantiloia ematen ditu; ez ditu azterketa-arau hauek zehazten.',prev:'Aurrekoa',blank:'Erantzun gabe',finishSim:'Simulazioa amaitu',time:'Denbora',answeredSim:'Erantzunda',
      source:'Iturria: C1eko OP2026/15 eta OP2026/16 galdera-sorta ofiziala, A Galdesorta, 2026/10/02. Ez da kanpoko azalpenik gehitzen.',
      selected:'hautatuta',save:'Aurrerapena nabigatzaile honetan bakarrik gordetzen da.',seen:'Ikusiak',right:'Asmatutakoak',wrong:'Hutsak',resetDone:'Aurrerapena ezabatuta.',noQuestions:'Ez dago galderarik hautapen honetarako.'}
  };
  const defaultState = () => ({lang:'es', theme:'light', failed:[], stats:{}, history:[], active:null});
  let state = loadState();
  let timerInterval = null;
  const SIMULATOR = {questions:100, timeSeconds:110*60};
  let view = 'home';
  let setupPreset = {topic:0, failedOnly:false};
  const app = document.getElementById('app');
  const toastEl = document.getElementById('toast');

  function loadState(){
    try { return {...defaultState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')}; }
    catch { return defaultState(); }
  }
  function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function tr(k){ return (T[state.lang] && T[state.lang][k]) || T.es[k] || k; }
  function esc(s){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function qText(q){ return q[state.lang] || q.es; }
  function topicText(t){ return t[state.lang] || t.es; }
  function topicById(id){ return BANK.topics.find(t=>t.id===id); }
  function shuffle(a){ const x=[...a]; for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];} return x; }
  function pct(a,b){ return b ? Math.round((a/b)*100) : 0; }
  function statsSummary(){
    const vals=Object.values(state.stats || {}); const attempts=vals.reduce((s,x)=>s+(x.attempts||0),0); const right=vals.reduce((s,x)=>s+(x.correct||0),0);
    return {seen:vals.length, attempts, right, accuracy:pct(right,attempts), failed:(state.failed||[]).length};
  }
  function setTheme(){ document.documentElement.dataset.theme=state.theme; }
  function updateChrome(){
    document.documentElement.lang=state.lang;
    document.getElementById('brandSub').textContent = state.lang==='es' ? 'Gipuzkoa C1 · 2026' : 'Gipuzkoa C1 · 2026';
    document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===state.lang));
    document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=tr(el.dataset.i18n));
    document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  }
  function toast(msg){ toastEl.textContent=msg; toastEl.classList.add('show'); setTimeout(()=>toastEl.classList.remove('show'),1900); }
  function go(v){ view=v; updateChrome(); render(); window.scrollTo({top:0,behavior:'smooth'}); }

  function render(){
    updateChrome();
    if (view==='home') return renderHome();
    if (view==='topics') return renderTopics();
    if (view==='failed') return renderFailed();
    if (view==='stats') return renderStats();
    if (view==='setup') return renderSetup();
    if (view==='quiz') return renderQuiz();
    if (view==='result') return renderResult();
  }

  function renderHome(){
    const s=statsSummary();
    app.innerHTML = `
      <section class="hero">
        <div class="eyebrow">${esc(tr('official'))}</div>
        <h1>${esc(BANK.meta.title[state.lang])}</h1>
        <p>${esc(BANK.meta.subtitle[state.lang])}</p>
        <div class="hero-actions">
          <button class="btn primary" id="startRandom">${esc(tr('start'))}</button>
          ${state.active ? `<button class="btn light" id="continueActive">${esc(tr('continue'))}</button>` : ''}
        </div>
      </section>
      <div class="section-title"><h2>${esc(tr('stats'))}</h2><p>${esc(tr('save'))}</p></div>
      <section class="grid">
        <div class="card metric"><strong>${s.seen}/256</strong><span>${esc(tr('answered'))}</span></div>
        <div class="card metric"><strong>${s.accuracy}%</strong><span>${esc(tr('accuracy'))}</span></div>
        <div class="card metric"><strong>${s.attempts}</strong><span>${esc(tr('attempts'))}</span></div>
        <div class="card metric"><strong>${s.failed}</strong><span>${esc(tr('failedCount'))}</span></div>
      </section>
      <div class="section-title"><h2>Tests</h2></div>
      <section class="grid">
        <button class="card quick-card" id="randomCard"><div class="qicon">⤨</div><strong>${esc(tr('random'))}</strong><small>${esc(tr('randomSub'))}</small></button>
        <button class="card quick-card simulator-card" id="simulatorCard"><div class="qicon">⏱</div><strong>${esc(tr('simulator'))}</strong><small>${esc(tr('simulatorSub'))}</small></button>
        <button class="card quick-card" id="topicCard"><div class="qicon">☷</div><strong>${esc(tr('topicTest'))}</strong><small>${esc(tr('topicSub'))}</small></button>
        <button class="card quick-card" id="failedCard"><div class="qicon">↻</div><strong>${esc(tr('failed'))}</strong><small>${esc(tr('failedSub'))}</small></button>
        <button class="card quick-card" id="statsCard"><div class="qicon">▥</div><strong>${esc(tr('stats'))}</strong><small>${esc(tr('statsSub'))}</small></button>
      </section>
      <p class="source-note card" style="margin-top:14px">${esc(tr('source'))}</p>`;
    document.getElementById('startRandom').onclick=()=>openSetup({topic:0,failedOnly:false});
    document.getElementById('randomCard').onclick=()=>openSetup({topic:0,failedOnly:false});
    document.getElementById('simulatorCard').onclick=startSimulator;
    document.getElementById('topicCard').onclick=()=>go('topics');
    document.getElementById('failedCard').onclick=()=>go('failed');
    document.getElementById('statsCard').onclick=()=>go('stats');
    const cont=document.getElementById('continueActive'); if(cont) cont.onclick=()=>{view='quiz';render();};
  }

  function renderTopics(){
    app.innerHTML = `<div class="section-title"><div><h2>${esc(tr('topics'))}</h2><p>${BANK.questions.length} ${esc(tr('questions'))}</p></div></div><div class="topic-list">${BANK.topics.map(t=>`
      <article class="card topic">
        <div class="topic-num">${t.id}</div><div><h3>${esc(topicText(t))}</h3><p>${esc(tr('range'))} ${t.start}-${t.end} · ${t.end-t.start+1} ${esc(tr('questions'))}</p></div>
        <button class="btn ghost" data-practice-topic="${t.id}">${esc(tr('practice'))}</button>
      </article>`).join('')}</div>`;
    app.querySelectorAll('[data-practice-topic]').forEach(b=>b.onclick=()=>openSetup({topic:Number(b.dataset.practiceTopic),failedOnly:false}));
  }

  function renderFailed(){
    const ids=(state.failed||[]).filter(id=>BANK.questions.some(q=>q.id===id));
    if(!ids.length){
      app.innerHTML=`<section class="card empty"><span class="big">✓</span><h2>${esc(tr('failed'))}</h2><p>${esc(tr('noFailed'))}</p><button class="btn ghost" id="toHome">${esc(tr('back'))}</button></section>`;
      document.getElementById('toHome').onclick=()=>go('home'); return;
    }
    const byTopic = BANK.topics.map(t=>({t,count:ids.filter(id=>id>=t.start&&id<=t.end).length})).filter(x=>x.count);
    app.innerHTML=`<div class="section-title"><div><h2>${esc(tr('failed'))}</h2><p>${ids.length} ${esc(tr('questions'))}</p></div><button class="btn primary" id="practiceFailed">${esc(tr('repeatFailed'))}</button></div>
      <div class="topic-list">${byTopic.map(({t,count})=>`<article class="card topic"><div class="topic-num">${t.id}</div><div><h3>${esc(topicText(t))}</h3><p>${count} ${esc(tr('questions'))}</p></div></article>`).join('')}</div>`;
    document.getElementById('practiceFailed').onclick=()=>openSetup({topic:0,failedOnly:true});
  }

  function renderStats(){
    const s=statsSummary();
    const rows=BANK.topics.map(t=>{
      const qs=BANK.questions.filter(q=>q.topic===t.id); let attempts=0,right=0,seen=0;
      qs.forEach(q=>{const st=state.stats[q.id]; if(st){seen++;attempts+=st.attempts||0;right+=st.correct||0;}});
      return {t,seen,attempts,right,acc:pct(right,attempts)};
    });
    app.innerHTML=`<div class="section-title"><h2>${esc(tr('stats'))}</h2></div>
      <section class="grid"><div class="card metric"><strong>${s.seen}/256</strong><span>${esc(tr('seen'))}</span></div><div class="card metric"><strong>${s.accuracy}%</strong><span>${esc(tr('accuracy'))}</span></div><div class="card metric"><strong>${s.right}</strong><span>${esc(tr('right'))}</span></div><div class="card metric"><strong>${s.failed}</strong><span>${esc(tr('wrong'))}</span></div></section>
      <div class="section-title"><h2>${esc(tr('themePerformance'))}</h2></div>
      <div class="card" style="overflow:auto"><table class="stat-table"><thead><tr><th>${esc(tr('topic'))}</th><th>${esc(tr('seen'))}</th><th>${esc(tr('attempts'))}</th><th>${esc(tr('accuracy'))}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.t.id}</td><td>${r.seen}/${r.t.end-r.t.start+1}</td><td>${r.attempts}</td><td><div style="display:grid;grid-template-columns:40px 90px;align-items:center;gap:8px"><strong>${r.acc}%</strong><div class="bar"><span style="width:${r.acc}%"></span></div></div></td></tr>`).join('')}</tbody></table></div>
      <section class="card danger-zone" style="margin-top:16px"><h3 style="margin-top:0">${esc(tr('reset'))}</h3><p class="muted">${esc(tr('save'))}</p><button class="btn danger" id="resetBtn">${esc(tr('reset'))}</button></section>`;
    document.getElementById('resetBtn').onclick=()=>{if(confirm(tr('resetConfirm'))){state=defaultState();saveState();setTheme();toast(tr('resetDone'));render();}};
  }

  function openSetup(preset){setupPreset=preset;view='setup';render();window.scrollTo({top:0,behavior:'smooth'});}
  function availableForSetup(topic,failedOnly){
    let q=BANK.questions; if(topic)q=q.filter(x=>x.topic===topic); if(failedOnly){const f=new Set(state.failed||[]);q=q.filter(x=>f.has(x.id));} return q;
  }
  function buildAmountChoices(max){
    const nums=[10,20,30,50,100].filter(n=>n<max).map(n=>({value:n,label:String(n)}));
    return max ? [...nums,{value:max,label:`${tr('all')} (${max})`,all:true}] : [];
  }
  function buildTopicBlocks(topic){
    if(!topic) return [];
    const t=topicById(topic); if(!t) return [];
    const blocks=[];
    for(let start=t.start; start<=t.end; start+=10){
      const end=Math.min(start+9,t.end);
      blocks.push({start,end,label:`#${start}–${end}`});
    }
    return blocks;
  }
  function renderSetup(){
    const initialTopic=setupPreset.failedOnly?0:setupPreset.topic;
    const base=availableForSetup(initialTopic,setupPreset.failedOnly);
    const max=base.length;
    app.innerHTML=`<section class="setup"><button class="btn ghost" id="setupBack">← ${esc(tr('back'))}</button><h1>${setupPreset.failedOnly?esc(tr('failed')):esc(tr('start'))}</h1><p id="selectedCount">${max} ${esc(tr('questions'))} ${esc(tr('selected'))}</p>
      ${!setupPreset.failedOnly?`<div class="form-row"><label>${esc(tr('topic'))}</label><select class="select" id="topicSelect"><option value="0">${esc(tr('allTopics'))}</option>${BANK.topics.map(t=>`<option value="${t.id}" ${setupPreset.topic===t.id?'selected':''}>${t.id}. ${esc(topicText(t))}</option>`).join('')}</select></div>`:''}
      <div class="form-row" id="selectionRow">
        <label>${esc(tr('selection'))}</label>
        <div class="segmented" id="selectionSwitch">
          <button data-selection="random" class="active">${esc(tr('randomSelection'))}</button>
          <button data-selection="block" id="blockModeBtn">${esc(tr('blocks'))}</button>
        </div>
      </div>
      <div class="form-row" id="amountRow"><label>${esc(tr('amount'))}</label><div class="chips" id="amountChips"></div></div>
      <div class="form-row hidden" id="blockRow"><label>${esc(tr('blocks'))}</label><div class="chips" id="blockChips"></div></div>
      <div class="form-row"><label>${esc(tr('mode'))}</label><div class="segmented" id="modeSwitch"><button data-mode="study" class="active">${esc(tr('study'))}</button><button data-mode="exam">${esc(tr('exam'))}</button></div><small class="muted" id="modeHelp">${esc(tr('studyHelp'))}</small></div>
      <div class="card">
        <div class="switch-row"><div><strong>${esc(tr('shuffleQ'))}</strong></div><label class="switch"><input type="checkbox" id="shuffleQ" checked><span class="slider"></span></label></div>
        <div class="switch-row"><div><strong>${esc(tr('shuffleA'))}</strong></div><label class="switch"><input type="checkbox" id="shuffleA" checked><span class="slider"></span></label></div>
      </div>
      <button class="btn primary" style="width:100%;margin-top:18px" id="beginBtn" ${max?'':'disabled'}>${esc(tr('begin'))}</button>${max?'':`<p class="muted">${esc(tr('noQuestions'))}</p>`}</section>`;

    let selection='random', amount=0, selectedBlock=null, mode='study';

    const getTopic=()=>setupPreset.failedOnly?0:Number(document.getElementById('topicSelect')?.value||0);
    const bindAmountChips=()=>document.querySelectorAll('[data-amount]').forEach(b=>b.onclick=()=>{
      selection='random'; amount=Number(b.dataset.amount); selectedBlock=null;
      document.querySelectorAll('[data-amount]').forEach(x=>x.classList.toggle('active',x===b));
      document.querySelectorAll('[data-block-start]').forEach(x=>x.classList.remove('active'));
    });
    const bindBlockChips=()=>document.querySelectorAll('[data-block-start]').forEach(b=>b.onclick=()=>{
      selection='block'; selectedBlock={start:Number(b.dataset.blockStart),end:Number(b.dataset.blockEnd)};
      document.querySelectorAll('[data-block-start]').forEach(x=>x.classList.toggle('active',x===b));
      document.querySelectorAll('[data-amount]').forEach(x=>x.classList.remove('active'));
    });

    const refreshSetupChoices=()=>{
      const topic=getTopic();
      const pool=availableForSetup(topic,setupPreset.failedOnly);
      const choices=buildAmountChoices(pool.length);
      amount=choices[0]?.value||0;
      selectedBlock=null;
      selection='random';

      const amountEl=document.getElementById('amountChips');
      amountEl.innerHTML=choices.map((c,i)=>`<button class="chip ${i===0?'active':''}" data-amount="${c.value}">${esc(c.label || String(c.value))}</button>`).join('');
      bindAmountChips();

      const blocks=(!setupPreset.failedOnly && topic)?buildTopicBlocks(topic):[];
      const blockEl=document.getElementById('blockChips');
      blockEl.innerHTML=blocks.map((b)=>`<button class="chip" data-block-start="${b.start}" data-block-end="${b.end}">${esc(b.label)}</button>`).join('');
      bindBlockChips();

      const blockBtn=document.getElementById('blockModeBtn');
      blockBtn.disabled=!blocks.length;
      document.getElementById('selectionRow').classList.toggle('hidden',setupPreset.failedOnly);
      document.getElementById('blockRow').classList.add('hidden');
      document.getElementById('amountRow').classList.remove('hidden');
      document.querySelectorAll('[data-selection]').forEach(x=>x.classList.toggle('active',x.dataset.selection==='random'));
      document.getElementById('shuffleQ').disabled=false;
      document.getElementById('shuffleQ').checked=true;
      document.getElementById('selectedCount').textContent=`${pool.length} ${tr('questions')} ${tr('selected')}`;
      document.getElementById('beginBtn').disabled=!pool.length;
    };

    refreshSetupChoices();

    const ts=document.getElementById('topicSelect');
    if(ts) ts.onchange=refreshSetupChoices;

    document.querySelectorAll('[data-selection]').forEach(b=>b.onclick=()=>{
      if(b.disabled) return;
      selection=b.dataset.selection;
      document.querySelectorAll('[data-selection]').forEach(x=>x.classList.toggle('active',x===b));
      const blockMode=selection==='block';
      document.getElementById('amountRow').classList.toggle('hidden',blockMode);
      document.getElementById('blockRow').classList.toggle('hidden',!blockMode);
      document.getElementById('shuffleQ').disabled=blockMode;
      if(blockMode){
        document.getElementById('shuffleQ').checked=false;
        const first=document.querySelector('[data-block-start]');
        if(first){ first.click(); }
      }else{
        selectedBlock=null;
        document.getElementById('shuffleQ').disabled=false;
        document.getElementById('shuffleQ').checked=true;
        const first=document.querySelector('[data-amount]');
        if(first){ first.click(); }
      }
    });

    document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{
      mode=b.dataset.mode;
      document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));
      document.getElementById('modeHelp').textContent=tr(mode==='study'?'studyHelp':'examHelp');
    });
    document.getElementById('setupBack').onclick=()=>go(setupPreset.topic?'topics':'home');
    document.getElementById('beginBtn').onclick=()=>{
      const topic=getTopic();
      let pool=availableForSetup(topic,setupPreset.failedOnly);

      if(selection==='block' && selectedBlock){
        pool=pool.filter(q=>q.id>=selectedBlock.start && q.id<=selectedBlock.end);
      }else{
        if(document.getElementById('shuffleQ').checked) pool=shuffle(pool); else pool=[...pool];
        pool=pool.slice(0,amount);
      }

      if(!pool.length){toast(tr('noQuestions'));return;}
      state.active={
        ids:pool.map(q=>q.id),
        index:0,
        mode,
        shuffleAnswers:document.getElementById('shuffleA').checked,
        answers:{},
        answerOrders:{},
        startedAt:Date.now(),
        source:setupPreset.failedOnly?'failed':selection==='block'&&selectedBlock?`topic-${topic}-block-${selectedBlock.start}-${selectedBlock.end}`:topic?`topic-${topic}`:'random'
      };
      saveState();view='quiz';render();
    };
  }

  function startSimulator(){
    if(BANK.questions.length < SIMULATOR.questions){ toast(tr('noQuestions')); return; }
    const pool=shuffle(BANK.questions).slice(0,SIMULATOR.questions);
    state.active={ids:pool.map(q=>q.id),index:0,mode:'simulator',shuffleAnswers:true,answers:{},answerOrders:{},startedAt:Date.now(),source:'simulacro'};
    saveState(); view='quiz'; render();
  }
  function simulatorRemaining(a){ return Math.max(0, SIMULATOR.timeSeconds - Math.floor((Date.now()-(a.startedAt||Date.now()))/1000)); }
  function formatTime(sec){ const m=Math.floor(sec/60), ss=sec%60; return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`; }
  function startSimulatorTimer(){
    clearInterval(timerInterval);
    const tick=()=>{
      const a=state.active; if(!a || a.mode!=='simulator'){ clearInterval(timerInterval); return; }
      const el=document.getElementById('simTimer'); if(!el){clearInterval(timerInterval);return;}
      const rem=simulatorRemaining(a); el.textContent=formatTime(rem); el.classList.toggle('urgent',rem<=300);
      if(rem<=0){ clearInterval(timerInterval); finishQuiz(true); }
    };
    tick(); timerInterval=setInterval(tick,1000);
  }
  function renderSimulatorQuiz(){
    const a=state.active; if(!a||!a.ids?.length){state.active=null;saveState();return go('home');}
    const q=currentQuestion(); if(!q){state.active=null;saveState();return go('home');}
    const tx=qText(q), order=optionOrderFor(q), selected=a.answers[q.id]||null, t=topicById(q.topic), prog=Math.round(((a.index+1)/a.ids.length)*100);
    const answeredCount=Object.keys(a.answers||{}).filter(id=>a.ids.includes(Number(id))).length;
    app.innerHTML=`<div class="quiz-head"><div><strong>${esc(tr('simulator'))} · ${esc(tr('question'))} ${a.index+1} ${esc(tr('of'))} ${a.ids.length}</strong><div class="meta">${esc(tr('topic'))} ${q.topic} · #${q.id} · ${esc(tr('answeredSim'))}: ${answeredCount}/${a.ids.length}</div></div><div class="sim-timer" id="simTimer">${formatTime(simulatorRemaining(a))}</div></div><div class="progress"><div style="width:${prog}%"></div></div>
      <p class="card sim-rule-note">${esc(tr('simRules'))}</p>
      <section class="card question-card"><div class="question-kicker"><span>${esc(topicText(t))}</span><span>#${q.id}</span></div><h2>${esc(tx.question)}</h2><div class="answers">${order.map((letter,pos)=>{
        const idx=LETTERS.indexOf(letter), isSel=selected===letter; let cls='answer'; if(isSel)cls+=' selected';
        return `<button class="${cls}" data-answer="${letter}"><span class="letter">${LETTERS[pos]}</span><span>${esc(tx.options[idx])}</span></button>`;
      }).join('')}</div>
      <div class="quiz-actions sim-actions"><button class="btn ghost" id="prevQ" ${a.index===0?'disabled':''}>← ${esc(tr('prev'))}</button><button class="btn ghost" id="nextQ">${a.index===a.ids.length-1?esc(tr('finishSim')):esc(tr('next'))} →</button></div></section>
      <section class="card sim-navigator"><div class="sim-nav-title"><strong>${esc(tr('questions'))}</strong><button class="btn ghost" id="exitQuiz">${esc(tr('exit'))}</button></div><div class="sim-nav-grid">${a.ids.map((id,i)=>`<button class="sim-nav-btn ${i===a.index?'current':''} ${a.answers[id]?'done':''}" data-jump="${i}">${id}</button>`).join('')}</div></section>`;
    app.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{a.answers[q.id]=b.dataset.answer;saveState();renderSimulatorQuiz();});
    app.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{a.index=Number(b.dataset.jump);saveState();renderSimulatorQuiz();window.scrollTo({top:0,behavior:'smooth'});});
    document.getElementById('prevQ').onclick=()=>{if(a.index>0){a.index--;saveState();renderSimulatorQuiz();window.scrollTo({top:0,behavior:'smooth'});}};
    document.getElementById('nextQ').onclick=()=>{if(a.index<a.ids.length-1){a.index++;saveState();renderSimulatorQuiz();window.scrollTo({top:0,behavior:'smooth'});}else if(confirm(state.lang==='es'?'¿Finalizar el simulacro y corregirlo?':'Simulazioa amaitu eta zuzendu?')) finishQuiz(false);};
    document.getElementById('exitQuiz').onclick=()=>{if(confirm(state.lang==='es'?'El simulacro queda guardado y el tiempo seguirá contando. ¿Salir?':'Simulazioa gordeta geratuko da eta denborak aurrera jarraituko du. Irten?')){clearInterval(timerInterval);go('home');}};
    startSimulatorTimer();
  }
  function currentQuestion(){ const a=state.active; if(!a)return null; return BANK.questions.find(q=>q.id===a.ids[a.index]); }
  function optionOrderFor(q){
    const a=state.active; if(!a.answerOrders)a.answerOrders={}; if(a.answerOrders[q.id])return a.answerOrders[q.id];
    const ord=a.shuffleAnswers?shuffle(LETTERS):[...LETTERS]; a.answerOrders[q.id]=ord; saveState(); return ord;
  }
  function renderQuiz(){
    const a=state.active; if(a?.mode==='simulator') return renderSimulatorQuiz();
    if(!a||!a.ids||!a.ids.length){state.active=null;saveState();return go('home');}
    const q=currentQuestion(); if(!q){state.active=null;saveState();return go('home');}
    const tx=qText(q), order=optionOrderFor(q), selected=a.answers[q.id]||null, answered=!!selected, showFeedback=a.mode==='study'&&answered;
    const t=topicById(q.topic), prog=Math.round(((a.index+1)/a.ids.length)*100);
    const answeredCount=Object.keys(a.answers||{}).filter(id=>a.ids.includes(Number(id))).length;
    app.innerHTML=`<div class="quiz-head"><div><strong>${esc(tr('question'))} ${a.index+1} ${esc(tr('of'))} ${a.ids.length}</strong><div class="meta">${esc(tr('topic'))} ${q.topic} · #${q.id} · ${answeredCount}/${a.ids.length} ${esc(tr('answeredSim')).toLowerCase()}</div></div><button class="btn ghost" id="exitQuiz">${esc(tr('exit'))}</button></div><div class="progress"><div style="width:${prog}%"></div></div>
      <section class="card question-card"><div class="question-kicker"><span>${esc(topicText(t))}</span><span>#${q.id}</span></div><h2>${esc(tx.question)}</h2><div class="answers">${order.map((letter,pos)=>{
        const idx=LETTERS.indexOf(letter), isSel=selected===letter, isCorrect=letter===q.correct; let cls='answer'; if(isSel)cls+=' selected'; if(showFeedback&&isCorrect)cls+=' correct'; if(showFeedback&&isSel&&!isCorrect)cls+=' wrong';
        return `<button class="${cls}" data-answer="${letter}" ${showFeedback?'disabled':''}><span class="letter">${LETTERS[pos]}</span><span>${esc(tx.options[idx])}</span></button>`;
      }).join('')}</div>${showFeedback?`<div class="feedback ${selected===q.correct?'ok':'bad'}">${selected===q.correct?esc(tr('correct')):`${esc(tr('incorrect'))}. ${esc(tr('correctWas'))}: ${esc(tx.options[LETTERS.indexOf(q.correct)])}`}</div>`:''}
      <div class="quiz-actions"><button class="btn ghost" id="prevQ" ${a.index===0?'disabled':''}>← ${esc(tr('prev'))}</button><span class="muted mono">${a.index+1}/${a.ids.length}</span><button class="btn primary" id="nextQ">${a.index===a.ids.length-1?esc(tr('finish')):esc(tr('next'))} →</button></div></section>
      <section class="card sim-navigator question-navigator"><div class="sim-nav-title"><strong>${esc(tr('questionNumbers'))}</strong><small class="muted">${answeredCount}/${a.ids.length}</small></div><div class="sim-nav-grid">${a.ids.map((id,i)=>{
        const qq=BANK.questions.find(x=>x.id===id), ans=a.answers[id];
        const status=ans?(a.mode==='study'?(ans===qq.correct?' nav-ok':' nav-bad'):' done'):'';
        return `<button class="sim-nav-btn ${i===a.index?'current':''}${status}" data-jump="${i}" aria-label="${esc(tr('question'))} ${id}">${id}</button>`;
      }).join('')}</div></section>`;
    app.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>selectAnswer(q,b.dataset.answer));
    app.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{a.index=Number(b.dataset.jump);saveState();renderQuiz();window.scrollTo({top:0,behavior:'smooth'});});
    document.getElementById('prevQ').onclick=()=>{if(a.index>0){a.index--;saveState();renderQuiz();window.scrollTo({top:0,behavior:'smooth'});}};
    document.getElementById('nextQ').onclick=()=>{if(a.index<a.ids.length-1){a.index++;saveState();renderQuiz();window.scrollTo({top:0,behavior:'smooth'});}else{finishQuiz();}};
    document.getElementById('exitQuiz').onclick=()=>{if(confirm(state.lang==='es'?'El test queda guardado para continuar después. ¿Salir?':'Testa gordeta geratuko da gero jarraitzeko. Irten?'))go('home');};
  }

  function selectAnswer(q,letter){
    const a=state.active; if(a.answers[q.id])return; a.answers[q.id]=letter;
    const st=state.stats[q.id]||{attempts:0,correct:0,wrong:0}; st.attempts++; if(letter===q.correct){st.correct++;state.failed=(state.failed||[]).filter(id=>id!==q.id);}else{st.wrong++;if(!(state.failed||[]).includes(q.id))state.failed.push(q.id);} state.stats[q.id]=st; saveState(); renderQuiz();
  }
  function nextQuestion(){const a=state.active;if(!a)return;if(a.index<a.ids.length-1){a.index++;saveState();renderQuiz();window.scrollTo({top:0,behavior:'smooth'});}else{finishQuiz();}}
  function finishQuiz(autoTime=false){
    const a=state.active;if(!a)return;
    clearInterval(timerInterval);
    const resultIds=[...a.ids], answers={...a.answers};
    const isSimulator=a.mode==='simulator';
    let correct=0, wrong=0, blank=0;
    resultIds.forEach(id=>{
      const q=BANK.questions.find(x=>x.id===id); const ans=answers[id];
      if(!ans){blank++;return;}
      const ok=ans===q.correct;
      if(ok)correct++; else wrong++;
      if(isSimulator){
        const st=state.stats[id]||{attempts:0,correct:0,wrong:0}; st.attempts++;
        if(ok){st.correct++;state.failed=(state.failed||[]).filter(x=>x!==id);}else{st.wrong++;if(!(state.failed||[]).includes(id))state.failed.push(id);}
        state.stats[id]=st;
      }
    });
    const elapsed=Math.floor((Date.now()-(a.startedAt||Date.now()))/1000);
    const item={date:Date.now(),count:resultIds.length,correct,wrong,blank,ids:resultIds,answers,source:a.source,isSimulator,elapsedSeconds:elapsed,autoTime};
    state.history=[item,...(state.history||[])].slice(0,20); state.lastResult=item; state.active=null; saveState(); view='result'; render(); window.scrollTo({top:0,behavior:'smooth'});
  }
  function renderResult(){
    const r=state.lastResult;if(!r)return go('home'); const score=pct(r.correct,r.count); const blank=r.blank||0; const wrong=Number.isFinite(r.wrong)?r.wrong:(r.count-r.correct-blank);
    const simExtra=r.isSimulator?`<div class="sim-result-grid"><div><strong>${r.correct}</strong><span>${esc(tr('correct'))}</span></div><div><strong>${wrong}</strong><span>${esc(tr('incorrect'))}</span></div><div><strong>${blank}</strong><span>${esc(tr('blank'))}</span></div><div><strong>${Math.floor((r.elapsedSeconds||0)/60)}m</strong><span>${esc(tr('time'))}</span></div></div>`:'';
    app.innerHTML=`<section class="card result-hero"><div class="score-ring" style="--score:${score}"><strong>${score}%</strong></div><h1>${r.isSimulator?esc(tr('simulator')):esc(tr('result'))}</h1><p>${r.correct} ${esc(tr('correct')).toLowerCase()} · ${wrong} ${esc(tr('incorrect')).toLowerCase()}${blank?` · ${blank} ${esc(tr('blank')).toLowerCase()}`:''}</p>${simExtra}<div class="hero-actions" style="justify-content:center"><button class="btn primary" id="newTest">${esc(tr('newTest'))}</button>${wrong?`<button class="btn ghost" id="againFailed">${esc(tr('repeatFailed'))}</button>`:''}</div></section>
      <div class="section-title"><h2>${esc(tr('review'))}</h2></div><div class="review-list">${r.ids.map(id=>{const q=BANK.questions.find(x=>x.id===id),tx=qText(q),sel=r.answers[id],isBlank=!sel,ok=sel===q.correct;return `<article class="card review-item"><div class="status ${ok?'ok':isBlank?'':'bad'}">${ok?'✓':isBlank?'—':'✕'} #${id}</div><div><p>${esc(tx.question)}</p><small>${esc(tr('topic'))} ${q.topic} · ${isBlank?esc(tr('blank')):ok?esc(tr('correct')):`${esc(tr('correctWas'))}: ${esc(tx.options[LETTERS.indexOf(q.correct)])}`}</small></div></article>`;}).join('')}</div>`;
    document.getElementById('newTest').onclick=()=>openSetup({topic:0,failedOnly:false}); const af=document.getElementById('againFailed');if(af)af.onclick=()=>openSetup({topic:0,failedOnly:true});
  }

  document.querySelectorAll('.bottom-nav button').forEach(b=>b.onclick=()=>go(b.dataset.view));
  document.getElementById('homeBtn').onclick=()=>go('home');
  document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{state.lang=b.dataset.lang;saveState();render();});
  document.getElementById('themeBtn').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';saveState();setTheme();};
  setTheme(); updateChrome(); render();
  if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
