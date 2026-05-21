import { useState, useRef, useEffect, useCallback } from "react";

const STORAGE_KEY = "tyrus-blueprint-v1";

const initialGoals = [
  {
    phase: 1, phaseLabel: "Right Now", phaseYears: "2026",
    phaseDesc: "Finish strong, pass the SIE, crush HRK, dominate the fall career fair.",
    items: [
      { id: 101, text: "Pass the SIE exam", tag: "Career", targetDate: "2026-06-13" },
      { id: 102, text: "Crush the HRK tax internship", tag: "Career", targetDate: "2026-07-31" },
      { id: 103, text: "Dominate the fall career fair — replace CLA offer", tag: "Career", targetDate: "2026-09-30" },
      { id: 104, text: "Graduate with Bachelor of Accountancy", tag: "Career", targetDate: "2026-12-15" },
      { id: 105, text: "Save and invest $5–10K before graduation", tag: "Finance", targetDate: "2026-12-01" },
      { id: 106, text: "Reach high 700s credit score", tag: "Finance", targetDate: "2026-12-01" },
      { id: 107, text: "Pay off all current debt", tag: "Finance", targetDate: "2026-12-01" },
      { id: 108, text: "Open a credit builder loan through a bank", tag: "Finance", targetDate: "2026-09-01" },
      { id: 109, text: "Invest into stocks monthly — no matter the amount", tag: "Finance", targetDate: "2026-06-01" },
      { id: 110, text: "Start building social media presence", tag: "Brand", targetDate: "2026-08-01" },
    ],
  },
  {
    phase: 2, phaseLabel: "Grad School", phaseYears: "Jan 2027 – May 2028",
    phaseDesc: "CLA internship or better, MAcc, CPA exams, get licensed, keep building.",
    items: [
      { id: 201, text: "Complete CLA Nashville internship (or upgraded offer)", tag: "Career", targetDate: "2027-03-31" },
      { id: 202, text: "Start and complete MAcc at MSU", tag: "Career", targetDate: "2028-05-15" },
      { id: 203, text: "Pass all four CPA exam sections", tag: "Career", targetDate: "2028-05-01" },
      { id: 204, text: "Earn CPA license", tag: "Career", targetDate: "2028-06-01" },
      { id: 205, text: "Get an apartment after college", tag: "Life", targetDate: "2027-01-01" },
      { id: 206, text: "Build large emergency fund — 5–6 months of expenses", tag: "Finance", targetDate: "2028-01-01" },
      { id: 207, text: "Invest ≥15% of take-home pay into brokerage and Roth IRA", tag: "Finance", targetDate: "2027-06-01" },
      { id: 208, text: "Hit $50K invested", tag: "Finance", targetDate: "2028-05-01" },
      { id: 209, text: "Build out wardrobe — suits, old money aesthetic, quality basics", tag: "Personal", targetDate: "2027-06-01" },
      { id: 210, text: "Professional teeth whitening / veneers", tag: "Personal", targetDate: "2027-12-01" },
      { id: 211, text: "Get my first gun", tag: "Personal", targetDate: "2027-09-01" },
      { id: 212, text: "Run a half marathon", tag: "Fitness", targetDate: "2027-10-01" },
      { id: 213, text: "Compete in a powerlifting competition", tag: "Fitness", targetDate: "2028-03-01" },
      { id: 214, text: "Open Amazon FBA — build to $5K/month recurring", tag: "Business", targetDate: "2028-01-01" },
      { id: 215, text: "Own a Buick Grand National, Cutlass, Caprice, SS Monte Carlo, or Box Chevy", tag: "Lifestyle", targetDate: "2027-12-01" },
      { id: 216, text: "Own multiple Rolexes (reps)", tag: "Lifestyle", targetDate: "2028-01-01" },
    ],
  },
  {
    phase: 3, phaseLabel: "Early Career", phaseYears: "Mid 2028 – 2031",
    phaseDesc: "Land the Big 4 or top-20 role, relocate to Austin, stack real deal experience.",
    items: [
      { id: 301, text: "Land audit or TAS role at Big 4 or top-20 firm", tag: "Career", targetDate: "2028-08-01" },
      { id: 302, text: "Relocate to Austin, TX", tag: "Life", targetDate: "2028-09-01" },
      { id: 303, text: "Get first promotion at the firm", tag: "Career", targetDate: "2030-01-01" },
      { id: 304, text: "Hit $100K invested", tag: "Finance", targetDate: "2030-06-01" },
      { id: 305, text: "Compete in a bodybuilding show — document the whole process", tag: "Fitness", targetDate: "2029-06-01" },
      { id: 306, text: "Run a full marathon", tag: "Fitness", targetDate: "2029-12-01" },
      { id: 307, text: "Buy first cash-flowing business", tag: "Business", targetDate: "2030-01-01" },
      { id: 308, text: "Own a Mercedes 190E or 300CE", tag: "Lifestyle", targetDate: "2029-06-01" },
      { id: 309, text: "Get pilot's license", tag: "Personal", targetDate: "2030-06-01" },
      { id: 310, text: "Start traveling the world — a lot of nice trips", tag: "Lifestyle", targetDate: "2029-01-01" },
    ],
  },
  {
    phase: 4, phaseLabel: "MBA & IB", phaseYears: "2031 – 2034",
    phaseDesc: "MLT/Consortium scholarship, top MBA, break into IB or M&A, first real acquisition.",
    items: [
      { id: 401, text: "Secure MBA scholarship via MLT or Consortium", tag: "Career", targetDate: "2031-04-01" },
      { id: 402, text: "Complete MBA at Ross, Darden, Fuqua, Kelley, or Columbia", tag: "Career", targetDate: "2033-05-01" },
      { id: 403, text: "Break into IB via MBA summer internship", tag: "Career", targetDate: "2032-08-01" },
      { id: 404, text: "Land full-time IB or M&A advisory role post-MBA", tag: "Career", targetDate: "2033-08-01" },
      { id: 405, text: "Hit $250K invested", tag: "Finance", targetDate: "2033-01-01" },
      { id: 406, text: "Launch the clothing brand / men's clothing store", tag: "Business", targetDate: "2032-01-01" },
      { id: 407, text: "Run an Ironman 70.3", tag: "Fitness", targetDate: "2032-06-01" },
      { id: 408, text: "Buy an e-dirt bike", tag: "Lifestyle", targetDate: "2031-06-01" },
      { id: 409, text: "Own a nice home", tag: "Life", targetDate: "2033-01-01" },
    ],
  },
  {
    phase: 5, phaseLabel: "Scale", phaseYears: "2034 – 2040",
    phaseDesc: "Multiple businesses, $500K+ invested, family, physical peak, real Rolexes.",
    items: [
      { id: 501, text: "Hit $500K invested", tag: "Finance", targetDate: "2036-01-01" },
      { id: 502, text: "Own accounting firms", tag: "Business", targetDate: "2035-01-01" },
      { id: 503, text: "Own 10 businesses across different verticals", tag: "Business", targetDate: "2038-01-01" },
      { id: 504, text: "Run a full Ironman", tag: "Fitness", targetDate: "2035-09-01" },
      { id: 505, text: "Get married", tag: "Life", targetDate: "2035-01-01" },
      { id: 506, text: "Have 2–3 children", tag: "Life", targetDate: "2038-01-01" },
      { id: 507, text: "Own a Porsche 911", tag: "Lifestyle", targetDate: "2036-01-01" },
      { id: 508, text: "Own real Rolexes", tag: "Lifestyle", targetDate: "2036-01-01" },
    ],
  },
  {
    phase: 6, phaseLabel: "Legacy", phaseYears: "2040+",
    phaseDesc: "Permanent capital. Generational wealth. The empire is built.",
    items: [
      { id: 601, text: "Hit $1M invested", tag: "Finance", targetDate: "2040-01-01" },
      { id: 602, text: "Start a private equity fund", tag: "Business", targetDate: "2040-01-01" },
      { id: 603, text: "Build holding company to $10M+ in revenue", tag: "Business", targetDate: "2042-01-01" },
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

// ── localStorage helpers (replaces window.storage) ────────
function lsLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function lsSave(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
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

  // LOAD
  useEffect(() => {
    const data = lsLoad();
    if (data) {
      if (data.goals)          setGoals(data.goals);
      if (data.checked)        setChecked(data.checked);
      if (data.completedDates) setCompletedDates(data.completedDates);
      if (data.nextId)         nextId.current = data.nextId;
    }
    setLoaded(true);
  }, []);

  // SAVE (debounced)
  const saveTimer = useRef(null);
  const persist = useCallback((g, c, cd) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      lsSave({ goals: g, checked: c, completedDates: cd, nextId: nextId.current });
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
