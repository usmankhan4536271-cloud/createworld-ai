const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY="createworld-ai-v2";
const def={name:"Creator",saved:[],posts:[],likes:[],followers:0,views:0,original:false,guidelines:false};
let state;
try{state={...def,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(e){state={...def}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>Number(n||0).toLocaleString("en-US");
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2200)}
function copy(text){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>toast("Copied")).catch(()=>toast("Select and copy manually"));else toast("Clipboard not available")}

/* navigation */
function go(v){
  $$(".view").forEach(x=>x.classList.toggle("active",x.id==="view-"+v));
  $$("#nav button,#bottom button[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));
  window.scrollTo({top:0,behavior:"smooth"});
  if(v==="creator"){renderProfile();renderLibrary()}
  if(v==="monetize")renderMonetize();
  if(v==="explore")renderFeed();
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(b)go(b.dataset.view)});

/* studio */
$$(".tab[data-tool]").forEach(b=>b.onclick=()=>{
  $$(".tab[data-tool]").forEach(x=>x.classList.toggle("active",x===b));
  ["prompt","voice","plan"].forEach(k=>$("#"+k+"Tool").classList.toggle("hidden",k!==b.dataset.tool));
});
$("#idea").oninput=e=>$("#count").textContent=e.target.value.length;
$$("#styleChips .chip").forEach(c=>c.onclick=()=>{$$("#styleChips .chip").forEach(x=>x.classList.toggle("active",x===c))});
$$("[data-copy]").forEach(b=>b.onclick=()=>copy($("#"+b.dataset.copy).textContent));
function show(box,res,text,title){$(res).textContent=text;$(box).classList.remove("hidden");state.saved.unshift({title,text,date:new Date().toLocaleDateString()});state.saved=state.saved.slice(0,30);save()}

$("#makePrompt").onclick=()=>{
  const idea=$("#idea").value.trim(); if(!idea)return toast("Describe your video idea first");
  const style=$("#styleChips .active").textContent, ratio=$("#ratio").value, lang=$("#lang").value;
  show("#promptOutput","#promptResult",
`Create a ${style.toLowerCase()} style short video, ${ratio}.

CONCEPT
${idea}

VISUALS
Clear main subject, cinematic lighting, rich environment, consistent characters from the first frame to the last.

CAMERA
Wide establishing shot, then expressive medium shots, finishing with a memorable closing frame. Smooth, purposeful movement.

PACING
Strong hook in the first 2 seconds, one clear emotional beat, satisfying ending. Built for Reels, Shorts and TikTok.

VOICE / TEXT LANGUAGE
${lang}

AVOID
Unwanted text, logos, watermarks, distorted faces or hands.

(This is a prompt draft. Paste it into your video generator.)`,"Video prompt");
  toast("Prompt ready ✦");
};
$("#makeVoice").onclick=()=>{
  const t=$("#voiceTopic").value.trim(); if(!t)return toast("Enter a topic first");
  const tone=$("#voiceTone").value,len=$("#voiceLength").value;
  show("#voiceOutput","#voiceResult",
`VOICEOVER · ${len.toUpperCase()} · ${tone.toUpperCase()}

[HOOK]
Ruk jao — ek minute. ${t}: yeh baat zyada log nahi batate.

[MAIN]
Sab se pehle sab se zaroori idea batao. Phir ek aasan misaal do jo audience tasawwur kar sake. Har jumla chhota aur saaf rakho.

[CLOSE]
Ab agla qadam aapka hai. Follow karo aur batao agla topic kya ho.

NOTE: ${tone} andaz me parho. Hook ke baad halka sa pause lo. Middle ko ${len} ke hisaab se kam ya zyada karo.`,"Voiceover");
  toast("Script ready ✦");
};
$("#makePlan").onclick=()=>{
  const t=$("#planTopic").value.trim(); if(!t)return toast("Enter a content idea");
  show("#planOutput","#planResult",
`CONTENT PLAN: ${t}

1. HOOK: bold statement or question (first 2 seconds)
2. SETUP: what the viewer will get
3. POINT 1: first idea with an example
4. POINT 2: second tip or twist
5. POINT 3: one action to try today
6. CTA: follow / comment prompt

BEFORE POSTING
□ Title and caption  □ Thumbnail  □ Subtitles
□ Audio levels  □ Hashtags  □ Final review`,"Content plan");
  toast("Plan ready ✦");
};

