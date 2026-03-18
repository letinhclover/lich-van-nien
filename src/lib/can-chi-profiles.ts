// src/lib/can-chi-profiles.ts — 60 trang can chi evergreen
export interface CanChiProfile {
  slug:        string;
  name:        string;   // "Giáp Tý"
  can:         string;
  chi:         string;
  nguHanh:     string;
  color:       string;   // hex màu chủ đạo
  conGiap:     string;
  meaning:     string;   // ý nghĩa can chi
  personality: string[]; // tính cách 4-5 điểm
  colors:      string[]; // màu hợp
  direction:   string;   // hướng tốt
  luckyNums:   number[]; // số may mắn
  compatible:  string[]; // tương sinh
  incompatible:string[]; // tương khắc
}

const CAN  = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI  = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const GIAP = ['Chuột','Trâu','Hổ','Mèo','Rồng','Rắn','Ngựa','Dê','Khỉ','Gà','Chó','Lợn'];

const NGU_HANH_CAN = ['Mộc','Mộc','Hỏa','Hỏa','Thổ','Thổ','Kim','Kim','Thủy','Thủy'];
const NGU_HANH_CHI = ['Thủy','Thổ','Mộc','Mộc','Thổ','Hỏa','Hỏa','Thổ','Kim','Kim','Thổ','Thủy'];

const NH_COLOR: Record<string,string> = {
  'Mộc':'#16a34a','Hỏa':'#dc2626','Thổ':'#d97706','Kim':'#9ca3af','Thủy':'#2563eb',
};
const NH_DIR: Record<string,string> = {
  'Mộc':'Đông, Đông Nam','Hỏa':'Nam','Thổ':'Trung tâm, Tây Nam, Đông Bắc','Kim':'Tây, Tây Bắc','Thủy':'Bắc',
};
const NH_COLORS: Record<string,string[]> = {
  'Mộc':['Xanh lá','Xanh lam','Đen'],'Hỏa':['Đỏ','Cam','Tím'],
  'Thổ':['Vàng','Nâu','Cam'],'Kim':['Trắng','Bạc','Xám'],'Thủy':['Đen','Xanh đậm','Trắng'],
};
const NH_LUCKY: Record<string,number[]> = {
  'Mộc':[3,4,8],'Hỏa':[2,7,9],'Thổ':[2,5,8],'Kim':[4,9,1],'Thủy':[1,6,8],
};
const NH_COMPAT: Record<string,string[]> = {
  'Mộc':['Thủy','Hỏa'],'Hỏa':['Mộc','Thổ'],'Thổ':['Hỏa','Kim'],'Kim':['Thổ','Thủy'],'Thủy':['Kim','Mộc'],
};
const NH_INCOMPAT: Record<string,string[]> = {
  'Mộc':['Kim','Thổ'],'Hỏa':['Thủy','Kim'],'Thổ':['Mộc','Thủy'],'Kim':['Hỏa','Mộc'],'Thủy':['Thổ','Hỏa'],
};

// Tính cách theo Can
const CAN_MEANING: Record<string,string> = {
  'Giáp':'Mạnh mẽ, tiên phong, lãnh đạo, kiên định',
  'Ất':'Linh hoạt, nhẫn nại, khéo léo, thích nghi tốt',
  'Bính':'Năng động, nhiệt huyết, sáng tạo, ham học hỏi',
  'Đinh':'Tinh tế, nhạy cảm, sâu sắc, trực giác tốt',
  'Mậu':'Ổn định, đáng tin, thực tế, kiên nhẫn',
  'Kỷ':'Tỉ mỉ, cẩn thận, chu đáo, trung thực',
  'Canh':'Quyết đoán, nguyên tắc, cứng rắn, công bằng',
  'Tân':'Thông minh, tinh tế, cầu toàn, nhạy bén',
  'Nhâm':'Sâu sắc, linh hoạt, trí tuệ, thích khám phá',
  'Quý':'Nhạy cảm, sáng tạo, trực giác mạnh, bí ẩn',
};

// Tính cách theo Chi
const CHI_MEANING: Record<string,string> = {
  'Tý':'Thông minh, nhanh nhạy, năng động, đa tài',
  'Sửu':'Chăm chỉ, kiên nhẫn, đáng tin, thực dụng',
  'Dần':'Dũng cảm, nhiệt tình, độc lập, lãnh đạo',
  'Mão':'Dịu dàng, khéo léo, nghệ thuật, thân thiện',
  'Thìn':'Tự tin, tham vọng, tài năng, cầu toàn',
  'Tỵ':'Sâu sắc, thông minh, bí ẩn, nhạy cảm',
  'Ngọ':'Vui vẻ, nhiệt tình, phóng khoáng, năng động',
  'Mùi':'Nhân hậu, ôn hoà, chân thành, nghệ thuật',
  'Thân':'Thông minh, lanh lợi, đa tài, hài hước',
  'Dậu':'Cẩn thận, tỉ mỉ, trung thực, nguyên tắc',
  'Tuất':'Trung thành, dũng cảm, thực tế, đáng tin',
  'Hợi':'Rộng lượng, hào phóng, chân thành, hiền lành',
};

