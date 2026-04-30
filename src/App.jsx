import { useState, useEffect, useRef } from "react";

// ─── localStorage helpers ────────────────────────────────────────────────────
const lsGet = k => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch(e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} };
const lsDel = k => { try { localStorage.removeItem(k); } catch(e) {} };

// ─── Constants ───────────────────────────────────────────────────────────────
const QUOTES = [
  "Hard work never killed anyone, but let's not test that theory. ☕",
  "I'm not procrastinating — I'm letting ideas marinate. 🧠",
  "My brain has too many tabs open. Please hold. 🌀",
  "The early bird gets the worm. I get brunch. 🍳",
  "I put the 'pro' in procrastination. Consistently. 🏆",
  "Meetings: where minutes are kept and hours are lost. 📅",
  "My to-do list has its own to-do list. Thriving. 📝",
  "Success: 1% inspiration, 99% not checking Twitter. 🐦",
  "I'm not lazy — I'm in aggressive energy-saving mode. ⚡",
  "Deadlines: the only thing that makes time feel real. ⏰",
  "I can and I will. Tomorrow. Definitely tomorrow. 🌅",
  "Work smarter, not harder. Also, nap smarter. 💤",
  "Best time to start was yesterday. Second best: after coffee. ☕",
  "Inbox zero is a myth, like unicorns and work-life balance. 🦄",
  "I work well under pressure. And under my duvet. 🛌",
  "Out of office. Also out of ideas. Back soon™. 🚶",
  "Today's to-do: survive. Everything else is bonus. ✌️",
  "Coffee in hand, chaos in plan. Let's go. 🔥",
];

const BACKGROUNDS = [
  { label:"Parchment", value:"#F7F0E6", dark:false },
  { label:"Sage",      value:"#E8EDE4", dark:false },
  { label:"Blush",     value:"#F5E8E4", dark:false },
  { label:"Linen",     value:"#F0EBE0", dark:false },
  { label:"Slate",     value:"#E4E8ED", dark:false },
  { label:"Midnight",  value:"#0D1117", dark:true  },
  { label:"Forest",    value:"#1A2B1E", dark:true  },
  { label:"Charcoal",  value:"#1C1C1E", dark:true  },
  { label:"Navy",      value:"#0F1729", dark:true  },
  { label:"Dawn",   gradient:true, value:"linear-gradient(135deg,#FFECD2,#FCB69F)", dark:false },
  { label:"Honey",  gradient:true, value:"linear-gradient(135deg,#F8D57E,#F08030)", dark:false },
  { label:"Rose",   gradient:true, value:"linear-gradient(135deg,#FFD1DC,#C8A0D1)", dark:false },
  { label:"Juniper",gradient:true, value:"linear-gradient(135deg,#134E5E,#71B280)", dark:true  },
  { label:"Twilight",gradient:true,value:"linear-gradient(135deg,#667EEA,#764BA2)", dark:true  },
  { label:"Ember",  gradient:true, value:"linear-gradient(135deg,#3D0C02,#C96A3F)", dark:true  },
];

// ─── Themed backgrounds ───────────────────────────────────────────────────────
const THEME_IMAGES = {
  cat: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1600&q=80",
    "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1600&q=80",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=1600&q=80",
    "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=1600&q=80",
    "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=1600&q=80",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1600&q=80",
  ],
  plant: [
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80",
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1600&q=80",
    "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1600&q=80",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1600&q=80",
    "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=1600&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
  ],
  space: [
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&q=80",
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1600&q=80",
    "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1600&q=80",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&q=80",
    "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1600&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80",
  ],
};

const THEMES = [
  { label:"Tabby",      emoji:"🐱", value:"#FFF4E8", dark:false, accent:"#D4834A", group:"cat",   tx:"#2A1A0A", muted:"#8A6A4A", desc:"Warm cream & ginger" },
  { label:"Calico",     emoji:"🐱", value:"linear-gradient(135deg,#FDE8D8,#F5C8D0,#E8D8F0)", gradient:true, dark:false, accent:"#C4708A", group:"cat",   tx:"#2A0A1A", muted:"#8A5A70", desc:"Soft tortoiseshell" },
  { label:"Night Cat",  emoji:"🐱", value:"linear-gradient(135deg,#1A1025,#2D1B3D)", gradient:true, dark:true,  accent:"#B88FD4", group:"cat",   tx:"#EDE0FF", muted:"#9A85B8", desc:"Mysterious purple dusk" },
  { label:"Void Cat",   emoji:"🐱", value:"#0A0A0F", dark:true,  accent:"#8B5CF6", group:"cat",   tx:"#E8E0FF", muted:"#8878B8", desc:"Pure midnight vibes" },
  { label:"Fern",       emoji:"🌿", value:"#EFF4EA", dark:false, accent:"#5A8A40", group:"plant", tx:"#0F2208", muted:"#4A6A35", desc:"Fresh sage morning" },
  { label:"Greenhouse", emoji:"🌿", value:"linear-gradient(135deg,#E8F5E4,#C8E6C0)", gradient:true, dark:false, accent:"#3A7A30", group:"plant", tx:"#0A1F05", muted:"#3A6028", desc:"Lush botanical garden" },
  { label:"Moss",       emoji:"🌿", value:"#1C2B1A", dark:true,  accent:"#7ABF5E", group:"plant", tx:"#D8F0D0", muted:"#7A9870", desc:"Deep forest floor" },
  { label:"Terrarium",  emoji:"🌿", value:"linear-gradient(135deg,#0D1F0A,#1A3A14)", gradient:true, dark:true,  accent:"#90D870", group:"plant", tx:"#D0F0C0", muted:"#70A860", desc:"Overgrown & cozy" },
  { label:"Cosmos",     emoji:"🚀", value:"linear-gradient(160deg,#0B0C2A,#1A1040,#0D1B3E)", gradient:true, dark:true,  accent:"#7B8FE8", group:"space", tx:"#D8DFFF", muted:"#7880B8", desc:"Deep space explorer" },
  { label:"Nebula",     emoji:"🚀", value:"linear-gradient(135deg,#1A0B2E,#2D1554,#0D1F3C)", gradient:true, dark:true,  accent:"#C084FC", group:"space", tx:"#EDD8FF", muted:"#9878C8", desc:"Purple cosmic cloud" },
  { label:"Aurora",     emoji:"🚀", value:"linear-gradient(135deg,#050F1A,#0A2A1A,#050F1A)", gradient:true, dark:true,  accent:"#34D399", group:"space", tx:"#C8FFE8", muted:"#60A880", desc:"Northern lights" },
  { label:"Starfield",  emoji:"🚀", value:"#04060F", dark:true,  accent:"#60A5FA", group:"space", tx:"#D8E8FF", muted:"#6878A8", desc:"Infinite dark sky" },
];

const CAT_COLORS = ["#C96A3F","#6B8F5E","#5B7FA6","#9B5EA0","#B89030","#5BA0A0","#A05B5B","#7B8B6F","#7060B0"];

