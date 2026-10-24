// SkillSwap front-end demo. Local account storage is for learning only.
(() => {
"use strict";
const $ = id => document.getElementById(id);
const skills = [
{id:1,title:"Web Development",category:"Technology",icon:"⌘",person:"Aarav Mehta",description:"Learn to build responsive websites with HTML, CSS, and JavaScript.",teaches:"HTML, CSS, JavaScript",learns:"UI design",popularity:98},
{id:2,title:"UI/UX Design",category:"Design",icon:"✳",person:"Maya Shah",description:"Explore wireframes, user flows, prototypes, and thoughtful design.",teaches:"Figma, prototyping",learns:"Frontend basics",popularity:91},
{id:3,title:"Photography",category:"Creative",icon:"◉",person:"Rohan Patil",description:"Understand composition, lighting, and visual storytelling.",teaches:"Portrait photography",learns:"Video editing",popularity:85},
{id:4,title:"Public Speaking",category:"Communication",icon:"◖",person:"Sara Khan",description:"Build confidence, structure a talk, and present ideas clearly.",teaches:"Presentations",learns:"Graphic design",popularity:79},
{id:5,title:"Python Programming",category:"Technology",icon:"⌘",person:"Dev Kulkarni",description:"Learn Python fundamentals, functions, and small projects.",teaches:"Python, problem solving",learns:"Web development",popularity:94},
{id:6,title:"Video Editing",category:"Creative",icon:"▷",person:"Isha Verma",description:"Learn pacing, transitions, sound, and a clean editing workflow.",teaches:"Video editing",learns:"Photography",popularity:73}
];
const grid=$("skillGrid"), search=$("searchInput"), sort=$("sortSelect"), filters=$("categoryFilters");
let category="All", toastTimer;
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
function renderSkills(){
 let list=skills.filter(s=>(category==="All"||s.category===category)&&[s.title,s.category,s.person,s.description,s.teaches,s.learns].join(" ").toLowerCase().includes(search.value.trim().toLowerCase()));
 list.sort(sort.value==="title"?(a,b)=>a.title.localeCompare(b.title):(a,b)=>b.popularity-a.popularity);
 $("resultCount").textContent=list.length;
 grid.innerHTML=list.map(s=>`<article class="skill-card"><div class="skill-top"><span class="skill-icon">${escapeHTML(s.icon)}</span><span class="category">${escapeHTML(s.category)}</span></div><h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.description)}</p><div class="person">${escapeHTML(s.person)}<small>Wants to learn: ${escapeHTML(s.learns)}</small></div><div class="card-foot"><span>Teaches: ${escapeHTML(s.teaches)}</span><button type="button" data-profile="${s.id}">View profile ↗</button></div></article>`).join("");
 $("emptyState").hidden=list.length>0;grid.hidden=list.length===0;
}
search.addEventListener("input",renderSkills);sort.addEventListener("change",renderSkills);
filters.addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;category=b.dataset.category;filters.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x===b));renderSkills()});
$("resetButton").addEventListener("click",()=>{search.value="";sort.value="popular";category="All";filters.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x.dataset.category==="All"));renderSkills()});
const profile=$("profileDialog");
grid.addEventListener("click",e=>{const b=e.target.closest("[data-profile]");if(!b)return;const s=skills.find(x=>x.id===Number(b.dataset.profile));$("profileTitle").textContent=s.title;$("profileContent").innerHTML=`<p class="profile-detail"><strong>${escapeHTML(s.person)}</strong> can teach ${escapeHTML(s.teaches)} and would like to learn ${escapeHTML(s.learns)}. ${escapeHTML(s.description)}</p><button class="btn primary" id="requestConnection">Request to connect ↗</button>`;profile.showModal()});
$("closeDialog").addEventListener("click",()=>profile.close());profile.addEventListener("click",e=>{if(e.target===profile)profile.close()});
$("profileContent").addEventListener("click",e=>{if(e.target.closest("#requestConnection"))toast("Demo request sent! Real messaging can be added later.")});
$("year").textContent=new Date().getFullYear();

