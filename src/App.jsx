import { useState, useRef, useEffect, useCallback } from "react";

const STORAGE_KEY = "tyrus-blueprint-v1";
const SUPABASE_URL = "https://safiinhcwuseiohpouue.supabase.co";
const SUPABASE_KEY = "sb_publishable_oBrSbZwTc3T6MOZ5654t5g_ISF9kYxJ";

const initialGoals = [
  {
    phase: 1, phaseLabel: "Finish Strong", phaseYears: "2026-2027",
    phaseDesc: "Finish the year off strong.",
    items: [
      { id: 101, text: "Pass the SIE exam", tag: "Career", targetDate: "2026-06-13" },
      { id: 102, text: "Master financial modeling (LBO, 3 Statement)", tag: "Career", targetDate: "2027-03-31" },
      { id: 103, text: "Complete HRK tax internship", tag: "Career", targetDate: "2026-07-31" },
      { id: 104, text: "Recruit during the fall career fair", tag: "Career", targetDate: "2026-09-30" },
      { id: 105, text: "Graduate with Bachelor of Accountancy", tag: "Career", targetDate: "2026-12-15" },
      { id: 106, text: "Save and invest $5–10K before graduation", tag: "Finance", targetDate: "2026-12-01" },
      { id: 107, text: "Pay off all current debt", tag: "Finance", targetDate: "2026-12-01" },
      { id: 108, text: "GMAT exam - MSU Testing center", tag: "Career", targetDate: "2026-08-01" },
      { id: 109, text: "Get accepted into Ole Miss Graduate School", tag: "Career", targetDate: "2026-08-01" },
    ],
  },
  {
    phase: 2, phaseLabel: "Post Grad - Grad School", phaseYears: "Jan 2027 – May 2028",
    phaseDesc: "Internship, MAcc, CPA exams, enjoy the journey.",
    items: [
      { id: 201, text: "Complete Spring 2027 Internship (CLA)", tag: "Career", targetDate: "2027-03-31" },
      { id: 202, text: "Complete MADA at Ole Miss", tag: "Career", targetDate: "2028-05-15" },
      { id: 203, text: "Pass all four CPA sections", tag: "Career", targetDate: "2028-05-01" },
      { id: 204, text: "Land a Full-Time Position", tag: "Career", targetDate: "2028-05-01" },
      { id: 205, text: "Choose relocation", tag: "Life", targetDate: "2027-01-01" },
      { id: 206, text: "Build out wardrobe, accessories", tag: "Personal", targetDate: "2027-06-01" },
      { id: 207, text: "Run a sprint/olympic distance tri", tag: "Fitness", targetDate: "2027-10-01" },
      { id: 208, text: "First long term relationship", tag: "Life", targetDate: "2028-04-01" },
    ],
  },
  {
    phase: 3, phaseLabel: "Early Career", phaseYears: "Mid 2028 – 2031",
    phaseDesc: "Being Full-time, relocate, gain real experience.",
    items: [
      { id: 302, text: "Relocate to TX, TN, IL, NY, FL", tag: "Life", targetDate: "2028-09-01" },
      { id: 303, text: "Join ACG", tag: "Career", targetDate: "2029-12-01" },
      { id: 304, text: "Get first promotion within firm", tag: "Career", targetDate: "2030-01-01" },
      { id: 305, text: "Compete in a bodybuilding show", tag: "Fitness", targetDate: "2029-06-01" },
      { id: 306, text: "Run a half ironman 70.3", tag: "Fitness", targetDate: "2029-12-01" },
      { id: 307, text: "Start traveling the world", tag: "Lifestyle", targetDate: "2029-01-01" },
      { id: 308, text: "Build emergency fund 3-6 months of expenses", tag: "Life", targetDate: "2030-01-01" },
      { id: 309, text: "Invest ≥15% of take-home pay into brokerage and Roth IRA", tag: "Finance", targetDate: "2028-06-01" },
      { id: 310, text: "Hit $50K invested", tag: "Finance", targetDate: "2028-05-01" },
      { id: 311, text: "Buy an e-dirt bike", tag: "Lifestyle", targetDate: "2031-06-01" },
      { id: 312, text: "Launch the clothing brand / men's clothing store", tag: "Business", targetDate: "2031-01-01" },
    ],
  },
  {
    phase: 4, phaseLabel: "Mid Career", phaseYears: "2031 – 2034",
    phaseDesc: "Get real on trajectory and vision",
    items: [
      { id: 401, text: "Transfer to TAS/DAS internally or externally", tag: "Career", targetDate: "2031-04-01" },
      { id: 402, text: "Get ABV, CFF, CFA L1/2", tag: "Finance", targetDate: "2031-01-01" },
      { id: 403, text: "Hit $100K invested", tag: "Finance", targetDate: "2033-01-01" },
      { id: 404, text: "Run a full Ironman", tag: "Fitness", targetDate: "2032-06-01" },
      { id: 405, text: "Get Married", tag: "Life", targetDate: "2032-06-01" },
      { id: 406, text: "Have children", tag: "Life", targetDate: "2034-01-01" },
      { id: 407, text: "Begin home search", tag: "Life", targetDate: "2033-01-01" },
      { id: 408, text: "Get pilot's license", tag: "Personal", targetDate: "2034-06-01" },
    ],
  },
  {
    phase: 5, phaseLabel: "Late Career", phaseYears: "2034 – 2040",
    phaseDesc: "Multiple businesses, $500K+ invested, family, physical peak",
    items: [
      { id: 501, text: "Hit $200K invested", tag: "Finance", targetDate: "2036-01-01" },
      { id: 502, text: "Land PE or M&A advisory role post-TAS/DAS", tag: "Career", targetDate: "2034-08-01" },
      { id: 503, text: "Buy first cash-flowing business", tag: "Business", targetDate: "2035-01-01" },
      { id: 504, text: "Own a Porsche 911", tag: "Lifestyle", targetDate: "2036-01-01" },
      { id: 505, text: "Own a Buick Grand National, Cutlass, Caprice, SS Monte Carlo, or Box Chevy", tag: "Lifestyle", targetDate: "2035-01-01" },
    ],
  },
  {
    phase: 6, phaseLabel: "Legacy", phaseYears: "2040+",
    phaseDesc: "Permanent capital. Generational wealth. The empire is built.",
    items: [
      { id: 601, text: "Hit $1M+ nvested", tag: "Finance", targetDate: "2040-01-01" },
      { id: 602, text: "Start a private equity fund/Holding Company", tag: "Business", targetDate: "2040-01-01" },
      { id: 603, text: "Own accounting firms", tag: "Business", targetDate: "2040-01-01" },
      { id: 604, text: "Own 10 businesses across different verticals", tag: "Business", targetDate: "2040-01-01" },
      { id: 605, text: "Build holding company to $10M+ in revenue", tag: "Business", targetDate: "2042-01-01" },
    ],
  },
];

