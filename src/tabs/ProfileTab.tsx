// ============================================================
// ProfileTab.tsx — Bản Mệnh + Quản Lý Gia Đình
// Lưu mảng thành viên, dropdown chọn xem cho ai
// ============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildUserProfile, getShopeeProduct, UserProfile } from "../utils/astrology";
import { playChime } from "../utils/sounds";

// ─── Types ───────────────────────────────────────────────────
interface Member {
  id: string;
  name: string;
  birthYear: number;
  birthDay?: number;
  birthMonth?: number;
  relation: string; // "Bản thân", "Vợ/Chồng", "Con", "Bố", "Mẹ", custom
}

const RELATIONS = ["Bản thân", "Vợ/Chồng", "Con", "Bố", "Mẹ", "Anh/Chị/Em", "Khác"];
const STORAGE_KEY = "hcc_family_members";
const ACTIVE_KEY  = "hcc_active_member";

function loadMembers(): Member[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)??"[]"); } catch { return []; }
}
function saveMembers(m: Member[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(m)); } catch {}
}

const ELEMENT_ICON:  Record<string,string> = { kim:"🪙", moc:"🌿", thuy:"💧", hoa:"🔥", tho:"⛰️" };
const ELEMENT_LABEL: Record<string,string> = { kim:"Kim", moc:"Mộc", thuy:"Thủy", hoa:"Hỏa", tho:"Thổ" };
const ELEMENT_COLOR: Record<string,string> = {
  kim:"#94a3b8", moc:"#22c55e", thuy:"#3b82f6", hoa:"#ef4444", tho:"#f59e0b"
};

// ─── Props ───────────────────────────────────────────────────
interface ProfileTabProps {
  userProfile: UserProfile | null;
  onProfileChange: (p: UserProfile | null) => void;
}