// Local demo authentication. Do not use real passwords or deploy as production auth.
const auth=$("authDialog"), authButton=$("authButton"), USERS="skillswapDemoUsers", SESSION="skillswapDemoSession";
const register=$("registerForm"), login=$("loginForm");
function getUsers(){try{const u=JSON.parse(localStorage.getItem(USERS)||"[]");return Array.isArray(u)?u:[]}catch{return[]}}
function setMsg(el,msg,type=""){el.textContent=msg;el.className="message"+(type?" "+type:"")}
function switchTab(tab){const reg=tab==="register";register.hidden=!reg;login.hidden=reg;$("showRegister").classList.toggle("active",reg);$("showLogin").classList.toggle("active",!reg);$("authTitle").textContent=reg?"Create your account":"Welcome back";$("authSubtitle").textContent=reg?"Start learning and sharing your skills.":"Log in to continue your SkillSwap journey.";setMsg($("registerMessage"),"");setMsg($("loginMessage"),"")}
function currentUser(){try{const s=JSON.parse(localStorage.getItem(SESSION)||"null");return s?getUsers().find(u=>u.id===s.id)||null:null}catch{return null}}
function renderAccount(){const u=currentUser();if(u){$("authForms").hidden=true;$("accountPanel").hidden=false;$("authTitle").textContent="Your account";$("authSubtitle").textContent="You're part of the SkillSwap community.";$("accountName").textContent=u.name;$("accountEmail").textContent=u.email;authButton.textContent="My account"}else{localStorage.removeItem(SESSION);$("authForms").hidden=false;$("accountPanel").hidden=true;authButton.textContent="Log in / Sign up";switchTab("register")}}
function openAuth(){renderAccount();if(!auth.open)auth.showModal()}
authButton.addEventListener("click",openAuth);$("heroJoinButton").addEventListener("click",openAuth);$("bottomJoinButton").addEventListener("click",openAuth);
$("closeAuthDialog").addEventListener("click",()=>auth.close());auth.addEventListener("click",e=>{if(e.target===auth)auth.close()});
$("showRegister").addEventListener("click",()=>switchTab("register"));$("showLogin").addEventListener("click",()=>switchTab("login"));
async function hashPassword(p){if(!window.crypto?.subtle)throw Error("Open this page through Live Server to use the demo.");const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(p));return Array.from(new Uint8Array(d)).map(x=>x.toString(16).padStart(2,"0")).join("")}
register.addEventListener("submit",async e=>{e.preventDefault();const name=$("registerName").value.trim(),email=$("registerEmail").value.trim().toLowerCase(),password=$("registerPassword").value,confirm=$("confirmPassword").value;setMsg($("registerMessage"),"");if(name.length<2)return setMsg($("registerMessage"),"Please enter your full name.","error");if(password.length<8)return setMsg($("registerMessage"),"Password must be at least 8 characters.","error");if(password!==confirm)return setMsg($("registerMessage"),"Passwords do not match.","error");const users=getUsers();if(users.some(u=>u.email===email)){switchTab("login");$("loginEmail").value=email;return setMsg($("loginMessage"),"This email is already registered. Please log in.","error")}const btn=register.querySelector('[type="submit"]');btn.disabled=true;try{const id=crypto.randomUUID?crypto.randomUUID():String(Date.now());users.push({id,name,email,passwordHash:await hashPassword(password)});localStorage.setItem(USERS,JSON.stringify(users));localStorage.setItem(SESSION,JSON.stringify({id}));register.reset();renderAccount();toast("Welcome to SkillSwap, "+name+"!")}catch(err){setMsg($("registerMessage"),err.message||"Could not create account.","error")}finally{btn.disabled=false}});
login.addEventListener("submit",async e=>{e.preventDefault();const email=$("loginEmail").value.trim().toLowerCase(),password=$("loginPassword").value,btn=login.querySelector('[type="submit"]');btn.disabled=true;setMsg($("loginMessage"),"");try{const user=getUsers().find(u=>u.email===email);if(!user||user.passwordHash!==await hashPassword(password))return setMsg($("loginMessage"),"Incorrect email or password.","error");localStorage.setItem(SESSION,JSON.stringify({id:user.id}));login.reset();renderAccount();toast("Welcome back, "+user.name+"!")}catch(err){setMsg($("loginMessage"),err.message||"Could not log in.","error")}finally{btn.disabled=false}});
$("logoutButton").addEventListener("click",()=>{localStorage.removeItem(SESSION);renderAccount();switchTab("login");toast("You've logged out.")});
renderSkills();renderAccount();
})();
