// src/lib/banMenh.ts — Cung bản mệnh & Nạp Âm Ngũ Hành

export interface NapAmInfo {
  hanh:  string;  // Kim / Mộc / Thủy / Hỏa / Thổ
  moTa:  string;  // "Thiên Hà Thủy — Nước sông Ngân"
}

// Bảng Nạp Âm đủ 60 can chi
export const NAP_AM: Record<string, NapAmInfo> = {
  'Giáp Tý':  {hanh:'Kim', moTa:'Hải Trung Kim — Vàng trong biển'},
  'Ất Sửu':   {hanh:'Kim', moTa:'Hải Trung Kim — Vàng trong biển'},
  'Bính Dần': {hanh:'Hỏa', moTa:'Lô Trung Hỏa — Lửa trong lò'},
  'Đinh Mão': {hanh:'Hỏa', moTa:'Lô Trung Hỏa — Lửa trong lò'},
  'Mậu Thìn': {hanh:'Mộc', moTa:'Đại Lâm Mộc — Rừng lớn'},
  'Kỷ Tỵ':   {hanh:'Mộc', moTa:'Đại Lâm Mộc — Rừng lớn'},
  'Canh Ngọ': {hanh:'Thổ', moTa:'Lộ Bàng Thổ — Đất bên đường'},
  'Tân Mùi':  {hanh:'Thổ', moTa:'Lộ Bàng Thổ — Đất bên đường'},
  'Nhâm Thân':{hanh:'Kim', moTa:'Kiếm Phong Kim — Vàng mũi kiếm'},
  'Quý Dậu':  {hanh:'Kim', moTa:'Kiếm Phong Kim — Vàng mũi kiếm'},
  'Giáp Tuất':{hanh:'Hỏa', moTa:'Sơn Đầu Hỏa — Lửa trên núi'},
  'Ất Hợi':   {hanh:'Hỏa', moTa:'Sơn Đầu Hỏa — Lửa trên núi'},
  'Bính Tý':  {hanh:'Thủy', moTa:'Giản Hạ Thủy — Nước dưới suối'},
  'Đinh Sửu': {hanh:'Thủy', moTa:'Giản Hạ Thủy — Nước dưới suối'},
  'Mậu Dần':  {hanh:'Thổ', moTa:'Thành Đầu Thổ — Đất đầu thành'},
  'Kỷ Mão':   {hanh:'Thổ', moTa:'Thành Đầu Thổ — Đất đầu thành'},
  'Canh Thìn': {hanh:'Kim', moTa:'Bạch Lạp Kim — Vàng sáp trắng'},
  'Tân Tỵ':   {hanh:'Kim', moTa:'Bạch Lạp Kim — Vàng sáp trắng'},
  'Nhâm Ngọ': {hanh:'Mộc', moTa:'Dương Liễu Mộc — Cây liễu'},
  'Quý Mùi':  {hanh:'Mộc', moTa:'Dương Liễu Mộc — Cây liễu'},
  'Giáp Thân':{hanh:'Thủy', moTa:'Tuyền Trung Thủy — Nước trong suối'},
  'Ất Dậu':   {hanh:'Thủy', moTa:'Tuyền Trung Thủy — Nước trong suối'},
  'Bính Tuất':{hanh:'Thổ', moTa:'Ốc Thượng Thổ — Đất trên nhà'},
  'Đinh Hợi': {hanh:'Thổ', moTa:'Ốc Thượng Thổ — Đất trên nhà'},
  'Mậu Tý':   {hanh:'Hỏa', moTa:'Tích Lịch Hỏa — Lửa sấm sét'},
  'Kỷ Sửu':   {hanh:'Hỏa', moTa:'Tích Lịch Hỏa — Lửa sấm sét'},
  'Canh Dần': {hanh:'Mộc', moTa:'Tùng Bách Mộc — Cây thông bách'},
  'Tân Mão':  {hanh:'Mộc', moTa:'Tùng Bách Mộc — Cây thông bách'},
  'Nhâm Thìn':{hanh:'Thủy', moTa:'Trường Lưu Thủy — Nước chảy dài'},
  'Quý Tỵ':  {hanh:'Thủy', moTa:'Trường Lưu Thủy — Nước chảy dài'},
  'Giáp Ngọ':{hanh:'Kim', moTa:'Sa Trung Kim — Vàng trong cát'},
  'Ất Mùi':  {hanh:'Kim', moTa:'Sa Trung Kim — Vàng trong cát'},
  'Bính Thân':{hanh:'Hỏa', moTa:'Sơn Hạ Hỏa — Lửa dưới núi'},
  'Đinh Dậu': {hanh:'Hỏa', moTa:'Sơn Hạ Hỏa — Lửa dưới núi'},
  'Mậu Tuất': {hanh:'Mộc', moTa:'Bình Địa Mộc — Cây đồng bằng'},
  'Kỷ Hợi':   {hanh:'Mộc', moTa:'Bình Địa Mộc — Cây đồng bằng'},
  'Canh Tý':  {hanh:'Thổ', moTa:'Bích Thượng Thổ — Đất trên vách'},
  'Tân Sửu':  {hanh:'Thổ', moTa:'Bích Thượng Thổ — Đất trên vách'},
  'Nhâm Dần': {hanh:'Kim', moTa:'Kim Bạch Kim — Vàng pha lê'},
  'Quý Mão':  {hanh:'Kim', moTa:'Kim Bạch Kim — Vàng pha lê'},
  'Giáp Thìn':{hanh:'Hỏa', moTa:'Phú Đăng Hỏa — Lửa đèn dầu'},
  'Ất Tỵ':    {hanh:'Hỏa', moTa:'Phú Đăng Hỏa — Lửa đèn dầu'},
  'Bính Ngọ': {hanh:'Thủy', moTa:'Thiên Hà Thủy — Nước sông Ngân'},
  'Đinh Mùi': {hanh:'Thủy', moTa:'Thiên Hà Thủy — Nước sông Ngân'},
  'Mậu Thân': {hanh:'Thổ', moTa:'Đại Dịch Thổ — Đất bãi lớn'},
  'Kỷ Dậu':   {hanh:'Thổ', moTa:'Đại Dịch Thổ — Đất bãi lớn'},
  'Canh Tuất':{hanh:'Kim', moTa:'Thoa Xuyến Kim — Vàng trâm vòng'},
  'Tân Hợi':  {hanh:'Kim', moTa:'Thoa Xuyến Kim — Vàng trâm vòng'},
  'Nhâm Tý':  {hanh:'Mộc', moTa:'Tang Đố Mộc — Cây dâu tằm'},
  'Quý Sửu':  {hanh:'Mộc', moTa:'Tang Đố Mộc — Cây dâu tằm'},
  'Giáp Dần': {hanh:'Thủy', moTa:'Đại Khê Thủy — Nước suối lớn'},
  'Ất Mão':   {hanh:'Thủy', moTa:'Đại Khê Thủy — Nước suối lớn'},
  'Bính Thìn':{hanh:'Thổ', moTa:'Sa Trung Thổ — Đất trong cát'},
  'Đinh Tỵ':  {hanh:'Thổ', moTa:'Sa Trung Thổ — Đất trong cát'},
  'Mậu Ngọ':  {hanh:'Hỏa', moTa:'Thiên Thượng Hỏa — Lửa trời'},
  'Kỷ Mùi':   {hanh:'Hỏa', moTa:'Thiên Thượng Hỏa — Lửa trời'},
  'Canh Thân':{hanh:'Mộc', moTa:'Thạch Lựu Mộc — Cây lựu đá'},
  'Tân Dậu':  {hanh:'Mộc', moTa:'Thạch Lựu Mộc — Cây lựu đá'},
  'Nhâm Tuất':{hanh:'Thủy', moTa:'Đại Hải Thủy — Nước biển lớn'},
  'Quý Hợi':  {hanh:'Thủy', moTa:'Đại Hải Thủy — Nước biển lớn'},
};