export function ProfileTab({ userProfile, onProfileChange }: ProfileTabProps) {
  const [members,      setMembers]      = useState<Member[]>(loadMembers);
  const [activeMemberId, setActiveMemberId] = useState<string>(() =>
    localStorage.getItem(ACTIVE_KEY) ?? ""
  );
  const [showAdd,      setShowAdd]      = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Form state for adding
  const [fName,     setFName]     = useState("Bản thân");
  const [fRelation, setFRelation] = useState("Bản thân");
  const [fYear,     setFYear]     = useState("");
  const [fDay,      setFDay]      = useState("");
  const [fMonth,    setFMonth]    = useState("");
  const [fError,    setFError]    = useState("");
  const [justSaved, setJustSaved] = useState(false);

  const activeMember = members.find(m => m.id === activeMemberId) ?? members[0] ?? null;
  const activeProfile = activeMember ? buildUserProfile(activeMember.birthYear) : null;

  // Sync parent profile when active member changes
  useEffect(() => {
    onProfileChange(activeProfile);
    // Also update legacy localStorage keys for other components
    if (activeMember) {
      try {
        localStorage.setItem("huyen_co_cac_birth_year", String(activeMember.birthYear));
        if (activeMember.birthDay && activeMember.birthMonth)
          localStorage.setItem("huyen_co_cac_dob", JSON.stringify({
            day: activeMember.birthDay, month: activeMember.birthMonth, year: activeMember.birthYear
          }));
      } catch {}
    }
  }, [activeMemberId, members.length]);

  const switchMember = (id: string) => {
    setActiveMemberId(id);
    try { localStorage.setItem(ACTIVE_KEY, id); } catch {}
    setShowDropdown(false);
  };

  const handleAdd = () => {
    const y = parseInt(fYear, 10);
    if (!fName.trim()) { setFError("Vui lòng nhập tên"); return; }
    if (isNaN(y) || y < 1900 || y > 2020) { setFError("Năm sinh không hợp lệ (1900–2020)"); return; }
    setFError("");
    const id = Date.now().toString();
    const member: Member = {
      id, name: fName.trim(), relation: fRelation, birthYear: y,
      birthDay: parseInt(fDay)||undefined, birthMonth: parseInt(fMonth)||undefined,
    };
    const updated = [...members, member];
    setMembers(updated); saveMembers(updated);
    setActiveMemberId(id);
    try { localStorage.setItem(ACTIVE_KEY, id); } catch {}
    setFName("Bản thân"); setFRelation("Bản thân"); setFYear(""); setFDay(""); setFMonth("");
    setShowAdd(false);
    playChime();
    setJustSaved(true); setTimeout(()=>setJustSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated); saveMembers(updated);
    if (activeMemberId === id) {
      const next = updated[0];
      setActiveMemberId(next?.id ?? "");
      try { localStorage.setItem(ACTIVE_KEY, next?.id ?? ""); } catch {}
    }
  };

  const shopee     = activeProfile ? getShopeeProduct(activeProfile.element) : null;
  const elColor    = activeProfile ? ELEMENT_COLOR[activeProfile.element] ?? "var(--gold)" : "var(--gold)";

  return (
    <div className="px-4 pt-4 flex flex-col gap-3">

      {/* ── Member Selector ── */}
      <div className="relative">
        <motion.button whileTap={{scale:0.97}} onClick={()=>setShowDropdown(v=>!v)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold"
          style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{activeMember ? "👤" : "➕"}</span>
            <span>{activeMember ? `${activeMember.name} — ${activeMember.relation}` : "Thêm thành viên đầu tiên"}</span>
          </div>
          <motion.span animate={{rotate:showDropdown?180:0}} style={{lineHeight:1}}>▾</motion.span>
        </motion.button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div initial={{opacity:0,y:-6,scale:0.97}} animate={{opacity:1,y:0,scale:1}}
              exit={{opacity:0,y:-6,scale:0.97}}
              className="absolute top-full left-0 right-0 mt-1 z-50 card overflow-hidden"
              style={{boxShadow:"var(--shadow-float)"}}>
              {members.map(m => (
                <button key={m.id} onClick={()=>switchMember(m.id)}
                  className="w-full flex items-center justify-between px-4 py-3 border-b text-left"
                  style={{borderColor:"var(--border-subtle)",
                    background:m.id===activeMemberId?"var(--gold-bg)":"transparent",
                    color:m.id===activeMemberId?"var(--gold)":"var(--text-primary)"}}>
                  <span className="font-medium">{m.name} <span className="text-xs opacity-60">({m.relation})</span></span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{color:"var(--text-faint)"}}>{m.birthYear}</span>
                    {members.length>1 && (
                      <span onClick={e=>{e.stopPropagation();handleDelete(m.id);}}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
                        style={{background:"rgba(248,113,113,0.12)",color:"var(--accent-red)"}}>✕</span>
                    )}
                  </div>
                </button>
              ))}
              <button onClick={()=>{setShowDropdown(false);setShowAdd(true);}}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold"
                style={{color:"var(--gold)"}}>
                <span>+</span><span>Thêm thành viên</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Form thêm thành viên ── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
            exit={{opacity:0,height:0}} style={{overflow:"hidden"}}>
            <div className="card p-4 flex flex-col gap-3">
              <p className="font-bold" style={{color:"var(--text-primary)"}}>➕ Thêm Thành Viên</p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="section-label mb-1.5">Tên</p>
                  <input value={fName} onChange={e=>setFName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl outline-none font-medium text-sm"
                    style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}
                    placeholder="Tên người thân"/>
                </div>
                <div>
                  <p className="section-label mb-1.5">Quan hệ</p>
                  <select value={fRelation} onChange={e=>setFRelation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl outline-none font-medium text-sm appearance-none"
                    style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}>
                    {RELATIONS.map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <p className="section-label mb-1.5">Năm sinh (bắt buộc)</p>
                <input type="number" value={fYear} onChange={e=>setFYear(e.target.value)}
                  placeholder="1990" className="w-full px-3 py-2.5 rounded-xl outline-none font-bold text-center"
                  style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}/>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[{label:"Ngày sinh (tuỳ chọn)",val:fDay,set:setFDay,ph:"15"},{label:"Tháng sinh (tuỳ chọn)",val:fMonth,set:setFMonth,ph:"8"}].map(({label,val,set,ph})=>(
                  <div key={label}>
                    <p className="section-label mb-1.5">{label}</p>
                    <input type="number" value={val} onChange={e=>set(e.target.value)}
                      placeholder={ph} className="w-full px-3 py-2.5 rounded-xl outline-none font-bold text-center"
                      style={{background:"var(--bg-elevated)",border:"1px solid var(--border-medium)",color:"var(--text-primary)"}}/>
                  </div>
                ))}
              </div>

              {fError && <p className="text-sm" style={{color:"var(--accent-red)"}}>{fError}</p>}

              <div className="flex gap-2">
                <button onClick={()=>{setShowAdd(false);setFError("");}}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
                  style={{background:"var(--bg-elevated)",color:"var(--text-muted)"}}>Huỷ</button>
                <motion.button whileTap={{scale:0.97}} onClick={handleAdd}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                  style={{background:"var(--gold)",color:"white"}}>
                  💾 Lưu
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hiển thị profile active ── */}
      {members.length === 0 ? (
        <motion.div initial={{opacity:0}} animate={{opacity:1}}
          className="card p-6 text-center flex flex-col items-center gap-3">
          <span className="text-4xl">👨‍👩‍👧‍👦</span>
          <p className="font-bold text-lg" style={{color:"var(--text-primary)"}}>Chưa có thành viên</p>
          <p className="text-sm" style={{color:"var(--text-muted)"}}>
            Thêm thông tin để nhận tử vi, bản mệnh cá nhân hoá cho cả gia đình
          </p>
          <motion.button whileTap={{scale:0.97}} onClick={()=>setShowAdd(true)}
            className="btn-gold px-6 py-3 rounded-2xl font-bold">
            + Thêm người đầu tiên
          </motion.button>
        </motion.div>
      ) : activeMember && activeProfile ? (
        <AnimatePresence mode="wait">
          <motion.div key={activeMember.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            exit={{opacity:0}} className="card overflow-hidden">
            <div className="h-1.5" style={{background:`linear-gradient(90deg,${elColor},${elColor}88)`}}/>
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="section-label mb-1">Bản Mệnh</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{ELEMENT_ICON[activeProfile.element]}</span>
                    <div>
                      <p className="text-xl font-bold font-display" style={{color:elColor}}>
                        {ELEMENT_LABEL[activeProfile.element]}
                      </p>
                      <p className="text-sm" style={{color:"var(--text-muted)"}}>{activeProfile.destinyName}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="section-label mb-1">Năm sinh</p>
                  <p className="font-bold text-xl" style={{color:"var(--text-primary)"}}>{activeMember.birthYear}</p>
                  <p className="text-sm" style={{color:"var(--gold)"}}>{activeProfile.canChiYear}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{borderColor:"var(--border-subtle)"}}>
                {[
                  {label:"Can",    val:["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"][activeProfile.canIndex]},
                  {label:"Chi",    val:["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"][activeProfile.chiIndex]},
                  {label:"Ngũ Hành",val:`${ELEMENT_ICON[activeProfile.element]} ${ELEMENT_LABEL[activeProfile.element]}`},
                ].map(({label,val})=>(
                  <div key={label} className="flex flex-col items-center py-2 rounded-xl"
                    style={{background:"var(--bg-elevated)"}}>
                    <p className="section-label mb-0.5">{label}</p>
                    <p className="font-bold" style={{color:"var(--text-primary)"}}>{val}</p>
                  </div>
                ))}
              </div>

              {justSaved && (
                <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="text-center text-sm mt-3 font-semibold"
                  style={{color:"var(--accent-emerald)"}}>✅ Đã lưu!</motion.p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : null}

      {/* Shopee recommendation */}
      {shopee && activeProfile && (
        <a href={shopee.url} target="_blank" rel="noopener noreferrer"
          className="card p-4 flex items-center gap-3 no-underline">
          <span className="text-2xl">{shopee.emoji}</span>
          <div className="flex-1">
            <p className="section-label mb-0.5">Vật phẩm hợp mệnh</p>
            <p className="font-semibold text-sm" style={{color:"var(--text-primary)"}}>{shopee.name}</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg font-bold"
            style={{background:"var(--gold-bg)",color:"var(--gold)"}}>Xem →</span>
        </a>
      )}
    </div>
  );
}
