/* paleis46 · publieke schakelaar voor woordkaarten.
   Drie gedeelde paleizen (wereldwonderen, grond-reis, moeder-aarde) + persoonlijke route.
   Persoonlijk blijft in localStorage op dit toestel en komt niet in de HTML.
   Stops: ingebakken hieronder (uit paleis/*.json) en, als die er is, kaart/paleis/<id>.json. */
(function(){
var KEY='kinetix.paleis.actief', OLD='kx46-paleis';
var EMBED =
/*PALEIS46-BEGIN*/
{"wereldwonderen":{"naam":"Wereldwonderen","stops":[{"nr":1,"naam":"Chinese Muur","kenmerk":"eindeloze stenen draak over de bergkammen, wachttorens"},{"nr":2,"naam":"Verboden Stad","kenmerk":"rode muren, gouden daken, poorten in een rechte as"},{"nr":3,"naam":"Angkor Wat","kenmerk":"vijf lotustorens gespiegeld in de vijver"},{"nr":4,"naam":"Taj Mahal","kenmerk":"witte marmeren koepel, vier minaretten, lange waterspiegel"},{"nr":5,"naam":"Petra","kenmerk":"tempel uitgehakt in roze rots (Al-Deir)"},{"nr":6,"naam":"Piramides van Gizeh","kenmerk":"reusachtige stenen driehoek in de woestijn"},{"nr":7,"naam":"Colosseum","kenmerk":"ronde arena met bogen, half afgebrokkeld"},{"nr":8,"naam":"Chichén Itzá","kenmerk":"trappenpiramide van El Castillo, slangenkoppen onderaan"},{"nr":9,"naam":"Machu Picchu","kenmerk":"stenen terrassen op een bergtop in de wolken"},{"nr":10,"naam":"Christus de Verlosser","kenmerk":"reuzenbeeld met gespreide armen boven Rio"}]},"grond-reis":{"naam":"Grond-reis","stops":[{"nr":1,"naam":"Oost-Azië","kenmerk":"gele löss-aarde: fijn stof, terrassen, wind"},{"nr":2,"naam":"Nusantara-eilanden","kenmerk":"zwarte vulkanische grond, warme regen"},{"nr":3,"naam":"Zuid-Azië","kenmerk":"delta-slib: natte klei na de moesson"},{"nr":4,"naam":"Centraal-Azië","kenmerk":"steppe: gras tot de horizon, droge wind"},{"nr":5,"naam":"Arabisch schiereiland","kenmerk":"zandgrond, steen, oase-water"},{"nr":6,"naam":"Oost-Afrika","kenmerk":"rode hooglandaarde, koele ochtend"},{"nr":7,"naam":"West-Afrika","kenmerk":"Sahel: droge grond die groen wordt na regen"},{"nr":8,"naam":"Noordwest-Europa","kenmerk":"veen en klei onder de dijk, zilte lucht"},{"nr":9,"naam":"Zuid-Amerika","kenmerk":"pampa: vlakke zwarte grond, lange grassen"},{"nr":10,"naam":"Noord-Amerika","kenmerk":"prairie: diepe wortels, onweerslucht"}]},"moeder-aarde":{"naam":"Moeder Aarde","stops":[{"nr":1,"naam":"Himalaya","kenmerk":"hoge bergen als watertorens; sneeuw voedt rivieren"},{"nr":2,"naam":"Amazone","kenmerk":"rivier en woud als één levend bekken"},{"nr":3,"naam":"Nijl","kenmerk":"lange rivier; vruchtbare oever langs het water"},{"nr":4,"naam":"Sahara","kenmerk":"woestijn als leefwereld: wind, zand, oase — geen lege zandbak"},{"nr":5,"naam":"Stille Oceaan","kenmerk":"grote zee; deining, wind, eilanden en kusten"},{"nr":6,"naam":"Andes","kenmerk":"bergketen; terrassen-grond op steile hellingen"},{"nr":7,"naam":"Riftvallei","kenmerk":"Oost-Afrikaanse rift: gescheurde aarde, meren, vlakte"},{"nr":8,"naam":"Congo-woud","kenmerk":"regenwoud-bekken; vochtige lucht, hoge kruinen"},{"nr":9,"naam":"Arctisch ijs","kenmerk":"zee-ijs dat groeit en smelt met de seizoenen"},{"nr":10,"naam":"Koraalrif","kenmerk":"levend rif: koraal bouwt, vissen wonen, zee spoelt"}]}}
/*PALEIS46-END*/
;
var PALEIS={};
Object.keys(EMBED).forEach(function(id){PALEIS[id]=EMBED[id]});
var actief='wereldwonderen';
try{ if(window.D&&D.router&&D.router.stops){ PALEIS.wereldrouter={naam:'Wereldroute · '+D.router.naam, stops:D.router.stops} } }catch(e){}
function slug(){
  try{ if(window.D&&D.slug) return D.slug }catch(e){}
  return (location.pathname.split('/').pop()||'').replace(/\.html$/,'');
}
function norm(v){
  if(v==='wereld'||v==='wereldwonderen') return 'wereldwonderen';
  if(v==='mijn'||v==='persoonlijk') return 'persoonlijk';
  if(v==='landen'||v==='grond-reis') return 'grond-reis';
  if(v==='moeder-aarde') return 'moeder-aarde';
  if(v==='wereldrouter'||v==='router') return 'wereldrouter';
  return '';
}
function leesActief(){
  var n='', o='';
  try{ n=localStorage.getItem(KEY)||''; o=localStorage.getItem(OLD)||'' }catch(e){}
  var v=norm(n)||norm(o);
  if(!v){ try{ if(!n&&!o&&localStorage.getItem('kx46-sync')) v='persoonlijk' }catch(e){} }
  if(!v) v=PALEIS.wereldrouter?'wereldrouter':'wereldwonderen';
  try{ if(localStorage.getItem(KEY)!==v) localStorage.setItem(KEY,v) }catch(e){}
  return v;
}
function een(v){
  if(typeof v==='number'&&v>=1&&v<=10) return v;
  if(typeof v==='string'&&/^[1-9]$|^10$/.test(v)) return parseInt(v,10);
  if(v&&typeof v==='object'&&v.stops&&v.stops.length){
    var x=v.stops[0];
    if(typeof x==='number') return x;
  }
  return 0;
}
function nummer(id){
  var p={}; try{ p=(window.D&&D.paleizen)||{} }catch(e){}
  var v=p[id];
  if(v==null&&id==='wereldwonderen') v=p.wereld;
  if(v==null&&id==='persoonlijk') v=p.mijn;
  var n=een(v);
  if(id==='persoonlijk'){
    try{ var k=parseInt(localStorage.getItem('kx46-eigen-woord-'+slug()),10); if(k>=1&&k<=10) n=k }catch(e){}
  }
  if(!(n>=1&&n<=10)) n=een(p.wereldwonderen)||een(p.wereld)||een(p.persoonlijk)||een(p.mijn)||1;
  return n;
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]}) }
function kenmerkVan(s){ return (s&&(s.kenmerk||s.grond||s.levend))||'' }
function eigenRoute(){
  var r=[]; try{ r=JSON.parse(localStorage.getItem('kx46-eigen-route')||'[]') }catch(e){}
  if(!Array.isArray(r)) r=[];
  var stops=[];
  for(var i=0;i<10;i++){
    var naam=(r[i]||'').trim();
    stops.push({nr:i+1, naam:naam||'jouw plek', kenmerk:naam?'alleen op dit toestel':'vul je route hieronder', leeg:!naam});
  }
  return {naam:'Mijn eigen route', stops:stops};
}
function paleis(id){
  if(id==='persoonlijk') return eigenRoute();
  return PALEIS[id]||{naam:id, stops:[]};
}
function stopOp(id, n){
  var stops=paleis(id).stops||[];
  for(var i=0;i<stops.length;i++) if(stops[i].nr===n||i===n-1&&!stops[i].nr) return stops[i];
  return {nr:n, naam:'stop '+n, kenmerk:'', leeg:true};
}
function teken(id){
  if(!PALEIS[id]&&id!=='persoonlijk') id='wereldwonderen';
  actief=id;
  var n=nummer(id), pal=paleis(id), st=stopOp(id,n);
  var plek=document.querySelector('[data-pl-plek]');
  if(plek){
    if(id==='persoonlijk'){
      plek.textContent=st.leeg
        ? 'Paleis · mijn eigen route · stop '+n+' · nog leeg op dit toestel'
        : 'Paleis · mijn eigen route · stop '+n+' '+st.naam+' · alleen op dit toestel';
    }else{
      var ken=kenmerkVan(st);
      plek.textContent='Paleis · '+pal.naam+' · stop '+n+' '+st.naam+(ken?' · '+ken:'');
    }
  }
  var nm=document.querySelector('[data-pl-naam]');
  if(nm) nm.textContent=pal.naam;
  var ol=document.getElementById('pl-stops');
  if(ol){
    var html='';
    var lijst=(pal.stops&&pal.stops.length)?pal.stops:[];
    if(!lijst.length){ for(var i=1;i<=10;i++) lijst.push({nr:i,naam:'stop '+i,kenmerk:''}) }
    lijst.forEach(function(s){
      var nr=s.nr, aan=nr===n;
      var ken=kenmerkVan(s);
      html+='<li'+(aan?' class="anker" aria-current="true"':'')+'><b>'+esc(s.naam)+'</b>'+(ken?' <span class="sub">'+esc(ken)+'</span>':'')+'</li>';
    });
    ol.innerHTML=html;
  }
  document.querySelectorAll('.pl-switch button').forEach(function(b){
    b.setAttribute('aria-pressed', b.getAttribute('data-pl')===id?'true':'false');
  });
  var fig=document.querySelector('figure.beeld3');
  if(fig){
    var mijn=[].slice.call(fig.querySelectorAll('img.pl-mijn'));
    var wereld=[].slice.call(fig.querySelectorAll('img.pl-wereld'));
    var toonM=id==='persoonlijk'&&mijn.length>0;
    var toonW=(id==='wereldwonderen'||(id==='wereldrouter'&&D.router&&D.router.id==='wereldwonderen'))&&wereld.length>0;
    mijn.forEach(function(e){ e.hidden=!toonM });
    wereld.forEach(function(e){ e.hidden=!toonW });
    var note=fig.querySelector('[data-pl-beeld]');
    if(note) note.hidden=toonM||toonW||(!mijn.length&&!wereld.length);
  }
  try{ document.documentElement.setAttribute('data-paleis', id) }catch(e){}
}
function zet(id){
  id=norm(id)||(PALEIS.wereldrouter?'wereldrouter':'wereldwonderen');
  try{ localStorage.setItem(KEY,id) }catch(e){}
  teken(id);
}
function bind(){
  document.querySelectorAll('.pl-switch button').forEach(function(b){
    b.onclick=function(){ zet(b.getAttribute('data-pl')) };
  });
  document.addEventListener('input', function(e){
    var t=e.target;
    if(t&&t.closest&&t.closest('#eigen46')) teken(actief);
  });
}
function vers(d){
  if(!d||!d.stops) return null;
  return {naam:d.naam||'', stops:d.stops.map(function(s){
    return {nr:s.nr, naam:s.naam, kenmerk:s.kenmerk||s.grond||s.levend||''};
  })};
}
function boot(){
  bind();
  teken(leesActief());
  ['wereldwonderen','grond-reis','moeder-aarde'].forEach(function(id){
    fetch('paleis/'+id+'.json').then(function(r){ if(!r.ok) throw 0; return r.json() }).then(function(d){
      var v=vers(d); if(!v) return;
      PALEIS[id]=v; if(actief===id) teken(actief);
    }).catch(function(){});
  });
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
