import { useState, useEffect, useCallback, useRef } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, ReferenceLine,
} from "recharts";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  teal:      "#1C7293",
  tealDark:  "#0F5670",
  navy:      "#0A3D5C",
  orange:    "#E85D04",
  bg:        "#F5F7FA",
  white:     "#FFFFFF",
  success:   "#0A8040",
  warn:      "#F59E0B",
  danger:    "#DC2626",
  info:      "#3B82F6",
  g100:      "#F9FAFB",
  g200:      "#F3F4F6",
  g300:      "#E5E7EB",
  g400:      "#D1D5DB",
  g500:      "#9CA3AF",
  g600:      "#6B7280",
  g700:      "#374151",
  parker:    "#005EB8",
  swagelok:  "#C8102E",
  gates:     "#00A651",
  eaton:     "#93C120",
  purple:    "#8B5CF6",
};

/* ─────────────────────────────────────────────
   PART DATA
───────────────────────────────────────────── */
const PARTS = {
  "PKR-2500X": {
    desc: 'High-Pressure Hydraulic Fitting, 1/2" NPT Male',
    category: "Fittings", listPrice: 42.00, cogs: 34.35, margin: 18.2,
    floor: 25.0, units: 120,
    material: "Stainless Steel 316", threadType: "NPT", pressureRating: "5000 PSI",
    tempRange: "-40°F to 400°F", weight: "0.25 lbs", certs: ["ISO 9001", "RoHS"],
    competitors: [
      { name:"Parker Hannifin", price:46.00, delivery:"3–5 days", avail:"In Stock",  rating:"4.8", moq:10,  color:C.parker   },
      { name:"Swagelok",        price:48.50, delivery:"2–3 days", avail:"In Stock",  rating:"4.9", moq:5,   color:C.swagelok },
      { name:"Gates Corp",      price:44.20, delivery:"5–7 days", avail:"Limited",   rating:"4.6", moq:25,  color:C.gates    },
      { name:"Eaton Aeroquip",  price:45.80, delivery:"4–6 days", avail:"In Stock",  rating:"4.7", moq:10,  color:C.eaton    },
    ],
    marketAvg: 46.13,
    ai: { title:"Price Increase Opportunity Detected", tagLabel:"⬆ Strong Increase", tagColor:C.teal,
      body:'Based on competitive analysis, we recommend an <b>8% price increase to $45.36</b>. This achieves a healthy 29.1% margin while remaining well below all competitors.',
      bullets:["Achieves 29.1% margin — 4.1 pts above floor","14% below Parker Hannifin — strong value positioning","All 4 competitors priced higher than proposed $45.36","Low volume risk: current price is significantly undermarket"]},
  },
  "VAL-8402A": {
    desc: 'Ball Valve, Stainless Steel, 3/4" NPT',
    category: "Valves", listPrice: 68.00, cogs: 52.70, margin: 22.5,
    floor: 25.0, units: 70,
    material: "Stainless Steel 316", threadType: "NPT Female", pressureRating: "6000 PSI",
    tempRange: "-20°F to 450°F", weight: "1.2 lbs", certs: ["ISO 9001", "API 607"],
    competitors: [
      { name:"Parker Hannifin", price:78.00, delivery:"3–5 days", avail:"In Stock",  rating:"4.8", moq:10,  color:C.parker   },
      { name:"Swagelok",        price:82.00, delivery:"2–3 days", avail:"In Stock",  rating:"4.9", moq:5,   color:C.swagelok },
      { name:"Gates Corp",      price:69.50, delivery:"5–7 days", avail:"In Stock",  rating:"4.6", moq:25,  color:C.gates    },
      { name:"Eaton Aeroquip",  price:72.00, delivery:"4–6 days", avail:"In Stock",  rating:"4.7", moq:10,  color:C.eaton    },
    ],
    marketAvg: 75.38,
    ai: { title:"Hold & Monitor — Optimal Positioning", tagLabel:"= Hold & Monitor", tagColor:C.info,
      body:"Your current pricing is <b>optimally positioned</b> at $68.00. Maintain current strategy with close monitoring.",
      bullets:["22.5% margin within 2.5 pts of floor — watch closely","Aligned with Gates Corp ($69.50)","Strong value vs. Parker $78, Swagelok $82","Consider 5% increase in 60 days if competitors move up"]},
  },
  "HSE-3301B": {
    desc: 'Hydraulic Hose Assembly, 1/2" ID, 36" Length',
    category: "Hoses", listPrice: 85.00, cogs: 68.20, margin: 19.8,
    floor: 25.0, units: 90,
    material: "Synthetic Rubber / Steel Braid", threadType: "JIC 37°", pressureRating: "4000 PSI",
    tempRange: "-40°F to 300°F", weight: "1.8 lbs", certs: ["SAE 100R2AT", "MSHA"],
    competitors: [
      { name:"Parker Hannifin", price:96.00, delivery:"3–5 days", avail:"In Stock",  rating:"4.8", moq:10,  color:C.parker   },
      { name:"Swagelok",        price:98.00, delivery:"2–3 days", avail:"In Stock",  rating:"4.9", moq:5,   color:C.swagelok },
      { name:"Gates Corp",      price:91.50, delivery:"5–7 days", avail:"Limited",   rating:"4.6", moq:25,  color:C.gates    },
      { name:"Eaton Aeroquip",  price:93.00, delivery:"4–6 days", avail:"In Stock",  rating:"4.7", moq:10,  color:C.eaton    },
    ],
    marketAvg: 94.63,
    ai: { title:"Competitor Price Surge — Increase Now", tagLabel:"⬆ Strong Increase — Act Now", tagColor:C.teal,
      body:"Competitors raised hose prices <b>8–12% in the last 30 days</b>. Significant opportunity to close the margin gap.",
      bullets:["Brennan is 11% below market average ($94.63)","Recommended increase to $95 achieves 28.2% margin","Still below all competitors at proposed price","Urgency: window may close if competitors stabilise"]},
  },
  "ADP-7712C": {
    desc: 'Adapter, JIC to NPT, 1/2"',
    category: "Adapters", listPrice: 28.00, cogs: 22.05, margin: 21.2,
    floor: 25.0, units: 150,
    material: "Carbon Steel, Zinc Plated", threadType: "JIC / NPT", pressureRating: "5000 PSI",
    tempRange: "-40°F to 400°F", weight: "0.15 lbs", certs: ["SAE J514", "ISO 8434"],
    competitors: [
      { name:"Parker Hannifin", price:26.50, delivery:"3–5 days", avail:"In Stock",  rating:"4.8", moq:10,  color:C.parker   },
      { name:"Swagelok",        price:29.00, delivery:"2–3 days", avail:"In Stock",  rating:"4.9", moq:5,   color:C.swagelok },
      { name:"Gates Corp",      price:25.80, delivery:"5–7 days", avail:"In Stock",  rating:"4.6", moq:25,  color:C.gates    },
      { name:"Eaton Aeroquip",  price:27.50, delivery:"4–6 days", avail:"In Stock",  rating:"4.7", moq:10,  color:C.eaton    },
    ],
    marketAvg: 27.20,
    ai: { title:"Volume Risk — Tactically Above Market", tagLabel:"⬇ Tactical Reduction", tagColor:C.warn,
      body:"⚠️ Your $28.00 price is <b>3% above market average</b> ($27.20). Sales volume has declined.",
      bullets:["Parker ($26.50) and Gates ($25.80) are both lower","Consider $26.40 — restores competitiveness","Margin improves from volume uplift at lower price","Monitor closely over next 30 days"]},
  },
  "REG-5504D": {
    desc: "Pressure Regulator, 0–200 PSI, Panel Mount",
    category: "Regulators", listPrice: 125.00, cogs: 103.10, margin: 17.5,
    floor: 25.0, units: 45,
    material: "Brass / Stainless Steel", threadType: "NPT Female", pressureRating: "3000 PSI",
    tempRange: "0°F to 250°F", weight: "2.4 lbs", certs: ["ISO 9001", "UL Listed"],
    competitors: [
      { name:"Parker Hannifin", price:148.00, delivery:"3–5 days", avail:"In Stock",  rating:"4.8", moq:10,  color:C.parker   },
      { name:"Swagelok",        price:155.00, delivery:"2–3 days", avail:"In Stock",  rating:"4.9", moq:5,   color:C.swagelok },
      { name:"Gates Corp",      price:138.00, delivery:"5–7 days", avail:"Limited",   rating:"4.6", moq:25,  color:C.gates    },
      { name:"Eaton Aeroquip",  price:142.00, delivery:"4–6 days", avail:"In Stock",  rating:"4.7", moq:10,  color:C.eaton    },
    ],
    marketAvg: 145.75,
    ai: { title:"Largest Margin Gap — Immediate Action", tagLabel:"⬆ Urgent Increase Required", tagColor:C.danger,
      body:"REG-5504D has the <b>largest absolute margin gap</b> at 7.5 pts below floor. Significant pricing power available.",
      bullets:["Recommend increase to $138 achieves 25.3% margin","Still $10+ below Parker — highly competitive","Competitor average is $145.75 — 16.6% headroom","Priority: address before quarterly pricing review"]},
  },
};

const TABLE_PARTS = [
  { id:"PKR-2500X", margin:18.2, status:"Below Floor",  statusType:"red",   comp:"+15% higher", compType:"pos" },
  { id:"HSE-3301B", margin:19.8, status:"Below Floor",  statusType:"red",   comp:"+12% higher", compType:"pos" },
  { id:"REG-5504D", margin:17.5, status:"Below Floor",  statusType:"red",   comp:"+18% higher", compType:"pos" },
  { id:"VAL-8402A", margin:22.5, status:"At Risk",      statusType:"amber", comp:"Competitive",  compType:"neutral" },
  { id:"ADP-7712C", margin:21.2, status:"At Risk",      statusType:"amber", comp:"−5% lower",    compType:"neg" },
];

const CATEGORY_DATA = [
  { name:"Valves",     x:2.5, y:42, z:180, fill:"#0A8040" },
  { name:"Hoses",      x:1.8, y:38, z:210, fill:"#0A8040" },
  { name:"Couplings",  x:1.6, y:35, z:160, fill:"#0A8040" },
  { name:"Gauges",     x:1.4, y:40, z:140, fill:"#0A8040" },
  { name:"Fittings",   x:3.2, y:28, z:234, fill:"#F59E0B" },
  { name:"Clamps",     x:0.9, y:25, z:90,  fill:"#F59E0B" },
  { name:"Adapters",   x:2.8, y:22, z:312, fill:"#DC2626" },
  { name:"Regulators", x:2.1, y:18, z:180, fill:"#DC2626" },
];

const TREND_DATA = [
  {w:"Dec 30",b:42,p:45.0,s:47.0},{w:"Jan 6", b:42,p:45.0,s:47.0},
  {w:"Jan 13",b:42,p:45.5,s:47.5},{w:"Jan 20",b:42,p:45.5,s:48.0},
  {w:"Jan 27",b:42,p:46.0,s:48.0},{w:"Feb 3", b:42,p:46.0,s:48.5},
  {w:"Feb 10",b:42,p:46.0,s:48.5},{w:"Feb 17",b:42,p:46.0,s:48.5},
  {w:"Feb 24",b:42,p:46.0,s:48.5},{w:"Mar 3", b:42,p:46.0,s:48.5},
  {w:"Mar 10",b:42,p:46.0,s:48.5},{w:"Mar 17",b:42,p:46.0,s:48.5},
];

/* ─────────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',-apple-system,sans-serif;background:#F5F7FA;color:#374151}
button{cursor:pointer;font-family:inherit;border:none;background:none}
input,textarea,select{font-family:inherit}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:#f1f1f1}
::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes slideInRight{from{transform:translateX(80px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes pop{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
.modal-anim{animation:slideUp .22s ease}
.toast-anim{animation:slideInRight .3s ease}
.pop-anim{animation:pop .4s ease}
.stagger-1{animation:slideUp .35s ease both;animation-delay:.05s}
.stagger-2{animation:slideUp .35s ease both;animation-delay:.12s}
.stagger-3{animation:slideUp .35s ease both;animation-delay:.19s}
.stagger-4{animation:slideUp .35s ease both;animation-delay:.26s}
.skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:800px 100%;animation:shimmer 1.5s infinite;border-radius:6px}
th.sortable{cursor:pointer;user-select:none}
th.sortable:hover{background:rgba(255,255,255,.15)}
`;

/* ─────────────────────────────────────────────
   REUSABLE UI PRIMITIVES
───────────────────────────────────────────── */
const s = {
  card: { background:C.white, borderRadius:8, border:`1px solid ${C.g300}`, boxShadow:"0 1px 3px rgba(0,0,0,.10)", overflow:"hidden" },
  panelHeader: { padding:"18px 22px 14px", borderBottom:`1px solid ${C.g200}` },
  panelBody: { padding:"20px 22px" },
  panelTitle: { fontSize:16, fontWeight:600, color:C.navy },
  panelSub: { fontSize:12, color:C.g500, marginTop:3 },
};