const TAG_COLORS = {
  Career:    { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  Finance:   { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  Fitness:   { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  Business:  { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  Lifestyle: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  Personal:  { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
  Life:      { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  Brand:     { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
};
const TAGS = Object.keys(TAG_COLORS);
const PHASE_ACCENTS = ["#6366f1","#2563eb","#16a34a","#d97706","#7c3aed","#dc2626"];
const PHASE_BGS     = ["#eef2ff","#eff6ff","#f0fdf4","#fffbeb","#f5f3ff","#fef2f2"];

function fmtDate(d) {
  if (!d) return "";
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
function daysUntil(d) {
  if (!d) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.round((new Date(d + "T12:00:00") - now) / 86400000);
}
function isOverdue(d, done) { return !done && !!d && daysUntil(d) < 0; }

// ── localStorage helpers (fast local cache) ────────
function lsLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function lsSave(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// ── Supabase helpers (source of truth, synced across devices) ────────
async function supaLoad() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blueprint_data?id=eq.main&select=data`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    const rows = await res.json();
    return rows && rows[0] ? rows[0].data : null;
  } catch { return null; }
}
async function supaSave(data) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/blueprint_data`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ id: "main", data, updated_at: new Date().toISOString() }),
    });
  } catch {}
}

export default function App() {
  const [goals, setGoals]               = useState(initialGoals);
  const [checked, setChecked]           = useState({});
  const [completedDates, setCompletedDates] = useState({});
  const [view, setView]                 = useState("phases");
  const [sortDir, setSortDir]           = useState("asc");
  const [activePhase, setActivePhase]   = useState(null);
  const [adding, setAdding]             = useState(null);
  const [newText, setNewText]           = useState("");
  const [newTag, setNewTag]             = useState("Career");
  const [newDate, setNewDate]           = useState("");
  const [movingGoal, setMovingGoal]     = useState(null);
  const [editingDate, setEditingDate]   = useState(null);
  const [editDateVal, setEditDateVal]   = useState("");
  const [loaded, setLoaded]             = useState(false);
  const [saveFlash, setSaveFlash]       = useState(false);
  const nextId = useRef(9000);

  // LOAD — show local cache instantly, then reconcile with Supabase
  useEffect(() => {
    const cached = lsLoad();
    if (cached) {
      if (cached.goals)          setGoals(cached.goals);
      if (cached.checked)        setChecked(cached.checked);
      if (cached.completedDates) setCompletedDates(cached.completedDates);
      if (cached.nextId)         nextId.current = cached.nextId;
    }
    (async () => {
      const remote = await supaLoad();
      if (remote) {
        if (remote.goals)          setGoals(remote.goals);
        if (remote.checked)        setChecked(remote.checked);
        if (remote.completedDates) setCompletedDates(remote.completedDates);
        if (remote.nextId)         nextId.current = remote.nextId;
      }
      setLoaded(true);
    })();
  }, []);

  // SAVE (debounced) — writes to Supabase, mirrors to localStorage for fast next load
  const saveTimer = useRef(null);
  const persist = useCallback((g, c, cd) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const payload = { goals: g, checked: c, completedDates: cd, nextId: nextId.current };
      lsSave(payload);
      await supaSave(payload);
      setSaveFlash(true);
      setTimeout(() => setSaveFlash(false), 1200);
    }, 500);
  }, []);

  useEffect(() => { if (loaded) persist(goals, checked, completedDates); },
    [goals, checked, completedDates, loaded, persist]);

  // Helpers
  const allItems = goals.flatMap((p) => p.items.map((i) => ({ ...i, phase: p.phase, phaseLabel: p.phaseLabel })));
  const totalGoals     = allItems.length;
  const completedGoals = Object.values(checked).filter(Boolean).length;
  const progress       = Math.round((completedGoals / totalGoals) * 100);

  const toggle = (id) => {
    const nowDone = !checked[id];
    setChecked((p) => ({ ...p, [id]: nowDone }));
    if (nowDone) {
      const today = new Date().toISOString().split("T")[0];
      setCompletedDates((p) => ({ ...p, [id]: today }));
    } else {
      setCompletedDates((p) => { const n = {...p}; delete n[id]; return n; });
    }
  };

  const addGoal = () => {
    if (!newText.trim()) { setAdding(null); return; }
    const id = nextId.current++;
    setGoals((prev) => prev.map((p) =>
      p.phase === adding ? { ...p, items: [...p.items, { id, text: newText.trim(), tag: newTag, targetDate: newDate || null }] } : p
    ));
    setAdding(null); setNewText(""); setNewDate("");
  };

  const removeGoal = (phaseNum, id) => {
    setGoals((prev) => prev.map((p) =>
      p.phase === phaseNum ? { ...p, items: p.items.filter((i) => i.id !== id) } : p
    ));
    setChecked((p) => { const n = {...p}; delete n[id]; return n; });
    setCompletedDates((p) => { const n = {...p}; delete n[id]; return n; });
  };

  const moveGoal = (goalId, fromPhase, toPhase) => {
    if (fromPhase === toPhase) { setMovingGoal(null); return; }
    let moved = null;
    setGoals((prev) => {
      const removed = prev.map((p) => {
        if (p.phase === fromPhase) { moved = p.items.find((i) => i.id === goalId); return { ...p, items: p.items.filter((i) => i.id !== goalId) }; }
        return p;
      });
      return removed.map((p) => p.phase === toPhase ? { ...p, items: [...p.items, moved] } : p);
    });
    setMovingGoal(null);
  };

  const saveDate = (id) => {
    setGoals((prev) => prev.map((p) => ({ ...p, items: p.items.map((i) => i.id === id ? { ...i, targetDate: editDateVal || null } : i) })));
    setEditingDate(null);
  };

  const timelineItems = [...allItems].sort((a, b) => {
    const da = a.targetDate || "9999", db = b.targetDate || "9999";
    return sortDir === "asc" ? da.localeCompare(db) : db.localeCompare(da);
  });

  const allCompletedSorted = Object.entries(completedDates).sort((a,b) => a[1].localeCompare(b[1]));
  const cumulativePoints   = allCompletedSorted.map((_,i) => ({ date: allCompletedSorted[i][1], count: i+1 }));
  const displayGoals       = activePhase === null ? goals : goals.filter((p) => p.phase === activePhase);

  if (!loaded) return (
    <div style={{ minHeight:"100vh", background:"#fafaf9", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ fontFamily:"monospace", fontSize:11, letterSpacing:4, color:"#d6d3d1", textTransform:"uppercase" }}>Loading...</p>
    </div>
  );

  const S = { // shared style shortcuts
    mono: { fontFamily: "monospace" },
    serif: { fontFamily: "'Georgia','Times New Roman',serif" },
  };

  return (
    <div style={{ minHeight:"100vh", background:"#fafaf9", color:"#1c1917", ...S.serif, paddingBottom: "env(safe-area-inset-bottom)" }}>

      {/* ── HEADER ─────────────────────────────────────── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e7e5e4", padding:"44px 20px 28px", paddingTop:"calc(44px + env(safe-area-inset-top))" }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <span style={{ fontSize:9, letterSpacing:5, color:"#a8a29e", textTransform:"uppercase", ...S.mono }}>TYRUS BURTON · LIFE BLUEPRINT</span>
            <span style={{ fontSize:9, ...S.mono, color: saveFlash ? "#16a34a" : "#d6d3d1", transition:"color 0.4s", letterSpacing:2 }}>
              {saveFlash ? "✓ SAVED" : "AUTO-SAVE ON"}
            </span>
          </div>
          <h1 style={{ fontSize:"clamp(28px,6vw,48px)", fontWeight:400, margin:"10px 0 6px", letterSpacing:"-1.5px", lineHeight:1.05, color:"#0c0a09" }}>
            The Blueprint
          </h1>
          <p style={{ color:"#78716c", fontSize:13, margin:"0 0 24px", fontStyle:"italic" }}>
            From Pascagoula to the top. Every goal. No shortcuts.
          </p>
          {/* Progress bar */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1, height:6, background:"#e7e5e4", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#6366f1,#16a34a)", borderRadius:99, transition:"width 0.5s ease" }} />
            </div>
            <span style={{ fontSize:11, color:"#78716c", ...S.mono, whiteSpace:"nowrap" }}>{completedGoals}/{totalGoals}</span>
            <span style={{ fontSize:11, color:"#6366f1", ...S.mono, fontWeight:600, minWidth:32 }}>{progress}%</span>
          </div>
        </div>
      </div>

      {/* ── NAV TABS ───────────────────────────────────── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e7e5e4", position:"sticky", top:0, zIndex:20, overflowX:"auto" }}>
        <div style={{ maxWidth:780, margin:"0 auto", padding:"0 20px" }}>
          <div style={{ display:"flex" }}>
            {[["phases","Phases"],["timeline","Timeline"],["chart","Chart"]].map(([key,label]) => (
              <button key={key} onClick={() => setView(key)} style={{
                background:"none", border:"none", cursor:"pointer",
                borderBottom: view===key ? "2px solid #6366f1" : "2px solid transparent",
                color: view===key ? "#6366f1" : "#a8a29e",
                padding:"13px 16px 11px", fontSize:11, letterSpacing:3,
                textTransform:"uppercase", ...S.mono, whiteSpace:"nowrap",
                fontWeight: view===key ? 600 : 400, transition:"all 0.15s",
              }}>{label}</button>
            ))}
          </div>
          {view==="phases" && (
            <div style={{ display:"flex", borderTop:"1px solid #f5f5f4", overflowX:"auto" }}>
              {[{label:"All",phase:null},...goals.map(g=>({label:g.phaseLabel,phase:g.phase}))].map((item,i) => {
                const active = activePhase===item.phase;
                const accent = item.phase ? PHASE_ACCENTS[item.phase-1] : "#1c1917";
                return (
                  <button key={i} onClick={() => setActivePhase(item.phase)} style={{
                    background:"none", border:"none", cursor:"pointer",
                    borderBottom: active ? `2px solid ${accent}` : "2px solid transparent",
                    color: active ? accent : "#d6d3d1",
                    padding:"9px 14px 7px", fontSize:10, letterSpacing:2,
                    textTransform:"uppercase", ...S.mono, whiteSpace:"nowrap",
                    fontWeight: active ? 600 : 400, transition:"all 0.15s",
                  }}>{item.label}</button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── PHASES VIEW ────────────────────────────────── */}
      {view==="phases" && (
        <div style={{ maxWidth:780, margin:"0 auto", padding:"32px 20px 80px" }}>
          {displayGoals.map((phase) => {
            const accent   = PHASE_ACCENTS[phase.phase-1];
            const lightBg  = PHASE_BGS[phase.phase-1];
            const phaseDone = phase.items.filter(i => checked[i.id]).length;
            return (
              <div key={phase.phase} style={{ marginBottom:52 }}>
                {/* Phase header */}
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:4 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                        <span style={{ fontSize:9, letterSpacing:4, color:accent, textTransform:"uppercase", ...S.mono, fontWeight:600 }}>Phase {phase.phase}</span>
                        <span style={{ fontSize:9, background:lightBg, color:accent, padding:"2px 8px", borderRadius:99, ...S.mono, letterSpacing:1 }}>{phase.phaseYears}</span>
                        <span style={{ fontSize:9, color:"#d6d3d1", ...S.mono }}>{phaseDone}/{phase.items.length}</span>
                      </div>
                      <h2 style={{ fontSize:22, fontWeight:400, margin:0, letterSpacing:"-0.5px", color:"#0c0a09" }}>{phase.phaseLabel}</h2>
                      <p style={{ fontSize:12, color:"#a8a29e", margin:"3px 0 0", fontStyle:"italic" }}>{phase.phaseDesc}</p>
                    </div>
                    <button onClick={() => setAdding(phase.phase)} style={{
                      background:lightBg, border:`1px solid ${accent}33`, color:accent,
                      borderRadius:7, padding:"6px 13px", fontSize:11, cursor:"pointer",
                      ...S.mono, letterSpacing:1, marginTop:4,
                    }}>+ Add</button>
                  </div>
                  <div style={{ height:1, background:"#e7e5e4" }} />
                </div>

                {/* Items */}
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  {phase.items.map((item) => {
                    const isDone   = checked[item.id];
                    const tag      = TAG_COLORS[item.tag] || { color:"#78716c", bg:"#f5f5f4", border:"#e7e5e4" };
                    const overdue  = isOverdue(item.targetDate, isDone);
                    const days     = daysUntil(item.targetDate);
                    const isEdit   = editingDate===item.id;
                    return (
                      <div key={item.id} style={{
                        display:"flex", alignItems:"center", gap:10, padding:"12px 10px",
                        borderRadius:8, background: isDone?"#f5f5f4":"transparent",
                        border:"1px solid", borderColor: overdue?"#fecaca": isDone?"#e7e5e4":"transparent",
                        opacity: isDone?0.55:1, transition:"all 0.15s", flexWrap:"wrap",
                      }}>
                        {/* Checkbox */}
                        <div onClick={() => toggle(item.id)} style={{
                          width:20, height:20, borderRadius:5, flexShrink:0,
                          border:`2px solid ${isDone?accent:"#d6d3d1"}`,
                          background: isDone?accent:"#fff",
                          display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
                        }}>
                          {isDone && <svg width="11" height="8" viewBox="0 0 10 7" fill="none"><path d="M1 3.5L3.5 6L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        {/* Text */}
                        <span onClick={() => toggle(item.id)} style={{
                          fontSize:14, flex:1, lineHeight:1.4, cursor:"pointer", minWidth:100,
                          color: isDone?"#a8a29e": overdue?"#b91c1c":"#1c1917",
                          textDecoration: isDone?"line-through":"none",
                        }}>{item.text}</span>
                        {/* Date */}
                        {isEdit ? (
                          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                            <input type="date" value={editDateVal} onChange={e=>setEditDateVal(e.target.value)}
                              style={{ border:"1px solid #d6d3d1", borderRadius:5, padding:"3px 7px", fontSize:12, ...S.mono, outline:"none" }} />
                            <button onClick={() => saveDate(item.id)} style={{ background:accent, border:"none", color:"#fff", borderRadius:5, padding:"4px 9px", fontSize:11, cursor:"pointer", ...S.mono }}>Save</button>
                            <button onClick={() => setEditingDate(null)} style={{ background:"none", border:"1px solid #e7e5e4", color:"#78716c", borderRadius:5, padding:"4px 8px", fontSize:11, cursor:"pointer" }}>✕</button>
                          </div>
                        ) : (
                          <span onClick={() => { setEditingDate(item.id); setEditDateVal(item.targetDate||""); }} style={{
                            fontSize:10, ...S.mono, cursor:"pointer", whiteSpace:"nowrap",
                            color: isDone?"#a8a29e": overdue?"#dc2626": days!==null&&days<=30?"#d97706":"#a8a29e",
                            background: !isDone&&overdue?"#fef2f2": !isDone&&days!==null&&days<=30?"#fffbeb":"transparent",
                            padding:"2px 6px", borderRadius:5,
                          }}>
                            {isDone&&completedDates[item.id] ? `✓ ${fmtDate(completedDates[item.id])}` : item.targetDate?(overdue?`⚠ ${fmtDate(item.targetDate)}`:fmtDate(item.targetDate)):"Set date"}
                          </span>
                        )}
                        {/* Tag */}
                        <span style={{
                          fontSize:9, letterSpacing:2, textTransform:"uppercase",
                          color:tag.color, background:tag.bg, border:`1px solid ${tag.border}`,
                          padding:"2px 7px", borderRadius:99, ...S.mono, whiteSpace:"nowrap",
                        }}>{item.tag}</span>
                        {/* Move */}
                        <button onClick={() => setMovingGoal({goal:item, fromPhase:phase.phase})} title="Move phase"
                          style={{ background:"none", border:"none", color:"#d6d3d1", cursor:"pointer", fontSize:16, padding:"0 2px", flexShrink:0, lineHeight:1 }}>⇄</button>
                        {/* Remove */}
                        <button onClick={() => removeGoal(phase.phase, item.id)}
                          style={{ background:"none", border:"none", color:"#e7e5e4", cursor:"pointer", fontSize:17, padding:"0 2px", flexShrink:0, lineHeight:1 }}>×</button>
                      </div>
                    );
                  })}

                  {/* Add input */}
                  {adding===phase.phase && (
                    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 10px", borderRadius:8, border:`1px solid ${accent}44`, background:lightBg, marginTop:4, flexWrap:"wrap" }}>
                      <div style={{ width:20, height:20, borderRadius:5, border:`2px dashed ${accent}66`, flexShrink:0 }} />
                      <input autoFocus value={newText} onChange={e=>setNewText(e.target.value)}
                        onKeyDown={e=>{ if(e.key==="Enter") addGoal(); if(e.key==="Escape") setAdding(null); }}
                        placeholder="New goal..."
                        style={{ flex:1, border:"none", background:"transparent", fontSize:14, color:"#1c1917", outline:"none", ...S.serif, minWidth:120 }} />
                      <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)}
                        style={{ border:"1px solid #d6d3d1", borderRadius:5, padding:"3px 7px", fontSize:12, ...S.mono, outline:"none" }} />
                      <select value={newTag} onChange={e=>setNewTag(e.target.value)}
                        style={{ border:`1px solid ${accent}33`, borderRadius:6, background:"#fff", color:accent, fontSize:10, padding:"3px 6px", ...S.mono, cursor:"pointer", outline:"none" }}>
                        {TAGS.map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                      <button onClick={addGoal} style={{ background:accent, border:"none", borderRadius:6, color:"#fff", fontSize:11, padding:"6px 13px", cursor:"pointer", ...S.mono }}>Save</button>
                      <button onClick={() => setAdding(null)} style={{ background:"none", border:"1px solid #e7e5e4", borderRadius:6, color:"#78716c", fontSize:11, padding:"6px 10px", cursor:"pointer" }}>Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div style={{ textAlign:"center", paddingTop:40, borderTop:"1px solid #e7e5e4" }}>
            <p style={{ fontSize:10, color:"#d6d3d1", letterSpacing:4, ...S.mono, textTransform:"uppercase", margin:0 }}>Build the empire. One check at a time.</p>
          </div>
        </div>
      )}

      {/* ── TIMELINE VIEW ──────────────────────────────── */}
      {view==="timeline" && (
        <div style={{ maxWidth:780, margin:"0 auto", padding:"28px 20px 80px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <h2 style={{ margin:0, fontSize:18, fontWeight:400, letterSpacing:"-0.5px" }}>All Goals by Date</h2>
              <p style={{ margin:"3px 0 0", fontSize:12, color:"#a8a29e", fontStyle:"italic" }}>{sortDir==="asc"?"Nearest first":"Furthest first"}</p>
            </div>
            <button onClick={() => setSortDir(d=>d==="asc"?"desc":"asc")}
              style={{ background:"#fff", border:"1px solid #e7e5e4", borderRadius:7, padding:"7px 13px", fontSize:11, cursor:"pointer", ...S.mono, letterSpacing:2, color:"#78716c" }}>
              {sortDir==="asc"?"↑ Nearest":"↓ Furthest"}
            </button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {timelineItems.map((item) => {
              const isDone  = checked[item.id];
              const tag     = TAG_COLORS[item.tag]||{color:"#78716c",bg:"#f5f5f4",border:"#e7e5e4"};
              const overdue = isOverdue(item.targetDate, isDone);
              const days    = daysUntil(item.targetDate);
              const accent  = PHASE_ACCENTS[item.phase-1];
              const isEdit  = editingDate===item.id;
              return (
                <div key={item.id} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"11px 12px",
                  borderRadius:8, background:isDone?"#f5f5f4":"transparent",
                  border:"1px solid", borderColor:overdue?"#fecaca":isDone?"#e7e5e4":"#f5f5f4",
                  opacity:isDone?0.5:1, flexWrap:"wrap",
                }}>
                  <div onClick={() => toggle(item.id)} style={{
                    width:18, height:18, borderRadius:4, flexShrink:0,
                    border:`2px solid ${isDone?accent:"#d6d3d1"}`,
                    background:isDone?accent:"#fff", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    {isDone && <svg width="9" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 3.5L3.5 6L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize:9, letterSpacing:2, color:accent, ...S.mono, whiteSpace:"nowrap", textTransform:"uppercase" }}>P{item.phase}</span>
                  <span onClick={() => toggle(item.id)} style={{
                    fontSize:13, flex:1, cursor:"pointer", minWidth:80,
                    color:isDone?"#a8a29e":overdue?"#b91c1c":"#1c1917",
                    textDecoration:isDone?"line-through":"none",
                  }}>{item.text}</span>
                  {isEdit ? (
                    <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                      <input type="date" value={editDateVal} onChange={e=>setEditDateVal(e.target.value)}
                        style={{ border:"1px solid #d6d3d1", borderRadius:5, padding:"2px 6px", fontSize:11, ...S.mono, outline:"none" }} />
                      <button onClick={() => saveDate(item.id)} style={{ background:"#6366f1", border:"none", color:"#fff", borderRadius:5, padding:"3px 8px", fontSize:10, cursor:"pointer", ...S.mono }}>Save</button>
                      <button onClick={() => setEditingDate(null)} style={{ background:"none", border:"1px solid #e7e5e4", color:"#78716c", borderRadius:5, padding:"3px 7px", fontSize:10, cursor:"pointer" }}>✕</button>
                    </div>
                  ) : (
                    <span onClick={() => { setEditingDate(item.id); setEditDateVal(item.targetDate||""); }} style={{
                      fontSize:10, ...S.mono, cursor:"pointer", whiteSpace:"nowrap",
                      color:isDone?"#a8a29e":overdue?"#dc2626":days!==null&&days<=60?"#d97706":"#a8a29e",
                      background:!isDone&&overdue?"#fef2f2":!isDone&&days!==null&&days<=60?"#fffbeb":"transparent",
                      padding:"2px 6px", borderRadius:5,
                    }}>
                      {isDone&&completedDates[item.id]?`✓ ${fmtDate(completedDates[item.id])}`:item.targetDate?fmtDate(item.targetDate):"No date"}
                    </span>
                  )}
                  <span style={{
                    fontSize:9, letterSpacing:1.5, textTransform:"uppercase",
                    color:tag.color, background:tag.bg, border:`1px solid ${tag.border}`,
                    padding:"2px 7px", borderRadius:99, ...S.mono, whiteSpace:"nowrap",
                  }}>{item.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CHART VIEW ─────────────────────────────────── */}
      {view==="chart" && (
        <div style={{ maxWidth:780, margin:"0 auto", padding:"32px 20px 80px" }}>
          <h2 style={{ margin:"0 0 4px", fontSize:18, fontWeight:400, letterSpacing:"-0.5px" }}>Progress Chart</h2>
          <p style={{ margin:"0 0 24px", fontSize:12, color:"#a8a29e", fontStyle:"italic" }}>Check goals off to build the curve.</p>
          {/* Stats */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:24 }}>
            {[["Total",totalGoals,"#6366f1"],["Done",completedGoals,"#16a34a"],["Left",totalGoals-completedGoals,"#d97706"],[`${progress}%`,"Progress","#2563eb"]].map(([val,label,color],i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid #e7e5e4", borderRadius:10, padding:"14px 18px", flex:"1 1 80px", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:400, color: i===3?color:"#1c1917", ...S.mono, letterSpacing:"-1px" }}>{val}</div>
                <div style={{ fontSize:10, letterSpacing:2, color:"#a8a29e", textTransform:"uppercase", ...S.mono, marginTop:2 }}>{i===3?"Progress":label}</div>
              </div>
            ))}
          </div>
          {/* Line chart */}
          <div style={{ background:"#fff", border:"1px solid #e7e5e4", borderRadius:12, padding:"20px", marginBottom:20 }}>
            <div style={{ fontSize:10, letterSpacing:3, color:"#a8a29e", textTransform:"uppercase", ...S.mono, marginBottom:14 }}>Goals Completed Over Time</div>
            {cumulativePoints.length===0 ? (
              <div style={{ textAlign:"center", padding:"36px 0", color:"#d6d3d1", fontStyle:"italic", fontSize:14 }}>Check off your first goal to start the curve.</div>
            ) : (
              <svg viewBox="0 0 600 180" style={{ width:"100%", height:"auto" }}>
                <defs>
                  <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#16a34a"/>
                  </linearGradient>
                  <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12"/><stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {[0,1,2,3].map(i=><line key={i} x1="36" y1={16+i*40} x2="580" y2={16+i*40} stroke="#f5f5f4" strokeWidth="1"/>)}
                {[0,1,2,3].map(i=>{
                  const v=Math.round((completedGoals/3)*(3-i));
                  return <text key={i} x="30" y={20+i*40} textAnchor="end" fontSize="9" fill="#d6d3d1" fontFamily="monospace">{v}</text>;
                })}
                {(() => {
                  const n=cumulativePoints.length;
                  if(n===0) return null;
                  const xs=(i)=>36+(i/Math.max(n-1,1))*544;
                  const ys=(v)=>156-(v/Math.max(completedGoals,1))*140;
                  const pts=cumulativePoints.map((p,i)=>`${xs(i)},${ys(p.count)}`).join(" ");
                  const fill=`36,156 ${pts} ${xs(n-1)},156`;
                  return (
                    <>
                      <polygon points={fill} fill="url(#lg2)"/>
                      <polyline points={pts} fill="none" stroke="url(#lg1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      {cumulativePoints.map((p,i)=><circle key={i} cx={xs(i)} cy={ys(p.count)} r="4" fill="#6366f1" stroke="#fff" strokeWidth="1.5"/>)}
                    </>
                  );
                })()}
              </svg>
            )}
          </div>
          {/* Phase bars */}
          <div style={{ background:"#fff", border:"1px solid #e7e5e4", borderRadius:12, padding:"20px" }}>
            <div style={{ fontSize:10, letterSpacing:3, color:"#a8a29e", textTransform:"uppercase", ...S.mono, marginBottom:14 }}>By Phase</div>
            {goals.map((phase) => {
              const done=phase.items.filter(i=>checked[i.id]).length;
              const total=phase.items.length;
              const pct=total===0?0:Math.round((done/total)*100);
              const accent=PHASE_ACCENTS[phase.phase-1];
              return (
                <div key={phase.phase} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:12, color:"#44403c" }}><span style={{ color:accent, ...S.mono, fontSize:9 }}>P{phase.phase} </span>{phase.phaseLabel}</span>
                    <span style={{ fontSize:10, color:"#a8a29e", ...S.mono }}>{done}/{total}</span>
                  </div>
                  <div style={{ height:5, background:"#f5f5f4", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:accent, borderRadius:99, transition:"width 0.5s ease" }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MOVE MODAL ─────────────────────────────────── */}
      {movingGoal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={() => setMovingGoal(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:14, padding:"24px 20px", maxWidth:360, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.14)" }}>
            <div style={{ fontSize:9, letterSpacing:4, color:"#a8a29e", textTransform:"uppercase", ...S.mono, marginBottom:8 }}>Move to Phase</div>
            <p style={{ fontSize:13, color:"#44403c", margin:"0 0 18px", lineHeight:1.4 }}>"{movingGoal.goal.text}"</p>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {goals.filter(p=>p.phase!==movingGoal.fromPhase).map(p=>(
                <button key={p.phase} onClick={() => moveGoal(movingGoal.goal.id, movingGoal.fromPhase, p.phase)} style={{
                  background:PHASE_BGS[p.phase-1], border:`1px solid ${PHASE_ACCENTS[p.phase-1]}33`,
                  borderRadius:8, padding:"10px 13px", textAlign:"left", cursor:"pointer",
                }}>
                  <span style={{ fontSize:9, color:PHASE_ACCENTS[p.phase-1], ...S.mono, letterSpacing:3, textTransform:"uppercase" }}>Phase {p.phase} · </span>
                  <span style={{ fontSize:13, color:"#1c1917" }}>{p.phaseLabel} </span>
                  <span style={{ fontSize:10, color:"#a8a29e", fontStyle:"italic" }}>{p.phaseYears}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setMovingGoal(null)} style={{ marginTop:14, width:"100%", background:"none", border:"1px solid #e7e5e4", borderRadius:8, padding:"9px", color:"#78716c", fontSize:12, cursor:"pointer", ...S.mono }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}