// ─── Utilities ───────────────────────────────────────────────────────────────
const formatDur = ms => { const s=Math.max(0,Math.floor((ms||0)/1000)); return `${Math.floor(s/3600)}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; };
const fmtMins  = ms => { const s=Math.floor((ms||0)/1000); if(s<60)return`${s}s`; const m=Math.floor(s/60); return m<60?`${m}m`:`${Math.floor(m/60)}h ${m%60}m`; };
const fmtTime  = ts => new Date(ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
const todayStr = () => new Date().toISOString().split("T")[0];
const uid      = () => Date.now().toString(36)+Math.random().toString(36).slice(2);
const fmtDate  = s => new Date(s+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"});
const fmtMY    = d => d.toLocaleDateString("en-US",{month:"long",year:"numeric"});
const fmtRel   = s => { if(s===todayStr())return"Today"; const y=new Date();y.setDate(y.getDate()-1);if(s===y.toISOString().split("T")[0])return"Yesterday";return fmtDate(s); };

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  // Auth
  const [screen,   setScreen]   = useState("loading");
  const [authMode, setAuthMode] = useState("login");
  const [eml, setEml] = useState(""); const [pwd, setPwd] = useState(""); const [authErr, setAuthErr] = useState("");
  const [user, setUser] = useState(null);
  // Data
  const [tasks,       setTasks]       = useState([]);
  const [notes,       setNotes]       = useState([]);
  const [reflections, setReflections] = useState({});
  const [reminders,   setReminders]   = useState([]);
  const [cats,        setCats]        = useState([]);
  // Timer
  const [active,  setActive]  = useState(null);
  const [elapsed, setElapsed] = useState(0);
  // UI
  const [view,     setView]     = useState("today");
  const [darkMode, setDarkMode] = useState(false);
  const [bg,       setBg]       = useState(BACKGROUNDS[0]);
  const [taskInput,setTaskInput]= useState("");
  const [selCat,   setSelCat]   = useState(null);
  const [quote,    setQuote]    = useState(QUOTES[0]);
  const [quoteVis, setQuoteVis] = useState(true);
  // Calendar
  const [calMo,  setCalMo]  = useState(new Date());
  const [calSel, setCalSel] = useState(todayStr());
  // Notes
  const [selNote,   setSelNote]   = useState(null);
  const [noteDraft, setNoteDraft] = useState({title:"",content:""});
  const [noteSearch,setNoteSearch]= useState("");
  const [noteSaved, setNoteSaved] = useState(true);
  // Reflections
  const [refMo,       setRefMo]       = useState(new Date());
  const [editRefDate,    setEditRefDate]    = useState(null);
  const [refDlFrom,      setRefDlFrom]      = useState("");
  const [refDlTo,        setRefDlTo]        = useState("");
  const [refGood,     setRefGood]     = useState("");
  const [refBetter,   setRefBetter]   = useState("");
  // Modals
  const [showLogout,  setShowLogout]  = useState(false);
  const [showPom,     setShowPom]     = useState(false);
  const [showCats,    setShowCats]    = useState(false);
  const [showBg,      setShowBg]      = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddRem,  setShowAddRem]  = useState(false);
  // Plan task
  const [planDate, setPlanDate] = useState(todayStr());
  const [planDesc, setPlanDesc] = useState("");
  const [planCat,  setPlanCat]  = useState(null);
  // Reminder
  const [remTitle, setRemTitle] = useState("");
  const [remDate,  setRemDate]  = useState(todayStr());
  const [remTime,  setRemTime]  = useState("09:00");
  // Pomodoro
  const [pomMode, setPomMode] = useState("work");
  const [pomRun,  setPomRun]  = useState(false);
  const [pomSec,  setPomSec]  = useState(0);
  // Inline task editing
  const [editingTask, setEditingTask] = useState(null);
  const [editDesc,    setEditDesc]    = useState("");
  const [editStart,   setEditStart]   = useState("");
  const [editEnd,     setEditEnd]     = useState("");
  // Cats settings
  const [newCatName, setNewCatName] = useState(""); const [newCatCol, setNewCatCol] = useState(CAT_COLORS[0]);
  const [customHex,  setCustomHex]  = useState("#F7F0E6");
  const [notifPerm,  setNotifPerm]  = useState("default");
  // WFO tracker
  const [wfoDays,     setWfoDays]     = useState({});
  const [wfoGoals,    setWfoGoals]    = useState({});
  const [wfoMo,       setWfoMo]       = useState(new Date());
  const [showGoalEdit,setShowGoalEdit]= useState(false);
  const [goalInput,   setGoalInput]   = useState("");
  const [showWfoShare,setShowWfoShare]= useState(false);
  const [wfoShareUrl, setWfoShareUrl] = useState("");
  const [sharedWfoView,setSharedWfoView]=useState(null); // {days,goals,ownerEmail}
  // Floating sticky notes
  const [stickyNotes,   setStickyNotes]   = useState([]);
  const [showAddSticky, setShowAddSticky] = useState(false);
  const [stickyDraft,   setStickyDraft]   = useState("");
  const [stickyColor,   setStickyColor]   = useState("#FFF9C4");
  // Theme image
  const [themeImgIdx,   setThemeImgIdx]   = useState(0);
  const [bgImgOpacity,  setBgImgOpacity]  = useState(0.12);
  const [customBgImg,   setCustomBgImg]   = useState(null); // base64 data URL
  // Refs
  const tRef    = useRef();
  const pRef    = useRef();
  const remRef  = useRef();
  const userRef = useRef(null); // always-current user for intervals

  // ── Theme ──────────────────────────────────────────────────────────────────
  const dk      = darkMode;
  const isDark  = dk || bg.dark; // combine dark mode toggle + theme darkness
  const tx      = dk ? "#F0EBE3" : (bg.tx || (isDark ? "#F0EBE3" : "#1A0F0A"));
  const muted   = dk ? "#8A8078" : (bg.muted || (isDark ? "#8A8078" : "#7A6A5A"));
  const cardBg  = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.82)";
  const bdr     = isDark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.09)";
  const inputBg = isDark ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.95)";
  const themeImg = bg.group && THEME_IMAGES[bg.group] ? THEME_IMAGES[bg.group][themeImgIdx % THEME_IMAGES[bg.group].length] : null;
  const pageBg  = dk ? "#0E1015" : bg.value;
  const hdrBg   = isDark ? "rgba(14,16,21,0.92)" : "rgba(247,240,230,0.88)";
  const modBg   = isDark ? "#161820" : "#FDFAF6";
  const faint   = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const accent  = bg.accent || "#C96A3F";
  const accentRGB = bg.accent
    ? `${parseInt(bg.accent.slice(1,3),16)},${parseInt(bg.accent.slice(3,5),16)},${parseInt(bg.accent.slice(5,7),16)}`
    : "201,106,63";
  const accentL = dk ? `rgba(${accentRGB},0.18)` : `rgba(${accentRGB},0.12)`;
  const card    = { background:cardBg, border:`1px solid ${bdr}`, borderRadius:14, backdropFilter:"blur(16px)" };
  const btnS    = { padding:"6px 10px", background:"transparent", border:`1px solid ${bdr}`, borderRadius:8, color:tx, cursor:"pointer", fontSize:13, fontFamily:"'Outfit',sans-serif", transition:"all 0.15s" };
  const inp     = { padding:"11px 14px", border:`1.5px solid ${bdr}`, borderRadius:10, background:inputBg, color:tx, fontSize:14, outline:"none", fontFamily:"'Outfit',sans-serif", width:"100%" };

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if ("Notification" in window) setNotifPerm(Notification.permission);
    const session = lsGet("oynb_session");
    if (session) {
      const u = lsGet(`oynb_u:${session}`);
      if (u) {
        userRef.current = u;
        setUser(u);
        if (u.darkMode !== undefined) setDarkMode(u.darkMode);
        if (u.bg) setBg(u.bg);
        pullData(u.email);
        setScreen("app");
        return;
      }
    }
    setScreen("auth");
    // Check for shared WFO link
    const hash = window.location.hash;
    if (hash.startsWith("#wfo=")) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(hash.slice(5)))));
        setSharedWfoView(decoded);
      } catch(e) {}
    }
  }, []);

  // ── Quote rotation ─────────────────────────────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setQuoteVis(false);
      setTimeout(() => { setQuote(QUOTES[Math.floor(Math.random()*QUOTES.length)]); setQuoteVis(true); }, 400);
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  // ── Active timer ───────────────────────────────────────────────────────────
  useEffect(() => {
    clearInterval(tRef.current);
    if (active) { setElapsed(Date.now()-active.startTime); tRef.current = setInterval(() => setElapsed(Date.now()-active.startTime), 1000); }
    return () => clearInterval(tRef.current);
  }, [active]);

  // ── Pomodoro ───────────────────────────────────────────────────────────────
  useEffect(() => {
    clearInterval(pRef.current);
    if (pomRun) { pRef.current = setInterval(() => setPomSec(s => { const lim=pomMode==="work"?1500:300; if(s+1>=lim){setPomRun(false);return lim;} return s+1; }), 1000); }
    return () => clearInterval(pRef.current);
  }, [pomRun, pomMode]);

  // ── Reminder check ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    remRef.current = setInterval(() => {
      const now = new Date();
      const nowKey = `${now.toISOString().split("T")[0]}T${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
      setReminders(prev => {
        let changed = false;
        const up = prev.map(r => {
          if (!r.triggered && `${r.date}T${r.time}` <= nowKey) {
            changed = true;
            if ("Notification" in window && Notification.permission === "granted") {
              try { new Notification("Kaam Se Kaam 💼", { body: r.title }); } catch(e) {}
            }
            return { ...r, triggered: true };
          }
          return r;
        });
        if (changed && userRef.current) { lsSet(`oynb_reminders:${userRef.current.email}`, up); return up; }
        return prev;
      });
    }, 30000);
    return () => clearInterval(remRef.current);
  }, [user]);

  // ── Keep userRef in sync ───────────────────────────────────────────────────
  useEffect(() => { userRef.current = user; }, [user]);

  // ── Data functions ─────────────────────────────────────────────────────────
  function pullData(em) {
    const t   = lsGet(`oynb_tasks:${em}`);
    const n   = lsGet(`oynb_notes:${em}`);
    const r   = lsGet(`oynb_refs:${em}`);
    const rem = lsGet(`oynb_reminders:${em}`);
    const c   = lsGet(`oynb_cats:${em}`);
    const wd  = lsGet(`oynb_wfodays:${em}`);
    const wg  = lsGet(`oynb_wfogoals:${em}`);
    if (t)   { setTasks(t); const a=t.find(x=>x.startTime&&!x.endTime); if(a)setActive(a); }
    if (n)   setNotes(n);
    if (r)   setReflections(r);
    if (rem) setReminders(rem);
    if (c)   setCats(c);
    if (wd)  setWfoDays(wd);
    if (wg)  setWfoGoals(wg);
    const sn = lsGet(`ksk_sticky:${em}`);
    if (sn)  setStickyNotes(sn);
    const ti = lsGet(`ksk_themeimg:${em}`);
    if (ti !== null) setThemeImgIdx(ti);
    const op = lsGet(`ksk_bgopacity:${em}`);
    if (op !== null) setBgImgOpacity(op);
    const cb = lsGet(`ksk_custombg:${em}`);
    if (cb) setCustomBgImg(cb);
  }

  const saveStickyNotes = n => { setStickyNotes(n); if(userRef.current) lsSet(`ksk_sticky:${userRef.current.email}`, n); };
  const saveThemeImg    = i => { setThemeImgIdx(i);  if(userRef.current) lsSet(`ksk_themeimg:${userRef.current.email}`, i); };
  const saveBgOpacity   = v => { setBgImgOpacity(v); if(userRef.current) lsSet(`ksk_bgopacity:${userRef.current.email}`, v); };
  const saveCustomBgImg = d => { setCustomBgImg(d);  if(userRef.current) lsSet(`ksk_custombg:${userRef.current.email}`, d); };
  const saveTasks    = t => { setTasks(t);       if(userRef.current) lsSet(`oynb_tasks:${userRef.current.email}`, t); };
  const saveNotes    = n => { setNotes(n);       if(userRef.current) lsSet(`oynb_notes:${userRef.current.email}`, n); };
  const saveRefs     = r => { setReflections(r); if(userRef.current) lsSet(`oynb_refs:${userRef.current.email}`, r); };
  const saveRems     = r => { setReminders(r);   if(userRef.current) lsSet(`oynb_reminders:${userRef.current.email}`, r); };
  const saveCats     = c => { setCats(c);        if(userRef.current) lsSet(`oynb_cats:${userRef.current.email}`, c); };
  const saveWfoDays  = d => { setWfoDays(d);     if(userRef.current) lsSet(`oynb_wfodays:${userRef.current.email}`, d); };
  const saveWfoGoals = g => { setWfoGoals(g);    if(userRef.current) lsSet(`oynb_wfogoals:${userRef.current.email}`, g); };
  const saveUD       = u => { setUser(u); userRef.current=u; lsSet(`oynb_u:${u.email}`, u); };

  // ── Notion push ────────────────────────────────────────────────────────────
  const [notionSending, setNotionSending] = useState(null); // id of item being sent
  const [notionSent,    setNotionSent]    = useState({});   // { [id]: true } for success flash

  async function pushToNotion({ id, type, title, content, date, category }) {
    setNotionSending(id);
    try {
      const res = await fetch("/.netlify/functions/notion-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, content, date, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setNotionSent(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setNotionSent(prev => { const n={...prev}; delete n[id]; return n; }), 3000);
    } catch (err) {
      alert(`Could not send to Notion: ${err.message}`);
    } finally {
      setNotionSending(null);
    }
  }

  // ── Auth ───────────────────────────────────────────────────────────────────
  function handleAuth(e) {
    e.preventDefault(); setAuthErr("");
    if (!eml || !pwd) return setAuthErr("Please fill both fields.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eml)) return setAuthErr("Valid email required.");

    if (authMode === "register") {
      const existing = lsGet(`oynb_u:${eml}`);
      if (existing) return setAuthErr("Email already registered. Try logging in.");
      const u = { email:eml, password:pwd, createdAt:Date.now(), bg:BACKGROUNDS[0], darkMode:false };
      lsSet(`oynb_u:${eml}`, u);
      lsSet("oynb_session", eml);
      userRef.current = u;
      setUser(u);
      setScreen("app");
    } else {
      const u = lsGet(`oynb_u:${eml}`);
      if (!u) return setAuthErr("Account not found. Please sign up first.");
      if (u.password !== pwd) return setAuthErr("Incorrect password.");
      lsSet("oynb_session", eml);
      userRef.current = u;
      setUser(u);
      if (u.darkMode !== undefined) setDarkMode(u.darkMode);
      if (u.bg) setBg(u.bg);
      pullData(eml);
      setScreen("app");
    }
  }

  // ── Tasks ──────────────────────────────────────────────────────────────────
  function startTask(desc) {
    const now=Date.now(), tod=todayStr();
    let ts=[...tasks];
    if (active) ts=ts.map(t=>t.id===active.id?{...t,endTime:now,duration:now-t.startTime}:t);
    const nt={id:uid(),description:desc,categoryId:selCat,startTime:now,endTime:null,duration:null,date:tod,planned:false};
    ts=[...ts,nt]; setActive(nt); setElapsed(0); setTaskInput(""); saveTasks(ts);
  }
  function stopTask() {
    if (!active) return;
    const now=Date.now();
    saveTasks(tasks.map(t=>t.id===active.id?{...t,endTime:now,duration:now-t.startTime}:t));
    setActive(null); setElapsed(0);
  }
  function addPlannedTask() {
    if (!planDesc.trim()) return;
    const nt={id:uid(),description:planDesc.trim(),categoryId:planCat,startTime:null,endTime:null,duration:null,date:planDate,planned:true};
    saveTasks([...tasks,nt]); setPlanDesc(""); setPlanCat(null); setShowAddTask(false);
  }
  function startPlannedTask(task) {
    const now=Date.now(); let ts=[...tasks];
    if (active) ts=ts.map(t=>t.id===active.id?{...t,endTime:now,duration:now-t.startTime}:t);
    const updated=ts.map(t=>t.id===task.id?{...t,startTime:now,planned:false}:t);
    saveTasks(updated); setActive(updated.find(t=>t.id===task.id)); setElapsed(0);
  }
  function deleteTask(id) {
    if (active?.id===id) { setActive(null); setElapsed(0); }
    saveTasks(tasks.filter(t=>t.id!==id));
  }
  function toHHMM(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
  }
  function mergeTimeIntoDate(dateStr, hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date(dateStr + "T00:00:00");
    d.setHours(h, m, 0, 0);
    return d.getTime();
  }
  function openEditTask(t) {
    setEditingTask(t.id);
    setEditDesc(t.description);
    setEditStart(t.startTime ? toHHMM(t.startTime) : "");
    setEditEnd(t.endTime ? toHHMM(t.endTime) : "");
  }
  function saveTaskEdit(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const newStart = editStart ? mergeTimeIntoDate(t.date, editStart) : t.startTime;
    const newEnd   = editEnd   ? mergeTimeIntoDate(t.date, editEnd)   : t.endTime;
    const newDur   = (newStart && newEnd && newEnd > newStart) ? newEnd - newStart : t.duration;
    const updated = tasks.map(x => x.id===id ? {
      ...x,
      description: editDesc.trim() || x.description,
      startTime: newStart,
      endTime:   newEnd,
      duration:  newDur,
    } : x);
    saveTasks(updated);
    setEditingTask(null);
  }
  function getOverlappingIds(taskList) {
    const done = taskList.filter(t => t.startTime && t.endTime && !t.planned);
    const overlaps = new Set();
    for (let i = 0; i < done.length; i++) {
      for (let j = i+1; j < done.length; j++) {
        const a = done[i], b = done[j];
        if (a.date !== b.date) continue;
        if (a.startTime < b.endTime && b.startTime < a.endTime) {
          overlaps.add(a.id); overlaps.add(b.id);
        }
      }
    }
    return overlaps;
  }

  // ── Notes ──────────────────────────────────────────────────────────────────
  function selectNote(note) { setSelNote(note.id); setNoteDraft({title:note.title,content:note.content}); setNoteSaved(true); }
  function newNote() {
    const n={id:uid(),title:"Untitled Note",content:"",date:todayStr(),createdAt:Date.now(),updatedAt:Date.now()};
    const updated=[n,...notes]; saveNotes(updated);
    setSelNote(n.id); setNoteDraft({title:n.title,content:n.content}); setNoteSaved(true);
  }
  function saveCurrentNote() {
    if (!selNote) return;
    saveNotes(notes.map(n=>n.id===selNote?{...n,title:noteDraft.title||"Untitled Note",content:noteDraft.content,updatedAt:Date.now()}:n));
    setNoteSaved(true);
  }
  function deleteNote(id) {
    saveNotes(notes.filter(n=>n.id!==id));
    if (selNote===id) { setSelNote(null); setNoteDraft({title:"",content:""}); }
  }

  // ── Reflections ────────────────────────────────────────────────────────────
  function openReflection(date) { setEditRefDate(date); setRefGood(reflections[date]?.good||""); setRefBetter(reflections[date]?.better||""); }
  function saveReflection() { if(!editRefDate) return; saveRefs({...reflections,[editRefDate]:{good:refGood,better:refBetter}}); setEditRefDate(null); }
  // WFO sharing — encode current WFO data as base64 in a URL
  function generateWfoShare() {
    const payload = { days: wfoDays, goals: wfoGoals, owner: user?.email || "?" };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const url = window.location.href.split("#")[0] + "#wfo=" + encoded;
    setWfoShareUrl(url);
    setShowWfoShare(true);
  }
  // Sticky notes
  const STICKY_COLORS = ["#FFF9C4","#C8F7C5","#C5D5F7","#F7C5D5","#F7DEC5","#E8C5F7"];
  function addStickyNote() {
    if (!stickyDraft.trim()) return;
    const note = { id: uid(), text: stickyDraft.trim(), color: stickyColor, createdAt: Date.now() };
    saveStickyNotes([...stickyNotes, note]);
    setStickyDraft(""); setShowAddSticky(false);
  }
  function deleteStickyNote(id) { saveStickyNotes(stickyNotes.filter(n => n.id !== id)); }

  function downloadReflections() {
    const from = refDlFrom || "2000-01-01";
    const to   = refDlTo   || todayStr();
    const rows = Object.entries(reflections)
      .filter(([d]) => d >= from && d <= to)
      .sort(([a],[b]) => a.localeCompare(b));
    if (!rows.length) { alert("No reflections found in that date range."); return; }
    const hdr = ["Date","Something Good","Could Have Gone Better"].join(",");
    const body = rows.map(([d, r]) =>
      [`"${d}"`, `"${(r.good||"").replace(/"/g,'""')}"`, `"${(r.better||"").replace(/"/g,'""')}"`].join(",")
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([[hdr,...body].join("\n")], {type:"text/csv"}));
    a.download = `ksk-reflections-${from}-to-${to}.csv`;
    a.click();
  }

  // ── Reminders ──────────────────────────────────────────────────────────────
  function addReminder() {
    if (!remTitle.trim()||!remDate||!remTime) return;
    saveRems([...reminders,{id:uid(),title:remTitle.trim(),date:remDate,time:remTime,triggered:false,createdAt:Date.now()}]);
    setRemTitle(""); setRemDate(todayStr()); setRemTime("09:00"); setShowAddRem(false);
  }
  async function requestNotif() { if("Notification" in window){ const p=await Notification.requestPermission(); setNotifPerm(p); } }

  // ── Settings ───────────────────────────────────────────────────────────────
  function applyBg(b)    { setBg(b); saveUD({...userRef.current,bg:b}); }
  function toggleDark()  { const d=!darkMode; setDarkMode(d); saveUD({...userRef.current,darkMode:d}); }
  function handleLogout(){ stopTask(); setShowLogout(true); }
  function doLogout()    { lsDel("oynb_session"); setUser(null); setTasks([]); setNotes([]); setReflections({}); setReminders([]); setCats([]); setActive(null); setScreen("auth"); setShowLogout(false); }

  function downloadReport(period) {
    const tod=todayStr();
    let rows=tasks.filter(t=>!t.planned&&t.duration);
    if(period==="daily") rows=rows.filter(t=>t.date===tod);
    else { const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return d.toISOString().split("T")[0];}); rows=rows.filter(t=>days.includes(t.date)); }
    // Collapse same-name tasks on same date — sum their durations
    const collapsed={};
    rows.forEach(t=>{
      const key=`${t.date}||${t.description.trim().toLowerCase()}`;
      if(!collapsed[key]) collapsed[key]={...t, duration:0, startTime:t.startTime};
      collapsed[key].duration+=(t.duration||0);
    });
    const merged=Object.values(collapsed).sort((a,b)=>a.date.localeCompare(b.date)||a.description.localeCompare(b.description));
    const hdr=["Task","Category","Date","Total Duration (min)"].join(",");
    const body=merged.map(t=>{const c=cats.find(c=>c.id===t.categoryId);return[`"${t.description}"`,`"${c?.name||"—"}"`,t.date,Math.round(t.duration/60000)].join(",");});
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([[hdr,...body].join("\n")],{type:"text/csv"})); a.download=`ksk-${period}-${tod}.csv`; a.click();
  }

  // ── Computed ───────────────────────────────────────────────────────────────
  const todayTasks    = tasks.filter(t=>t.date===todayStr());
  const todayDone     = todayTasks.filter(t=>t.endTime);
  const totalMs       = todayTasks.reduce((s,t)=>s+(t.duration||(active?.id===t.id?elapsed:0)),0);
  const filteredNotes = notes.filter(n=>!noteSearch||n.title.toLowerCase().includes(noteSearch.toLowerCase())||n.content.toLowerCase().includes(noteSearch.toLowerCase()));
  const pomLim  = pomMode==="work"?1500:300;
  const pomRem  = pomLim-pomSec;
  const pomDisp = `${String(Math.floor(pomRem/60)).padStart(2,"0")}:${String(pomRem%60).padStart(2,"0")}`;
  const pomPct  = (pomSec/pomLim)*100;
  const calY=calMo.getFullYear(), calM=calMo.getMonth();
  const calFirst=new Date(calY,calM,1).getDay(), calDays=new Date(calY,calM+1,0).getDate();
  const refY=refMo.getFullYear(), refM=refMo.getMonth();
  const refFirst=new Date(refY,refM,1).getDay(), refDays=new Date(refY,refM+1,0).getDate();
  const byDate    = tasks.reduce((a,t)=>{if(!a[t.date])a[t.date]=[];a[t.date].push(t);return a;},{});
  const byDateRem = reminders.reduce((a,r)=>{if(!a[r.date])a[r.date]=[];a[r.date].push(r);return a;},{});
  const upcoming  = reminders.filter(r=>!r.triggered&&r.date>=todayStr()).sort((a,b)=>`${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────

  if (screen==="loading") return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0E1015",fontFamily:"'Playfair Display',serif",fontSize:24,color:"#7A6A5A"}}>
      Waking your brain up...
    </div>
  );

  if (screen==="auth") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0E1015 0%,#1C1525 60%,#0E1015 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",padding:20}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{marginBottom:40,animation:"fadeIn 0.5s ease"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:11,fontWeight:600,color:accent,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:6}}>Welcome to</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:44,fontWeight:700,color:"#F0EBE3",lineHeight:1.05,marginBottom:10}}>Kaam Se<br/>Kaam.</div>
          <div style={{fontSize:14,color:"rgba(240,235,227,0.45)"}}>Kaam. Notes. Reflect. Balance.</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:20,padding:"32px 28px",backdropFilter:"blur(20px)",animation:"fadeIn 0.6s ease 0.1s both"}}>
          <div style={{display:"flex",background:"rgba(255,255,255,0.06)",borderRadius:10,padding:3,marginBottom:24,gap:2}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setAuthMode(m);setAuthErr("");}} style={{flex:1,padding:"8px 0",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:500,transition:"all 0.2s",background:authMode===m?accent:"transparent",color:authMode===m?"#fff":"rgba(240,235,227,0.45)"}}>
                {m==="login"?"Log In":"Create Account"}
              </button>
            ))}
          </div>
          <form onSubmit={handleAuth} style={{display:"flex",flexDirection:"column",gap:12}}>
            <input value={eml} onChange={e=>setEml(e.target.value)} type="email" placeholder="Email address"
              style={{padding:"13px 16px",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:10,background:"rgba(255,255,255,0.07)",color:"#F0EBE3",fontSize:14,outline:"none",fontFamily:"'Outfit',sans-serif"}}/>
            <input value={pwd} onChange={e=>setPwd(e.target.value)} type="password" placeholder="Password (min 6 chars)"
              style={{padding:"13px 16px",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:10,background:"rgba(255,255,255,0.07)",color:"#F0EBE3",fontSize:14,outline:"none",fontFamily:"'Outfit',sans-serif"}}/>
            {authErr&&<div style={{color:"#E07070",fontSize:12,padding:"4px 2px"}}>{authErr}</div>}
            <button type="submit" style={{padding:"13px 0",background:accent,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",marginTop:4}}>
              {authMode==="login"?"Log In →":"Create Account →"}
            </button>
          </form>
          <div style={{marginTop:14,fontSize:11,color:"rgba(240,235,227,0.3)",textAlign:"center"}}>Your data lives in your browser — private to you, always.</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:pageBg,fontFamily:"'Outfit',sans-serif",color:tx,transition:"background 0.45s ease",position:"relative"}}>
      {/* Theme background image */}
      {(customBgImg||(themeImg&&!dk))&&(
        <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
          backgroundImage:`url(${customBgImg||themeImg})`,backgroundSize:"cover",backgroundPosition:"center",
          opacity:bgImgOpacity,transition:"opacity 0.4s, background-image 0.4s"}}/>
      )}
      {/* Theme image cycle button */}
      {bg.group&&THEME_IMAGES[bg.group]&&!dk&&(
        <button onClick={()=>{ const next=(themeImgIdx+1)%THEME_IMAGES[bg.group].length; saveThemeImg(next); }}
          style={{position:"fixed",bottom:20,right:20,zIndex:50,background:cardBg,border:`1px solid ${bdr}`,borderRadius:10,padding:"7px 12px",cursor:"pointer",fontSize:12,color:tx,fontFamily:"'Outfit',sans-serif",backdropFilter:"blur(12px)",boxShadow:"0 2px 12px rgba(0,0,0,0.12)"}}>
          {bg.emoji} Next image
        </button>
      )}
      {/* Floating sticky notes */}
      {stickyNotes.map((n,i)=>{
        const positions=[
          {bottom:80,right:20},{bottom:80,right:180},{bottom:80,right:340},
          {bottom:180,right:20},{bottom:180,right:180},{bottom:240,right:20},
        ];
        const pos=positions[i%positions.length];
        return(
          <div key={n.id} style={{position:"fixed",...pos,zIndex:40,background:n.color,borderRadius:12,padding:"12px 14px",maxWidth:190,boxShadow:"0 4px 20px rgba(0,0,0,0.15)",fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#2A2010",lineHeight:1.5,transform:`rotate(${(i%3-1)*2.5}deg)`,transition:"all 0.2s"}}>
            <div style={{fontSize:13,marginBottom:6,paddingRight:18}}>{n.text}</div>
            <button onClick={()=>deleteStickyNote(n.id)} style={{position:"absolute",top:6,right:8,background:"transparent",border:"none",fontSize:14,cursor:"pointer",color:"rgba(0,0,0,0.35)",lineHeight:1}}>×</button>
            <div style={{fontSize:9,color:"rgba(0,0,0,0.3)",marginTop:4}}>
              {new Date(n.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
            </div>
          </div>
        );
      })}
      {/* Add sticky note button */}
      {view==="today"&&(
        <button onClick={()=>setShowAddSticky(true)}
          style={{position:"fixed",bottom:20,left:20,zIndex:50,background:cardBg,border:`1px solid ${bdr}`,borderRadius:10,padding:"7px 12px",cursor:"pointer",fontSize:12,color:tx,fontFamily:"'Outfit',sans-serif",backdropFilter:"blur(12px)",boxShadow:"0 2px 12px rgba(0,0,0,0.12)"}}>
          📌 Add note
        </button>
      )}

      {/* HEADER */}
      <div style={{position:"sticky",top:0,zIndex:200,backdropFilter:"blur(24px)",background:hdrBg,borderBottom:`1px solid ${bdr}`}}>
        <div style={{maxWidth:1160,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",height:56,gap:8}}>
          <div style={{flexShrink:0,marginRight:6,cursor:"pointer"}} onClick={()=>setView("today")}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:10,fontWeight:600,color:accent,letterSpacing:"0.12em",textTransform:"uppercase",lineHeight:1}}>Kaam Se</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:accent,lineHeight:1.1}}>Kaam.</div>
          </div>
          <div style={{display:"flex",background:dk?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)",borderRadius:9,padding:3,gap:2}}>
            {[["today","Today"],["notes","Notes"],["calendar","Calendar"],["reflections","Reflections"],["wfo","WFO"]].map(([v,l])=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"5px 10px",border:"none",borderRadius:7,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:500,transition:"all 0.15s",background:view===v?accent:"transparent",color:view===v?"#fff":muted,whiteSpace:"nowrap"}}>
                {l}
              </button>
            ))}
          </div>
          <span style={{flex:1,fontSize:11,color:muted,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",opacity:quoteVis?1:0,transition:"opacity 0.35s",padding:"0 8px"}}>{quote}</span>
          <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
            <button onClick={toggleDark} title={dk?"Light Mode":"Dark Mode"} style={btnS}>{dk?"☀️":"🌙"}</button>
            <button onClick={()=>setShowPom(true)}  title="Pomodoro" style={btnS}>🍅</button>
            <button onClick={()=>setShowBg(true)}   title="Background" style={btnS}>🎨</button>
            <button onClick={()=>setShowCats(true)} title="Categories" style={btnS}>🏷</button>
            <button onClick={()=>{setRemDate(todayStr());setShowAddRem(true);}} title="Reminder" style={btnS}>🔔</button>
            <button onClick={()=>downloadReport("daily")}  title="Today CSV"  style={btnS}>📥</button>
            <button onClick={()=>downloadReport("weekly")} title="Week CSV"   style={btnS}>📊</button>
            <button onClick={handleLogout} style={{...btnS,marginLeft:4,fontWeight:500}}>Log Out</button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1160,margin:"0 auto",padding:"32px 16px 80px"}}>

        {/* ══ TODAY ══════════════════════════════════════════════════════════ */}
        {view==="today"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28,flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,lineHeight:1.1}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
                <div style={{fontSize:13,color:muted,marginTop:4}}>{active ? `${fmtMins(totalMs)} tracked today — timer running` : totalMs > 0 ? `${fmtMins(totalMs)} tracked today` : "No time tracked yet"}</div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button onClick={()=>{setPlanDate(todayStr());setPlanDesc("");setPlanCat(null);setShowAddTask(true);}} style={{...btnS,fontSize:12}}>+ Plan Task</button>
                <button onClick={()=>{setRemDate(todayStr());setShowAddRem(true);}} style={{...btnS,fontSize:12}}>+ Reminder</button>
                {active&&<button onClick={stopTask} style={{...btnS,fontSize:12}}>⏹ Stop Timer</button>}
              </div>
            </div>

            {active&&(
              <div style={{...card,padding:"14px 18px",marginBottom:20,borderLeft:`3px solid ${accent}`}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:accent,animation:"pulse 1.5s infinite",flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,color:tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{active.description}</div>
                    {cats.find(c=>c.id===active.categoryId)&&<div style={{fontSize:11,color:muted,marginTop:2}}>{cats.find(c=>c.id===active.categoryId).name}</div>}
                  </div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:22,fontWeight:500,color:accent,flexShrink:0}}>{formatDur(elapsed)}</div>
                </div>
              </div>
            )}

            <div style={{...card,padding:"14px 16px",marginBottom:24}}>
              <form onSubmit={e=>{e.preventDefault();const d=taskInput.trim();if(d)startTask(d);}} style={{display:"flex",gap:10,alignItems:"center"}}>
                <input value={taskInput} onChange={e=>setTaskInput(e.target.value)} autoFocus
                  placeholder={active?"Switching to... (Enter to swap timer)":"What are you working on? Hit Enter to start the timer →"}
                  style={{...inp,flex:1}}/>
                <select value={selCat||""} onChange={e=>setSelCat(e.target.value||null)} style={{...inp,width:"auto",maxWidth:130,cursor:"pointer",color:selCat?tx:muted}}>
                  <option value="">No category</option>
                  {cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button type="submit" style={{padding:"11px 18px",background:accent,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",flexShrink:0}}>
                  {active?"Switch":"Start"}
                </button>
              </form>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20,alignItems:"start"}}>
              <div>
                {todayTasks.length===0?(
                  <div style={{textAlign:"center",padding:"50px 0",color:muted}}>
                    <div style={{fontSize:38,marginBottom:10}}>☕</div>
                    <div style={{fontSize:14}}>Type something above and hit Enter to start tracking!</div>
                  </div>
                ):(
                  <>
                    <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:muted,marginBottom:12}}>Today's Tasks</div>
                    <div style={{display:"flex",flexDirection:"column",gap:7}}>
                      {(()=>{ const overlappingIds=getOverlappingIds(todayTasks); return [...todayTasks].reverse().map(t=>{
                        const isAct=active?.id===t.id, dur=t.duration||(isAct?elapsed:0), cat=cats.find(c=>c.id===t.categoryId);
                        const isEditing=editingTask===t.id;
                        const isOverlap = overlappingIds.has(t.id);
                        const editedDurMs = (editStart && editEnd) ? (() => {
                          const s = mergeTimeIntoDate(t.date, editStart);
                          const e = mergeTimeIntoDate(t.date, editEnd);
                          return e > s ? e - s : null;
                        })() : null;
                        return (
                            <div key={t.id} style={{...card, padding:"12px 15px", display:"flex", alignItems:"center", gap:10,
                              borderLeft: isEditing ? ("3px solid "+accent) : isOverlap ? "3px solid #E8A030" : isAct ? ("3px solid "+accent) : t.planned ? ("3px dashed "+muted) : "3px solid transparent",
                              background: isOverlap && !isEditing ? (dk?"rgba(232,160,48,0.08)":"rgba(232,160,48,0.07)") : cardBg,
                              transition:"all 0.2s", animation:"fadeIn 0.3s ease", flexWrap:isEditing?"wrap":"nowrap"}}>
                              {!isEditing&&<>
                                {cat&&<div style={{width:7,height:7,borderRadius:"50%",background:cat.color,flexShrink:0}}/>}
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:13,fontWeight:isAct?600:400,color:t.planned?muted:tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.description}</div>
                                  <div style={{display:"flex",gap:8,marginTop:3,alignItems:"center",flexWrap:"wrap"}}>
                                    {cat&&<span style={{fontSize:10,padding:"1px 7px",borderRadius:20,background:cat.color+"22",color:cat.color,fontWeight:500}}>{cat.name}</span>}
                                    {t.planned
                                      ? <span style={{fontSize:10,color:muted,fontStyle:"italic"}}>planned</span>
                                      : <span style={{fontSize:10,color:muted}}>{fmtTime(t.startTime)}{t.endTime?" \u2192 "+fmtTime(t.endTime):" \u2192 now"}</span>}
                                    {isOverlap&&<span style={{fontSize:10,fontWeight:600,color:"#E8A030",padding:"1px 7px",borderRadius:20,background:"rgba(232,160,48,0.15)"}}>&#9888; overlapping time</span>}
                                  </div>
                                </div>
                                {t.planned&&t.date===todayStr()&&<button onClick={()=>startPlannedTask(t)} style={{...btnS,fontSize:11,padding:"4px 10px"}}>&#9654; Start</button>}
                                {!t.planned&&<div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:14,color:isAct?accent:tx,fontWeight:500,flexShrink:0}}>{fmtMins(dur)}</div>}
                                {!isAct&&!t.planned&&<button onClick={()=>openEditTask(t)} style={{...btnS,fontSize:11,padding:"3px 8px",flexShrink:0,color:isOverlap?"#E8A030":tx,borderColor:isOverlap?"rgba(232,160,48,0.5)":bdr}}>&#9998; Edit</button>}
                                <button onClick={()=>pushToNotion({id:t.id,type:"Task",title:t.description,date:t.date,category:cats.find(c=>c.id===t.categoryId)?.name})} disabled={!!notionSending} title="Send to Notion" style={{background:notionSent[t.id]?"rgba(60,180,100,0.15)":"transparent",border:`1px solid ${notionSent[t.id]?"rgba(60,180,100,0.4)":bdr}`,borderRadius:6,color:notionSent[t.id]?"#3CB464":muted,cursor:"pointer",fontSize:11,padding:"3px 7px",flexShrink:0,opacity:notionSending===t.id?0.5:1,transition:"all 0.2s"}}>{notionSent[t.id]?"✓ Sent":notionSending===t.id?"…":"N"}</button>
                                <button onClick={()=>deleteTask(t.id)} style={{background:"transparent",border:"none",color:muted,cursor:"pointer",fontSize:17,padding:"1px 4px",opacity:0.45,lineHeight:1}}>&#215;</button>
                              </>}
                              {isEditing&&<div style={{width:"100%",display:"flex",flexDirection:"column",gap:10}}>
                                <div style={{fontSize:11,fontWeight:600,color:muted,textTransform:"uppercase",letterSpacing:"0.05em"}}>Edit Task</div>
                                <input value={editDesc} onChange={e=>setEditDesc(e.target.value)}
                                  style={{...inp,fontSize:13,padding:"8px 11px"}} placeholder="Task name"/>
                                <div style={{display:"flex",gap:10,alignItems:"flex-end",flexWrap:"wrap"}}>
                                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                                    <span style={{fontSize:11,color:muted}}>Start time</span>
                                    <input type="time" value={editStart} onChange={e=>setEditStart(e.target.value)}
                                      style={{...inp,fontSize:13,padding:"8px 11px",width:130}}/>
                                  </div>
                                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                                    <span style={{fontSize:11,color:muted}}>End time</span>
                                    <input type="time" value={editEnd} onChange={e=>setEditEnd(e.target.value)}
                                      style={{...inp,fontSize:13,padding:"8px 11px",width:130}}/>
                                  </div>
                                  {editedDurMs!==null&&(
                                    <div style={{padding:"8px 14px",background:accentL,borderRadius:9,fontSize:13,fontWeight:600,color:accent,fontFamily:"'IBM Plex Mono',monospace",alignSelf:"flex-end"}}>
                                      {"= "+fmtMins(editedDurMs)}
                                    </div>
                                  )}
                                  {editStart&&editEnd&&editedDurMs===null&&(
                                    <div style={{padding:"8px 12px",background:"rgba(220,60,60,0.12)",borderRadius:9,fontSize:12,color:"#C84B4B",alignSelf:"flex-end"}}>
                                      End must be after start
                                    </div>
                                  )}
                                </div>
                                <div style={{display:"flex",gap:8}}>
                                  <button onClick={()=>setEditingTask(null)} style={{...btnS,fontSize:12,flex:1}}>Cancel</button>
                                  <button onClick={()=>saveTaskEdit(t.id)} disabled={editStart&&editEnd&&editedDurMs===null}
                                    style={{flex:2,padding:"8px 0",background:accent,color:"#fff",border:"none",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif",opacity:(editStart&&editEnd&&editedDurMs===null)?0.4:1}}>Save</button>
                                </div>
                              </div>}
                            </div>
                            );
                      });})()}
                    </div>
                  </>
                )}
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{...card,padding:"16px"}}>
                  <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:muted,marginBottom:12}}>Today's Reflection</div>
                  {reflections[todayStr()]?.good||reflections[todayStr()]?.better?(
                    <div>
                      {reflections[todayStr()]?.good&&<div style={{marginBottom:10}}>
                        <div style={{fontSize:10,color:muted,marginBottom:3}}>✨ Something good</div>
                        <div style={{fontSize:12,color:tx,lineHeight:1.55,padding:"8px 10px",background:faint,borderRadius:8}}>{reflections[todayStr()].good}</div>
                      </div>}
                      {reflections[todayStr()]?.better&&<div>
                        <div style={{fontSize:10,color:muted,marginBottom:3}}>💡 Could be better</div>
                        <div style={{fontSize:12,color:tx,lineHeight:1.55,padding:"8px 10px",background:faint,borderRadius:8}}>{reflections[todayStr()].better}</div>
                      </div>}
                      <button onClick={()=>openReflection(todayStr())} style={{...btnS,marginTop:10,fontSize:11,width:"100%",textAlign:"center"}}>Edit reflection</button>
                    </div>
                  ):(
                    <button onClick={()=>openReflection(todayStr())} style={{...btnS,fontSize:12,padding:"10px",width:"100%",textAlign:"center",borderStyle:"dashed"}}>✨ Add today's reflection</button>
                  )}
                </div>
                {upcoming.length>0&&(
                  <div style={{...card,padding:"16px"}}>
                    <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:muted,marginBottom:10}}>Reminders 🔔</div>
                    {upcoming.slice(0,4).map(r=>(
                      <div key={r.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:faint,borderRadius:8,marginBottom:6}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,color:tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.title}</div>
                          <div style={{fontSize:10,color:muted,marginTop:2}}>{fmtRel(r.date)} · {r.time}</div>
                        </div>
                        <button onClick={()=>saveRems(reminders.filter(x=>x.id!==r.id))} title="Delete reminder" style={{background:"rgba(180,60,60,0.12)",border:"1px solid rgba(180,60,60,0.25)",borderRadius:6,color:"#C84B4B",cursor:"pointer",fontSize:12,padding:"3px 8px",fontWeight:600,flexShrink:0}}>Delete</button>
                      </div>
                    ))}
                    {upcoming.length>4&&<div style={{fontSize:11,color:muted,textAlign:"center",marginTop:4}}>+{upcoming.length-4} more</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ NOTES ══════════════════════════════════════════════════════════ */}
        {view==="notes"&&(
          <div style={{display:"grid",gridTemplateColumns:"270px 1fr",gap:20,minHeight:"72vh",animation:"fadeIn 0.3s ease"}}>
            <div>
              <div style={{display:"flex",gap:8,marginBottom:14}}>
                <input value={noteSearch} onChange={e=>setNoteSearch(e.target.value)} placeholder="Search notes..." style={{...inp,flex:1,fontSize:12,padding:"8px 12px"}}/>
                <button onClick={newNote} style={{...btnS,padding:"8px 14px",fontWeight:600,background:accent,color:"#fff",border:"none"}}>+</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:"75vh",overflowY:"auto",paddingRight:4}}>
                {filteredNotes.length===0&&<div style={{color:muted,fontSize:13,textAlign:"center",padding:"30px 0"}}>No notes yet.<br/><span style={{fontSize:12}}>Click + to create one</span></div>}
                {filteredNotes.map(n=>(
                  <div key={n.id} onClick={()=>selectNote(n)} style={{...card,padding:"12px 14px",cursor:"pointer",borderLeft:selNote===n.id?`3px solid ${accent}`:`3px solid transparent`,background:selNote===n.id?accentL:cardBg,transition:"all 0.15s"}}>
                    <div style={{fontSize:13,fontWeight:500,color:tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4}}>{n.title||"Untitled Note"}</div>
                    <div style={{fontSize:11,color:muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.content?.slice(0,55)||"No content yet"}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
                      <span style={{fontSize:10,color:muted}}>{n.date}</span>
                      <button onClick={e=>{e.stopPropagation();deleteNote(n.id);}} style={{background:"transparent",border:"none",color:muted,cursor:"pointer",fontSize:14,opacity:0.45,padding:0}}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{...card,padding:"26px 28px",display:"flex",flexDirection:"column"}}>
              {!selNote?(
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",flex:1,color:muted,flexDirection:"column",gap:12}}>
                  <div style={{fontSize:40}}>📝</div>
                  <div style={{fontSize:14}}>Select a note to edit, or create a new one</div>
                  <button onClick={newNote} style={{...btnS,background:accent,color:"#fff",border:"none",padding:"10px 20px"}}>+ New Note</button>
                </div>
              ):(
                <>
                  <input value={noteDraft.title} onChange={e=>{setNoteDraft(d=>({...d,title:e.target.value}));setNoteSaved(false);}}
                    placeholder="Note title..." style={{fontSize:22,fontWeight:700,fontFamily:"'Playfair Display',serif",background:"transparent",border:"none",borderBottom:`1px solid ${bdr}`,borderRadius:0,padding:"0 0 14px 0",color:tx,outline:"none",marginBottom:16,width:"100%"}}/>
                  <textarea value={noteDraft.content} onChange={e=>{setNoteDraft(d=>({...d,content:e.target.value}));setNoteSaved(false);}}
                    placeholder="Start writing your thoughts..."
                    style={{flex:1,resize:"none",background:"transparent",border:"none",outline:"none",color:tx,fontSize:14,lineHeight:1.75,fontFamily:"'Outfit',sans-serif",minHeight:380}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:14,borderTop:`1px solid ${bdr}`,marginTop:14}}>
                    <span style={{fontSize:11,color:muted}}>{noteSaved?"✓ Saved":"Unsaved changes"}</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      {selNote&&<button onClick={()=>{const n=notes.find(x=>x.id===selNote);if(n)pushToNotion({id:"note-"+n.id,type:"Note",title:n.title||"Untitled Note",content:n.content,date:new Date(n.updatedAt||n.createdAt||Date.now()).toISOString().split("T")[0]});}} disabled={!!notionSending} style={{padding:"8px 14px",background:notionSent["note-"+selNote]?"rgba(60,180,100,0.15)":"transparent",border:`1px solid ${notionSent["note-"+selNote]?"rgba(60,180,100,0.4)":bdr}`,borderRadius:9,cursor:"pointer",fontSize:12,color:notionSent["note-"+selNote]?"#3CB464":muted,fontFamily:"'Outfit',sans-serif",transition:"all 0.2s"}}>{notionSent["note-"+selNote]?"✓ Sent to Notion":notionSending==="note-"+selNote?"Sending…":"Send to Notion"}</button>}
                      <button onClick={saveCurrentNote} style={{padding:"8px 22px",background:accent,color:"#fff",border:"none",borderRadius:9,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif",fontWeight:600}}>Save Note</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ══ CALENDAR ═══════════════════════════════════════════════════════ */}
        {view==="calendar"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:18}}>
              <button onClick={()=>setCalMo(d=>new Date(d.getFullYear(),d.getMonth()-1,1))} style={btnS}>←</button>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,flex:1,textAlign:"center"}}>{fmtMY(calMo)}</div>
              <button onClick={()=>setCalMo(d=>new Date(d.getFullYear(),d.getMonth()+1,1))} style={btnS}>→</button>
            </div>
            <div style={{display:"flex",gap:16,justifyContent:"center",marginBottom:14}}>
              {[[accent,"Tasks"],[muted,"Planned"],["#5B7FA6","Reminders"],["#B89030","Reflections"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:muted}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:c}}/>{l}
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>(
                <div key={d} style={{textAlign:"center",fontSize:10,fontWeight:600,color:muted,padding:"5px 0",letterSpacing:"0.04em"}}>{d}</div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:28}}>
              {Array.from({length:calFirst}).map((_,i)=><div key={`e${i}`}/>)}
              {Array.from({length:calDays}).map((_,i)=>{
                const day=i+1;
                const ds=`${calY}-${String(calM+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                const dt=byDate[ds]||[], dr=byDateRem[ds]||[], hasRef=!!(reflections[ds]?.good||reflections[ds]?.better);
                const isToday=ds===todayStr(), isSel=calSel===ds;
                return(
                  <div key={day} onClick={()=>setCalSel(isSel?null:ds)} style={{...card,padding:"7px 5px",textAlign:"center",cursor:"pointer",minHeight:62,border:`1px solid ${isSel?accent:bdr}`,background:isSel?accentL:cardBg,transition:"all 0.15s"}}>
                    <div style={{fontSize:13,fontWeight:isToday?700:400,color:isToday?accent:tx,marginBottom:5}}>{day}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center",minHeight:10}}>
                      {dt.filter(t=>!t.planned).slice(0,3).map((_,ti)=><div key={ti} style={{width:5,height:5,borderRadius:"50%",background:accent}}/>)}
                      {dt.some(t=>t.planned)&&<div style={{width:5,height:5,borderRadius:"50%",background:muted}}/>}
                      {dr.length>0&&<div style={{width:5,height:5,borderRadius:"50%",background:"#5B7FA6"}}/>}
                      {hasRef&&<div style={{width:5,height:5,borderRadius:"50%",background:"#B89030"}}/>}
                    </div>
                  </div>
                );
              })}
            </div>
            {calSel&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,animation:"fadeIn 0.25s ease"}}>
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{fontSize:15,fontWeight:600,color:tx}}>{fmtDate(calSel)}{calSel===todayStr()&&<span style={{marginLeft:8,fontSize:11,padding:"2px 8px",background:accentL,color:accent,borderRadius:20,fontWeight:600}}>Today</span>}</div>
                    <button onClick={()=>{setPlanDate(calSel);setPlanDesc("");setPlanCat(null);setShowAddTask(true);}} style={{...btnS,fontSize:11,padding:"5px 10px"}}>+ Add Task</button>
                  </div>
                  {(byDate[calSel]||[]).length===0?<div style={{fontSize:13,color:muted,padding:"16px 0"}}>No tasks on this day.</div>
                  :(byDate[calSel]||[]).map(t=>{
                    const cat=cats.find(c=>c.id===t.categoryId), dur=t.duration||(active?.id===t.id?elapsed:0);
                    return(
                      <div key={t.id} style={{...card,padding:"10px 13px",display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                        {cat&&<div style={{width:7,height:7,borderRadius:"50%",background:cat.color,flexShrink:0}}/>}
                        <div style={{flex:1,minWidth:0,fontSize:13,color:t.planned?muted:tx,fontStyle:t.planned?"italic":"normal",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.description}</div>
                        {t.planned?<span style={{fontSize:10,color:muted,border:`1px solid ${bdr}`,borderRadius:5,padding:"1px 6px",flexShrink:0}}>planned</span>
                          :<div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:muted,flexShrink:0}}>{fmtMins(dur)}</div>}
                        <button onClick={()=>pushToNotion({id:t.id,type:"Task",title:t.description,date:t.date,category:cats.find(c=>c.id===t.categoryId)?.name})} disabled={!!notionSending} title="Send to Notion" style={{background:notionSent[t.id]?"rgba(60,180,100,0.15)":"transparent",border:`1px solid ${notionSent[t.id]?"rgba(60,180,100,0.4)":bdr}`,borderRadius:6,color:notionSent[t.id]?"#3CB464":muted,cursor:"pointer",fontSize:10,padding:"2px 6px",flexShrink:0,opacity:notionSending===t.id?0.5:1,transition:"all 0.2s"}}>{notionSent[t.id]?"✓":"N"}</button>
                        <button onClick={()=>deleteTask(t.id)} style={{background:"transparent",border:"none",color:muted,cursor:"pointer",fontSize:15,opacity:0.4,flexShrink:0,padding:0}}>×</button>
                      </div>
                    );
                  })}
                </div>
                <div>
                  {(byDateRem[calSel]||[]).length>0&&(
                    <div style={{marginBottom:16}}>
                      <div style={{fontSize:12,color:muted,fontWeight:600,marginBottom:8}}>Reminders 🔔</div>
                      {(byDateRem[calSel]||[]).map(r=>(
                        <div key={r.id} style={{...card,padding:"9px 12px",display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                          <div style={{flex:1,fontSize:12,color:r.triggered?muted:tx,textDecoration:r.triggered?"line-through":"none"}}>{r.title}</div>
                          <div style={{fontSize:11,color:muted}}>{r.time}</div>
                          <button onClick={()=>saveRems(reminders.filter(x=>x.id!==r.id))} title="Delete reminder" style={{background:"rgba(180,60,60,0.12)",border:"1px solid rgba(180,60,60,0.25)",borderRadius:6,color:"#C84B4B",cursor:"pointer",fontSize:12,padding:"3px 8px",fontWeight:600,flexShrink:0}}>Delete</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={()=>{setRemDate(calSel);setShowAddRem(true);}} style={{...btnS,fontSize:12,width:"100%",textAlign:"center",padding:"9px",marginBottom:14}}>🔔 Add Reminder for this day</button>
                  <div style={{fontSize:12,color:muted,fontWeight:600,marginBottom:8}}>Reflection ✨</div>
                  {reflections[calSel]?.good||reflections[calSel]?.better?(
                    <div style={{...card,padding:"14px"}}>
                      {reflections[calSel]?.good&&<div style={{marginBottom:10}}><div style={{fontSize:10,color:muted,marginBottom:3}}>Something good</div><div style={{fontSize:12,color:tx,lineHeight:1.55}}>{reflections[calSel].good}</div></div>}
                      {reflections[calSel]?.better&&<div><div style={{fontSize:10,color:muted,marginBottom:3}}>Could be better</div><div style={{fontSize:12,color:tx,lineHeight:1.55}}>{reflections[calSel].better}</div></div>}
                      <button onClick={()=>openReflection(calSel)} style={{...btnS,marginTop:10,fontSize:11}}>Edit reflection</button>
                    </div>
                  ):(
                    <button onClick={()=>openReflection(calSel)} style={{...btnS,fontSize:12,width:"100%",textAlign:"center",padding:"10px",borderStyle:"dashed"}}>✨ Add reflection for this day</button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ REFLECTIONS ════════════════════════════════════════════════════ */}
        {view==="reflections"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:10}}>
              <button onClick={()=>setRefMo(d=>new Date(d.getFullYear(),d.getMonth()-1,1))} style={btnS}>←</button>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,flex:1,textAlign:"center"}}>{fmtMY(refMo)}</div>
              <button onClick={()=>setRefMo(d=>new Date(d.getFullYear(),d.getMonth()+1,1))} style={btnS}>→</button>
            </div>
            <div style={{fontSize:13,color:muted,textAlign:"center",marginBottom:20}}>Your daily reflections — great for self reviews, performance reviews, or just seeing how far you've come.</div>

            {/* Download reflections panel */}
            <div style={{...card,padding:"14px 18px",marginBottom:28,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div style={{fontSize:12,fontWeight:600,color:tx,flexShrink:0}}>📥 Download reflections</div>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11,color:muted,flexShrink:0}}>From</span>
                  <input type="date" value={refDlFrom} onChange={e=>setRefDlFrom(e.target.value)}
                    style={{...inp,padding:"6px 10px",fontSize:12,width:"auto"}}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11,color:muted,flexShrink:0}}>To</span>
                  <input type="date" value={refDlTo} onChange={e=>setRefDlTo(e.target.value)}
                    style={{...inp,padding:"6px 10px",fontSize:12,width:"auto"}}/>
                </div>
                <span style={{fontSize:11,color:muted}}>(leave blank for all)</span>
              </div>
              <button onClick={downloadReflections}
                style={{padding:"7px 16px",background:accent,color:"#fff",border:"none",borderRadius:9,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Outfit',sans-serif",flexShrink:0}}>
                Download CSV
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
              {Array.from({length:refDays}).map((_,i)=>{
                const day=i+1;
                const ds=`${refY}-${String(refM+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                const ref=reflections[ds], hasRef=!!(ref?.good||ref?.better);
                return(
                  <div key={ds} onClick={()=>openReflection(ds)} style={{...card,padding:"15px",cursor:"pointer",transition:"all 0.15s",borderLeft:hasRef?`3px solid ${accent}`:`3px solid ${bdr}`,opacity:ds>todayStr()?0.45:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:hasRef?10:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:tx}}>{fmtDate(ds)}</div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {ds===todayStr()&&<span style={{fontSize:10,padding:"2px 7px",background:accentL,color:accent,borderRadius:20,fontWeight:600}}>Today</span>}
                        {hasRef&&<span style={{fontSize:14}}>✨</span>}
                      </div>
                    </div>
                    {hasRef?(
                      <>
                        {ref.good&&<div style={{marginBottom:8}}><div style={{fontSize:10,color:muted,marginBottom:2}}>Something good</div><div style={{fontSize:12,color:tx,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{ref.good}</div></div>}
                        {ref.better&&<div><div style={{fontSize:10,color:muted,marginBottom:2}}>Could be better</div><div style={{fontSize:12,color:tx,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{ref.better}</div></div>}
                      </>
                    ):<div style={{fontSize:12,color:muted,marginTop:4,fontStyle:"italic"}}>Click to add reflection...</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ WFO TRACKER ════════════════════════════════════════════════════ */}
        {view==="wfo"&&(()=>{
          // Use shared data if viewing someone else's WFO
          const wfoData  = sharedWfoView ? sharedWfoView.days  : wfoDays;
          const wfoGData = sharedWfoView ? sharedWfoView.goals : wfoGoals;
          const wY=wfoMo.getFullYear(), wM=wfoMo.getMonth();
          const wFirst=new Date(wY,wM,1).getDay(), wDays=new Date(wY,wM+1,0).getDate();
          const moKey=`${wY}-${String(wM+1).padStart(2,"0")}`;
          const goal=wfoGData[moKey]||0;
          // count this month
          let wfoDone=0,wfoPlanned=0,wfhCount=0,leaveCount=0;
          for(let d=1;d<=wDays;d++){
            const ds=`${moKey}-${String(d).padStart(2,"0")}`;
            const st=wfoData[ds];
            if(st==="wfo-attended") wfoDone++;
            else if(st==="wfo-planned") wfoPlanned++;
            else if(st==="wfh") wfhCount++;
            else if(st==="leave") leaveCount++;
          }
          const pct=goal>0?Math.min(100,Math.round((wfoDone/goal)*100)):0;
          const pending=Math.max(0,goal-wfoDone);
          // cycle: null -> wfo-planned -> wfo-attended -> wfh -> leave -> null
          const CYCLE=[null,"wfo-planned","wfo-attended","wfh","leave"];
          function cycleDay(ds){
            if(sharedWfoView) return; // read-only
            const cur=wfoDays[ds]||null;
            const idx=CYCLE.indexOf(cur);
            const next=CYCLE[(idx+1)%CYCLE.length];
            const updated={...wfoDays};
            if(next===null) delete updated[ds]; else updated[ds]=next;
            saveWfoDays(updated);
          }
          const STATUS={
            "wfo-planned":  {label:"WFO Planned",  bg:"#7B2D2D", dot:"#C84B4B", text:"#fff"},
            "wfo-attended": {label:"WFO Attended",  bg:"#2D5A3D", dot:"#4CAF70", text:"#fff"},
            "wfh":          {label:"Work From Home",bg:"#1E3A5F", dot:"#4A8FD4", text:"#fff"},
            "leave":        {label:"Leave",         bg:"#5A3E00", dot:"#D4A017", text:"#fff"},
          };
          return(
            <div style={{animation:"fadeIn 0.3s ease"}}>
              {/* Month nav */}
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,flexWrap:"wrap"}}>
                <button onClick={()=>setWfoMo(d=>new Date(d.getFullYear(),d.getMonth()-1,1))} style={btnS}>←</button>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,flex:1,textAlign:"center"}}>{fmtMY(wfoMo)}</div>
                <button onClick={()=>setWfoMo(d=>new Date(d.getFullYear(),d.getMonth()+1,1))} style={btnS}>→</button>
                <button onClick={generateWfoShare} style={{...btnS,background:accentL,borderColor:accent,color:accent,fontWeight:600}}>🔗 Share WFO</button>
              </div>

              {/* Stats row */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                {[
                  {label:"Monthly Goal",    val:goal,       sub:"WFO days target",    col:"#C96A3F"},
                  {label:"WFO Done",        val:wfoDone,    sub:"confirmed this month",col:"#4CAF70"},
                  {label:"WFO Planned",     val:wfoPlanned, sub:"yet to confirm",      col:"#C84B4B"},
                  {label:"WFH Days",        val:wfhCount,   sub:"worked from home",    col:"#4A8FD4"},
                ].map(s=>(
                  <div key={s.label} style={{...card,padding:"16px",textAlign:"center"}}>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:28,fontWeight:500,color:s.col}}>{s.val}</div>
                    <div style={{fontSize:12,fontWeight:600,color:tx,marginTop:4}}>{s.label}</div>
                    <div style={{fontSize:10,color:muted,marginTop:2}}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{...card,padding:"16px 20px",marginBottom:24}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:13,fontWeight:500,color:tx}}>Monthly WFO Target · <span style={{fontWeight:700}}>{goal}</span> days</div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:12,color:muted}}>{pct}% complete</span>
                    <button onClick={()=>{setGoalInput(String(goal));setShowGoalEdit(true);}} style={{...btnS,fontSize:11,padding:"4px 10px"}}>Edit Goal</button>
                  </div>
                </div>
                <div style={{height:10,background:faint,borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#4CAF70,#2D8A50)",borderRadius:99,transition:"width 0.5s ease"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                  <span style={{fontSize:11,color:muted}}>{wfoDone} attended</span>
                  {pending>0&&<span style={{fontSize:11,color:muted}}>{pending} days remaining</span>}
                  {pending===0&&goal>0&&<span style={{fontSize:11,color:"#4CAF70",fontWeight:600}}>🎉 Goal reached!</span>}
                </div>
              </div>

              {/* Legend */}
              <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:14,padding:"10px 14px",background:faint,borderRadius:10}}>
                <div style={{fontSize:11,color:muted,fontWeight:500,marginRight:4}}>Click to cycle:</div>
                {Object.entries(STATUS).map(([k,v])=>(
                  <div key={k} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:tx}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:v.dot,flexShrink:0}}/>
                    {v.label}
                  </div>
                ))}
                <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:muted}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:bdr,border:`1px solid ${bdr}`,flexShrink:0}}/>
                  Clear
                </div>
              </div>

              {/* Calendar grid */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6}}>
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>(
                  <div key={d} style={{textAlign:"center",fontSize:11,fontWeight:600,color:muted,padding:"6px 0",letterSpacing:"0.04em"}}>{d}</div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>
                {Array.from({length:wFirst}).map((_,i)=><div key={`e${i}`}/>)}
                {Array.from({length:wDays}).map((_,i)=>{
                  const day=i+1;
                  const ds=`${moKey}-${String(day).padStart(2,"0")}`;
                  const st=wfoData[ds]||null;
                  const info=st?STATUS[st]:null;
                  const isToday=ds===todayStr();
                  const isWeekend=new Date(ds+"T12:00:00").getDay()%6===0;
                  return(
                    <div key={day} onClick={()=>cycleDay(ds)}
                      style={{
                        borderRadius:10, cursor:"pointer", minHeight:56, padding:"8px 6px",
                        background: info ? info.bg : (isWeekend ? (dk?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.03)") : cardBg),
                        border: isToday ? `2px solid ${accent}` : `1px solid ${info?"transparent":bdr}`,
                        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start",
                        transition:"all 0.15s", backdropFilter:"blur(8px)",
                        opacity: isWeekend&&!info ? 0.5 : 1,
                      }}>
                      <div style={{fontSize:13,fontWeight:isToday?700:400,color:info?info.text:(isToday?accent:tx),marginBottom:info?4:0}}>{day}</div>
                      {info&&<div style={{width:6,height:6,borderRadius:"50%",background:info.dot}}/>}
                      {info&&<div style={{fontSize:8,color:info.text,opacity:0.8,marginTop:2,textAlign:"center",lineHeight:1.2,letterSpacing:"0.02em"}}>
                        {info.label.split(" ").slice(-1)[0]}
                      </div>}
                    </div>
                  );
                })}
              </div>

              {/* Leave count */}
              {leaveCount>0&&(
                <div style={{marginTop:16,padding:"10px 16px",background:faint,borderRadius:10,fontSize:12,color:muted}}>
                  🌴 <strong style={{color:tx}}>{leaveCount}</strong> leave day{leaveCount!==1?"s":""} this month
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── Shared WFO read-only banner ── */}
      {sharedWfoView&&(
        <div style={{position:"fixed",top:56,left:0,right:0,zIndex:300,background:accentL,borderBottom:`1px solid ${accent}`,padding:"10px 20px",display:"flex",alignItems:"center",gap:12,fontFamily:"'Outfit',sans-serif",backdropFilter:"blur(12px)"}}>
          <span style={{fontSize:13,color:accent,fontWeight:600}}>👀 Viewing WFO calendar shared by {sharedWfoView.owner}</span>
          <span style={{fontSize:12,color:muted,flex:1}}>Read-only view</span>
          <button onClick={()=>{setSharedWfoView(null);window.history.replaceState(null,"",window.location.pathname);}} style={{...btnS,fontSize:12,padding:"4px 12px"}}>✕ Close</button>
        </div>
      )}

      {/* ── WFO Share Modal ── */}
      {showWfoShare&&(
        <Modal onClose={()=>setShowWfoShare(false)} bg={modBg} bdr={bdr} tx={tx} muted={muted}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:6,color:tx}}>Share Your WFO Calendar 🔗</div>
          <div style={{fontSize:13,color:muted,marginBottom:20}}>Anyone with this link can view your WFO calendar for all months — read only, no login required.</div>
          <div style={{background:faint,borderRadius:10,padding:"12px 14px",marginBottom:14,wordBreak:"break-all",fontSize:11,color:tx,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.6}}>{wfoShareUrl}</div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{ navigator.clipboard.writeText(wfoShareUrl).catch(()=>{}); }} style={{flex:1,padding:"10px 0",background:accent,color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>📋 Copy Link</button>
            <button onClick={()=>setShowWfoShare(false)} style={{flex:1,padding:"10px 0",background:"transparent",border:`1.5px solid ${bdr}`,borderRadius:10,color:tx,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif"}}>Done</button>
          </div>
          <div style={{fontSize:11,color:muted,marginTop:12,textAlign:"center"}}>The link encodes your WFO data directly — no server required.</div>
        </Modal>
      )}

      {/* ── Add Sticky Note Modal ── */}
      {showAddSticky&&(
        <Modal onClose={()=>setShowAddSticky(false)} bg={modBg} bdr={bdr} tx={tx} muted={muted}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:6,color:tx}}>📌 Add a Note to Yourself</div>
          <div style={{fontSize:13,color:muted,marginBottom:20}}>A floating sticky note on your Today page — a reminder, a mantra, whatever you need.</div>
          <textarea value={stickyDraft} onChange={e=>setStickyDraft(e.target.value)} rows={4} autoFocus
            placeholder={`"You're doing great."
"Drink water!"
"Remember to breathe."`}
            style={{...inp,resize:"none",lineHeight:1.65,marginBottom:14}}/>
          <div style={{marginBottom:18}}>
            <div style={{fontSize:12,color:muted,marginBottom:8}}>Note colour</div>
            <div style={{display:"flex",gap:8}}>
              {["#FFF9C4","#C8F7C5","#C5D5F7","#F7C5D5","#F7DEC5","#E8C5F7"].map(c=>(
                <div key={c} onClick={()=>setStickyColor(c)} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:stickyColor===c?"2.5px solid #333":"2px solid transparent",transition:"all 0.1s"}}/>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14,padding:"10px 14px",background:stickyColor,borderRadius:10,fontSize:13,color:"#2A2010",lineHeight:1.6,minHeight:48}}>
            {stickyDraft||<span style={{opacity:0.4}}>Preview...</span>}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setShowAddSticky(false)} style={{flex:1,padding:"10px 0",background:"transparent",border:`1.5px solid ${bdr}`,borderRadius:10,color:tx,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif"}}>Cancel</button>
            <button onClick={addStickyNote} style={{flex:2,padding:"10px 0",background:accent,color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>Pin Note</button>
          </div>
        </Modal>
      )}

      {/* Goal edit modal */}
      {showGoalEdit&&(
        <Modal onClose={()=>setShowGoalEdit(false)} bg={modBg} bdr={bdr} tx={tx} muted={muted}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:6,color:tx}}>Set Monthly WFO Goal</div>
          <div style={{fontSize:13,color:muted,marginBottom:20}}>{fmtMY(wfoMo)}</div>
          <input type="number" min="0" max="31" value={goalInput} onChange={e=>setGoalInput(e.target.value)}
            placeholder="e.g. 8" autoFocus
            style={{...inp,fontSize:20,fontWeight:600,textAlign:"center",letterSpacing:"0.05em",marginBottom:16}}/>
          <div style={{fontSize:12,color:muted,textAlign:"center",marginBottom:20}}>How many days do you want to go into office this month?</div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setShowGoalEdit(false)} style={{flex:1,padding:"11px 0",background:"transparent",border:`1.5px solid ${bdr}`,borderRadius:10,color:tx,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif"}}>Cancel</button>
            <button onClick={()=>{
              const wY=wfoMo.getFullYear(),wM=wfoMo.getMonth();
              const moKey=`${wY}-${String(wM+1).padStart(2,"0")}`;
              saveWfoGoals({...wfoGoals,[moKey]:parseInt(goalInput)||0});
              setShowGoalEdit(false);
            }} style={{flex:2,padding:"11px 0",background:accent,color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>Save Goal</button>
          </div>
        </Modal>
      )}

      {/* ══ MODALS ══════════════════════════════════════════════════════════ */}

      {showLogout&&(
        <Modal onClose={()=>setShowLogout(false)} bg={modBg} bdr={bdr} tx={tx} muted={muted}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,marginBottom:4,color:accent}}>Day Summary</div>
          <div style={{fontSize:13,color:muted,marginBottom:20}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
          <div style={{fontSize:11,color:muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Completed today</div>
          {todayDone.length===0?<div style={{color:muted,fontSize:13,padding:"14px 0",marginBottom:16}}>No completed tasks today.</div>:(
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:18,maxHeight:220,overflowY:"auto"}}>
              {todayDone.map(t=>{const cat=cats.find(c=>c.id===t.categoryId);return(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:faint,borderRadius:9}}>
                  {cat&&<div style={{width:7,height:7,borderRadius:"50%",background:cat.color,flexShrink:0}}/>}
                  <div style={{flex:1,fontSize:13,color:tx}}>{t.description}</div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,color:muted}}>{fmtMins(t.duration)}</div>
                </div>
              );})}
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderTop:`1px solid ${bdr}`,borderBottom:`1px solid ${bdr}`,marginBottom:16}}>
            <span style={{fontSize:13,color:muted}}>Total tracked</span>
            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:18,fontWeight:500,color:accent}}>{fmtMins(totalMs)}</span>
          </div>
          {!(reflections[todayStr()]?.good||reflections[todayStr()]?.better)&&(
            <div style={{marginBottom:14}}>
              <button onClick={()=>{setShowLogout(false);openReflection(todayStr());}} style={{...btnS,width:"100%",textAlign:"center",padding:"10px",fontSize:13,borderStyle:"dashed"}}>✨ Add today's reflection before you go</button>
            </div>
          )}
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>downloadReport("daily")} style={{flex:1,padding:"10px 0",background:"transparent",border:`1.5px solid ${bdr}`,borderRadius:10,color:tx,cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif"}}>📥 Download Report</button>
            <button onClick={doLogout} style={{flex:1,padding:"10px 0",background:accent,color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>Log Out</button>
          </div>
        </Modal>
      )}

      {showBg&&(
        <Modal onClose={()=>setShowBg(false)} bg={modBg} bdr={bdr} tx={tx} muted={muted}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:4,color:tx}}>Choose Theme</div>
          <div style={{fontSize:12,color:muted,marginBottom:16}}>Theme changes the background and accent colour throughout the app.</div>

          {/* Themed sections */}
          {[["cat","🐱 Cat"],["plant","🌿 Plant"],["space","🚀 Space"]].map(([grp,label])=>(
            <div key={grp} style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:muted,marginBottom:8}}>{label}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {THEMES.filter(t=>t.group===grp).map((t,i)=>(
                  <div key={i} onClick={()=>{applyBg(t);setShowBg(false);}} style={{height:58,borderRadius:10,cursor:"pointer",background:t.value,border:bg.label===t.label?`2.5px solid ${t.accent||accent}`:`1.5px solid ${bg.label===t.label?"#fff":"transparent"}`,transition:"all 0.15s",position:"relative",overflow:"hidden",boxShadow:bg.label===t.label?"0 0 0 1px rgba(255,255,255,0.3) inset":"none"}}>
                    <div style={{position:"absolute",top:4,left:6,fontSize:12}}>{t.emoji}</div>
                    <div style={{position:"absolute",bottom:4,left:0,right:0,textAlign:"center",fontSize:9,fontWeight:600,color:t.dark?"rgba(255,255,255,0.85)":"rgba(0,0,0,0.6)",letterSpacing:"0.02em"}}>{t.label}</div>
                    {bg.label===t.label&&<div style={{position:"absolute",top:3,right:5,fontSize:9,color:t.dark?"#fff":"#000",opacity:0.7}}>✓</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Classic section */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:muted,marginBottom:8}}>Classic</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5}}>
              {BACKGROUNDS.map((b,i)=>(
                <div key={i} onClick={()=>{applyBg(b);setShowBg(false);}} style={{height:42,borderRadius:8,cursor:"pointer",background:b.value,border:bg.label===b.label?`2.5px solid ${accent}`:"1.5px solid transparent",transition:"all 0.15s",position:"relative"}}>
                  <div style={{position:"absolute",bottom:2,left:0,right:0,textAlign:"center",fontSize:8,fontWeight:600,color:b.dark?"rgba(255,255,255,0.75)":"rgba(0,0,0,0.5)"}}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom hex */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <input type="color" value={customHex} onChange={e=>setCustomHex(e.target.value)} style={{width:42,height:38,border:`1px solid ${bdr}`,borderRadius:8,cursor:"pointer",background:"transparent",padding:3}}/>
            <input value={customHex} onChange={e=>setCustomHex(e.target.value)} placeholder="#hex colour" style={{...inp,flex:1,fontSize:13,padding:"8px 12px"}}/>
            <button onClick={()=>{const lm=parseInt(customHex.slice(1,3),16)*0.299+parseInt(customHex.slice(3,5),16)*0.587+parseInt(customHex.slice(5,7),16)*0.114;applyBg({label:"Custom",value:customHex,dark:lm<150});setShowBg(false);}}
              style={{padding:"8px 14px",background:accent,color:"#fff",border:"none",borderRadius:9,cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif",fontWeight:600}}>Apply</button>
          </div>

          {/* Custom image upload */}
          <div style={{marginBottom:12,padding:"12px 14px",background:faint,borderRadius:10}}>
            <div style={{fontSize:12,fontWeight:600,color:tx,marginBottom:10}}>🖼️ Background image</div>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
              <label style={{flex:1,padding:"8px 12px",border:`1.5px dashed ${bdr}`,borderRadius:9,cursor:"pointer",fontSize:12,color:muted,textAlign:"center",display:"block"}}>
                📁 Upload your own image
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                  const file=e.target.files[0]; if(!file) return;
                  const reader=new FileReader();
                  reader.onload=ev=>{ saveCustomBgImg(ev.target.result); setBgImgOpacity(bg.dark||dk?0.08:0.15); };
                  reader.readAsDataURL(file);
                }}/>
              </label>
              {customBgImg&&(
                <button onClick={()=>saveCustomBgImg(null)} style={{...btnS,fontSize:11,padding:"6px 10px",color:"#C84B4B",borderColor:"rgba(200,75,75,0.3)"}}>✕ Remove</button>
              )}
            </div>
            {customBgImg&&(
              <div style={{width:"100%",height:60,borderRadius:8,backgroundImage:`url(${customBgImg})`,backgroundSize:"cover",backgroundPosition:"center",marginBottom:10,border:`1px solid ${bdr}`}}/>
            )}
            {bg.group&&THEME_IMAGES[bg.group]&&!customBgImg&&(
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,color:muted,marginBottom:6}}>{bg.emoji} Or pick a preset</div>
                <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                  {THEME_IMAGES[bg.group].map((img,i)=>(
                    <div key={i} onClick={()=>saveThemeImg(i)} style={{width:48,height:34,borderRadius:7,cursor:"pointer",backgroundImage:`url(${img})`,backgroundSize:"cover",backgroundPosition:"center",border:themeImgIdx===i?`2.5px solid ${accent}`:"1.5px solid transparent",transition:"all 0.15s",flexShrink:0}}/>
                  ))}
                </div>
              </div>
            )}
            {/* Opacity slider */}
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:11,color:muted}}>Image opacity</span>
                <span style={{fontSize:11,fontWeight:600,color:tx,fontFamily:"'IBM Plex Mono',monospace"}}>{Math.round(bgImgOpacity*100)}%</span>
              </div>
              <input type="range" min="0" max="100" value={Math.round(bgImgOpacity*100)}
                onChange={e=>saveBgOpacity(parseInt(e.target.value)/100)}
                style={{width:"100%",accentColor:accent,cursor:"pointer"}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                <span style={{fontSize:9,color:muted}}>Invisible</span>
                <span style={{fontSize:9,color:muted}}>Fully visible</span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:faint,borderRadius:9}}>
            <span style={{fontSize:13,color:tx,flex:1}}>Dark Mode</span>
            <div onClick={toggleDark} style={{width:44,height:24,borderRadius:12,background:dk?accent:bdr,cursor:"pointer",position:"relative",transition:"background 0.2s"}}>
              <div style={{position:"absolute",top:3,left:dk?"23px":"3px",width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
            </div>
          </div>
        </Modal>
      )}

      {showPom&&(
        <Modal onClose={()=>setShowPom(false)} bg={modBg} bdr={bdr} tx={tx} muted={muted}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:20,color:tx}}>🍅 Pomodoro</div>
          <div style={{display:"flex",background:dk?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)",borderRadius:9,padding:3,marginBottom:24,gap:2}}>
            {[["work","Focus (25m)"],["break","Break (5m)"]].map(([m,l])=>(
              <button key={m} onClick={()=>{setPomMode(m);setPomSec(0);setPomRun(false);}} style={{flex:1,padding:"7px 0",border:"none",borderRadius:7,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:500,transition:"all 0.2s",background:pomMode===m?accent:"transparent",color:pomMode===m?"#fff":muted}}>{l}</button>
            ))}
          </div>
          <div style={{textAlign:"center",marginBottom:22}}>
            <div style={{position:"relative",display:"inline-block"}}>
              <svg width={148} height={148} style={{transform:"rotate(-90deg)"}}>
                <circle cx={74} cy={74} r={62} fill="none" stroke={dk?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)"} strokeWidth={7}/>
                <circle cx={74} cy={74} r={62} fill="none" stroke={accent} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${2*Math.PI*62}`} strokeDashoffset={`${2*Math.PI*62*(1-pomPct/100)}`} style={{transition:"stroke-dashoffset 0.8s ease"}}/>
              </svg>
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:30,fontWeight:500,color:tx}}>{pomDisp}</div>
                <div style={{fontSize:10,color:muted,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:3}}>{pomMode==="work"?"Focus":"Break"}</div>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setPomRun(r=>!r)} style={{flex:2,padding:"11px 0",background:accent,color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>{pomRun?"⏸ Pause":"▶ Start"}</button>
            <button onClick={()=>{setPomSec(0);setPomRun(false);}} style={{flex:1,padding:"11px 0",background:"transparent",border:`1.5px solid ${bdr}`,borderRadius:10,color:tx,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif"}}>Reset</button>
          </div>
        </Modal>
      )}

      {showCats&&(
        <Modal onClose={()=>setShowCats(false)} bg={modBg} bdr={bdr} tx={tx} muted={muted}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:16,color:tx}}>Categories</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16,maxHeight:200,overflowY:"auto"}}>
            {cats.length===0&&<div style={{fontSize:13,color:muted,padding:"8px 0"}}>No categories yet.</div>}
            {cats.map(c=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:faint,borderRadius:9}}>
                <div style={{width:11,height:11,borderRadius:"50%",background:c.color,flexShrink:0}}/>
                <div style={{flex:1,fontSize:13,color:tx}}>{c.name}</div>
                <button onClick={()=>saveCats(cats.filter(x=>x.id!==c.id))} style={{background:"transparent",border:"none",color:muted,cursor:"pointer",fontSize:15,padding:"0 4px"}}>×</button>
              </div>
            ))}
          </div>
          <div style={{borderTop:`1px solid ${bdr}`,paddingTop:14}}>
            <div style={{fontSize:11,color:muted,fontWeight:600,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>New Category</div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Name"
                onKeyDown={e=>{if(e.key==="Enter"&&newCatName.trim()){saveCats([...cats,{id:uid(),name:newCatName.trim(),color:newCatCol}]);setNewCatName("");}}}
                style={{...inp,flex:1,minWidth:100,fontSize:13,padding:"9px 12px"}}/>
              <div style={{display:"flex",gap:3,flexShrink:0}}>
                {CAT_COLORS.map(col=>(
                  <div key={col} onClick={()=>setNewCatCol(col)} style={{width:20,height:20,borderRadius:"50%",background:col,cursor:"pointer",border:newCatCol===col?`2.5px solid ${tx}`:"2.5px solid transparent",transition:"all 0.1s"}}/>
                ))}
              </div>
              <button onClick={()=>{if(!newCatName.trim())return;saveCats([...cats,{id:uid(),name:newCatName.trim(),color:newCatCol}]);setNewCatName("");}}
                style={{padding:"9px 14px",background:accent,color:"#fff",border:"none",borderRadius:9,cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif",fontWeight:600,flexShrink:0}}>Add</button>
            </div>
          </div>
        </Modal>
      )}

      {showAddTask&&(
        <Modal onClose={()=>setShowAddTask(false)} bg={modBg} bdr={bdr} tx={tx} muted={muted}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:4,color:tx}}>Plan a Task</div>
          <div style={{fontSize:13,color:muted,marginBottom:20}}>Add a task to any date — it'll show in your calendar.</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><div style={{fontSize:12,color:muted,marginBottom:6}}>Date</div><input type="date" value={planDate} onChange={e=>setPlanDate(e.target.value)} style={{...inp}}/></div>
            <div><div style={{fontSize:12,color:muted,marginBottom:6}}>Task</div>
              <input value={planDesc} onChange={e=>setPlanDesc(e.target.value)} placeholder="What needs to be done?" autoFocus style={{...inp}} onKeyDown={e=>e.key==="Enter"&&addPlannedTask()}/></div>
            <div><div style={{fontSize:12,color:muted,marginBottom:6}}>Category <span style={{opacity:0.5}}>(optional)</span></div>
              <select value={planCat||""} onChange={e=>setPlanCat(e.target.value||null)} style={{...inp,cursor:"pointer",color:planCat?tx:muted}}>
                <option value="">No category</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
            <button onClick={addPlannedTask} style={{padding:"12px 0",background:accent,color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"'Outfit',sans-serif",marginTop:4}}>Add Task</button>
          </div>
        </Modal>
      )}

      {showAddRem&&(
        <Modal onClose={()=>setShowAddRem(false)} bg={modBg} bdr={bdr} tx={tx} muted={muted}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:4,color:tx}}>Set a Reminder 🔔</div>
          <div style={{fontSize:13,color:muted,marginBottom:20}}>A browser notification will fire at the set time.</div>
          {notifPerm!=="granted"&&(
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:accentL,borderRadius:9,marginBottom:16}}>
              <div style={{flex:1,fontSize:12,color:tx}}>Enable browser notifications to receive alerts.</div>
              <button onClick={requestNotif} style={{padding:"6px 12px",background:accent,color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif",fontWeight:600,flexShrink:0}}>Allow</button>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><div style={{fontSize:12,color:muted,marginBottom:6}}>Reminder</div>
              <input value={remTitle} onChange={e=>setRemTitle(e.target.value)} placeholder="e.g. Review standup notes..." autoFocus style={{...inp}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><div style={{fontSize:12,color:muted,marginBottom:6}}>Date</div><input type="date" value={remDate} onChange={e=>setRemDate(e.target.value)} style={{...inp}}/></div>
              <div><div style={{fontSize:12,color:muted,marginBottom:6}}>Time</div><input type="time" value={remTime} onChange={e=>setRemTime(e.target.value)} style={{...inp}}/></div>
            </div>
            <button onClick={addReminder} style={{padding:"12px 0",background:accent,color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"'Outfit',sans-serif",marginTop:4}}>Set Reminder</button>
          </div>
          {reminders.length>0&&(
            <div style={{marginTop:20,paddingTop:16,borderTop:`1px solid ${bdr}`}}>
              <div style={{fontSize:11,color:muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>All Reminders</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:180,overflowY:"auto"}}>
                {[...reminders].sort((a,b)=>`${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).map(r=>(
                  <div key={r.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:faint,borderRadius:8}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,color:r.triggered?muted:tx,textDecoration:r.triggered?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.title}</div>
                      <div style={{fontSize:10,color:muted,marginTop:2}}>{fmtRel(r.date)} · {r.time}{r.triggered&&" · notified"}</div>
                    </div>
                    <button onClick={()=>saveRems(reminders.filter(x=>x.id!==r.id))} title="Delete reminder" style={{background:"rgba(180,60,60,0.12)",border:"1px solid rgba(180,60,60,0.25)",borderRadius:6,color:"#C84B4B",cursor:"pointer",fontSize:12,padding:"3px 8px",fontWeight:600,flexShrink:0}}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}

      {editRefDate&&(
        <Modal onClose={()=>setEditRefDate(null)} bg={modBg} bdr={bdr} tx={tx} muted={muted}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:2,color:tx}}>Daily Reflection</div>
          <div style={{fontSize:13,color:muted,marginBottom:22}}>{fmtDate(editRefDate)}</div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:tx,marginBottom:6}}>✨ Something good that happened</div>
              <textarea value={refGood} onChange={e=>setRefGood(e.target.value)} rows={4}
                placeholder="A win, a moment of connection, something you're proud of or grateful for..."
                style={{...inp,resize:"none",lineHeight:1.65}}/>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:tx,marginBottom:6}}>💡 Something that could have gone better</div>
              <textarea value={refBetter} onChange={e=>setRefBetter(e.target.value)} rows={4}
                placeholder="A lesson learned, something you'd approach differently, or a habit to work on..."
                style={{...inp,resize:"none",lineHeight:1.65}}/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setEditRefDate(null)} style={{flex:1,padding:"11px 0",background:"transparent",border:`1.5px solid ${bdr}`,borderRadius:10,color:tx,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif"}}>Cancel</button>
              <button onClick={()=>{if(editRefDate&&(refGood||refBetter))pushToNotion({id:"ref-"+editRefDate,type:"Reflection",title:`Reflection – ${fmtDate(editRefDate)}`,content:(refGood?"✨ Something good:
"+refGood+"

":"")+(refBetter?"💡 Could be better:
"+refBetter:""),date:editRefDate});}} disabled={!!notionSending||(!refGood&&!refBetter)} style={{flex:1,padding:"11px 0",background:notionSent["ref-"+editRefDate]?"rgba(60,180,100,0.15)":"transparent",border:`1.5px solid ${notionSent["ref-"+editRefDate]?"rgba(60,180,100,0.5)":bdr}`,borderRadius:10,color:notionSent["ref-"+editRefDate]?"#3CB464":muted,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif",transition:"all 0.2s"}}>{notionSent["ref-"+editRefDate]?"✓ Sent":notionSending==="ref-"+editRefDate?"Sending…":"Send to Notion"}</button>
              <button onClick={saveReflection} style={{flex:2,padding:"11px 0",background:accent,color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>Save Reflection</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, bg, bdr, tx, muted }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.52)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(6px)"}}>
      <div style={{background:bg,border:`1px solid ${bdr}`,borderRadius:20,padding:"28px 26px",width:"100%",maxWidth:490,position:"relative",boxShadow:"0 28px 70px rgba(0,0,0,0.32)",maxHeight:"92vh",overflowY:"auto",animation:"fadeIn 0.2s ease"}}>
        <button onClick={onClose} style={{position:"absolute",top:12,right:14,background:"transparent",border:"none",fontSize:22,color:muted,cursor:"pointer",lineHeight:1,padding:0}}>×</button>
        {children}
      </div>
    </div>
  );
}
