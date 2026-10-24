/* eigen46 · publieke laag: eigen route (O'Brien), eigen audio-haak, uitspraak-proef kruipen/lopen/rennen. Alles lokaal in de browser; niets wordt verstuurd. */
(function(){
var hz=(document.getElementById('kop-hz')||{}).textContent||'';var slug=(location.pathname.split('/').pop()||'').replace('.html','');
var K='kx46-eigen-route',route=[];try{route=JSON.parse(localStorage.getItem(K)||'[]')}catch(e){}
var box=document.getElementById('eigen46');if(!box)return;
/* 1 eigen route */
var ol=box.querySelector('.er-stops');
for(var i=0;i<10;i++){var li=document.createElement('li');var inp=document.createElement('input');inp.type='text';inp.placeholder='stop '+(i+1)+': een plek die jij kent';inp.value=route[i]||'';inp.dataset.i=i;inp.oninput=function(){route[this.dataset.i]=this.value;localStorage.setItem(K,JSON.stringify(route))};li.appendChild(inp);ol.appendChild(li)}
var kies=box.querySelector('.er-kies'),KW='kx46-eigen-woord-'+slug;
if(kies){kies.value=localStorage.getItem(KW)||'';kies.oninput=function(){localStorage.setItem(KW,this.value)}}
/* 2 eigen audio-haak (MediaRecorder, blijft op dit toestel) */
var rb=box.querySelector('.er-rec'),pa=box.querySelector('.er-play'),mr=null,ch=[];
if(rb){if(!navigator.mediaDevices||!window.MediaRecorder){rb.disabled=true;rb.textContent='opnemen niet beschikbaar in deze browser'}
rb.onclick=function(){if(mr&&mr.state==='recording'){mr.stop();return}
navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){ch=[];mr=new MediaRecorder(s);mr.ondataavailable=function(e){ch.push(e.data)};
mr.onstop=function(){s.getTracks().forEach(function(t){t.stop()});var b=new Blob(ch,{type:mr.mimeType});pa.src=URL.createObjectURL(b);pa.hidden=false;rb.textContent='● opnieuw opnemen';
var r=new FileReader();r.onload=function(){try{localStorage.setItem('kx46-haak-'+slug,r.result)}catch(e){}};r.readAsDataURL(b)};
mr.start();rb.textContent='■ stop opname'}).catch(function(){rb.textContent='geen microfoon-toestemming'})}
var oud=localStorage.getItem('kx46-haak-'+slug);if(oud){pa.src=oud;pa.hidden=false}}
/* 3 uitspraak-proef: gratis Web Speech API (zh-CN) in Chrome/Edge. Geen betaalde API. */
var ub=box.querySelector('.er-spreek'),uo=box.querySelector('.er-uitslag');
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(ub){if(!SR){ub.disabled=true;uo.textContent='Uitspraak-proef werkt (nog) alleen in Chrome of Edge.'}
ub.onclick=function(){var r=new SR();r.lang='zh-CN';r.maxAlternatives=5;uo.textContent='luistert…';
r.onresult=function(e){var a=[].slice.call(e.results[0]).map(function(x){return{t:x.transcript.replace(/[\s。，！？]/g,''),c:x.confidence||0}});
var best=a[0],hit=a.filter(function(x){return x.t===hz})[0],deel=a.filter(function(x){return hz.split('').some(function(c){return x.t.indexOf(c)>=0})})[0];
var n='nog niet herkend';if(hit&&hit.c>=0.85&&best.t===hz)n='🏃 rennen · klinkt als native';else if(hit)n='🚶 lopen · student: herkend als '+hz;else if(deel)n='🐢 kruipen · beginner: deels herkend';
uo.textContent=n+' (gehoord: '+best.t+')'};
r.onerror=function(e){uo.textContent='geen spraak gehoord ('+e.error+')'};r.start()}}
})();