/* feed */
const samples=[
  {id:"s1",name:"Creative Vision",time:"Featured idea",text:"A powerful story can start with one simple frame. What are you creating this week?",ico:"✦",tab:"trending"},
  {id:"s2",name:"Story Lab",time:"Video concept",text:"Try a 15-second story: one character, one challenge, one surprising last moment.",ico:"⌁",tab:"foryou"},
  {id:"s3",name:"Future Makers",time:"Inspiration",text:"Decide the feeling you want viewers to keep, then build every scene around it.",ico:"◈",tab:"foryou"},
  {id:"s4",name:"Hook School",time:"Tip",text:"Your first two seconds decide everything. Start with the most interesting moment, not the intro.",ico:"♛",tab:"trending"}
];
let feedTab="foryou";
$$("[data-feed]").forEach(b=>b.onclick=()=>{feedTab=b.dataset.feed;$$("[data-feed]").forEach(x=>x.classList.toggle("active",x===b));renderFeed()});
function renderFeed(){
  const own=state.posts.map((p,i)=>({...p,id:"own"+i,ico:"U",time:"Your post",tab:"all"}));
  let list=[...own,...samples];
  if(feedTab==="trending")list=list.filter(p=>p.tab==="trending"||p.tab==="all");
  if(feedTab==="following")list=own;
  $("#feed").innerHTML=list.length?list.map(p=>`<article class="post"><div class="ico">${p.ico}</div><div><b>${esc(p.name)}</b><small>${esc(p.time)}</small><p>${esc(p.text)}</p><div class="acts"><button data-like="${p.id}" class="${state.likes.includes(p.id)?"on":""}">${state.likes.includes(p.id)?"♥ Liked":"♡ Like"}</button><button data-share="${p.id}">↗ Share</button></div></div></article>`).join(""):`<div class="empty">Nothing here yet. Tap “New post” to share your first idea.</div>`;
  $$("[data-like]").forEach(b=>b.onclick=()=>{const id=b.dataset.like;state.likes=state.likes.includes(id)?state.likes.filter(x=>x!==id):[...state.likes,id];save();renderFeed()});
  $$("[data-share]").forEach(b=>b.onclick=()=>{const p=list.find(x=>x.id===b.dataset.share);copy(p.text)});
}
$("#newPost").onclick=()=>$("#postDialog").showModal();
$("#cancelPost").onclick=()=>$("#postDialog").close();
$("#publishPost").onclick=()=>{const t=$("#postText").value.trim();if(!t)return toast("Write something first");state.posts.unshift({name:state.name,text:t});save();$("#postText").value="";$("#postDialog").close();feedTab="foryou";$$("[data-feed]").forEach(x=>x.classList.toggle("active",x.dataset.feed==="foryou"));renderFeed();toast("Posted (visible in this browser only)")};

/* profile */
function renderProfile(){
  const n=state.name||"Creator";
  $("#pname").textContent=n;$("#pfp").textContent=n[0].toUpperCase();$("#avatarBtn").textContent=n[0].toUpperCase();
  $("#phandle").textContent="@"+n.toLowerCase().replace(/[^a-z0-9]+/g,"");
  $("#sViews").textContent=fmt(state.views);$("#sFollowers").textContent=fmt(state.followers);$("#sDrafts").textContent=state.saved.length;
}
$("#editProfile").onclick=()=>{const n=prompt("Display name:",state.name);if(n&&n.trim()){state.name=n.trim().slice(0,30);save();renderProfile();toast("Name updated")}};
function renderLibrary(){
  const el=$("#library");
  if(!state.saved.length){el.innerHTML=`<div class="empty">Your generated prompts, scripts and plans are saved here automatically.</div>`;return}
  el.innerHTML=state.saved.map((x,i)=>`<div class="item"><b>${esc(x.title)}</b> <small class="muted">· ${esc(x.date)}</small><pre>${esc(x.text)}</pre><button class="text-btn" data-cs="${i}">Copy</button> <button class="text-btn" data-ds="${i}">Delete</button></div>`).join("");
  $$("[data-cs]").forEach(b=>b.onclick=()=>copy(state.saved[b.dataset.cs].text));
  $$("[data-ds]").forEach(b=>b.onclick=()=>{state.saved.splice(+b.dataset.ds,1);save();renderLibrary();renderProfile()});
}

/* monetization checker */
function renderMonetize(){
  $("#inFollowers").value=state.followers||"";$("#inViews").value=state.views||"";
  $("#chkOriginal").checked=state.original;$("#chkGuidelines").checked=state.guidelines;
  drawReqs();
}
function drawReqs(){
  const f=state.followers,v=state.views;
  const rows=[
    {t:"1,000 followers",ok:f>=1000,p:Math.min(100,f/10),s:`${fmt(f)} / 1,000`},
    {t:"50,000 views (last 30 days)",ok:v>=50000,p:Math.min(100,v/500),s:`${fmt(v)} / 50,000`},
    {t:"Original content",ok:state.original},
    {t:"Community guidelines",ok:state.guidelines}
  ];
  $("#reqList").innerHTML=rows.map(r=>`<div><div class="req"><span>${r.t}</span><span class="${r.ok?"ok":"no"}">${r.ok?"✓ Done":"○ Pending"}${r.s?" · "+r.s:""}</span></div>${r.p!==undefined?`<div class="bar"><i style="width:${r.p}%"></i></div>`:""}</div>`).join("");
  const all=rows.every(r=>r.ok),box=$("#eligibleBox");
  box.className="eligible"+(all?" yes":"");
  box.textContent=all?"♛ You meet the target requirements. Real payouts will open when the platform launches.":"Keep creating. Meet all four requirements to become eligible.";
}
$("#inFollowers").oninput=e=>{state.followers=Math.max(0,parseInt(e.target.value)||0);save();drawReqs()};
$("#inViews").oninput=e=>{state.views=Math.max(0,parseInt(e.target.value)||0);save();drawReqs()};
$("#chkOriginal").onchange=e=>{state.original=e.target.checked;save();drawReqs()};
$("#chkGuidelines").onchange=e=>{state.guidelines=e.target.checked;save();drawReqs()};

/* plans */
["#waitPro","#waitPrem"].forEach(id=>$(id).onclick=()=>toast("Waitlist is not connected yet. Coming soon."));

renderProfile();renderFeed();
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