function Badge({ children, type = "default" }) {
  const map = {
    red:     { bg:"#FEE2E2", color:C.danger },
    amber:   { bg:"#FEF3C7", color:"#92400E" },
    green:   { bg:"#D1FAE5", color:"#065F46" },
    teal:    { bg:"#E0F4FB", color:C.tealDark },
    blue:    { bg:"#DBEAFE", color:"#1E40AF" },
    default: { bg:C.g200,    color:C.g700 },
  };
  const { bg, color } = map[type] || map.default;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 9px",
      borderRadius:20, fontSize:11, fontWeight:600, letterSpacing:0.3, background:bg, color }}>
      {children}
    </span>
  );
}

function Btn({ children, variant = "primary", size = "md", onClick, disabled, style }) {
  const base = { display:"inline-flex", alignItems:"center", gap:7, borderRadius:6,
    fontSize: size === "sm" ? 12 : 14, fontWeight:500, cursor:"pointer",
    padding: size === "sm" ? "5px 12px" : "10px 20px", border:"none",
    transition:"background .15s, box-shadow .15s", ...style };
  const vars = {
    primary:   { background:C.teal,    color:C.white },
    secondary: { background:C.white,   color:C.teal,   border:`2px solid ${C.teal}`, padding: size==="sm"?"4px 11px":"9px 19px" },
    danger:    { background:C.danger,  color:C.white },
    ghost:     { background:"transparent", color:C.g600, border:`1px solid ${C.g300}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...vars[variant],
      opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
      {children}
    </button>
  );
}

function InputStepper({ value, onChange, min = 0, max = 9999, step = 1, prefix = "" }) {
  const inc = () => onChange(Math.min(max, parseFloat(value) + step));
  const dec = () => onChange(Math.max(min, parseFloat(value) - step));
  const btnStyle = { width:36, height:44, background:C.g100, color:C.g600, fontSize:20,
    borderRight:`1px solid ${C.g300}`, borderLeft:`1px solid ${C.g300}`, display:"flex",
    alignItems:"center", justifyContent:"center", cursor:"pointer", border:"none",
    transition:"background .1s" };
  return (
    <div style={{ display:"flex", alignItems:"center", border:`1px solid ${C.g400}`,
      borderRadius:6, overflow:"hidden", background:C.white }}>
      <button onClick={dec} style={btnStyle}>−</button>
      <div style={{ flex:1, textAlign:"center", fontSize:16, fontWeight:600,
        color:C.navy, fontFamily:"'DM Mono',monospace", padding:"0 4px", height:44,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        {prefix}{typeof value === "number" ? value.toFixed(step < 1 ? 2 : 0) : value}
      </div>
      <button onClick={inc} style={btnStyle}>+</button>
    </div>
  );
}

function Modal({ open, onClose, children, width = 620 }) {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)",
        zIndex:200, display:"flex", alignItems:"center", justifyContent:"center",
        animation:"fadeIn .2s" }}>
      <div className="modal-anim" style={{ background:C.white, borderRadius:12,
        boxShadow:"0 20px 60px rgba(0,0,0,.2)", width:"90vw", maxWidth:width,
        maxHeight:"90vh", overflowY:"auto" }}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, icon, onClose }) {
  return (
    <div style={{ padding:"22px 26px 16px", borderBottom:`1px solid ${C.g200}`,
      display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        {icon && <span style={{ fontSize:26 }}>{icon}</span>}
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:C.navy }}>{title}</div>
          {subtitle && <div style={{ fontSize:12, color:C.g500, marginTop:3 }}>{subtitle}</div>}
        </div>
      </div>
      <button onClick={onClose} style={{ color:C.g400, fontSize:22, lineHeight:1,
        cursor:"pointer", padding:2 }}>×</button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONFIRM DIALOG
───────────────────────────────────────────── */
function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel, variant = "primary" }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onCancel} width={480}>
      <ModalHeader icon="⚡" title={title} onClose={onCancel} />
      <div style={{ padding:"20px 26px" }}>
        <div style={{ fontSize:14, color:C.g700, lineHeight:1.65 }}>{message}</div>
      </div>
      <div style={{ padding:"16px 26px", borderTop:`1px solid ${C.g200}`,
        display:"flex", justifyContent:"flex-end", gap:12 }}>
        <Btn variant="ghost" onClick={onCancel}>{cancelLabel}</Btn>
        <Btn variant={variant} onClick={onConfirm}>{confirmLabel}</Btn>
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   COUNT-UP HOOK
───────────────────────────────────────────── */
function useCountUp(target, duration = 800) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    const num = typeof target === "number" ? target : parseFloat(String(target).replace(/[^0-9.]/g, "")) || 0;
    if (num === 0) { setVal(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(eased * num);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return val;
}

/* ─────────────────────────────────────────────
   SKELETON PLACEHOLDER
───────────────────────────────────────────── */
function SkeletonBlock({ width = "100%", height = 20, style }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

function DashboardSkeleton() {
  return (
    <div style={{ maxWidth:1440, margin:"0 auto", padding:"28px 32px 48px" }}>
      <SkeletonBlock width="40%" height={32} style={{ marginBottom:12 }} />
      <SkeletonBlock width="60%" height={16} style={{ marginBottom:24 }} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[1,2,3,4].map(i => <SkeletonBlock key={i} height={120} />)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:20 }}>
        <SkeletonBlock height={360} />
        <SkeletonBlock height={360} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TOAST SYSTEM
───────────────────────────────────────────── */
function ToastContainer({ toasts }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:300,
      display:"flex", flexDirection:"column", gap:10 }}>
      {toasts.map(t => (
        <div key={t.id} className="toast-anim"
          style={{ background: t.type === "success" ? C.success : t.type === "error" ? C.danger : C.navy,
            color:C.white, padding:"14px 20px", borderRadius:8,
            fontSize:14, minWidth:300, boxShadow:"0 10px 25px rgba(0,0,0,.2)",
            display:"flex", alignItems:"center", gap:10 }}>
          {t.type === "success" ? "✅" : "❌"} {t.msg}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((type, msg) => {
    const id = Date.now();
    setToasts(t => [...t, { id, type, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
  }, []);
  return { toasts, push };
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav({ crumbs, onNavigate }) {
  return (
    <nav style={{ height:64, background:C.navy, display:"flex", alignItems:"center",
      justifyContent:"space-between", padding:"0 32px", position:"sticky",
      top:0, zIndex:100, flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:8,
          background:"linear-gradient(135deg,#1C7293,#E85D04)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontWeight:700, color:C.white, fontSize:13, letterSpacing:0.5 }}>BO</div>
        <span style={{ color:C.white, fontWeight:600, fontSize:17, letterSpacing:-0.3 }}>
          BOSS<span style={{ color:C.orange }}>Platform</span>
        </span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6,
        color:"rgba(255,255,255,.55)", fontSize:13 }}>
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          const label = typeof c === "string" ? c : c.label;
          const onClick = typeof c === "string" ? undefined : c.onClick;
          return (
            <span key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
              {i > 0 && <span style={{ color:"rgba(255,255,255,.3)" }}>›</span>}
              <span onClick={!isLast && onClick ? onClick : undefined}
                style={{ color: isLast ? "rgba(255,255,255,.9)" : undefined,
                  cursor: !isLast && onClick ? "pointer" : "default",
                  textDecoration: !isLast && onClick ? "none" : "none" }}
                onMouseEnter={e => { if (!isLast && onClick) e.target.style.textDecoration = "underline"; }}
                onMouseLeave={e => { e.target.style.textDecoration = "none"; }}>
                {label}
              </span>
            </span>
          );
        })}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10,
        color:"rgba(255,255,255,.8)", fontSize:14 }}>
        <div style={{ width:32, height:32, borderRadius:"50%", background:C.teal,
          display:"flex", alignItems:"center", justifyContent:"center",
          color:C.white, fontWeight:600, fontSize:13 }}>RS</div>
        <span>Rohan Singh</span>
        <span style={{ color:"rgba(255,255,255,.4)" }}>▾</span>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────── */
function KPICard({ label, value, numericValue, formatter, trend, trendDir, sub, alert, onClick }) {
  const borderColor = alert === "red" ? C.danger : alert === "amber" ? C.warn : "transparent";
  const animated = useCountUp(numericValue ?? 0, 900);
  const displayVal = numericValue != null && formatter ? formatter(animated) : value;
  return (
    <div onClick={onClick} style={{ ...s.card, padding:"20px 22px",
      borderLeft: alert ? `4px solid ${borderColor}` : undefined,
      cursor: onClick ? "pointer" : "default",
      transition:"box-shadow .2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.12)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = s.card.boxShadow}>
      <div style={{ fontSize:11, fontWeight:600, letterSpacing:0.7,
        textTransform:"uppercase", color:C.g500, marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:30, fontWeight:700, letterSpacing:-1, lineHeight:1,
        color: alert === "red" ? C.danger : alert === "amber" ? C.warn : C.navy,
        marginBottom:8 }}>{displayVal}</div>
      {trend && (
        <div style={{ fontSize:13, display:"flex", alignItems:"center", gap:4,
          color: trendDir === "up" ? C.success : trendDir === "down" ? C.danger : C.g500 }}>
          {trendDir === "up" ? "▲" : trendDir === "down" ? "▼" : "↗"} {trend}
        </div>
      )}
      {sub && <div style={{ fontSize:12, color:C.g500, marginTop:4 }}>{sub}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   BUBBLE CHART TOOLTIP
───────────────────────────────────────────── */
function BubbleTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background:C.navy, color:C.white, padding:"10px 14px",
      borderRadius:8, fontSize:12, boxShadow:"0 4px 12px rgba(0,0,0,.3)" }}>
      <div style={{ fontWeight:700, marginBottom:4 }}>{d.name}</div>
      <div>Revenue: ${d.x}M</div>
      <div>Margin: {d.y}%</div>
      <div>SKUs: {d.z}</div>
      <div style={{ marginTop:4, fontWeight:600,
        color: d.y > 35 ? "#4ADE80" : d.y >= 25 ? C.warn : "#F87171" }}>
        {d.y > 35 ? "✓ Healthy" : d.y >= 25 ? "⚠ Warning" : "✗ At Risk"}
      </div>
    </div>
  );
}

function BubbleDot(props) {
  const { cx, cy, payload } = props;
  const r = Math.sqrt(payload.z / Math.PI) * 2.2;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={payload.fill} fillOpacity={0.82} stroke={payload.fill} strokeWidth={1.5} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize={10} fontWeight={700} fontFamily="DM Sans,sans-serif">
        {payload.name.length > 8 ? payload.name.slice(0, 7) + "…" : payload.name}
      </text>
    </g>
  );
}

/* ─────────────────────────────────────────────
   SCREEN 1: DASHBOARD
───────────────────────────────────────────── */
function Screen1({ onSimulate, onQueue, onInsightDetail, toast, onNavigateHome }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };
  const sortedParts = [...TABLE_PARTS].sort((a, b) => {
    if (!sortCol) return 0;
    let va, vb;
    if (sortCol === "margin") { va = a.margin; vb = b.margin; }
    else if (sortCol === "id") { va = a.id; vb = b.id; }
    else if (sortCol === "status") { va = a.statusType; vb = b.statusType; }
    else return 0;
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });
  const sortIcon = (col) => sortCol === col ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  return (
    <div style={{ flex:1 }}>
      <Nav crumbs={[
        { label:"Home", onClick: onNavigateHome },
        { label:"Pricing Intelligence" },
        "Dashboard"
      ]} />
      <div style={{ maxWidth:1440, margin:"0 auto", padding:"28px 32px 48px" }}>

        {/* Page Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:26, fontWeight:700, color:C.navy, letterSpacing:-0.5 }}>
              Pricing Intelligence Dashboard
            </div>
            <div style={{ fontSize:14, color:C.g500, marginTop:3 }}>
              Real-time margin monitoring & competitive intelligence · 1,400+ SKUs across 8 categories
            </div>
          </div>
          <div style={{ fontSize:12, color:C.g500, textAlign:"right", lineHeight:1.9 }}>
            <strong style={{ color:C.g600 }}>Last refreshed:</strong> Today, 09:14 AM<br />
            <strong style={{ color:C.g600 }}>Data source:</strong> ERP + Competitive Intel Feed<br />
            <span style={{ color:C.danger, fontWeight:600 }}>● Live</span>
          </div>
        </div>

        {/* KPI Row */}
        <div className="stagger-1" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
          <KPICard label="Total Revenue"       value="$12.45M" numericValue={12.45} formatter={v => `$${v.toFixed(2)}M`} trend="+8.2% vs. last quarter" trendDir="up"   sub="Portfolio weighted average" />
          <KPICard label="Average Margin"      value="34.2%"   numericValue={34.2}  formatter={v => `${v.toFixed(1)}%`}   trend="−1.5% vs. last quarter" trendDir="down" sub="Portfolio weighted average" />
          <KPICard label="Below Margin Floor"  value="18%"     numericValue={18}    formatter={v => `${Math.round(v)}%`}  trend="−3% improvement vs. last quarter" trendDir="up" sub="260 SKUs below 25% floor" alert="red" />
          <KPICard label="Pending Approvals"   value="7"       numericValue={7}     formatter={v => `${Math.round(v)}`}   trend="Click to open queue" trendDir="neutral" sub="Awaiting Pricing Director review" alert="amber" onClick={onQueue} />
        </div>

        {/* Two Col */}
        <div className="stagger-2" style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:20, marginBottom:24 }}>

          {/* Bubble Chart */}
          <div style={s.card}>
            <div style={s.panelHeader}>
              <div style={s.panelTitle}>Product Category Health — Revenue vs. Margin</div>
              <div style={s.panelSub}>Bubble size = SKU count · Click bubble for details</div>
            </div>
            <div style={{ ...s.panelBody, paddingBottom:10 }}>
              <ResponsiveContainer width="100%" height={310}>
                <ScatterChart margin={{ top:10, right:20, bottom:20, left:10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.g200} />
                  <XAxis dataKey="x" type="number" name="Revenue"
                    label={{ value:"Revenue ($M)", position:"insideBottom", offset:-8, fontSize:12, fill:C.g500 }}
                    domain={[0, 3.8]} tickFormatter={v => "$" + v + "M"}
                    tick={{ fontSize:11, fill:C.g500 }} />
                  <YAxis dataKey="y" type="number" name="Margin"
                    label={{ value:"Margin %", angle:-90, position:"insideLeft", fontSize:12, fill:C.g500 }}
                    domain={[0, 50]} tickFormatter={v => v + "%"}
                    tick={{ fontSize:11, fill:C.g500 }} />
                  <ZAxis dataKey="z" range={[400, 2400]} />
                  <Tooltip content={<BubbleTooltip />} />
                  <Scatter data={CATEGORY_DATA} shape={<BubbleDot />} />
                </ScatterChart>
              </ResponsiveContainer>
              <div style={{ display:"flex", gap:20, justifyContent:"center", marginTop:10 }}>
                {[["#0A8040","Healthy (>35%)"],["#F59E0B","Warning (25–35%)"],["#DC2626","At Risk (<25%)"]].map(([c,l]) => (
                  <span key={l} style={{ fontSize:12, display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ display:"inline-block", width:12, height:12, borderRadius:"50%", background:c }} />{l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div style={s.card}>
            <div style={s.panelHeader}>
              <div style={s.panelTitle}>✦ AI-Powered Insights</div>
              <div style={s.panelSub}>Opportunities ranked by $ impact</div>
            </div>
            <div style={s.panelBody}>
              {[
                { icon:"📈", title:"Price Increase Opportunity", finding:"15 Valve SKUs can support 3–5% increases based on competitive benchmarking", impact:"+$180K annual revenue", pos:true, insightKey:"price_increase",
                  detail:{ summary:"15 Valve SKUs identified with pricing power based on competitive gap analysis.", skus:["VAL-8402A","PKR-2500X","HSE-3301B"], recommendation:"Implement 3–5% increase on these SKUs to capture +$180K annual revenue while remaining below all competitors." } },
                { icon:"⚡", title:"Competitive Advantage Window", finding:"Competitors raised hose prices 8–12% in last 30 days — act before window closes", impact:"+$210K opportunity", pos:true, insightKey:"comp_window",
                  detail:{ summary:"Parker & Swagelok raised hose prices 8–12% in the last 30 days. Window to increase prices while remaining competitive.", skus:["HSE-3301B"], recommendation:"Increase hose prices 6–8% immediately. Even at +8%, Brennan remains the lowest-cost option." } },
                { icon:"⚠️", title:"Margin Leakage Risk", finding:"23 Adapter SKUs priced below cost floor due to outdated pricing from supplier cost increases", impact:"−$120K at risk", pos:false, border:C.danger, insightKey:"margin_leak",
                  detail:{ summary:"23 Adapter SKUs have not been repriced since supplier cost increases in Q4 2025.", skus:["ADP-7712C","REG-5504D"], recommendation:"Immediate repricing required. Bulk price adjustment to restore 25%+ margin floor across all 23 SKUs." } },
                { icon:"📊", title:"Discount Overuse Alert", finding:"Fittings discounts increased from 8% to 14% in Q1 without approval", impact:"−$95K erosion", pos:false, border:C.warn, insightKey:"discount_overuse",
                  detail:{ summary:"Fittings category average discount increased from 8% to 14% in Q1 without pricing approval. Sales team is over-discounting to win deals.", skus:["PKR-2500X"], recommendation:"Implement discount caps at 10% for Fittings. Any discount >10% requires Pricing Director approval." } },
              ].map((a, i) => (
                <div key={i} style={{ padding:"12px 14px", borderRadius:6, border:`1px solid ${a.border || C.g200}`,
                  marginBottom:10, transition:"box-shadow .15s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.09)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  <div style={{ display:"flex", gap:8, marginBottom:5 }}>
                    <span style={{ fontSize:17 }}>{a.icon}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:C.navy }}>{a.title}</span>
                  </div>
                  <div style={{ fontSize:12, color:C.g600, lineHeight:1.5, marginBottom:8 }}>{a.finding}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:12, fontWeight:600, color: a.pos ? C.success : C.danger }}>{a.impact}</span>
                    <button onClick={() => onInsightDetail(a)}
                      style={{ fontSize:12, fontWeight:500, color:C.teal, background:"none",
                        border:"none", cursor:"pointer", textDecoration:"underline" }}>
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ background:"linear-gradient(135deg,#e0f4fb,#f0fdf4)",
                border:`1px solid ${C.teal}`, borderRadius:6, padding:"12px 16px",
                textAlign:"center", fontSize:14, fontWeight:600, color:C.teal, marginTop:4 }}>
                Total Identified Opportunity: <span style={{ fontSize:20, color:C.navy }}>$390K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="stagger-3" style={{ ...s.card }}>
          <div style={{ ...s.panelHeader, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={s.panelTitle}>Products Below Margin Floor</div>
              <div style={s.panelSub}>5 worst-performing SKUs requiring immediate attention</div>
            </div>
            <div style={{ fontSize:12, color:C.g500, textAlign:"right" }}>
              Data as of Today, 09:14 AM<br />
              <span style={{ color:C.danger, fontWeight:600 }}>● Live</span>
            </div>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:C.teal }}>
                  {[
                    { key:"id", label:"Part #", align:"left" },
                    { key:null, label:"Category", align:"left" },
                    { key:null, label:"Description", align:"left" },
                    { key:"margin", label:"Current Margin", align:"right" },
                    { key:"status", label:"Guardrail Status", align:"left" },
                    { key:null, label:"vs. Competitor Avg", align:"right" },
                    { key:null, label:"Action", align:"center" },
                  ].map(h => (
                    <th key={h.label} className={h.key ? "sortable" : ""} onClick={h.key ? () => toggleSort(h.key) : undefined}
                      style={{ color:C.white, fontSize:12, fontWeight:600,
                      textAlign: h.align,
                      padding:"12px 16px", letterSpacing:0.3 }}>{h.label}{h.key ? sortIcon(h.key) : ""}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedParts.map((p, i) => {
                  const part = PARTS[p.id];
                  return (
                    <tr key={p.id} onClick={() => onSimulate(p.id)} style={{ borderBottom:`1px solid ${C.g200}`,
                      background: i % 2 === 1 ? C.g100 : C.white, cursor:"pointer", transition:"background .1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.g200}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? C.g100 : C.white}>
                      <td style={{ padding:"13px 16px" }}>
                        <span style={{ color:C.teal, fontWeight:600, fontSize:13 }}>{p.id}</span>
                      </td>
                      <td style={{ padding:"13px 16px" }}><Badge>{part.category}</Badge></td>
                      <td style={{ padding:"13px 16px", maxWidth:220, overflow:"hidden",
                        textOverflow:"ellipsis", whiteSpace:"nowrap", fontSize:13 }}
                        title={part.desc}>{part.desc}</td>
                      <td style={{ padding:"13px 16px", textAlign:"right", fontVariantNumeric:"tabular-nums",
                        fontWeight:600, color: p.statusType === "red" ? C.danger : "#92400E", fontSize:13 }}>
                        {p.statusType === "red" ? "🔴" : "🟡"} {p.margin}%
                      </td>
                      <td style={{ padding:"13px 16px" }}>
                        <Badge type={p.statusType}>{p.status}</Badge>
                      </td>
                      <td style={{ padding:"13px 16px", textAlign:"right", fontSize:13, fontWeight:600,
                        color: p.compType === "pos" ? C.success : p.compType === "neg" ? C.danger : C.g600 }}>
                        {p.comp}
                      </td>
                      <td style={{ padding:"13px 16px", textAlign:"center" }}>
                        <Btn size="sm" onClick={e => { e.stopPropagation(); onSimulate(p.id); }}>
                          Simulate
                        </Btn>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"14px 22px", borderTop:`1px solid ${C.g200}`,
            display:"flex", alignItems:"center", justifyContent:"space-between",
            background:C.g100, fontSize:12, color:C.g500 }}>
            <div style={{ display:"flex", gap:10 }}>
              <Btn variant="secondary" size="sm" onClick={() => toast("success","Margin analysis report generated")}>📊 Run Margin Analysis</Btn>
              <Btn variant="secondary" size="sm" onClick={() => toast("success","Risk report exported as PDF")}>📄 Export Risk Report</Btn>
              <Btn size="sm" onClick={() => toast("success","Review meeting scheduled — Tuesday 2:00 PM")}>📅 Schedule Review</Btn>
            </div>
            <span>Showing 5 of 260 SKUs below floor</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPETITIVE SPECTRUM
───────────────────────────────────────────── */
function CompetitiveSpectrum({ part, netPrice }) {
  const allPrices = part.competitors.map(c => c.price).concat([part.listPrice, netPrice]);
  const minP = Math.min(...allPrices) * 0.94;
  const maxP = Math.max(...allPrices) * 1.06;
  const pct  = v => ((v - minP) / (maxP - minP) * 100);

  const diffFromAvg = ((netPrice - part.marketAvg) / part.marketAvg * 100).toFixed(0);
  const narrative = netPrice < part.marketAvg
    ? `Proposed $${netPrice.toFixed(2)} is ${Math.abs(diffFromAvg)}% below market average — compelling value with 1–2 day delivery & lowest MOQ.`
    : `Proposed $${netPrice.toFixed(2)} is ${diffFromAvg}% above market average — monitor volume impact closely.`;

  return (
    <div style={{ marginTop:20 }}>
      <div style={{ fontSize:12, fontWeight:600, textTransform:"uppercase",
        letterSpacing:0.5, color:C.g500, marginBottom:4 }}>Price Positioning Map</div>
      <div style={{ position:"relative", height:90, margin:"0 10px" }}>
        {/* Track */}
        <div style={{ position:"absolute", top:45, left:0, right:0, height:10, borderRadius:5,
          background:`linear-gradient(to right,${C.danger},${C.warn},${C.success})` }} />
        {/* Avg line */}
        <div style={{ position:"absolute", left:`${pct(part.marketAvg)}%`, top:30,
          width:2, height:30, background:C.navy, borderStyle:"dashed" }}>
          <div style={{ position:"absolute", bottom:"100%", left:"50%", transform:"translateX(-50%)",
            fontSize:9, color:C.navy, fontWeight:700, whiteSpace:"nowrap",
            background:C.white, padding:"1px 4px", border:`1px solid ${C.g300}`, borderRadius:3 }}>
            Avg ${part.marketAvg.toFixed(0)}
          </div>
        </div>
        {/* Competitor dots */}
        {part.competitors.map(c => (
          <div key={c.name} style={{ position:"absolute", left:`${pct(c.price)}%`,
            top:36, transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ fontSize:8, fontWeight:700, color:C.g600, marginBottom:3,
              whiteSpace:"nowrap", position:"absolute", bottom:"100%", marginBottom:4 }}>
              {c.name.split(" ")[0]}
            </div>
            <div style={{ width:16, height:16, borderRadius:"50%", background:c.color,
              border:"2px solid white", boxShadow:"0 1px 4px rgba(0,0,0,.25)", marginTop:2 }} />
            <div style={{ fontSize:9, color:C.navy, marginTop:3, fontWeight:600,
              fontFamily:"DM Mono,monospace" }}>${c.price.toFixed(0)}</div>
          </div>
        ))}
        {/* Brennan current */}
        <div style={{ position:"absolute", left:`${pct(part.listPrice)}%`,
          top:36, transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ fontSize:8, fontWeight:700, color:C.g500, position:"absolute",
            bottom:"100%", marginBottom:4, whiteSpace:"nowrap" }}>Current</div>
          <div style={{ width:14, height:14, borderRadius:"50%", background:C.g400,
            border:"2px solid white", boxShadow:"0 1px 4px rgba(0,0,0,.2)", marginTop:2 }} />
        </div>
        {/* Brennan proposed */}
        <div style={{ position:"absolute", left:`${pct(netPrice)}%`,
          top:34, transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ width:18, height:18, background:C.teal, transform:"rotate(45deg)",
            border:"2px solid white", boxShadow:"0 2px 6px rgba(0,0,0,.3)", borderRadius:2, marginTop:2 }} />
          <div style={{ fontSize:9, color:C.teal, marginTop:5, fontWeight:700,
            fontFamily:"DM Mono,monospace", whiteSpace:"nowrap" }}>${netPrice.toFixed(2)}</div>
        </div>
      </div>
      <div style={{ fontSize:13, color:C.g600, lineHeight:1.6, padding:"10px 14px",
        background:C.g100, borderRadius:6, marginTop:8 }}>{narrative}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCREEN 2: PRICE SIMULATION
───────────────────────────────────────────── */
function Screen2({ selectedPart, onBack, onApprove, toast, onNavigateHome }) {
  const [partId, setPartId] = useState(selectedPart || "PKR-2500X");
  const [price, setPrice] = useState(PARTS[partId].listPrice);
  const [disc,  setDisc]  = useState(0);

  useEffect(() => {
    const p = PARTS[partId];
    setPrice(p.listPrice);
    setDisc(0);
  }, [partId]);

  useEffect(() => { setPartId(selectedPart || "PKR-2500X"); }, [selectedPart]);

  const part    = PARTS[partId];
  const netP    = price * (1 - disc / 100);
  const mgrD    = netP - part.cogs;
  const mgrPct  = (mgrD / netP) * 100;
  const oldNet  = part.listPrice;
  const oldMgrAmt = oldNet - part.cogs;
  const oldMgrPct = (oldMgrAmt / oldNet) * 100;
  const aboveFloor = mgrPct >= part.floor;

  const fmt$  = v => "$" + Math.abs(v).toFixed(2);
  const fmtPct = v => v.toFixed(1) + "%";
  const sign  = v => v >= 0 ? "+" : "−";
  const clr   = v => v >= 0 ? C.success : C.danger;

  const trendData = TREND_DATA.map(d => ({
    ...d,
    b: part.listPrice,
    p: d.p * (part.listPrice / 42),
    s: d.s * (part.listPrice / 42),
  }));

  const ResultRow = ({ label, cur, prop, chg, chgVal, isHighlight }) => (
    <tr style={{ borderBottom:`1px solid ${C.g200}`,
      background: isHighlight ? C.g100 : "transparent" }}>
      <td style={{ padding:"9px 0", fontSize:13,
        color: isHighlight ? C.navy : C.g500, fontWeight: isHighlight ? 700 : 400 }}>{label}</td>
      <td style={{ padding:"9px 0", textAlign:"right", fontSize:13, fontVariantNumeric:"tabular-nums" }}>{cur}</td>
      <td style={{ padding:"9px 0", textAlign:"right", fontSize:13, fontVariantNumeric:"tabular-nums",
        fontWeight: isHighlight ? 700 : 500, color: isHighlight ? C.navy : C.g700 }}>{prop}</td>
      <td style={{ padding:"9px 0", textAlign:"right", fontSize:12,
        color: chgVal === 0 ? C.g500 : clr(chgVal), fontWeight:600 }}>{chg}</td>
    </tr>
  );

  return (
    <div style={{ flex:1 }}>
      <Nav crumbs={[
        { label:"Home", onClick: onNavigateHome },
        { label:"Pricing Intelligence", onClick: onBack },
        "Price Simulation"
      ]} />
      <div style={{ maxWidth:1440, margin:"0 auto", padding:"28px 32px 48px" }}>

        <button onClick={onBack}
          style={{ display:"inline-flex", alignItems:"center", gap:6,
            color:C.teal, fontSize:14, fontWeight:500, cursor:"pointer",
            background:"none", border:"none", marginBottom:14 }}>
          ← Back to Dashboard
        </button>

        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:26, fontWeight:700, color:C.navy, letterSpacing:-0.5 }}>
            Price Simulation & Competitive Analysis
          </div>
          <div style={{ fontSize:14, color:C.g500, marginTop:3 }}>
            Select a part, adjust pricing, and see real-time margin & competitive impact
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"290px 1fr", gap:20 }}>

          {/* PART SELECTOR */}
          <div>
            <div style={{ ...s.card, position:"sticky", top:80 }}>
              <div style={s.panelHeader}>
                <div style={s.panelTitle}>Select Part</div>
                <div style={s.panelSub}>Click to load simulation</div>
              </div>
              <div style={{ padding:14 }}>
                {Object.entries(PARTS).map(([id, p]) => {
                  const isActive = id === partId;
                  const mColor = p.margin < 25 ? C.danger : "#92400E";
                  return (
                    <div key={id} style={{ border:`1px solid ${isActive ? C.teal : C.g300}`,
                      borderRadius:6, marginBottom:8, overflow:"hidden",
                      background: isActive ? "#E0F4FB" : C.white, cursor:"pointer",
                      transition:"border-color .15s" }}
                      onClick={() => setPartId(id)}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 13px" }}>
                        <div style={{ width:18, height:18, borderRadius:"50%",
                          border:`2px solid ${isActive ? C.teal : C.g400}`,
                          background: isActive ? C.teal : "transparent",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          flexShrink:0 }}>
                          {isActive && <div style={{ width:6, height:6, borderRadius:"50%", background:C.white }} />}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:C.navy }}>{id}</div>
                          <div style={{ fontSize:11, color:C.g500 }}>{p.category}</div>
                        </div>
                        <Badge type={p.margin < 25 ? "red" : "amber"}>{p.margin}%</Badge>
                      </div>
                      {isActive && (
                        <div style={{ padding:"10px 13px", background:C.g100, borderTop:`1px solid ${C.g200}` }}>
                          {[["List Price",`$${p.listPrice.toFixed(2)}`],["COGS",`$${p.cogs.toFixed(2)}`],
                            ["Margin",`${p.margin}% ${p.margin<25?"🔴":"🟡"}`],["Floor",`${p.floor}%`],
                            ["Material", p.material], ["Pressure", p.pressureRating],
                            ["Thread", p.threadType], ["Temp Range", p.tempRange]]
                            .map(([l,v]) => (
                              <div key={l} style={{ display:"flex", justifyContent:"space-between",
                                fontSize:12, padding:"4px 0", borderBottom:`1px solid ${C.g200}` }}>
                                <span style={{ color:C.g500 }}>{l}</span>
                                <span style={{ fontWeight:500, color:C.navy }}>{v}</span>
                              </div>
                            ))}
                          {p.certs && (
                            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:6 }}>
                              {p.certs.map(c => <Badge key={c} type="teal">{c}</Badge>)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SIMULATION PANELS */}
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

            {/* INPUTS & RESULTS */}
            <div style={s.card}>
              <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.g200}`,
                background:"linear-gradient(to right,#F8FBFF,#FFFFFF)" }}>
                <div style={{ fontSize:14, fontWeight:600, color:C.navy }}>
                  Simulating: <strong>{partId}</strong> — {part.desc}
                </div>
                <div style={{ fontSize:12, color:C.g500, marginTop:2 }}>
                  Current margin {part.margin}% · {(part.floor - part.margin).toFixed(1)} pts below {part.floor}% floor
                </div>
              </div>
              <div style={{ padding:"18px 22px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase",
                      letterSpacing:0.5, color:C.g600, marginBottom:6 }}>New List Price ($)</div>
                    <InputStepper value={price} onChange={v => setPrice(parseFloat(v.toFixed(2)))}
                      min={1} max={500} step={0.5} prefix="$" />
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase",
                      letterSpacing:0.5, color:C.g600, marginBottom:6 }}>Discount (%)</div>
                    <InputStepper value={disc} onChange={setDisc} min={0} max={30} step={1} />
                  </div>
                </div>

                <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase",
                  letterSpacing:0.5, color:C.g500, marginBottom:10 }}>Projected Results</div>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid ${C.g200}` }}>
                      {["Metric","Current","Proposed","Change"].map(h => (
                        <th key={h} style={{ fontSize:11, color:C.g500, fontWeight:600,
                          textTransform:"uppercase", letterSpacing:0.4,
                          textAlign: h === "Metric" ? "left" : "right",
                          paddingBottom:8 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <ResultRow label="List Price"
                      cur={`$${part.listPrice.toFixed(2)}`} prop={`$${price.toFixed(2)}`}
                      chg={price === part.listPrice ? "—" : `${sign(price-part.listPrice)}$${Math.abs(price-part.listPrice).toFixed(2)}`}
                      chgVal={price - part.listPrice} />
                    <ResultRow label="Discount %"
                      cur="0%" prop={disc + "%"}
                      chg={disc ? `+${disc}%` : "—"} chgVal={-disc} />
                    <ResultRow label="Net Price"
                      cur={`$${oldNet.toFixed(2)}`} prop={`$${netP.toFixed(2)}`}
                      chg={netP === oldNet ? "—" : `${sign(netP-oldNet)}$${Math.abs(netP-oldNet).toFixed(2)}`}
                      chgVal={netP - oldNet} />
                    <ResultRow label="COGS"
                      cur={`$${part.cogs.toFixed(2)}`} prop={`$${part.cogs.toFixed(2)}`}
                      chg="—" chgVal={0} />
                    <ResultRow label="Margin $" isHighlight
                      cur={`$${oldMgrAmt.toFixed(2)}`} prop={`$${mgrD.toFixed(2)}`}
                      chg={`${sign(mgrD-oldMgrAmt)}$${Math.abs(mgrD-oldMgrAmt).toFixed(2)}`}
                      chgVal={mgrD - oldMgrAmt} />
                    <ResultRow label="Margin %" isHighlight
                      cur={fmtPct(oldMgrPct)} prop={fmtPct(mgrPct)}
                      chg={`${sign(mgrPct-oldMgrPct)}${Math.abs(mgrPct-oldMgrPct).toFixed(1)} pts`}
                      chgVal={mgrPct - oldMgrPct} />
                  </tbody>
                </table>

                {/* Margin Alert */}
                <div style={{ borderRadius:6, padding:"12px 16px", marginTop:14,
                  display:"flex", alignItems:"flex-start", gap:10,
                  background: aboveFloor ? "#F0FDF4" : "#FEF2F2",
                  border: `1px solid ${aboveFloor ? "#BBF7D0" : "#FECACA"}`,
                  borderLeft: `4px solid ${aboveFloor ? C.success : C.danger}` }}>
                  <span style={{ fontSize:18 }}>{aboveFloor ? "✅" : "🔴"}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:3,
                      color: aboveFloor ? C.success : C.danger }}>
                      {aboveFloor ? "Above Margin Floor — Apply immediately" : "Below Margin Floor — Approval required"}
                    </div>
                    <div style={{ fontSize:12, color:C.g700 }}>
                      {aboveFloor
                        ? `Proposed margin ${fmtPct(mgrPct)} is ${(mgrPct-part.floor).toFixed(1)} pts above the ${part.floor}% floor.`
                        : `Margin ${fmtPct(mgrPct)} is ${(part.floor-mgrPct).toFixed(1)} pts below the ${part.floor}% floor.`}
                    </div>
                  </div>
                </div>

                {/* Revenue Impact */}
                <div style={{ marginTop:18 }}>
                  <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase",
                    letterSpacing:0.5, color:C.g500, marginBottom:10 }}>Revenue Impact Analysis</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                    {[
                      { label:"Monthly (Current)", val:`$${(part.units * oldNet).toFixed(0)}`, sub:`${part.units} units @ $${oldNet.toFixed(2)}` },
                      { label:"Monthly (Proposed)", val:`$${(part.units * netP).toFixed(0)}`,
                        sub: (() => { const d = part.units*(netP-oldNet); return `${d>=0?"+":""}$${d.toFixed(0)}`; })(),
                        subColor: (part.units*(netP-oldNet))>=0 ? C.success : C.danger },
                      { label:"Annual Impact",
                        val: (() => { const d = part.units*(netP-oldNet)*12; return `${d>=0?"+":""}$${Math.abs(d).toFixed(0)}`; })(),
                        valColor: (part.units*(netP-oldNet)*12)>=0 ? C.success : C.danger,
                        sub:"projected change" },
                    ].map(c => (
                      <div key={c.label} style={{ background:C.g100, borderRadius:6,
                        padding:"12px", textAlign:"center" }}>
                        <div style={{ fontSize:11, color:C.g500, textTransform:"uppercase",
                          letterSpacing:0.4, marginBottom:4 }}>{c.label}</div>
                        <div style={{ fontSize:16, fontWeight:700,
                          color: c.valColor || C.navy }}>{c.val}</div>
                        <div style={{ fontSize:12, marginTop:2,
                          color: c.subColor || C.g500 }}>{c.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:11, color:C.g400, marginTop:8 }}>
                    Based on 12-month average of {part.units} units/month. Actual impact may vary.
                  </div>
                </div>
              </div>
            </div>

            {/* AI RECOMMENDATION */}
            <div style={{ background:"linear-gradient(135deg,#EFF9FF,#F0FDF4)",
              border:`1px solid #BAE6FD`, borderRadius:8, padding:"18px 20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <span style={{ background:C.teal, color:C.white, fontSize:10, fontWeight:700,
                  letterSpacing:0.7, padding:"3px 8px", borderRadius:12 }}>✦ AI INSIGHT</span>
                <span style={{ fontSize:14, fontWeight:700, color:C.navy }}>{part.ai.title}</span>
              </div>
              <div style={{ fontSize:13, color:C.g700, lineHeight:1.65 }}
                dangerouslySetInnerHTML={{ __html: part.ai.body }} />
              <ul style={{ margin:"10px 0 0 4px", listStyle:"none" }}>
                {part.ai.bullets.map(b => (
                  <li key={b} style={{ fontSize:12, color:C.g600, marginBottom:5,
                    paddingLeft:14, position:"relative" }}>
                    <span style={{ position:"absolute", left:0, color:C.teal }}>•</span>{b}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop:10, display:"inline-block",
                background: part.ai.tagColor, color: part.ai.tagColor === C.warn ? C.navy : C.white,
                fontSize:11, fontWeight:700, letterSpacing:0.5,
                padding:"4px 12px", borderRadius:12 }}>
                {part.ai.tagLabel}
              </div>
            </div>

            {/* COMPETITOR TABLE */}
            <div style={s.card}>
              <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.g200}`,
                background:"linear-gradient(to right,#F8FBFF,#FFFFFF)" }}>
                <div style={s.panelTitle}>Competitive Benchmark — How You Compare</div>
                <div style={s.panelSub}>Data as of Today · competitive intelligence feed</div>
              </div>
              <div style={{ padding:"16px 22px" }}>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:C.navy }}>
                        {["Competitor","Price","vs. Brennan","Delivery","Availability","Rating","MOQ"].map(h => (
                          <th key={h} style={{ color:C.white, fontSize:11, fontWeight:600,
                            textAlign: h === "Competitor" ? "left" : "right",
                            padding:"10px 12px", letterSpacing:0.3 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {part.competitors.map((c, i) => {
                        const diff = ((c.price - part.listPrice) / part.listPrice * 100);
                        return (
                          <tr key={c.name} style={{ borderBottom:`1px solid ${C.g200}`,
                            background: i % 2 ? C.g100 : C.white }}>
                            <td style={{ padding:"10px 12px", fontSize:12, display:"flex", alignItems:"center", gap:7 }}>
                              <span style={{ width:10, height:10, borderRadius:"50%",
                                background:c.color, display:"inline-block", flexShrink:0 }} />
                              {c.name}
                            </td>
                            <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12,
                              fontVariantNumeric:"tabular-nums" }}>${c.price.toFixed(2)}</td>
                            <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12,
                              fontWeight:600, color: diff > 0 ? C.success : C.danger }}>
                              {diff > 0 ? "+" : ""}{diff.toFixed(0)}%
                            </td>
                            <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>{c.delivery}</td>
                            <td style={{ padding:"10px 12px", textAlign:"right" }}>
                              <Badge type={c.avail === "In Stock" ? "green" : "amber"}>{c.avail}</Badge>
                            </td>
                            <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>⭐ {c.rating}</td>
                            <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>{c.moq}u</td>
                          </tr>
                        );
                      })}
                      {/* Market avg */}
                      <tr style={{ background:C.g200, fontWeight:600 }}>
                        <td style={{ padding:"10px 12px", fontSize:12 }} colSpan={1}>Market Average</td>
                        <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>${part.marketAvg.toFixed(2)}</td>
                        <td colSpan={5} />
                      </tr>
                      {/* Brennan current */}
                      <tr style={{ background:"#E0F4FB" }}>
                        <td style={{ padding:"10px 12px", fontSize:12, fontWeight:700, color:C.teal }}>⬥ Brennan (Current)</td>
                        <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>${part.listPrice.toFixed(2)}</td>
                        <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12, color:C.teal, fontWeight:600 }}>—</td>
                        <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>1–2 days</td>
                        <td style={{ padding:"10px 12px", textAlign:"right" }}><Badge type="green">In Stock</Badge></td>
                        <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>⭐ 4.7</td>
                        <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>1u</td>
                      </tr>
                      {/* Brennan proposed */}
                      <tr style={{ background:"#E0F4FB", fontWeight:600 }}>
                        <td style={{ padding:"10px 12px", fontSize:12, fontWeight:700, color:C.tealDark }}>⬥ Brennan (Proposed)</td>
                        <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>${netP.toFixed(2)}</td>
                        <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12, fontWeight:600,
                          color: netP < part.marketAvg ? C.success : C.danger }}>
                          {((netP-part.marketAvg)/part.marketAvg*100).toFixed(0)}% vs Avg
                        </td>
                        <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>1–2 days</td>
                        <td style={{ padding:"10px 12px", textAlign:"right" }}><Badge type="green">In Stock</Badge></td>
                        <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>⭐ 4.7</td>
                        <td style={{ padding:"10px 12px", textAlign:"right", fontSize:12 }}>1u</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Spectrum */}
                <CompetitiveSpectrum part={part} netPrice={netP} />

                {/* Trend Chart */}
                <div style={{ marginTop:20 }}>
                  <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase",
                    letterSpacing:0.5, color:C.g500, marginBottom:10 }}>12-Week Price Trend</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={trendData} margin={{ top:5, right:10, bottom:5, left:0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.g200} />
                      <XAxis dataKey="w" tick={{ fontSize:10, fill:C.g500 }} />
                      <YAxis tickFormatter={v => "$" + v.toFixed(0)} tick={{ fontSize:10, fill:C.g500 }} />
                      <Tooltip formatter={(v, n) => [`$${v.toFixed(2)}`, n === "b" ? "Brennan" : n === "p" ? "Parker" : "Swagelok"]} />
                      <Legend formatter={n => n === "b" ? "Brennan" : n === "p" ? "Parker" : "Swagelok"}
                        wrapperStyle={{ fontSize:11 }} />
                      <Line type="monotone" dataKey="b" stroke={C.teal} strokeWidth={2.5} dot={{ r:3 }} name="b" />
                      <Line type="monotone" dataKey="p" stroke={C.parker} strokeWidth={1.5} dot={{ r:2 }} strokeDasharray="4 3" name="p" />
                      <Line type="monotone" dataKey="s" stroke={C.swagelok} strokeWidth={1.5} dot={{ r:2 }} strokeDasharray="4 3" name="s" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ display:"flex", gap:12, justifyContent:"flex-end", paddingTop:4 }}>
              <Btn variant="secondary" onClick={() => toast("success","Comparison report exported as CSV")}>
                📥 Export Report
              </Btn>
              <Btn variant="secondary" onClick={() => toast("success","Draft saved — return anytime")}>
                💾 Save as Draft
              </Btn>
              <Btn onClick={() => onApprove({ partId, price, disc, netP, mgrPct, part, aboveFloor })}>
                {aboveFloor ? "Apply Pricing Changes →" : "Request Approval →"}
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   APPROVAL MODAL
───────────────────────────────────────────── */
function ApprovalModal({ open, data, onClose, onSubmit }) {
  const [just, setJust] = useState(
    "Competitive response to Parker Hannifin price reduction announced last week. This pricing allows us to maintain market share in a critical product category while remaining below all major competitors. Volume increase expected to offset margin reduction."
  );
  if (!data) return null;
  const { partId, price, disc, netP, mgrPct, part } = data;
  const oldMgr = ((part.listPrice - part.cogs) / part.listPrice * 100);
  const canSubmit = just.trim().length >= 50;

  const SummaryRow = ({ label, cur, prop, chg, red }) => (
    <tr style={{ borderBottom:`1px solid ${C.g200}` }}>
      <td style={{ padding:"9px 12px", fontSize:13 }}>{label}</td>
      <td style={{ padding:"9px 12px", textAlign:"right", fontSize:13, fontVariantNumeric:"tabular-nums" }}>{cur}</td>
      <td style={{ padding:"9px 12px", textAlign:"right", fontSize:13, fontVariantNumeric:"tabular-nums" }}>{prop}</td>
      <td style={{ padding:"9px 12px", textAlign:"right", fontSize:13, fontWeight:600,
        color: red ? C.danger : C.g700 }}>{chg}</td>
    </tr>
  );

  return (
    <Modal open={open} onClose={onClose} width={660}>
      <ModalHeader icon="⚠️" title="Pricing Change Approval Required"
        subtitle={`This pricing is below the ${part.floor}% margin floor and requires Pricing Director sign-off`}
        onClose={onClose} />
      <div style={{ padding:"22px 26px" }}>
        <div style={{ fontSize:12, fontWeight:600, textTransform:"uppercase",
          letterSpacing:0.4, color:C.navy, marginBottom:10 }}>
          Proposed Change — {partId}
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
          <thead>
            <tr style={{ background:C.g100 }}>
              {["Field","Current","Proposed","Change"].map(h => (
                <th key={h} style={{ fontSize:11, fontWeight:600, textTransform:"uppercase",
                  letterSpacing:0.4, color:C.g500, textAlign: h === "Field" ? "left" : "right",
                  padding:"8px 12px", borderBottom:`1px solid ${C.g200}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SummaryRow label="List Price" cur={`$${part.listPrice.toFixed(2)}`} prop={`$${price.toFixed(2)}`}
              chg={`${price >= part.listPrice ? "+" : ""}$${(price - part.listPrice).toFixed(2)}`} />
            <SummaryRow label="Discount" cur="0%" prop={`${disc}%`} chg={disc ? `+${disc}%` : "—"} />
            <SummaryRow label="Net Price" cur={`$${part.listPrice.toFixed(2)}`} prop={`$${netP.toFixed(2)}`}
              chg={`${netP >= part.listPrice ? "+" : ""}$${(netP - part.listPrice).toFixed(2)}`} />
            <SummaryRow label="Margin %" cur={`${oldMgr.toFixed(1)}%`}
              prop={<span style={{ color:C.danger, fontWeight:700 }}>{mgrPct.toFixed(1)}% 🔴</span>}
              chg={`${(mgrPct - oldMgr).toFixed(1)} pts`} red />
          </tbody>
        </table>

        <div style={{ borderRadius:6, padding:"12px 16px", marginBottom:16,
          background:"#FEF2F2", border:`1px solid #FECACA`, borderLeft:`4px solid ${C.danger}`,
          display:"flex", gap:10 }}>
          <span style={{ fontSize:18 }}>🔴</span>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:C.danger, marginBottom:3 }}>
              {(part.floor - mgrPct).toFixed(1)} pts below the {part.floor}% margin floor
            </div>
            <div style={{ fontSize:12, color:C.g700 }}>
              Changes below floor are reviewed by Pricing Director within 24–48 hours.
            </div>
          </div>
        </div>

        <div style={{ fontSize:13, fontWeight:600, color:C.navy, marginBottom:6 }}>
          Justification <span style={{ color:C.danger }}>*</span>
          <span style={{ fontSize:11, color:C.g500, fontWeight:400, marginLeft:6 }}>(min 50 characters)</span>
        </div>
        <textarea value={just} onChange={e => setJust(e.target.value)} maxLength={500}
          style={{ width:"100%", border:`1px solid ${C.g400}`, borderRadius:6,
            padding:12, fontSize:13, color:C.g700, lineHeight:1.55, resize:"vertical",
            minHeight:90, outline:"none", fontFamily:"inherit" }}
          onFocus={e => { e.target.style.borderColor = C.teal; e.target.style.boxShadow = `0 0 0 3px rgba(28,114,147,.15)`; }}
          onBlur={e => { e.target.style.borderColor = C.g400; e.target.style.boxShadow = "none"; }} />
        <div style={{ fontSize:11, color:C.g400, textAlign:"right", marginTop:4 }}>
          {just.length}/500 · {just.trim().length < 50 &&
            <span style={{ color:C.danger }}>Need {50 - just.trim().length} more characters</span>}
        </div>

        <div style={{ marginTop:16 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.navy, marginBottom:10 }}>Approval Workflow</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            {[["active","👤 You (Pricing Manager)"],["","👩‍💼 Sarah Chen (Director)"],["","✅ Decision"]].map(([type, label], i) => (
              <>
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6,
                  background: type === "active" ? C.teal : C.g100,
                  border: `1px solid ${type === "active" ? C.teal : C.g300}`,
                  borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:500,
                  color: type === "active" ? C.white : C.navy }}>{label}</div>
                {i < 2 && <span style={{ color:C.g400 }}>→</span>}
              </>
            ))}
          </div>
          <div style={{ fontSize:12, color:C.g500, marginTop:10 }}>
            📧 schen@brennanindustries.com receives email + Slack notification immediately<br />
            ⏱ Expected review: 24–48 hours (weekdays)
          </div>
        </div>
      </div>
      <div style={{ padding:"16px 26px", borderTop:`1px solid ${C.g200}`,
        display:"flex", alignItems:"center", justifyContent:"flex-end", gap:12 }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn variant="secondary" onClick={onClose}>Save as Draft</Btn>
        <Btn onClick={() => canSubmit && onSubmit()} disabled={!canSubmit}>Submit for Approval →</Btn>
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   SUCCESS MODAL
───────────────────────────────────────────── */
function SuccessModal({ open, partId, onQueue, onDashboard }) {
  return (
    <Modal open={open} onClose={onDashboard} width={540}>
      <div style={{ padding:"40px 32px", textAlign:"center" }}>
        <div className="pop-anim" style={{ fontSize:56, marginBottom:16 }}>✅</div>
        <div style={{ fontSize:22, fontWeight:700, color:C.navy, marginBottom:8 }}>
          Pricing Change Submitted!
        </div>
        <div style={{ fontSize:14, color:C.g600, lineHeight:1.6, marginBottom:20 }}>
          Your pricing change for <strong>{partId}</strong> has been sent to<br />
          <strong>Sarah Chen</strong> (Pricing Director) for review.
        </div>
        <div style={{ background:C.g100, border:`1px solid ${C.g300}`, borderRadius:6,
          padding:"10px 18px", fontSize:13, fontFamily:"DM Mono,monospace",
          color:C.navy, display:"inline-block", marginBottom:20 }}>
          Tracking #: PRC-2026-03-24-001
        </div>
        <div style={{ background:C.g100, borderRadius:8, padding:"18px 20px",
          textAlign:"left", marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.navy, marginBottom:10 }}>What happens next:</div>
          <ol style={{ paddingLeft:18 }}>
            {["Sarah receives email + Slack notification immediately",
              "She reviews competitive analysis & your justification",
              "Decision typically within 24–48 hours",
              "You'll be notified when approved or rejected",
              "If approved, pricing syncs to CRM automatically"].map((s, i) => (
                <li key={i} style={{ fontSize:13, color:C.g600, marginBottom:6, lineHeight:1.5 }}>{s}</li>
              ))}
          </ol>
        </div>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <Btn variant="secondary" onClick={onQueue}>View Approval Queue</Btn>
          <Btn onClick={onDashboard}>Return to Dashboard</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   QUEUE MODAL
───────────────────────────────────────────── */
function QueueModal({ open, onClose, toast }) {
  const [rows, setRows] = useState([
    { id:"PKR-2500X", by:"R. Singh",  date:"Today 09:14", impact:"18.2%→15.2%", just:"Competitive response to Parker Hannifin price reduction. Maintaining market share in critical category.", status:"amber", label:"Pending" },
    { id:"ADP-7712C", by:"M. Kumar",  date:"Mar 23",       impact:"21.2%→19.5%", just:"Strategic account retention for Tier-1 OEM customer requesting volume discount.", status:"amber", label:"Pending" },
    { id:"REG-5504D", by:"S. Patel",  date:"Mar 22",       impact:"17.5%→16.0%", just:"Market entry pricing for new territory expansion in Southeast region.", status:"amber", label:"Pending" },
    { id:"VAL-8402A", by:"R. Singh",  date:"Mar 21",       impact:"22.5%→23.8%", just:"Price normalisation after audit...", status:"green", label:"Approved" },
    { id:"HSE-3301B", by:"A. Sharma", date:"Mar 20",       impact:"19.8%→18.5%", just:"Volume discount for key account...", status:"red", label:"Rejected" },
  ]);
  const [reviewId, setReviewId] = useState(null);
  const reviewRow = rows.find(r => r.id === reviewId);

  const handleApprove = (id) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, status:"green", label:"Approved" } : r));
    setReviewId(null);
    if (toast) toast("success", `Pricing change for ${id} approved — syncing to CRM`);
  };
  const handleReject = (id) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, status:"red", label:"Rejected" } : r));
    setReviewId(null);
    if (toast) toast("error", `Pricing change for ${id} rejected — submitter notified`);
  };
  const pendingCount = rows.filter(r => r.label === "Pending").length;

  return (
    <Modal open={open} onClose={onClose} width={820}>
      <ModalHeader title="Pending Approval Queue"
        subtitle={`${pendingCount} pricing changes awaiting Pricing Director review`} onClose={onClose} />

      {/* Review detail sub-modal */}
      {reviewRow && (
        <div style={{ margin:"0 22px 16px", padding:"16px 20px", background:C.g100,
          border:`1px solid ${C.g300}`, borderRadius:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.navy }}>Reviewing: {reviewRow.id}</div>
            <button onClick={() => setReviewId(null)} style={{ color:C.g400, fontSize:18, cursor:"pointer", background:"none", border:"none" }}>×</button>
          </div>
          <div style={{ fontSize:13, color:C.g600, marginBottom:6 }}><strong>Submitted by:</strong> {reviewRow.by} · {reviewRow.date}</div>
          <div style={{ fontSize:13, color:C.g600, marginBottom:6 }}><strong>Margin Impact:</strong> <span style={{ color:C.danger, fontWeight:600 }}>{reviewRow.impact}</span></div>
          <div style={{ fontSize:13, color:C.g700, marginBottom:14, lineHeight:1.6 }}>
            <strong>Justification:</strong> {reviewRow.just}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="primary" size="sm" onClick={() => handleApprove(reviewRow.id)}>✓ Approve</Btn>
            <Btn variant="danger" size="sm" onClick={() => handleReject(reviewRow.id)}>✗ Reject</Btn>
            <Btn variant="ghost" size="sm" onClick={() => setReviewId(null)}>Cancel</Btn>
          </div>
        </div>
      )}

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:C.teal }}>
              {["Part #","Submitted By","Date","Margin Impact","Justification","Status","Action"].map(h => (
                <th key={h} style={{ color:C.white, fontSize:11, fontWeight:600,
                  textAlign:"left", padding:"10px 14px", letterSpacing:0.3 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} style={{ borderBottom:`1px solid ${C.g200}`,
                background: reviewId === r.id ? "#E0F4FB" : i % 2 ? C.g100 : C.white,
                transition:"background .15s" }}>
                <td style={{ padding:"11px 14px", fontSize:13, color:C.teal, fontWeight:600 }}>{r.id}</td>
                <td style={{ padding:"11px 14px", fontSize:13 }}>{r.by}</td>
                <td style={{ padding:"11px 14px", fontSize:12, color:C.g500 }}>{r.date}</td>
                <td style={{ padding:"11px 14px", fontSize:13, fontWeight:600,
                  color: r.status === "green" ? C.success : C.danger }}>{r.impact}</td>
                <td style={{ padding:"11px 14px", fontSize:12, color:C.g600,
                  maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}
                  title={r.just}>{r.just}</td>
                <td style={{ padding:"11px 14px" }}><Badge type={r.status}>{r.label}</Badge></td>
                <td style={{ padding:"11px 14px" }}>
                  {r.label === "Pending" ? (
                    <Btn size="sm" onClick={() => setReviewId(r.id)}>Review</Btn>
                  ) : (
                    <Btn size="sm" variant="secondary" onClick={() => setReviewId(r.id)}>View</Btn>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding:"16px 22px", borderTop:`1px solid ${C.g200}`,
        display:"flex", justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Close</Btn>
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   INSIGHT DETAIL MODAL
───────────────────────────────────────────── */
function InsightDetailModal({ open, insight, onClose, onSimulate }) {
  if (!open || !insight) return null;
  return (
    <Modal open={open} onClose={onClose} width={680}>
      <ModalHeader icon={insight.icon} title={insight.title}
        subtitle={insight.impact} onClose={onClose} />
      <div style={{ padding:"22px 26px" }}>
        <div style={{ fontSize:14, color:C.g700, lineHeight:1.7, marginBottom:18 }}>
          {insight.detail?.summary || insight.finding}
        </div>

        {insight.detail?.skus && (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:12, fontWeight:600, textTransform:"uppercase",
              letterSpacing:0.5, color:C.g500, marginBottom:10 }}>Affected SKUs</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {insight.detail.skus.map(sku => {
                const p = PARTS[sku];
                if (!p) return null;
                return (
                  <div key={sku} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"10px 14px", background:C.g100, borderRadius:6, border:`1px solid ${C.g300}` }}>
                    <div>
                      <span style={{ color:C.teal, fontWeight:600, fontSize:13 }}>{sku}</span>
                      <span style={{ color:C.g500, fontSize:12, marginLeft:8 }}>{p.category} — {p.desc}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ fontSize:12, fontWeight:600,
                        color: p.margin < 25 ? C.danger : "#92400E" }}>{p.margin}%</span>
                      <Btn size="sm" onClick={() => { onClose(); onSimulate(sku); }}>Simulate</Btn>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {insight.detail?.recommendation && (
          <div style={{ background:"linear-gradient(135deg,#EFF9FF,#F0FDF4)",
            border:`1px solid #BAE6FD`, borderRadius:8, padding:"14px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <span style={{ background:C.teal, color:C.white, fontSize:10, fontWeight:700,
                letterSpacing:0.7, padding:"3px 8px", borderRadius:12 }}>✦ RECOMMENDATION</span>
            </div>
            <div style={{ fontSize:13, color:C.g700, lineHeight:1.65 }}>
              {insight.detail.recommendation}
            </div>
          </div>
        )}

        <div style={{ marginTop:18, padding:"12px 16px", background:C.g100, borderRadius:6,
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:14, fontWeight:600,
            color: insight.pos ? C.success : C.danger }}>{insight.impact}</span>
          {insight.detail?.skus?.length > 0 && (
            <Btn size="sm" onClick={() => { onClose(); onSimulate(insight.detail.skus[0]); }}>
              Simulate Top SKU →
            </Btn>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────
   HOME NAV (enhanced with search + notifications)
───────────────────────────────────────────── */
function HomeNav({ onHome, notifCount = 3, userName = "Sarah Chen" }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  return (
    <nav style={{ height:64, background:C.navy, display:"flex", alignItems:"center",
      justifyContent:"space-between", padding:"0 32px", position:"sticky",
      top:0, zIndex:100, flexShrink:0 }}>
      <div onClick={onHome} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
        <div style={{ width:36, height:36, borderRadius:8,
          background:"linear-gradient(135deg,#1C7293,#E85D04)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontWeight:700, color:C.white, fontSize:13, letterSpacing:0.5 }}>BO</div>
        <div>
          <span style={{ color:C.white, fontWeight:600, fontSize:17, letterSpacing:-0.3 }}>
            BOSS<span style={{ color:C.orange }}>Platform</span>
          </span>
          <div style={{ fontSize:10, color:"rgba(255,255,255,.5)", marginTop:-2 }}>Decision Intelligence Platform</div>
        </div>
      </div>
      {/* Global search */}
      <div style={{ position:"relative", width:400 }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
          fontSize:14, color: searchFocused ? C.g500 : "rgba(255,255,255,.5)" }}>🔍</span>
        <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
          onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
          placeholder="Search products, categories, alerts...   ⌘K"
          style={{ width:"100%", height:40, borderRadius:6, border: searchFocused ? `2px solid ${C.teal}` : "1px solid rgba(255,255,255,.2)",
            background: searchFocused ? C.white : "rgba(255,255,255,.1)",
            color: searchFocused ? C.navy : C.white, fontSize:14, paddingLeft:36, paddingRight:12,
            outline:"none", transition:"all .2s" }} />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        {/* Notifications */}
        <div style={{ position:"relative", cursor:"pointer" }}>
          <span style={{ fontSize:20, color:"rgba(255,255,255,.8)" }}>🔔</span>
          {notifCount > 0 && (
            <span style={{ position:"absolute", top:-6, right:-8, background:C.orange,
              color:C.white, fontSize:10, fontWeight:700, width:18, height:18,
              borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {notifCount}
            </span>
          )}
        </div>
        {/* User */}
        <div style={{ display:"flex", alignItems:"center", gap:10,
          color:"rgba(255,255,255,.8)", fontSize:14 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:C.teal,
            display:"flex", alignItems:"center", justifyContent:"center",
            color:C.white, fontWeight:600, fontSize:13 }}>
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
          <span>{userName}</span>
          <span style={{ color:"rgba(255,255,255,.4)" }}>▾</span>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HOME: WELCOME HEADER
───────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "Welcome back";
}

/* ─────────────────────────────────────────────
   HOME: PLATFORM HEALTH CARD
───────────────────────────────────────────── */
function HealthCard({ icon, label, score, trend, trendDir, detail, color, onClick }) {
  const status = score >= 80 ? "Healthy" : score >= 60 ? "Monitor" : "Action Required";
  const statusColor = score >= 80 ? C.success : score >= 60 ? C.warn : C.danger;
  const animated = useCountUp(score, 1000);
  return (
    <div onClick={onClick} style={{ ...s.card, padding:"20px 22px", cursor:"pointer",
      borderLeft:`4px solid ${statusColor}`, transition:"all .2s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = s.card.boxShadow; e.currentTarget.style.transform = "none"; }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={{ fontSize:20 }}>{icon}</span>
        <span style={{ fontSize:11, fontWeight:600, letterSpacing:0.7,
          textTransform:"uppercase", color:C.g500 }}>{label}</span>
      </div>
      <div style={{ fontSize:30, fontWeight:700, letterSpacing:-1, lineHeight:1,
        color:C.navy, marginBottom:6 }}>{Math.round(animated)}<span style={{ fontSize:18, color:C.g400 }}>/100</span></div>
      {trend && (
        <div style={{ fontSize:13, display:"flex", alignItems:"center", gap:4, marginBottom:8,
          color: trendDir === "up" ? C.success : trendDir === "down" ? C.danger : C.g500 }}>
          {trendDir === "up" ? "▲" : trendDir === "down" ? "▼" : "→"} {trend}
        </div>
      )}
      <Badge type={score >= 80 ? "green" : score >= 60 ? "amber" : "red"}>
        {score >= 80 ? "✓" : score >= 60 ? "⚠" : "✗"} {status}
      </Badge>
      {detail && <div style={{ fontSize:12, color:C.g500, marginTop:6 }}>{detail}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOME: MODULE CARD
───────────────────────────────────────────── */
function ModuleCard({ icon, title, subtitle, stats, description, color, onClick }) {
  return (
    <div onClick={onClick} style={{ ...s.card, padding:"28px 28px 24px", cursor:"pointer",
      borderTop:`3px solid ${color}`, transition:"all .25s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)"; e.currentTarget.style.transform = "scale(1.015)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = s.card.boxShadow; e.currentTarget.style.transform = "none"; }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <span style={{ fontSize:24 }}>{icon}</span>
        <div>
          <div style={{ fontSize:17, fontWeight:700, color:C.navy }}>{title}</div>
          <div style={{ fontSize:12, color:C.g500 }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ background:C.g100, borderRadius:6, padding:"12px 14px", marginBottom:14 }}>
        {stats.map((st, i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            fontSize:13, padding:"4px 0", borderBottom: i < stats.length - 1 ? `1px solid ${C.g200}` : "none" }}>
            <span style={{ color:C.g600 }}>{st.label}</span>
            <span style={{ fontWeight:600, color: st.color || C.navy }}>{st.value}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize:13, color:C.g600, lineHeight:1.55, marginBottom:16 }}>{description}</div>
      <Btn style={{ width:"100%" }} onClick={onClick}>Open Dashboard →</Btn>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOME SCREEN
───────────────────────────────────────────── */
const HOME_ACTIVITY = [
  { time:"2 min ago", module:"PRICING", moduleColor:C.teal, user:"Sarah Chen", action:"Approved pricing change for PKR-2500X (+7% increase)", icon:"📊" },
  { time:"15 min ago", module:"PRODUCT", moduleColor:C.info, user:"Joe Martinez", action:"Launched 3 new valve SKUs to NetSuite", icon:"🚀" },
  { time:"1 hr ago", module:"COMPETITIVE", moduleColor:C.purple, user:"SYSTEM", action:"Detected Parker price change on 8 hose SKUs", icon:"🤖" },
  { time:"2 hr ago", module:"PRICING", moduleColor:C.teal, user:"M. Kumar", action:"Submitted pricing exception for ADP-7712C", icon:"📋" },
  { time:"3 hr ago", module:"PROFITABILITY", moduleColor:C.success, user:"Brad Wilson", action:"Exported Q1 profitability report", icon:"📄" },
  { time:"Yesterday", module:"PRODUCT", moduleColor:C.info, user:"Joe Martinez", action:"Updated attribute completeness for 45 SKUs", icon:"🔧" },
];

const HOME_OPPORTUNITIES = [
  { module:"PRICING", moduleColor:C.teal, title:"15 Valve SKUs can support 3–5% price increases",
    impact:"+$180K annual revenue", confidence:"92%", desc:"Competitive analysis shows Brennan priced 15–20% below Parker on these items.", targetScreen:"dashboard" },
  { module:"COMPETITIVE", moduleColor:C.purple, title:"Parker discontinued 3 hose assemblies — gap opportunity",
    impact:"+$85K addressable market", confidence:"87%", desc:"Parker delisted HS-400, HS-410, HS-420. No other competitor carries direct equivalents.", targetScreen:"competitive" },
  { module:"PRODUCT", moduleColor:C.info, title:"3 new valve SKUs ready for market launch",
    impact:"+$45K projected Q2 revenue", confidence:"95%", desc:"All attributes complete, NetSuite synced, supplier inventory confirmed.", targetScreen:"product" },
];

const HOME_RISKS = [
  { module:"PRICING", moduleColor:C.teal, title:"23 Adapter SKUs priced below 25% margin floor",
    impact:"-$120K at risk", urgency:"High", desc:"Legacy pricing not updated after supplier cost increases last month.", targetScreen:"dashboard" },
  { module:"COMPETITIVE", moduleColor:C.purple, title:"Swagelok dropped hose prices 8–12% in 30 days",
    impact:"-$190K revenue risk", urgency:"Medium", desc:"If Brennan doesn't respond, market share at risk in hose category.", targetScreen:"competitive" },
  { module:"PROFITABILITY", moduleColor:C.success, title:"42 SKUs generating negative margin after freight",
    impact:"-$67K annual loss", urgency:"Medium", desc:"Small-order freight absorption erasing margins on low-value SKUs.", targetScreen:"profitability" },
];

function HomeScreen({ onNavigate, toast }) {
  return (
    <div style={{ flex:1 }}>
      <HomeNav onHome={() => {}} />
      <div style={{ maxWidth:1440, margin:"0 auto", padding:"28px 32px 48px" }}>

        {/* Welcome Header */}
        <div className="stagger-1" style={{ ...s.card, padding:"22px 28px", marginBottom:24,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:24, fontWeight:600, color:C.navy }}>
              {getGreeting()}, Sarah 👋
            </div>
            <div style={{ fontSize:14, color:C.g500, marginTop:3 }}>
              Last login: Friday, 4:32 PM from Denver Office
            </div>
          </div>
          <div style={{ fontSize:12, color:C.g500, textAlign:"right" }}>
            <strong style={{ color:C.g600 }}>Platform status:</strong> All systems operational<br />
            <span style={{ color:C.success, fontWeight:600 }}>● Online</span>
            <span style={{ color:C.g400, marginLeft:8 }}>Updated 2 min ago</span>
          </div>
        </div>

        {/* Platform Health KPIs */}
        <div className="stagger-1" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
          <HealthCard icon="💰" label="Pricing Health" score={82} trend="+5 vs. last week" trendDir="up"
            detail="260 SKUs below floor" color={C.teal} onClick={() => onNavigate("dashboard")} />
          <HealthCard icon="📈" label="Profitability" score={74} trend="-2 vs. last week" trendDir="down"
            detail="42 unprofitable SKUs" color={C.success} onClick={() => onNavigate("profitability")} />
          <HealthCard icon="⚔️" label="Competitive Threat" score={68} trend="Stable" trendDir="neutral"
            detail="18 price changes in 30d" color={C.purple} onClick={() => onNavigate("competitive")} />
          <HealthCard icon="🚀" label="Product Launch" score={91} trend="+12 vs. last week" trendDir="up"
            detail="3 SKUs launch-ready" color={C.info} onClick={() => onNavigate("product")} />
        </div>

        {/* AI Insights — Opportunities & Risks */}
        <div className="stagger-2" style={{ background:"linear-gradient(135deg,#E0F4FB 0%,#F0FDF4 50%,#FFFFFF 100%)",
          border:`1px solid #BAE6FD`, borderRadius:8, padding:"28px 28px 24px", marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <span style={{ background:C.teal, color:C.white, fontSize:11, fontWeight:700,
              letterSpacing:0.7, padding:"4px 10px", borderRadius:12 }}>🤖 AI INSIGHTS</span>
            <span style={{ fontSize:16, fontWeight:700, color:C.navy }}>What Needs Your Attention Today</span>
            <span style={{ fontSize:12, color:C.g400, marginLeft:"auto" }}>Last updated: 2 minutes ago</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            {/* Opportunities */}
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.success, textTransform:"uppercase",
                letterSpacing:0.5, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
                ✦ Opportunities
              </div>
              {HOME_OPPORTUNITIES.map((o, i) => (
                <div key={i} style={{ ...s.card, padding:"16px 18px", marginBottom:10 }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.09)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = s.card.boxShadow}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ background:o.moduleColor, color:C.white, fontSize:10, fontWeight:700,
                      letterSpacing:0.5, padding:"2px 8px", borderRadius:10 }}>{o.module}</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.navy, marginBottom:4 }}>{o.title}</div>
                  <div style={{ fontSize:12, color:C.g600, lineHeight:1.5, marginBottom:8 }}>{o.desc}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", gap:12 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:C.success }}>{o.impact}</span>
                      <span style={{ fontSize:11, color:C.g400 }}>Confidence: {o.confidence}</span>
                    </div>
                    <button onClick={() => onNavigate(o.targetScreen)}
                      style={{ fontSize:12, fontWeight:500, color:C.teal, background:"none",
                        border:"none", cursor:"pointer", textDecoration:"underline" }}>
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Risks */}
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.danger, textTransform:"uppercase",
                letterSpacing:0.5, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
                ⚠️ Risks
              </div>
              {HOME_RISKS.map((r, i) => (
                <div key={i} style={{ ...s.card, padding:"16px 18px", marginBottom:10,
                  borderLeft:`3px solid ${r.urgency === "High" ? C.danger : C.warn}` }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.09)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = s.card.boxShadow}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ background:r.moduleColor, color:C.white, fontSize:10, fontWeight:700,
                      letterSpacing:0.5, padding:"2px 8px", borderRadius:10 }}>{r.module}</span>
                    <Badge type={r.urgency === "High" ? "red" : "amber"}>{r.urgency} Urgency</Badge>
                  </div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.navy, marginBottom:4 }}>{r.title}</div>
                  <div style={{ fontSize:12, color:C.g600, lineHeight:1.5, marginBottom:8 }}>{r.desc}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:12, fontWeight:600, color:C.danger }}>{r.impact}</span>
                    <button onClick={() => onNavigate(r.targetScreen)}
                      style={{ fontSize:12, fontWeight:500, color:C.teal, background:"none",
                        border:"none", cursor:"pointer", textDecoration:"underline" }}>
                      {r.urgency === "High" ? "Fix Now →" : "Analyze →"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop:14, padding:"12px 18px", background:"rgba(28,114,147,.06)",
            borderRadius:6, textAlign:"center", fontSize:14, fontWeight:600, color:C.teal }}>
            Total Identified Opportunity: <span style={{ fontSize:20, color:C.navy }}>$390K</span>
            <span style={{ fontSize:12, color:C.g500, fontWeight:400, marginLeft:8 }}>across 4 modules</span>
          </div>
        </div>

        {/* Module Navigation Grid */}
        <div className="stagger-3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:28 }}>
          <ModuleCard icon="💰" title="Pricing Intelligence" subtitle="Margin protection & competitive positioning"
            color={C.teal}
            stats={[
              { label:"Below Floor", value:"18% (260 SKUs)", color:C.danger },
              { label:"Opportunity", value:"$390K identified", color:C.success },
              { label:"Pending Approvals", value:"7" },
            ]}
            description="Optimize pricing across 1,400+ SKUs with real-time competitive intelligence and AI recommendations."
            onClick={() => onNavigate("dashboard")} />
          <ModuleCard icon="📈" title="Profitability Intelligence" subtitle="SKU-level P&L & customer profitability"
            color={C.success}
            stats={[
              { label:"Unprofitable SKUs", value:"42", color:C.danger },
              { label:"Margin Leaders", value:"12 SKUs >50%" , color:C.success },
              { label:"Avg Order Profit", value:"$127" },
            ]}
            description="Understand profitability at every level — by SKU, customer, order, and category."
            onClick={() => onNavigate("profitability")} />
          <ModuleCard icon="⚔️" title="Competitive Intelligence" subtitle="Real-time competitor monitoring"
            color={C.purple}
            stats={[
              { label:"Price Changes (30d)", value:"18 detected", color:C.warn },
              { label:"Product Gaps", value:"12 opportunities", color:C.success },
              { label:"Tracked Competitors", value:"4" },
            ]}
            description="Monitor Parker, Swagelok, Gates, and Eaton with daily web scraping and AI-powered matching."
            onClick={() => onNavigate("competitive")} />
          <ModuleCard icon="🚀" title="Product Intelligence" subtitle="PIM, AI attribute extraction, lifecycle"
            color={C.info}
            stats={[
              { label:"Launch-Ready", value:"3 SKUs", color:C.success },
              { label:"Attribute Completeness", value:"95%" },
              { label:"Launch Velocity", value:"2x faster", color:C.success },
            ]}
            description="Manage 150K+ SKUs with AI-powered attribute extraction, lifecycle tracking, and NetSuite integration."
            onClick={() => onNavigate("product")} />
        </div>

        {/* Bottom Row: Quick Actions + Activity Feed */}
        <div className="stagger-4" style={{ display:"grid", gridTemplateColumns:"380px 1fr", gap:20 }}>
          {/* Quick Actions */}
          <div style={s.card}>
            <div style={{ ...s.panelHeader }}>
              <div style={s.panelTitle}>⚡ Quick Actions</div>
            </div>
            <div style={{ padding:"8px 14px" }}>
              {[
                { icon:"📊", label:"Run Cross-Module Analysis", action:() => toast("success","Cross-module analysis started — results in 30 seconds") },
                { icon:"📥", label:"Export Executive Report", action:() => toast("success","Executive report generated — downloading PDF") },
                { icon:"⚙️", label:"Configure Alerts", action:() => toast("success","Alert configuration panel opened") },
                { icon:"📅", label:"Schedule Review Meeting", action:() => toast("success","Review meeting scheduled — Tuesday 2:00 PM") },
                { icon:"📖", label:"View Help Documentation", action:() => toast("success","Opening BOSS documentation...") },
              ].map((a, i) => (
                <div key={i} onClick={a.action} style={{ display:"flex", alignItems:"center", gap:12,
                  padding:"12px 10px", borderRadius:6, cursor:"pointer", transition:"background .15s",
                  borderBottom: i < 4 ? `1px solid ${C.g200}` : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.g100}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize:18 }}>{a.icon}</span>
                  <span style={{ fontSize:14, color:C.g700 }}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Activity Feed */}
          <div style={s.card}>
            <div style={{ ...s.panelHeader, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={s.panelTitle}>📋 Recent Activity Across All Modules</div>
              <span style={{ fontSize:11, color:C.g400 }}>Auto-refreshing</span>
            </div>
            <div style={{ padding:"8px 18px", maxHeight:280, overflowY:"auto" }}>
              {HOME_ACTIVITY.map((a, i) => (
                <div key={i} style={{ display:"flex", gap:12, padding:"12px 0",
                  borderBottom: i < HOME_ACTIVITY.length - 1 ? `1px solid ${C.g200}` : "none" }}>
                  <span style={{ fontSize:18, flexShrink:0, marginTop:2 }}>{a.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:11, color:C.g400 }}>{a.time}</span>
                      <span style={{ background:a.moduleColor, color:C.white, fontSize:9, fontWeight:700,
                        letterSpacing:0.5, padding:"1px 6px", borderRadius:8 }}>{a.module}</span>
                      <span style={{ fontSize:12, fontWeight:600, color:C.navy }}>{a.user}</span>
                    </div>
                    <div style={{ fontSize:13, color:C.g600, lineHeight:1.45 }}>{a.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PLACEHOLDER MODULE SCREENS
───────────────────────────────────────────── */
function PlaceholderModule({ title, icon, color, stats, description, onHome }) {
  return (
    <div style={{ flex:1 }}>
      <Nav crumbs={[
        { label:"Home", onClick: onHome },
        title
      ]} />
      <div style={{ maxWidth:1440, margin:"0 auto", padding:"28px 32px 48px" }}>
        <button onClick={onHome}
          style={{ display:"inline-flex", alignItems:"center", gap:6,
            color:C.teal, fontSize:14, fontWeight:500, cursor:"pointer",
            background:"none", border:"none", marginBottom:14 }}>
          ← Back to Home
        </button>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:26, fontWeight:700, color:C.navy, letterSpacing:-0.5, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:30 }}>{icon}</span> {title}
          </div>
          <div style={{ fontSize:14, color:C.g500, marginTop:3 }}>{description}</div>
        </div>

        {/* KPI Row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
          {stats.map((st, i) => (
            <KPICard key={i} label={st.label} value={st.value} numericValue={st.numericValue}
              formatter={st.formatter} trend={st.trend} trendDir={st.trendDir}
              sub={st.sub} alert={st.alert} />
          ))}
        </div>

        {/* Coming Soon placeholder */}
        <div style={{ ...s.card, padding:"60px 40px", textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🚧</div>
          <div style={{ fontSize:22, fontWeight:700, color:C.navy, marginBottom:8 }}>
            Module Under Development
          </div>
          <div style={{ fontSize:15, color:C.g500, lineHeight:1.7, maxWidth:600, margin:"0 auto", marginBottom:24 }}>
            The <strong>{title}</strong> module is being built as part of BOSS Phase 2.
            This dashboard will include real-time analytics, AI recommendations,
            and deep integration with Dynamics 365 and NetSuite.
          </div>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <Btn variant="secondary" onClick={onHome}>← Return to Home</Btn>
            <Btn onClick={onHome}>View Pricing Intelligence →</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompetitiveScreen({ onHome }) {
  return <PlaceholderModule onHome={onHome} title="Competitive Intelligence" icon="⚔️" color={C.purple}
    description="Real-time competitor monitoring — Parker, Swagelok, Gates, Eaton · Daily web scraping & AI matching"
    stats={[
      { label:"Price Changes (30d)", value:"18", numericValue:18, formatter:v=>`${Math.round(v)}`, trend:"6 new this week", trendDir:"up" },
      { label:"Product Gaps", value:"12", numericValue:12, formatter:v=>`${Math.round(v)}`, trend:"3 new opportunities", trendDir:"up", sub:"Addressable market: $85K" },
      { label:"Match Accuracy", value:"94%", numericValue:94, formatter:v=>`${Math.round(v)}%`, trend:"+2% vs. last month", trendDir:"up" },
      { label:"Tracked Competitors", value:"4", numericValue:4, formatter:v=>`${Math.round(v)}`, sub:"Parker · Swagelok · Gates · Eaton" },
    ]} />;
}

function ProfitabilityScreen({ onHome }) {
  return <PlaceholderModule onHome={onHome} title="Profitability Intelligence" icon="📈" color={C.success}
    description="SKU-level P&L visibility · Customer & order profitability · Cost optimization"
    stats={[
      { label:"Portfolio Margin", value:"34.2%", numericValue:34.2, formatter:v=>`${v.toFixed(1)}%`, trend:"-1.5% vs. last quarter", trendDir:"down" },
      { label:"Unprofitable SKUs", value:"42", numericValue:42, formatter:v=>`${Math.round(v)}`, trend:"Needs attention", trendDir:"down", alert:"red", sub:"Losing $67K annually" },
      { label:"Top Margin SKUs", value:"12", numericValue:12, formatter:v=>`${Math.round(v)}`, sub:">50% margin each", trend:"+2 added", trendDir:"up" },
      { label:"Avg Order Profit", value:"$127", numericValue:127, formatter:v=>`$${Math.round(v)}`, trend:"+$8 vs. last month", trendDir:"up" },
    ]} />;
}

function ProductScreen({ onHome }) {
  return <PlaceholderModule onHome={onHome} title="Product Intelligence" icon="🚀" color={C.info}
    description="Central product master · AI attribute extraction · Lifecycle tracking · NetSuite integration"
    stats={[
      { label:"Total SKUs", value:"150K+", numericValue:150, formatter:v=>`${Math.round(v)}K+`, sub:"Across 8 categories" },
      { label:"Attribute Completeness", value:"95%", numericValue:95, formatter:v=>`${Math.round(v)}%`, trend:"+8% vs. Q4 2025", trendDir:"up" },
      { label:"Launch-Ready", value:"3", numericValue:3, formatter:v=>`${Math.round(v)}`, sub:"Valve SKUs ready to go", alert:"amber" },
      { label:"Launch Velocity", value:"2x", numericValue:2, formatter:v=>`${Math.round(v)}x`, trend:"vs. Q4 2025 baseline", trendDir:"up", sub:"Faster than manual process" },
    ]} />;
}

/* ─────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────── */
export default function App() {
  const [screen,     setScreen]     = useState("home");
  const [loading,    setLoading]    = useState(false);
  const [simPart,    setSimPart]    = useState("PKR-2500X");
  const [approvalData, setApproval] = useState(null);
  const [showApproval, setShowApproval] = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [showQueue,    setShowQueue]    = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [confirmData,  setConfirmData]  = useState(null);
  const [showInsight,  setShowInsight]  = useState(false);
  const [insightData,  setInsightData]  = useState(null);
  const { toasts, push: toast } = useToast();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Keyboard shortcuts: Esc closes modals
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (showConfirm) setShowConfirm(false);
        else if (showInsight) setShowInsight(false);
        else if (showApproval) setShowApproval(false);
        else if (showSuccess) setShowSuccess(false);
        else if (showQueue) setShowQueue(false);
      }
      // Cmd/Ctrl+S = save draft on simulation screen
      if ((e.metaKey || e.ctrlKey) && e.key === "s" && screen === "simulation") {
        e.preventDefault();
        toast("success", "Draft saved — return anytime");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showConfirm, showInsight, showApproval, showSuccess, showQueue, screen, toast]);

  const goSimulate = (partId) => {
    setLoading(true);
    setSimPart(partId);
    setTimeout(() => {
      setScreen("simulation");
      setLoading(false);
      window.scrollTo(0, 0);
    }, 350);
  };

  const goBack = () => {
    setLoading(true);
    setTimeout(() => {
      setScreen("dashboard");
      setLoading(false);
      window.scrollTo(0, 0);
    }, 250);
  };

  const handleApprove = (data) => {
    if (data.aboveFloor) {
      setConfirmData(data);
      setShowConfirm(true);
      return;
    }
    setApproval(data);
    setShowApproval(true);
  };

  const handleConfirmApply = () => {
    if (confirmData) {
      toast("success", `Pricing for ${confirmData.partId} updated — syncing to CRM`);
    }
    setShowConfirm(false);
    setConfirmData(null);
  };

  const handleSubmit = () => {
    setShowApproval(false);
    setShowSuccess(true);
  };

  const handleInsightDetail = (insight) => {
    setInsightData(insight);
    setShowInsight(true);
  };

  const navigateTo = (target) => {
    setLoading(true);
    setTimeout(() => {
      setScreen(target);
      setLoading(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const onNavigateHome = () => {
    navigateTo("home");
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column" }}>
      {loading && (
        <>
          <HomeNav onHome={onNavigateHome} />
          <DashboardSkeleton />
        </>
      )}

      {!loading && screen === "home" && (
        <HomeScreen onNavigate={navigateTo} toast={toast} />
      )}
      {!loading && screen === "dashboard" && (
        <Screen1 onSimulate={goSimulate} onQueue={() => setShowQueue(true)}
          onInsightDetail={handleInsightDetail} toast={toast} onNavigateHome={onNavigateHome} />
      )}
      {!loading && screen === "simulation" && (
        <Screen2 selectedPart={simPart} onBack={goBack}
          onApprove={handleApprove} toast={toast} onNavigateHome={onNavigateHome} />
      )}
      {!loading && screen === "competitive" && (
        <CompetitiveScreen onHome={onNavigateHome} />
      )}
      {!loading && screen === "profitability" && (
        <ProfitabilityScreen onHome={onNavigateHome} />
      )}
      {!loading && screen === "product" && (
        <ProductScreen onHome={onNavigateHome} />
      )}

      <ConfirmDialog open={showConfirm}
        title="Apply Pricing Changes"
        message={confirmData ? `Apply pricing change for ${confirmData.partId}?\n\nNet Price: $${confirmData.netP.toFixed(2)} | Margin: ${confirmData.mgrPct.toFixed(1)}%\n\nThis will sync to CRM immediately.` : ""}
        confirmLabel="Apply Now" cancelLabel="Cancel"
        onConfirm={handleConfirmApply}
        onCancel={() => setShowConfirm(false)} />

      <ApprovalModal open={showApproval} data={approvalData}
        onClose={() => setShowApproval(false)} onSubmit={handleSubmit} />

      <SuccessModal open={showSuccess} partId={approvalData?.partId}
        onQueue={() => { setShowSuccess(false); setShowQueue(true); }}
        onDashboard={() => { setShowSuccess(false); setScreen("dashboard"); window.scrollTo(0,0); }} />

      <QueueModal open={showQueue} onClose={() => setShowQueue(false)} toast={toast} />

      <InsightDetailModal open={showInsight} insight={insightData}
        onClose={() => setShowInsight(false)} onSimulate={goSimulate} />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