const MAU_HOP: Record<string, string[]> = {
  Kim: ['Trắng','Bạc','Vàng nhạt'], Mộc: ['Xanh lá','Xanh lam','Xanh đậm'],
  Thủy: ['Đen','Xanh đậm','Tím'], Hỏa: ['Đỏ','Cam','Tím'], Thổ: ['Vàng','Nâu','Cam'],
};
const MAU_KY: Record<string, string[]> = {
  Kim: ['Đỏ','Cam'], Mộc: ['Trắng','Bạc'], Thủy: ['Vàng','Nâu'],
  Hỏa: ['Đen','Xanh đậm'], Thổ: ['Xanh lá','Xanh lam'],
};
const HUONG_HOP: Record<string, string[]> = {
  Kim: ['Tây','Tây Bắc'], Mộc: ['Đông','Đông Nam'],
  Thủy: ['Bắc'], Hỏa: ['Nam'], Thổ: ['Trung tâm','Đông Bắc','Tây Nam'],
};
const NGHE_HOP: Record<string, string[]> = {
  Kim: ['Tài chính','Ngân hàng','Công nghệ','Kỹ thuật'],
  Mộc: ['Giáo dục','Y tế','Nghệ thuật','Nông nghiệp'],
  Thủy: ['Thương mại','Giao tiếp','Du lịch','Truyền thông'],
  Hỏa: ['Marketing','Giải trí','Nhà hàng','Thể thao'],
  Thổ: ['Bất động sản','Xây dựng','Nông nghiệp','Quản lý'],
};

