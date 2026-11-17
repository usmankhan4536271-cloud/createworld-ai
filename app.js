const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY="createworld-ai-v2";
const def={name:"Creator",profile:null,hasProfile:false,plan:"free",videosUsed:0,earnings:0,saved:[],posts:[],likes:[],following:[],followers:0,views:0,original:false,guidelines:false,rewardsJoined:false,settings:{publicProfile:true,allowComments:true,allowDownloads:false,showVideos:true,notifFollowers:true,notifLikes:true,notifRewards:true,notifMessages:true,autoplay:true,lang:"Roman Urdu"},inbox:null};
let state;
try{state={...def,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(e){state={...def}}
if(!state.profile)state.profile={name:state.name||"Creator",username:(state.name||"creator").toLowerCase().replace(/[^a-z0-9]+/g,""),bio:"Create • Share • Grow • Earn",niche:"General"};
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
  if(v==="settings")renderSettings();
  if(v==="inbox")renderInbox();
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(b)go(b.dataset.view)});

/* studio */
const TOOLS=["prompt","voice","plan","title","thumb","story","hash"];
$$(".tab[data-tool]").forEach(b=>b.onclick=()=>{
  $$(".tab[data-tool]").forEach(x=>x.classList.toggle("active",x===b));
  TOOLS.forEach(k=>$("#"+k+"Tool").classList.toggle("hidden",k!==b.dataset.tool));
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

$("#makeTitle").onclick=()=>{
  const t=$("#titleTopic").value.trim(); if(!t)return toast("Enter a video topic first");
  const style=$("#titleStyle").value, lang=$("#titleLang").value;
  const T={
    Curiosity:[`Nobody Told You This About ${t}`,`The Truth About ${t} (Watch Till The End)`,`Why Everyone Is Wrong About ${t}`,`${t} — The Secret Nobody Shares`,`I Tried ${t} For 7 Days… Shocking Result`],
    "How-to":[`How To ${t} — Step By Step`,`${t} In 5 Easy Steps`,`Learn ${t} Fast — Beginner Guide`,`How I Do ${t} (Simple Method)`,`${t}: The Complete Guide For Beginners`],
    List:[`5 Best Ways To ${t}`,`Top 7 ${t} Tips You Need Today`,`3 ${t} Mistakes To Avoid`,`10 ${t} Ideas That Actually Work`,`${t}: 5 Things I Wish I Knew Earlier`],
    Story:[`My ${t} Story — From Zero To…`,`How ${t} Changed My Life`,`The Day ${t} Taught Me Everything`,`My Honest ${t} Journey`,`${t} — What Happened Next Will Surprise You`]
  }[style];
  show("#titleOutput","#titleResult",
`TITLES · ${style.toUpperCase()} · ${lang.toUpperCase()}

${T.map((x,i)=>(i+1)+". "+x).join("\n")}

DESCRIPTION
In this video: ${t}. Watch till the end for the best tip. Like, share and follow for more!

TAGS
${t.toLowerCase().replace(/[^a-z0-9 ]/g,"").split(/\s+/).filter(Boolean).slice(0,5).map(w=>"#"+w).join(" ")} #createworldai #shorts #viral`,"Titles + description");
  toast("Titles ready ✦");
};
$("#makeThumb").onclick=()=>{
  const t=$("#thumbTopic").value.trim(); if(!t)return toast("Enter a video topic first");
  show("#thumbOutput","#thumbResult",
`THUMBNAIL IDEAS: ${t}

1. BIG BOLD TEXT
Text: "${t.toUpperCase().slice(0,24)}"
Style: yellow text on dark background, shocked face on the right.

2. BEFORE vs AFTER
Left: sad / messy. Right: happy / clean.
Text: "BEFORE → AFTER" in white + gold arrow.

3. ONE WORD + EMOTION
Text: "WOW!" or "SECRET!"
Style: close-up face, bright background, red circle around the key thing.

RULES
• Max 3–4 words on the thumbnail
• Big text, high contrast (yellow/white on dark)
• One clear face or object — no clutter`,"Thumbnail ideas");
  toast("Thumbnail ideas ready ✦");
};
$("#makeStory").onclick=()=>{
  const c=$("#storyChar").value.trim(); if(!c)return toast("Enter a main character first");
  const moral=$("#storyMoral").value,len=$("#storyLen").value;
  show("#storyOutput","#storyResult",
`CARTOON STORY · ${len.toUpperCase()} · MORAL: ${moral.toUpperCase()}

${c} lived a simple life. One day, a small problem came — and everyone said it could not be fixed.

But ${c} did not give up. With patience and a clever idea, the problem slowly turned into a chance.

In the end, everyone smiled — because the real treasure was ${moral.toLowerCase()}.

LESSON
${moral} always wins in the end.

(Use this story with your cartoon scenes. Keep each scene 5–8 seconds.)`,"Cartoon story");
  toast("Story ready ✦");
};
$("#makeHash").onclick=()=>{
  const t=$("#hashTopic").value.trim(); if(!t)return toast("Enter a post topic first");
  const words=t.toLowerCase().replace(/[^a-z0-9 ]/g,"").split(/\s+/).filter(Boolean);
  const tags=[...new Set([...words.slice(0,4),"createworldai","viral","trending","reels","shorts","foryou","creator","motivation"])].slice(0,10).map(w=>"#"+w).join(" ");
  show("#hashOutput","#hashResult",
`CAPTION
${t} ✨
Create • Share • Grow • Earn — only on CreateWorld AI.

HASHTAGS
${tags}`,"Caption + hashtags");
  toast("Caption ready ✦");
};

/* feed */
const samples=[
  {id:"s1",name:"Creative Vision",time:"Featured video",text:"A powerful story can start with one simple frame. What are you creating this week?",ico:"✦",tab:"trending",img:"img/poster.jpg",views:12400},
  {id:"s2",name:"Story Lab",time:"Video concept",text:"Try a 15-second story: one character, one challenge, one surprising last moment.",ico:"⌁",tab:"foryou",img:"img/showcase.jpg",views:8300},
  {id:"s3",name:"Future Makers",time:"Inspiration",text:"Decide the feeling you want viewers to keep, then build every scene around it.",ico:"◈",tab:"foryou",img:"img/poster.jpg",views:5600},
  {id:"s4",name:"Hook School",time:"Tip",text:"Your first two seconds decide everything. Start with the most interesting moment, not the intro.",ico:"♛",tab:"trending",img:"img/showcase.jpg",views:21400}
];
let feedTab="foryou";
$$("[data-feed]").forEach(b=>b.onclick=()=>{feedTab=b.dataset.feed;$$("[data-feed]").forEach(x=>x.classList.toggle("active",x===b));renderFeed()});
function renderFeed(){
  const own=state.posts.map((p,i)=>({...p,id:"own"+i,ico:"U",time:"Your post",tab:"all"}));
  let list=[...own,...samples];
  if(feedTab==="trending")list=list.filter(p=>p.tab==="trending"||p.tab==="all");
  if(feedTab==="following")list=list.filter(p=>p.tab==="all"||(state.following||[]).includes(p.id));
  $("#feed").innerHTML=list.length?list.map(p=>{
    const followed=(state.following||[]).includes(p.id);
    const thumb=p.img?`<div class="vthumb" data-play="${p.id}"><img src="${p.img}" alt=""><span class="play">▶</span><span class="vcount">${fmt(p.views||0)} views</span></div>`:"";
    const follow=p.tab==="all"?"":`<button data-follow="${p.id}">${followed?"✓ Following":"＋ Follow"}</button>`;
    return `<article class="post"><div class="ico">${p.ico}</div><div><b>${esc(p.name)}</b><small>${esc(p.time)}</small>${thumb}<p>${esc(p.text)}</p><div class="acts"><button data-like="${p.id}" class="${state.likes.includes(p.id)?"on":""}">${state.likes.includes(p.id)?"♥ Liked":"♡ Like"}</button><button data-share="${p.id}">↗ Share</button>${follow}</div></div></article>`;
  }).join(""):`<div class="empty">Nothing here yet. Tap “New post” to share your first idea.</div>`;
  $$("[data-like]").forEach(b=>b.onclick=()=>{const id=b.dataset.like;state.likes=state.likes.includes(id)?state.likes.filter(x=>x!==id):[...state.likes,id];save();renderFeed()});
  $$("[data-share]").forEach(b=>b.onclick=()=>{const p=list.find(x=>x.id===b.dataset.share);copy(p.text)});
  $$("[data-follow]").forEach(b=>b.onclick=()=>{const id=b.dataset.follow;const f=state.following||[];state.following=f.includes(id)?f.filter(x=>x!==id):[...f,id];save();renderFeed();toast(state.following.includes(id)?"Following ✓":"Unfollowed")});
  $$("[data-play]").forEach(b=>b.onclick=()=>toast("Demo video — real playback needs the video upload backend"));
}
$("#newPost").onclick=()=>$("#postDialog").showModal();
$("#cancelPost").onclick=()=>$("#postDialog").close();
$("#publishPost").onclick=()=>{const t=$("#postText").value.trim();if(!t)return toast("Write something first");state.posts.unshift({name:state.name,text:t});save();$("#postText").value="";$("#postDialog").close();feedTab="foryou";$$("[data-feed]").forEach(x=>x.classList.toggle("active",x.dataset.feed==="foryou"));renderFeed();toast("Posted (visible in this browser only)")};

/* profile */
function renderProfile(){
  const p=state.profile||{name:"Creator",username:"creator",bio:"",niche:"General"};
  const n=p.name||"Creator";
  $("#pname").textContent=n;$("#pfp").textContent=n[0].toUpperCase();$("#avatarBtn").textContent=n[0].toUpperCase();
  $("#phandle").textContent="@"+(p.username||"creator");
  $("#pbio").textContent=p.bio||"Create • Share • Grow • Earn";
  $("#pniche").textContent=p.niche?("Niche: "+p.niche):"";
  const pl=PLANS[state.plan||"free"]||PLANS.free;
  $("#pquota").textContent="Plan: "+pl.name+" · Videos this month: "+(state.videosUsed||0)+" / "+pl.videos;
  const planPrice=pl.name==="Free"?"Rs 0":pl.name==="Pro"?"Rs 999/mo":"Rs 1,999/mo";
  $("#earnPlan").textContent="Plan: "+pl.name+" ("+planPrice+")";
  $("#earnVideos").textContent="Videos this month: "+(state.videosUsed||0)+" / "+pl.videos;
  $("#earnMoney").textContent="Kamai: Rs "+(state.earnings||0)+" (demo)";
  $("#earnGoals").textContent="Monetization goal: "+state.followers+" / 1,000 followers · "+state.views+" / 50,000 views";
  $("#editProfile").textContent=state.hasProfile?"Edit Profile":"Create Account";
  $("#sViews").textContent=fmt(state.views);$("#sFollowers").textContent=fmt(state.followers);$("#sDrafts").textContent=state.saved.length;
}
$("#editProfile").onclick=()=>{
  const p=state.profile||{name:"",username:"",bio:"",niche:"General"};
  $("#profileDialog h3").textContent=state.hasProfile?"Edit profile":"Create your account";
  $("#pfName").value=p.name==="Creator"?"":p.name;
  $("#pfUser").value=p.username==="creator"?"":p.username;
  $("#pfBio").value=p.bio||"";
  $("#pfNiche").value=p.niche||"General";
  $("#profileDialog").showModal();
};
$("#cancelProfile").onclick=()=>$("#profileDialog").close();
$("#saveProfile").onclick=()=>{
  const n=$("#pfName").value.trim(),u=$("#pfUser").value.trim().toLowerCase().replace(/[^a-z0-9_]/g,"");
  if(!n)return toast("Enter your display name");
  if(!u)return toast("Choose a username (letters and numbers)");
  state.profile={name:n.slice(0,30),username:u.slice(0,20),bio:$("#pfBio").value.trim().slice(0,140),niche:$("#pfNiche").value};
  state.name=n.slice(0,30);state.hasProfile=true;save();$("#profileDialog").close();renderProfile();toast("Account created ✦ Welcome, "+n);
};
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
  drawReqs();renderRewards();
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
  renderRewards();
}
$("#inFollowers").oninput=e=>{state.followers=Math.max(0,parseInt(e.target.value)||0);save();drawReqs()};
$("#inViews").oninput=e=>{state.views=Math.max(0,parseInt(e.target.value)||0);save();drawReqs()};
$("#chkOriginal").onchange=e=>{state.original=e.target.checked;save();drawReqs()};
$("#chkGuidelines").onchange=e=>{state.guidelines=e.target.checked;save();drawReqs()};

/* plans */
const PLANS={free:{name:"Free",videos:1},pro:{name:"Pro",videos:6},premium:{name:"Premium",videos:14}};
function renderPlans(){
  const p=state.plan||"free";
  $("#planFreeBtn").textContent=p==="free"?"Current plan":"Choose Free";
  $("#choosePro").textContent=p==="pro"?"Current plan":"Choose Pro";
  $("#choosePrem").textContent=p==="premium"?"Current plan":"Choose Premium";
}
$("#planFreeBtn").onclick=()=>{state.plan="free";save();renderPlans();renderProfile();toast("Free plan selected")};
$("#choosePro").onclick=()=>{state.plan="pro";save();renderPlans();renderProfile();toast("Pro selected — payment coming soon")};
$("#choosePrem").onclick=()=>{state.plan="premium";save();renderPlans();renderProfile();toast("Premium selected — payment coming soon")};
renderPlans();

/* settings */
function renderSettings(){
  const s=state.settings||def.settings;
  const p=state.profile||{name:"Creator",username:"creator"};
  $("#setAccount").textContent="Signed in as "+(p.name||"Creator")+" (@"+(p.username||"creator")+") · Plan: "+(PLANS[state.plan||"free"].name);
  $("#setPublic").checked=!!s.publicProfile;$("#setComments").checked=!!s.allowComments;
  $("#setDownloads").checked=!!s.allowDownloads;$("#setShowVideos").checked=!!s.showVideos;
  $("#setNotifFollowers").checked=!!s.notifFollowers;$("#setNotifLikes").checked=!!s.notifLikes;
  $("#setNotifRewards").checked=!!s.notifRewards;$("#setNotifMessages").checked=!!s.notifMessages;
  $("#setAutoplay").checked=!!s.autoplay;$("#setLang").value=s.lang||"Roman Urdu";
  $("#setStorage").textContent="Saved drafts: "+state.saved.length+" · Posts: "+state.posts.length+" · Likes: "+state.likes.length;
}
[["#setPublic","publicProfile"],["#setComments","allowComments"],["#setDownloads","allowDownloads"],["#setShowVideos","showVideos"],["#setNotifFollowers","notifFollowers"],["#setNotifLikes","notifLikes"],["#setNotifRewards","notifRewards"],["#setNotifMessages","notifMessages"],["#setAutoplay","autoplay"]].forEach(([id,key])=>{$(id).onchange=e=>{if(!state.settings)state.settings={...def.settings};state.settings[key]=e.target.checked;save();toast("Setting saved")}});
$("#setLang").onchange=e=>{if(!state.settings)state.settings={...def.settings};state.settings.lang=e.target.value;save();toast("Language: "+e.target.value)};
$("#setEditProfile").onclick=()=>{go("creator");$("#editProfile").click()};
$("#clearData").onclick=()=>{if(confirm("Clear all CreateWorld data in this browser?")){localStorage.removeItem(KEY);location.reload()}};

/* creator rewards program */
function calcRewards(){
  const v=Math.max(0,parseInt($("#rwViews").value)||0);
  $("#rwResult").textContent="Estimated reward: Rs "+fmt(Math.floor(v/10000*50))+" (demo rate: Rs 50 per 10,000 views)";
}
function renderRewards(){
  $("#joinRewards").textContent=state.rewardsJoined?"✓ Joined Rewards Program (demo)":"Join Rewards Program";
  const ok=state.followers>=1000&&state.views>=50000&&state.original&&state.guidelines;
  $("#rwStatus").textContent=state.rewardsJoined?(ok?"Eligible ✓ — rewards demo rate par count honge.":"Joined — pehle 4 requirements poori karo (upar dekho)."):"Join karo — phir views par reward count hoga (demo rate).";
  calcRewards();
}
$("#rwViews").oninput=calcRewards;
$("#joinRewards").onclick=()=>{state.rewardsJoined=!state.rewardsJoined;save();renderRewards();toast(state.rewardsJoined?"Rewards Program joined (demo)":"Rewards Program left")};

/* inbox */
const SEED_THREADS=[
  {id:"t1",name:"Ayesha Creates",msgs:[{f:"them",t:"Salam! Aapki video ka idea bohot acha tha.",time:"9:12"},{f:"me",t:"Shukriya! Agli video kal aayegi.",time:"9:20"}]},
  {id:"t2",name:"Bilal Edits",msgs:[{f:"them",t:"Thumbnail wali tips try ki, views barh gaye!",time:"Yesterday"}]},
  {id:"t3",name:"CreateWorld Team",msgs:[{f:"them",t:"Welcome! Rewards Program jald aa raha hai.",time:"Mon"}]}
];
function getThreads(){if(!state.inbox)state.inbox={threads:SEED_THREADS};return state.inbox.threads}
let openThread=null;
function renderInbox(){
  openThread=null;
  $("#inboxList").classList.remove("hidden");$("#threadView").classList.add("hidden");
  const list=getThreads();
  $("#inboxList").innerHTML=list.map(t=>{const last=t.msgs[t.msgs.length-1];return `<div class="inbox-item" data-thread="${t.id}"><div class="ico">${esc(t.name[0])}</div><div><b>${esc(t.name)}</b><small>${esc(last.time)}</small><p>${esc(last.t)}</p></div></div>`}).join("");
  $$("[data-thread]").forEach(el=>el.onclick=()=>openThreadFn(el.dataset.thread));
}
function openThreadFn(id){
  openThread=id;
  const t=getThreads().find(x=>x.id===id); if(!t)return;
  $("#inboxList").classList.add("hidden");
  $("#threadView").classList.remove("hidden");
  $("#threadName").textContent=t.name;
  $("#threadMsgs").innerHTML=t.msgs.map(m=>`<div class="msg ${m.f==="me"?"me":"them"}">${esc(m.t)}<small>${esc(m.time||"")}</small></div>`).join("");
}
$("#backInbox").onclick=()=>{openThread=null;$("#inboxList").classList.remove("hidden");$("#threadView").classList.add("hidden")};
$("#sendMsg").onclick=()=>{
  const v=$("#threadInput").value.trim(); if(!v||!openThread)return;
  const t=getThreads().find(x=>x.id===openThread); if(!t)return;
  t.msgs.push({f:"me",t:v,time:"now"}); save();
  $("#threadInput").value=""; openThreadFn(openThread);
};

renderProfile();renderFeed();
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
