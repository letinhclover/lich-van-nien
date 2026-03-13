// ============================================================
// shareImage.ts — Tạo ảnh share bằng Canvas 2D API
// Không cần thư viện ngoài, hoạt động trên mọi trình duyệt
// ============================================================

const FONT_BODY   = "Be Vietnam Pro, system-ui, sans-serif";
const DARK_BG     = "#070B17";
const GOLD        = "#F5A623";
const TEXT_PRI    = "#F8F4ED";
const TEXT_SEC    = "#C9B99A";
const TEXT_FAINT  = "#6B5F4E";
const CARD_BG     = "#111827";
const BORDER      = "#2A2014";

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ─── Ảnh AI Luận Giải hàng ngày ──────────────────────────────
export async function shareFortuneImage(opts: {
  dateLabel: string;
  canChiDay: string;
  topic: string;
  content: string;
  canChiYear: string;
}): Promise<boolean> {
  const W = 800, H = 520, PAD = 40, R = 20;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return false;

  // Background
  ctx.fillStyle = DARK_BG;
  roundRect(ctx, 0, 0, W, H, R);
  ctx.fill();

  // Gold top stripe
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#B8720A");
  grad.addColorStop(1, "#F5A623");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 5);

  // Card background
  ctx.fillStyle = CARD_BG;
  roundRect(ctx, PAD, 28, W - PAD * 2, H - 90, 16);
  ctx.fill();
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Header: emoji + topic
  ctx.font = `700 18px ${FONT_BODY}`;
  ctx.fillStyle = GOLD;
  ctx.textBaseline = "middle";
  ctx.fillText(`✨ ${opts.topic}`, PAD + 20, 66);

  // Date
  ctx.font = `400 14px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_FAINT;
  ctx.textAlign = "right";
  ctx.fillText(`${opts.canChiDay} · ${opts.dateLabel}`, W - PAD - 20, 66);
  ctx.textAlign = "left";

  // Divider
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD + 20, 86);
  ctx.lineTo(W - PAD - 20, 86);
  ctx.stroke();

  // Content text (wrap)
  ctx.font = `400 17px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_PRI;
  ctx.textBaseline = "top";
  const lines = wrapText(ctx, opts.content, W - PAD * 2 - 60);
  let y = 106;
  const LINE_H = 30;
  for (const line of lines.slice(0, 9)) {
    ctx.fillText(line, PAD + 20, y);
    y += LINE_H;
    if (y > H - 110) { break; }
  }

  // Bottom row
  const botY = H - 58;

  // Can chi badge
  ctx.fillStyle = "rgba(245,166,35,0.12)";
  roundRect(ctx, PAD, botY, 160, 36, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(245,166,35,0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.font = `600 14px ${FONT_BODY}`;
  ctx.fillStyle = GOLD;
  ctx.textBaseline = "middle";
  ctx.fillText(`🪐 Tuổi ${opts.canChiYear}`, PAD + 12, botY + 18);

  // Watermark
  ctx.font = `500 13px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_FAINT;
  ctx.textAlign = "right";
  ctx.fillText("📅 Lịch Vạn Niên AI 2026", W - PAD, botY + 18);
  ctx.textAlign = "left";

  return _doShare(canvas, `luận giải ${opts.topic.toLowerCase()} - Lịch Vạn Niên AI`, opts.content.slice(0, 100) + "...");
}

// ─── Ảnh Tử Vi Trọn Đời ──────────────────────────────────────
export async function shareTuviImage(opts: {
  canChiYear: string;
  gender: string;
  sections: { emoji: string; label: string; content: string }[];
}): Promise<boolean> {
  const W = 800, H = 600, PAD = 40;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return false;

  ctx.fillStyle = DARK_BG;
  roundRect(ctx, 0, 0, W, H, 20);
  ctx.fill();

  // Gold stripe
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#B8720A");
  grad.addColorStop(1, "#F5A623");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 5);

  // Title
  ctx.font = `700 22px ${FONT_BODY}`;
  ctx.fillStyle = GOLD;
  ctx.textBaseline = "middle";
  ctx.fillText("🔮 Tử Vi Trọn Đời", PAD, 40);

  ctx.font = `400 14px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_SEC;
  ctx.textAlign = "right";
  ctx.fillText(`${opts.gender === "nam" ? "👨" : "👩"} Tuổi ${opts.canChiYear}`, W - PAD, 40);
  ctx.textAlign = "left";

  // Divider
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, 60);
  ctx.lineTo(W - PAD, 60);
  ctx.stroke();

  // 4 sections in 2x2 grid
  const secW = (W - PAD * 2 - 16) / 2;
  const secH = (H - 90) / 2 - 12;
  opts.sections.slice(0, 4).forEach((sec, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = PAD + col * (secW + 16);
    const y = 72 + row * (secH + 12);

    ctx.fillStyle = CARD_BG;
    roundRect(ctx, x, y, secW, secH, 12);
    ctx.fill();
    ctx.strokeStyle = BORDER;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Label
    ctx.font = `700 13px ${FONT_BODY}`;
    ctx.fillStyle = GOLD;
    ctx.textBaseline = "top";
    ctx.fillText(`${sec.emoji} ${sec.label}`, x + 12, y + 12);

    // Content wrap
    ctx.font = `400 12px ${FONT_BODY}`;
    ctx.fillStyle = TEXT_SEC;
    const lines = wrapText(ctx, sec.content, secW - 24);
    lines.slice(0, 4).forEach((line, li) => {
      ctx.fillText(line, x + 12, y + 34 + li * 18);
    });
  });

  // Watermark
  ctx.font = `500 12px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_FAINT;
  ctx.textAlign = "center";
  ctx.fillText("📅 Lịch Vạn Niên AI 2026 — lich-van-nien.pages.dev", W / 2, H - 16);

  const text = opts.sections.map(s => `${s.emoji} ${s.label}: ${s.content.slice(0, 80)}...`).join("\n\n");
  return _doShare(canvas, `Tử vi tuổi ${opts.canChiYear}`, text);
}

// ─── Ảnh Xem Tuổi ────────────────────────────────────────────
export async function shareXemTuoiImage(opts: {
  mode: "capdoi" | "laman";
  canChiA: string;
  canChiB: string;
  labelA: string;
  labelB: string;
  diem: number;
  danhGia: string;
  tongQuan: string;
  ketLuan: string;
}): Promise<boolean> {
  const W = 800, H = 440, PAD = 40;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return false;

  ctx.fillStyle = DARK_BG;
  roundRect(ctx, 0, 0, W, H, 20);
  ctx.fill();

  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#B8720A");
  grad.addColorStop(1, "#F5A623");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 5);

  // Header
  const icon = opts.mode === "capdoi" ? "💑 Hợp Đôi Tình Duyên" : "🤝 Làm Ăn Chung";
  ctx.font = `700 20px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_PRI;
  ctx.textBaseline = "middle";
  ctx.fillText(icon, PAD, 38);

  // The two people
  ctx.font = `600 16px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_SEC;
  ctx.textAlign = "right";
  ctx.fillText(`${opts.labelA} ${opts.canChiA}  ⟷  ${opts.labelB} ${opts.canChiB}`, W - PAD, 38);
  ctx.textAlign = "left";

  // Score circle
  const score = Math.round(opts.diem);
  const scoreColor = score >= 80 ? "#4ade80" : score >= 60 ? GOLD : score >= 40 ? "#fb923c" : "#f87171";
  const cx = PAD + 50, cy = 130, radius = 46;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(245,166,35,0.08)";
  ctx.fill();
  ctx.strokeStyle = scoreColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.font = `800 28px ${FONT_BODY}`;
  ctx.fillStyle = scoreColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${score}`, cx, cy - 6);
  ctx.font = `500 11px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_FAINT;
  ctx.fillText("điểm", cx, cy + 14);

  // Danh gia + tong quan
  ctx.textAlign = "left";
  ctx.font = `700 18px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_PRI;
  ctx.textBaseline = "top";
  ctx.fillText(opts.danhGia, PAD + 110, 98);

  ctx.font = `400 14px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_SEC;
  const lines = wrapText(ctx, opts.tongQuan, W - PAD * 2 - 120);
  lines.slice(0, 3).forEach((l, i) => ctx.fillText(l, PAD + 110, 124 + i * 22));

  // Divider
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, 196);
  ctx.lineTo(W - PAD, 196);
  ctx.stroke();

  // Ket luan box
  ctx.fillStyle = "rgba(245,166,35,0.06)";
  roundRect(ctx, PAD, 210, W - PAD * 2, 150, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(245,166,35,0.2)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = `600 13px ${FONT_BODY}`;
  ctx.fillStyle = GOLD;
  ctx.textBaseline = "top";
  ctx.fillText("💡 Kết Luận", PAD + 16, 226);

  ctx.font = `400 14px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_SEC;
  const kLines = wrapText(ctx, opts.ketLuan, W - PAD * 2 - 32);
  kLines.slice(0, 5).forEach((l, i) => ctx.fillText(l, PAD + 16, 248 + i * 22));

  // Watermark
  ctx.font = `500 12px ${FONT_BODY}`;
  ctx.fillStyle = TEXT_FAINT;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("📅 Lịch Vạn Niên AI 2026 — lich-van-nien.pages.dev", W / 2, H - 8);

  return _doShare(canvas, opts.mode === "capdoi" ? `Xem tuổi hợp đôi: ${opts.canChiA} & ${opts.canChiB}` : `Xem tuổi làm ăn: ${opts.canChiA} & ${opts.canChiB}`, opts.ketLuan);
}

// ─── Internal: share or download canvas ──────────────────────
async function _doShare(canvas: HTMLCanvasElement, title: string, text: string): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, "image/png", 0.95));
    if (!blob) return _fallbackDownload(canvas, title);

    if (navigator.share && navigator.canShare?.({ files: [new File([blob], "lichvannien.png", { type: "image/png" })] })) {
      await navigator.share({
        title,
        text: `${text}\n\n📅 Lịch Vạn Niên AI 2026`,
        files: [new File([blob], "lichvannien.png", { type: "image/png" })],
      });
      return true;
    }
    // Fallback: share link only
    if (navigator.share) {
      await navigator.share({ title, text: `${text}\n\nhttps://lich-van-nien.pages.dev` });
      return true;
    }
    return _fallbackDownload(canvas, title);
  } catch {
    return false;
  }
}

function _fallbackDownload(canvas: HTMLCanvasElement, title: string): boolean {
  try {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png", 0.95);
    a.download = `lichvannien-${title.replace(/\s+/g, "-").slice(0, 30)}.png`;
    a.click();
    return true;
  } catch { return false; }
}