function makeProfile(canIdx: number, chiIdx: number): CanChiProfile {
  const can  = CAN[canIdx]!;
  const chi  = CHI[chiIdx]!;
  const name = `${can} ${chi}`;
  const slug = name.toLowerCase()
    .replace(/à/g,'a').replace(/á/g,'a').replace(/ả/g,'a').replace(/ã/g,'a').replace(/ạ/g,'a')
    .replace(/ă/g,'a').replace(/ắ/g,'a').replace(/ằ/g,'a').replace(/ẳ/g,'a').replace(/ẵ/g,'a').replace(/ặ/g,'a')
    .replace(/â/g,'a').replace(/ấ/g,'a').replace(/ầ/g,'a').replace(/ẩ/g,'a').replace(/ẫ/g,'a').replace(/ậ/g,'a')
    .replace(/è/g,'e').replace(/é/g,'e').replace(/ẻ/g,'e').replace(/ẽ/g,'e').replace(/ẹ/g,'e')
    .replace(/ê/g,'e').replace(/ế/g,'e').replace(/ề/g,'e').replace(/ể/g,'e').replace(/ễ/g,'e').replace(/ệ/g,'e')
    .replace(/ì/g,'i').replace(/í/g,'i').replace(/ỉ/g,'i').replace(/ĩ/g,'i').replace(/ị/g,'i')
    .replace(/ò/g,'o').replace(/ó/g,'o').replace(/ỏ/g,'o').replace(/õ/g,'o').replace(/ọ/g,'o')
    .replace(/ô/g,'o').replace(/ố/g,'o').replace(/ồ/g,'o').replace(/ổ/g,'o').replace(/ỗ/g,'o').replace(/ộ/g,'o')
    .replace(/ơ/g,'o').replace(/ớ/g,'o').replace(/ờ/g,'o').replace(/ở/g,'o').replace(/ỡ/g,'o').replace(/ợ/g,'o')
    .replace(/ù/g,'u').replace(/ú/g,'u').replace(/ủ/g,'u').replace(/ũ/g,'u').replace(/ụ/g,'u')
    .replace(/ư/g,'u').replace(/ứ/g,'u').replace(/ừ/g,'u').replace(/ử/g,'u').replace(/ữ/g,'u').replace(/ự/g,'u')
    .replace(/ỳ/g,'y').replace(/ý/g,'y').replace(/ỷ/g,'y').replace(/ỹ/g,'y').replace(/ỵ/g,'y')
    .replace(/đ/g,'d').replace(/\s+/g,'-');

  const nhCan   = NGU_HANH_CAN[canIdx]!;
  const nhChi   = NGU_HANH_CHI[chiIdx]!;
  // Ngũ hành tổng hợp = ngũ hành can (chủ đạo)
  const nguHanh = nhCan;

  return {
    slug,
    name,
    can,
    chi,
    nguHanh,
    color:      NH_COLOR[nguHanh] ?? '#6b7280',
    conGiap:    GIAP[chiIdx]!,
    meaning:    `${CAN_MEANING[can]} · ${CHI_MEANING[chi]}`,
    personality:[
      `${CAN_MEANING[can].split(',')[0]} theo bản chất Can ${can}`,
      `${CHI_MEANING[chi].split(',')[0]} theo tính cách Chi ${chi}`,
      `Ngũ hành ${nguHanh} — ${nguHanh==='Mộc'?'sinh trưởng phát triển':nguHanh==='Hỏa'?'năng động nhiệt huyết':nguHanh==='Thổ'?'ổn định kiên định':nguHanh==='Kim'?'quyết đoán nguyên tắc':'linh hoạt thích nghi'}`,
      `Con giáp ${GIAP[chiIdx]} mang lại ${chiIdx%2===0?'may mắn và năng lượng tích cực':'sự khôn ngoan và bền bỉ'}`,
    ],
    colors:      NH_COLORS[nguHanh] ?? ['Trắng','Xám'],
    direction:   NH_DIR[nguHanh] ?? 'Trung tâm',
    luckyNums:   NH_LUCKY[nguHanh] ?? [1,6,8],
    compatible:  NH_COMPAT[nguHanh] ?? [],
    incompatible:NH_INCOMPAT[nguHanh] ?? [],
  };
}

// Generate 60 can chi
export const CAN_CHI_PROFILES: CanChiProfile[] = Array.from({ length: 60 }, (_, i) => {
  const canIdx = i % 10;
  const chiIdx = i % 12;
  return makeProfile(canIdx, chiIdx);
});

export default CAN_CHI_PROFILES;
