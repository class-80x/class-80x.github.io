
(function(){
  "use strict";
  const $=s=>document.querySelector(s);
  const play=$("#playButton"), frame=$("#gameFrame"), start=$("#startScreen");
  const favBtn=$("#favoriteButton"), newTab=$("#newTabButton"), fs=$("#fullscreenButton");
  const related=$("#relatedGrid");
  const currentSlug=location.pathname.split("/").pop().replace(/\.html$/i,"");

  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const cat=c=>({action:"Action & Adventure",strategy:"Strategy & Puzzle",casual:"Casual & Idle",driving:"Driving & Sports"}[c]||c||"Browser Game");
  const pop=v=>Number(String(v||"0").replace(/[^0-9.]/g,""))*(String(v).includes("B")?1e9:String(v).includes("M")?1e6:String(v).includes("K")?1e3:1);
  const image=g=>g.localThumb||((g.link||"")+(g.thumb||""));

  function rememberRecent(id){
    if(id==null) return;
    let a=[]; try{a=JSON.parse(localStorage.getItem("nova-recents")||"[]").map(String)}catch(e){}
    a=[String(id),...a.filter(x=>x!==String(id))].slice(0,24);
    localStorage.setItem("nova-recents",JSON.stringify(a));
  }
  function favorites(){
    try{return JSON.parse(localStorage.getItem("nova-favorites")||"[]").map(String)}catch(e){return []}
  }
  function setFavorite(id){
    if(id==null) return;
    let a=favorites(), sid=String(id);
    a=a.includes(sid)?a.filter(x=>x!==sid):[sid,...a];
    localStorage.setItem("nova-favorites",JSON.stringify(a));
    favBtn.textContent=(a.includes(sid)?"★ ":"☆ ")+"Favorite";
  }
  function launch(){
    if(!frame) return;
    const url=frame.dataset.src;
    if(url && !frame.src) frame.src=url;
    frame.style.display="block";
    if(start) start.style.display="none";
  }
  if(play) play.addEventListener("click", launch);

  if(fs) fs.addEventListener("click",()=>{
    const target=$("#player")||frame;
    if(document.fullscreenElement) document.exitFullscreen();
    else if(target && target.requestFullscreen) target.requestFullscreen();
  });

  if(newTab) newTab.addEventListener("click",()=>{
    const url=(frame&&frame.dataset.src)||"";
    if(!url) return;
    const w=window.open("about:blank","_blank");
    if(!w) return;
    w.document.open();
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Game</title><style>html,body,iframe{width:100%;height:100%;margin:0;border:0;background:#000;overflow:hidden}iframe{display:block}</style></head><body><iframe allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write" allowfullscreen src="'+esc(url)+'"></iframe></body></html>');
    w.document.close();
  });

  fetch("../data/games.json",{cache:"no-store"}).then(r=>{
    if(!r.ok) throw new Error("catalog");
    return r.json();
  }).then(d=>{
    const games=Array.isArray(d.games)?d.games:[];
    const current=games.find(g=>g.slug===currentSlug);
    if(current){
      rememberRecent(current.id);
      if(favBtn){
        const on=favorites().includes(String(current.id));
        favBtn.textContent=(on?"★ ":"☆ ")+"Favorite";
        favBtn.onclick=()=>setFavorite(current.id);
      }
    }
    if(related){
      const picks=[...games]
        .filter(g=>g.slug!==currentSlug)
        .sort((a,b)=>pop(b.popularity)-pop(a.popularity))
        .slice(0,24);
      related.innerHTML=picks.map(g=>`
        <article class="game-card">
          <a href="${encodeURIComponent(g.slug)}.html">
            <div class="cover-wrap">
              <img class="cover" src="${esc(image(g))}" alt="${esc(g.name)}" width="320" height="320" loading="lazy" decoding="async" onerror="this.src='../assets/logo.svg'">
            </div>
            <div class="card-text"><strong>${esc(g.name)}</strong><span>${esc(cat(g.category))}</span></div>
          </a>
        </article>`).join("");
    }
  }).catch(()=>{
    if(related) related.innerHTML='<p class="related-error">Popular games could not be loaded.</p>';
  });
})();