const CAN  = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI  = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const GIAP = ['Chuột','Trâu','Hổ','Mèo','Rồng','Rắn','Ngựa','Dê','Khỉ','Gà','Chó','Lợn'];

export interface BanMenhResult {
  namSinh:      number;
  canChi:       string;
  conGiap:      string;
  napAm:        NapAmInfo;
  mauHop:       string[];
  mauKy:        string[];
  huongHop:     string[];
  ngheNghiep:   string[];
  tuongHop:     string[];
  tuongKy:      string[];
  moTa:         string;
}

export function getBanMenh(namSinh: number): BanMenhResult {
  const canChi  = `${CAN[(namSinh + 6) % 10]} ${CHI[(namSinh + 8) % 12]}`;
  const conGiap = GIAP[(namSinh + 8) % 12] ?? 'Chuột';
  const napAm   = NAP_AM[canChi] ?? { hanh: 'Thổ', moTa: 'Đại Dịch Thổ — Đất bãi lớn' };
  const hanh    = napAm.hanh;

  // Tam hợp chi
  const tamHopSets = [['Tý','Thìn','Thân'],['Sửu','Tỵ','Dậu'],['Dần','Ngọ','Tuất'],['Mão','Mùi','Hợi']];
  const chiNay = CHI[(namSinh + 8) % 12]!;
  const tamHop = tamHopSets.find(s => s.includes(chiNay)) ?? [];
  const tuongHop = tamHop.filter(c => c !== chiNay);

  // Lục xung
  const xungMap: Record<string,string> = {'Tý':'Ngọ','Ngọ':'Tý','Sửu':'Mùi','Mùi':'Sửu','Dần':'Thân','Thân':'Dần','Mão':'Dậu','Dậu':'Mão','Thìn':'Tuất','Tuất':'Thìn','Tỵ':'Hợi','Hợi':'Tỵ'};
  const tuongKy = xungMap[chiNay] ? [xungMap[chiNay]!] : [];

  const moTa = `Người tuổi ${canChi} mang mệnh ${napAm.moTa}. Hành ${hanh} chủ đạo cho bạn thiên hướng về ${(NGHE_HOP[hanh] ?? []).slice(0,2).join(', ')}. Màu sắc hợp mệnh là ${(MAU_HOP[hanh] ?? []).join(', ')}, hướng tốt là ${(HUONG_HOP[hanh] ?? []).join(', ')}. Năm 2027 (Đinh Mùi — Thiên Hà Thủy) ảnh hưởng như thế nào đến bạn phụ thuộc vào tương tác giữa hành ${hanh} và hành Thủy của năm.`;

  return {
    namSinh, canChi, conGiap, napAm,
    mauHop:     MAU_HOP[hanh]   ?? [],
    mauKy:      MAU_KY[hanh]    ?? [],
    huongHop:   HUONG_HOP[hanh] ?? [],
    ngheNghiep: NGHE_HOP[hanh]  ?? [],
    tuongHop, tuongKy, moTa,
  };
}
