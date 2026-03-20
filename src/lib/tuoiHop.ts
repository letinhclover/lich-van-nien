// src/lib/tuoiHop.ts — Xem tuổi vợ chồng hợp không

const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const NH  = ['Mộc','Mộc','Hỏa','Hỏa','Thổ','Thổ','Kim','Kim','Thủy','Thủy'];

const TAM_HOP = [
  ['Tý','Thìn','Thân'], // Thủy cục
  ['Sửu','Tỵ','Dậu'],  // Kim cục
  ['Dần','Ngọ','Tuất'], // Hỏa cục
  ['Mão','Mùi','Hợi'],  // Mộc cục
];

const LUC_HOP = [
  ['Tý','Sửu'],['Dần','Hợi'],['Mão','Tuất'],
  ['Thìn','Dậu'],['Tỵ','Thân'],['Ngọ','Mùi'],
];

const LUC_XUNG = [
  ['Tý','Ngọ'],['Sửu','Mùi'],['Dần','Thân'],
  ['Mão','Dậu'],['Thìn','Tuất'],['Tỵ','Hợi'],
];

const LUC_HAI = [
  ['Tý','Mùi'],['Sửu','Ngọ'],['Dần','Tỵ'],
  ['Mão','Thìn'],['Thân','Hợi'],['Dậu','Tuất'],
];

const MAU_HOP: Record<string, string[]> = {
  'Mộc':['Xanh lá','Xanh lam'],'Hỏa':['Đỏ','Tím','Cam'],
  'Thổ':['Vàng','Nâu','Cam'],'Kim':['Trắng','Bạc','Vàng'],'Thủy':['Đen','Xanh đậm'],
};

export type KetQua = 'tam-hop'|'luc-hop'|'binh-thuong'|'luc-hai'|'luc-xung';

export interface TuoiHopResult {
  nam: { namSinh: number; tuoi: string; menh: string };
  nu:  { namSinh: number; tuoi: string; menh: string };
  ketQua: KetQua;
  diemSo: number; // 1-5
  nhanXet: string;
  chiTiet: string[];
  mauHopNhau: string[];
}

function chiOf(namSinh: number): string { return CHI[(namSinh + 8) % 12]!; }
function canOf(namSinh: number): string { return CAN[(namSinh + 6) % 10]!; }
function tuoiOf(namSinh: number): string { return `${canOf(namSinh)} ${chiOf(namSinh)}`; }
function menhOf(namSinh: number): string { return NH[(namSinh + 6) % 10]!; }

function pairIn(arr: string[][], a: string, b: string): boolean {
  return arr.some(p => (p.includes(a) && p.includes(b)));
}

export function xemTuoiHop(namSinhNam: number, namSinhNu: number): TuoiHopResult {
  const chiNam = chiOf(namSinhNam);
  const chiNu  = chiOf(namSinhNu);
  const menhNam = menhOf(namSinhNam);
  const menhNu  = menhOf(namSinhNu);

  // Check relationships
  const isTamHop  = TAM_HOP.some(g => g.includes(chiNam) && g.includes(chiNu));
  const isLucHop  = pairIn(LUC_HOP,  chiNam, chiNu);
  const isLucXung = pairIn(LUC_XUNG, chiNam, chiNu);
  const isLucHai  = pairIn(LUC_HAI,  chiNam, chiNu);

  let ketQua: KetQua;
  let diemSo: number;
  let nhanXet: string;
  const chiTiet: string[] = [];

  if (isTamHop) {
    ketQua = 'tam-hop'; diemSo = 5;
    nhanXet = `Tuyệt vời! Tuổi ${chiNam} và ${chiNu} thuộc cùng bộ Tam Hợp — đây là mức độ hợp nhau cao nhất trong phong tục truyền thống Việt Nam.`;
    chiTiet.push(`${chiNam} và ${chiNu} tam hợp — cùng hành cục, bổ trợ nhau toàn diện`);
    chiTiet.push('Hôn nhân bền vững, sự nghiệp thuận lợi khi hai người cùng nhau');
    chiTiet.push('Tốt cho: kết hôn, kinh doanh chung, sinh con');
  } else if (isLucHop) {
    ketQua = 'luc-hop'; diemSo = 4;
    nhanXet = `Rất tốt! Tuổi ${chiNam} và ${chiNu} lục hợp — hai tuổi bổ trợ nhau, gia đình hòa thuận.`;
    chiTiet.push(`${chiNam} và ${chiNu} lục hợp — hợp duyên, dễ đồng thuận`);
    chiTiet.push('Cuộc sống hôn nhân hòa hợp, ít mâu thuẫn lớn');
    chiTiet.push('Tốt cho: kết hôn, xây dựng gia đình');
  } else if (isLucHai) {
    ketQua = 'luc-hai'; diemSo = 2;
    nhanXet = `Cần lưu ý: Tuổi ${chiNam} và ${chiNu} lục hại — có thể có một số mâu thuẫn, cần cả hai nhường nhịn nhau.`;
    chiTiet.push(`${chiNam} và ${chiNu} lục hại — dễ xảy ra tranh cãi nhỏ`);
    chiTiet.push('Cần chú ý giao tiếp, tránh để mâu thuẫn nhỏ tích tụ');
    chiTiet.push('Có thể hóa giải bằng ngày tháng tốt và tâm lý vững');
  } else if (isLucXung) {
    ketQua = 'luc-xung'; diemSo = 1;
    nhanXet = `Cần cân nhắc kỹ: Tuổi ${chiNam} và ${chiNu} lục xung — hai tuổi khắc nhau theo quan niệm truyền thống.`;
    chiTiet.push(`${chiNam} và ${chiNu} lục xung — khắc khí, cần hóa giải`);
    chiTiet.push('Theo phong tục: nên chọn ngày giờ tốt để hóa giải, tham khảo thầy phong thủy');
    chiTiet.push('Hôn nhân vẫn có thể hạnh phúc nếu hai bên hiểu và tôn trọng nhau');
  } else {
    ketQua = 'binh-thuong'; diemSo = 3;
    nhanXet = `Bình thường: Tuổi ${chiNam} và ${chiNu} không có quan hệ đặc biệt — hôn nhân phụ thuộc vào nỗ lực của hai người.`;
    chiTiet.push(`${chiNam} và ${chiNu} không có xung hợp đặc biệt`);
    chiTiet.push('Hôn nhân phụ thuộc vào sự hiểu biết và tình cảm hai bên');
    chiTiet.push('Chú ý chọn ngày tốt để làm lễ');
  }

  // Ngũ hành nam-nữ
  chiTiet.push(`Mệnh ${menhNam} (nam) + Mệnh ${menhNu} (nữ)`);

  // Màu hợp chung
  const mauNam = MAU_HOP[menhNam] ?? [];
  const mauNu  = MAU_HOP[menhNu]  ?? [];
  const mauHopNhau = [...new Set([...mauNam, ...mauNu])].slice(0, 4);

  return {
    nam: { namSinh: namSinhNam, tuoi: tuoiOf(namSinhNam), menh: menhNam },
    nu:  { namSinh: namSinhNu,  tuoi: tuoiOf(namSinhNu),  menh: menhNu  },
    ketQua, diemSo, nhanXet, chiTiet, mauHopNhau,
  };
}
