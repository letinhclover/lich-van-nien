// ============================================================
// src/lib/tiet-khi-content.ts — Nội dung 24 tiết khí
// Đầy đủ data cho 6 tiết đầu; cấu trúc cho 18 tiết còn lại
// ============================================================

export interface TietKhiContent {
  slug:       string;
  name:       string;
  hanViet:    string;     // Hán Việt
  position:   number;     // 1–24
  sunDegree:  number;     // Kinh độ MT (285°, 300°, ...)
  season:     'xuân' | 'hạ' | 'thu' | 'đông';
  weather:    { bac: string; nam: string };
  meaning:    string;     // Ý nghĩa ngắn
  detail:     string;     // Đoạn mô tả ~150 chữ
  customs:    string[];   // Phong tục tập quán
  foods:      string[];   // Món ăn đặc trưng
  farming:    string;     // Nông nghiệp
  fengshui:   { colors: string[]; doNow: string[]; avoid: string[] };
  seoDesc:    string;     // Meta description
}

export const TIET_KHI_DATA: TietKhiContent[] = [
  {
    slug: 'tieu-han',
    name: 'Tiểu Hàn', hanViet: '小寒', position: 1, sunDegree: 285, season: 'đông',
    weather: {
      bac: 'Rét đậm, sương muối, nhiệt độ 10–16°C ở đồng bằng, dưới 0°C ở vùng cao',
      nam: 'Mát mẻ dễ chịu, nhiệt độ 20–27°C, ít mưa',
    },
    meaning: 'Lạnh nhẹ — bắt đầu mùa lạnh',
    detail: 'Tiểu Hàn (Lạnh Nhỏ) là tiết khí thứ 23 trong năm, mặt trời đạt kinh độ 285°. Đây là thời điểm bắt đầu giai đoạn lạnh nhất trong năm ở miền Bắc Việt Nam. Mặc dù tên gọi là "lạnh nhỏ" nhưng thực tế nhiều năm Tiểu Hàn lạnh hơn Đại Hàn. Người nông dân tranh thủ thu hoạch lúa mùa và chuẩn bị đất cho vụ xuân.',
    customs: ['Giữ ấm cơ thể, mặc thêm áo', 'Ăn các món nóng, bổ dưỡng', 'Chuẩn bị mua sắm Tết'],
    foods: ['Cháo gừng', 'Thịt chó', 'Bánh trôi nước', 'Lẩu các loại'],
    farming: 'Thu hoạch lúa mùa muộn, gieo mạ xuân sớm, chăm sóc rau màu vụ đông',
    fengshui: {
      colors: ['Đen', 'Xanh Navy', 'Xanh lam'],
      doNow: ['Dưỡng sức', 'Thiền định', 'Học tập', 'Lên kế hoạch năm mới'],
      avoid: ['Xuất hành xa khi trời rét đậm', 'Khởi công lớn'],
    },
    seoDesc: 'Tiểu Hàn 2026 ngày mấy? Ý nghĩa tiết Tiểu Hàn, thời tiết, phong tục và phong thuỷ Việt Nam.',
  },
  {
    slug: 'dai-han',
    name: 'Đại Hàn', hanViet: '大寒', position: 2, sunDegree: 300, season: 'đông',
    weather: {
      bac: 'Lạnh nhất trong năm, rét cắt da, sương giá, có thể có tuyết ở vùng cao',
      nam: 'Mát, nhiệt độ 20–26°C, hanh khô',
    },
    meaning: 'Lạnh lớn — lạnh nhất trong năm',
    detail: 'Đại Hàn (Lạnh Lớn) là tiết khí thứ 24 và cuối cùng trong chu kỳ, mặt trời đạt 300°. Đây là tiết khí kết thúc một năm âm lịch, thường rơi vào cuối tháng Chạp. Không khí lạnh giá nhất, nhưng cũng là lúc mọi người tất bật chuẩn bị đón Tết Nguyên Đán. Sau Đại Hàn sẽ sang Lập Xuân — bắt đầu chu kỳ mới.',
    customs: ['Sắm Tết, mua sắm cuối năm', 'Cúng ông Táo (23 tháng Chạp)', 'Dọn dẹp nhà cửa đón Xuân', 'Gói bánh chưng bánh tét'],
    foods: ['Bánh chưng', 'Giò chả', 'Dưa hành', 'Thịt đông', 'Canh bóng'],
    farming: 'Chuẩn bị giống cho vụ xuân, ủ phân, sửa chữa nông cụ',
    fengshui: {
      colors: ['Đỏ', 'Vàng', 'Cam — màu Tết mang may mắn'],
      doNow: ['Tất toán công việc cuối năm', 'Dọn dẹp nhà cửa', 'Trả nợ cũ', 'Lập kế hoạch năm mới'],
      avoid: ['Khởi sự việc lớn chưa hoàn thành trong năm', 'Cãi vã đầu năm'],
    },
    seoDesc: 'Đại Hàn 2026 ngày mấy? Ý nghĩa tiết Đại Hàn, thời tiết cuối năm, phong tục chuẩn bị Tết Việt Nam.',
  },
  {
    slug: 'lap-xuan',
    name: 'Lập Xuân', hanViet: '立春', position: 3, sunDegree: 315, season: 'xuân',
    weather: {
      bac: 'Rét lạnh nhưng bắt đầu ấm dần, xuất hiện mưa xuân lất phất, nhiệt độ 14–20°C',
      nam: 'Ấm áp, nhiệt độ 25–32°C, bắt đầu mùa khô',
    },
    meaning: 'Bắt đầu Xuân — xuân về',
    detail: 'Lập Xuân (Đứng Xuân) là tiết khí đầu tiên của mùa xuân, mặt trời đạt 315°, thường rơi vào 3–5 tháng 2 dương lịch. Đây là thời điểm quan trọng nhất trong 24 tiết khí vì đánh dấu sự bắt đầu của chu kỳ mới. Mưa xuân bắt đầu rơi ở miền Bắc, cây cối đâm chồi nảy lộc. Người Việt coi Lập Xuân là ngày may mắn để khởi đầu công việc.',
    customs: ['Lễ khai xuân', 'Xuất hành đầu năm chọn hướng tốt', 'Khai bút đầu xuân', 'Trồng cây đầu xuân'],
    foods: ['Bánh chưng còn lại sau Tết', 'Dưa hành', 'Nem cuốn mùa xuân', 'Canh rau tươi'],
    farming: 'Gieo mạ xuân, cày bừa ruộng, trồng rau vụ xuân, chăm sóc cây ăn quả',
    fengshui: {
      colors: ['Xanh lá', 'Xanh non', 'Vàng nhạt'],
      doNow: ['Khai trương', 'Khởi công', 'Ký hợp đồng', 'Xuất hành', 'Gieo trồng'],
      avoid: ['Ở nhà quá nhiều', 'Lười biếng đầu xuân'],
    },
    seoDesc: 'Lập Xuân 2026 ngày mấy? Ý nghĩa tiết Lập Xuân, phong tục khai xuân, ngày tốt để khởi đầu năm mới.',
  },
  {
    slug: 'vu-thuy',
    name: 'Vũ Thủy', hanViet: '雨水', position: 4, sunDegree: 330, season: 'xuân',
    weather: {
      bac: 'Mưa xuân nhiều hơn, ẩm ướt, nhiệt độ 16–22°C, sương mù buổi sáng',
      nam: 'Nắng ấm, nhiệt độ 27–34°C, ít mưa',
    },
    meaning: 'Mưa nước — mưa xuân tưới tắm đất',
    detail: 'Vũ Thủy (Mưa Nước) là tiết khí thứ 4, mặt trời đạt 330°. Đây là thời điểm mưa xuân bắt đầu nhiều hơn, độ ẩm tăng cao. Tuyết tan ở vùng núi phía Bắc, nước sông dâng cao. Mưa xuân mang theo nguồn nước quý giá cho đồng ruộng sau mùa đông khô hanh. Cây cối bắt đầu nảy lộc xanh tươi.',
    customs: ['Lễ tạ ơn trời đất ban mưa', 'Cầu cho mưa thuận gió hoà', 'Chăm sóc vườn tược'],
    foods: ['Măng luộc', 'Rau cải xanh', 'Canh chua', 'Bánh cuốn'],
    farming: 'Gieo mạ hè thu, bón phân cho lúa xuân, trồng ngô, đậu',
    fengshui: {
      colors: ['Xanh lam', 'Trắng', 'Xanh lá nhạt'],
      doNow: ['Học hành', 'Phát triển kế hoạch', 'Đầu tư dài hạn', 'Gieo trồng'],
      avoid: ['Khởi sự quá vội vàng', 'Đi xa khi mưa lớn'],
    },
    seoDesc: 'Vũ Thủy 2026 ngày mấy? Ý nghĩa tiết Vũ Thủy, thời tiết mưa xuân, phong tục và phong thuỷ Việt Nam.',
  },
  {
    slug: 'kinh-trap',
    name: 'Kinh Trập', hanViet: '驚蟄', position: 5, sunDegree: 345, season: 'xuân',
    weather: {
      bac: 'Ấm dần, mưa nhiều, sấm sét đầu mùa, nhiệt độ 18–24°C',
      nam: 'Nắng nóng, nhiệt độ 28–35°C, đôi khi có dông',
    },
    meaning: 'Sâu bọ thức giấc — tiếng sấm đánh thức muôn loài',
    detail: 'Kinh Trập (Sấm Thức) là tiết khí thứ 5, mặt trời đạt 345°. Tiếng sấm đầu mùa xuân đánh thức các loài sâu bọ đang ngủ đông trong lòng đất. Đây là dấu hiệu đất trời giao hoà, vạn vật sinh sôi. Nông dân chuẩn bị sản xuất hè thu, côn trùng gây hại bắt đầu xuất hiện nhiều.',
    customs: ['Đánh trống xua đuổi sâu bọ', 'Bắt sâu bảo vệ mùa màng', 'Cúng ruộng đồng'],
    foods: ['Rau xanh mùa xuân', 'Trứng vịt lộn', 'Chè hạt sen'],
    farming: 'Phun thuốc trừ sâu sớm, cấy lúa xuân, trồng rau ăn quả',
    fengshui: {
      colors: ['Xanh lá đậm', 'Nâu đất', 'Cam'],
      doNow: ['Giải quyết việc tồn đọng', 'Khởi động dự án mới', 'Kiểm tra sức khoẻ'],
      avoid: ['Bỏ bê công việc', 'Ở trong nhà nhiều'],
    },
    seoDesc: 'Kinh Trập 2026 ngày mấy? Ý nghĩa tiết Kinh Trập, sâu bọ thức giấc, phong tục mùa xuân Việt Nam.',
  },
  {
    slug: 'xuan-phan',
    name: 'Xuân Phân', hanViet: '春分', position: 6, sunDegree: 0, season: 'xuân',
    weather: {
      bac: 'Ấm áp dễ chịu, mưa xuân, nhiệt độ 20–26°C, ngày dài bằng đêm',
      nam: 'Nóng bức, nhiệt độ 28–36°C, bắt đầu mùa mưa',
    },
    meaning: 'Giữa Xuân — ngày và đêm bằng nhau',
    detail: 'Xuân Phân (Phân Xuân) là tiết khí thứ 6, mặt trời ở đường xích đạo (0°). Đây là điểm đặc biệt quan trọng: ngày và đêm dài bằng nhau chính xác 12 tiếng. Sau Xuân Phân, ngày sẽ dài hơn đêm cho đến Hạ Chí. Đây là thời điểm cân bằng âm dương, thuận lợi cho mọi hoạt động.',
    customs: ['Lễ tế xuân tại đình làng', 'Hội xuân, lễ hội dân gian', 'Thả diều', 'Cân bằng âm dương'],
    foods: ['Bánh trôi bánh chay', 'Chè xôi', 'Cơm nắm', 'Rau xanh các loại'],
    farming: 'Cấy lúa xuân hè, trồng rau màu, chăm sóc cây ăn quả đang ra hoa',
    fengshui: {
      colors: ['Xanh lá', 'Vàng', 'Trắng'],
      doNow: ['Khai trương', 'Kết hôn', 'Xuất hành', 'Ký hợp đồng — ngày cân bằng tốt nhất'],
      avoid: ['Không có kiêng kỵ đặc biệt'],
    },
    seoDesc: 'Xuân Phân 2026 ngày mấy? Ý nghĩa tiết Xuân Phân, ngày đêm bằng nhau, phong tục lễ hội xuân Việt Nam.',
  },
  // ── 18 tiết còn lại ─────────────────────────────────────────
  { slug:'thanh-minh', name:'Thanh Minh', hanViet:'清明', position:7, sunDegree:15, season:'xuân', weather:{bac:'Trời trong sáng, mưa nhẹ, 22–28°C',nam:'Nắng nóng đầu hè, 30–37°C'}, meaning:'Trời trong sáng', detail:'Thanh Minh là tiết khí thứ 7, mặt trời đạt 15°. Đây là dịp tảo mộ, thăm viếng phần mộ tổ tiên quan trọng nhất trong năm. Trời trong xanh, không khí sạch mát. Thời điểm hoa lá đua nhau nở rộ.', customs:['Tảo mộ', 'Thắp hương mộ tổ tiên', 'Ăn bánh trôi'], foods:['Bánh trôi','Xôi đỗ xanh','Chè hoa cau'], farming:'Gieo trồng rau màu hè, chăm sóc lúa xuân', fengshui:{colors:['Trắng','Xanh nhạt','Vàng'],doNow:['Tảo mộ','Thăm viếng họ hàng','Trồng cây xanh'],avoid:['Tiệc tùng ồn ào ngày tảo mộ']}, seoDesc:'Thanh Minh 2026 ngày mấy? Phong tục tảo mộ Thanh Minh, ý nghĩa và nghi lễ thăm mộ tổ tiên Việt Nam.' },
  { slug:'coc-vu', name:'Cốc Vũ', hanViet:'穀雨', position:8, sunDegree:30, season:'xuân', weather:{bac:'Mưa nhiều nuôi lúa, 23–29°C',nam:'Mưa đầu mùa, nóng ẩm, 31–38°C'}, meaning:'Mưa lúa — mưa tưới tắm hạt giống', detail:'Cốc Vũ là tiết khí cuối mùa xuân, mặt trời đạt 30°. Mưa xuân nhiều nhất giúp lúa và các loại cây trồng phát triển mạnh. Đây là thời điểm quan trọng nhất để gieo trồng.', customs:['Cầu mưa thuận','Gieo hạt đầu hè','Lễ hội nước'], foods:['Canh rau','Cháo đậu xanh','Rau muống xào'], farming:'Giai đoạn quan trọng nhất để gieo cấy, bón phân', fengshui:{colors:['Xanh lam','Xanh lá','Trắng'],doNow:['Khởi đầu dự án','Đầu tư','Học hành'],avoid:['Lãng phí tài nguyên']}, seoDesc:'Cốc Vũ 2026 ngày mấy? Ý nghĩa tiết Cốc Vũ, mưa tưới hạt giống, phong tục nông nghiệp Việt Nam.' },
  { slug:'lap-ha', name:'Lập Hạ', hanViet:'立夏', position:9, sunDegree:45, season:'hạ', weather:{bac:'Bắt đầu nóng, 26–33°C, mưa rào',nam:'Nóng bức, đầy đủ mùa mưa, 32–38°C'}, meaning:'Bắt đầu Hạ — mùa hè về', detail:'Lập Hạ đánh dấu bắt đầu mùa hè, mặt trời đạt 45°. Nắng nhiều, nhiệt độ tăng nhanh. Người dân chuyển sang ăn đồ mát, uống nước giải nhiệt.', customs:['Ăn đồ mát, uống nước giải nhiệt','Nghỉ trưa nhiều hơn'], foods:['Chè đậu','Nước chanh','Dưa hấu','Canh chua'], farming:'Thu hoạch lúa xuân, gieo lúa hè thu', fengshui:{colors:['Đỏ','Cam','Hồng'],doNow:['Hoạt động ngoài trời sáng sớm','Kinh doanh sôi động'],avoid:['Ra nắng buổi trưa']}, seoDesc:'Lập Hạ 2026 ngày mấy? Ý nghĩa tiết Lập Hạ, bắt đầu mùa hè, phong tục và ẩm thực mùa hè Việt Nam.' },
  { slug:'tieu-man', name:'Tiểu Mãn', hanViet:'小滿', position:10, sunDegree:60, season:'hạ', weather:{bac:'Nóng, mưa rào, 28–35°C',nam:'Nóng ẩm, mưa nhiều, 31–37°C'}, meaning:'Đầy nhỏ — lúa bắt đầu chắc hạt', detail:'Tiểu Mãn là thời điểm lúa và ngũ cốc bắt đầu chắc hạt nhưng chưa chín. Mặt trời đạt 60°. Đây là giai đoạn chăm sóc lúa quan trọng.', customs:['Lễ cầu mùa','Chăm sóc lúa đang làm đòng'], foods:['Xôi','Bánh mì','Trái cây đầu mùa'], farming:'Chăm sóc lúa hè thu, phun thuốc trừ sâu', fengshui:{colors:['Vàng','Xanh lá','Cam'],doNow:['Tiếp tục công việc đang dở','Chăm sóc sức khoẻ'],avoid:['Đầu tư mạo hiểm']}, seoDesc:'Tiểu Mãn 2026 ngày mấy? Ý nghĩa tiết Tiểu Mãn, lúa chắc hạt, phong tục nông nghiệp mùa hè.' },
  { slug:'mang-chung', name:'Mang Chủng', hanViet:'芒種', position:11, sunDegree:75, season:'hạ', weather:{bac:'Nóng nực, mưa rào chiều tối, 29–36°C',nam:'Mưa nhiều, nóng ẩm, 29–34°C'}, meaning:'Gieo hạt — mùa gieo trồng chính', detail:'Mang Chủng là thời điểm gieo hạt quan trọng nhất, mặt trời đạt 75°. Tên gọi gợi lên hình ảnh những bông lúa có râu đang trổ đòng.', customs:['Lễ cúng thần nông','Gieo hạt đúng mùa','Lễ hội mùa màng'], foods:['Cơm mới','Xôi gấc','Bánh khúc'], farming:'Gieo cấy lúa hè thu, trồng ngô đông', fengshui:{colors:['Xanh lá đậm','Vàng','Nâu'],doNow:['Khởi sự mới','Ký hợp đồng nông nghiệp'],avoid:['Trì hoãn gieo trồng']}, seoDesc:'Mang Chủng 2026 ngày mấy? Ý nghĩa tiết Mang Chủng, mùa gieo hạt, phong tục nông nghiệp Việt Nam.' },
  { slug:'ha-chi', name:'Hạ Chí', hanViet:'夏至', position:12, sunDegree:90, season:'hạ', weather:{bac:'Nóng nhất trong năm, 32–38°C, ngày dài nhất',nam:'Mưa nhiều nhất, nóng ẩm, 28–33°C'}, meaning:'Giữa Hạ — ngày dài nhất trong năm', detail:'Hạ Chí là điểm cực bắc của mặt trời (90°), ngày dài nhất năm. Sau Hạ Chí, đêm dần dài hơn. Đây là thời điểm dương khí mạnh nhất.', customs:['Lễ mừng ngày dài nhất','Tắm biển, đi nghỉ hè','Ăn đồ mát'], foods:['Dưa hấu','Chè đỗ đen','Nước sắn dây','Rau má'], farming:'Thu hoạch lúa hè thu đầu vụ, trồng rau mùa hè', fengshui:{colors:['Đỏ','Cam','Vàng — dương khí cực thịnh'],doNow:['Kết hôn (dương khí mạnh)','Khai trương','Hoạt động ban ngày'],avoid:['Thức khuya quá nhiều']}, seoDesc:'Hạ Chí 2026 ngày mấy? Ngày dài nhất năm, ý nghĩa tiết Hạ Chí, phong tục mùa hè Việt Nam.' },
  { slug:'tieu-thu', name:'Tiểu Thử', hanViet:'小暑', position:13, sunDegree:105, season:'hạ', weather:{bac:'Nóng nực nhất, 33–39°C, mưa giông',nam:'Mưa nhiều, nhiệt độ 28–33°C'}, meaning:'Nóng nhẹ — bắt đầu nóng nhất', detail:'Tiểu Thử là bắt đầu giai đoạn nóng nhất, mặt trời đạt 105°. Nhiệt độ miền Bắc có thể lên tới 40°C. Mưa dông thường xuyên buổi chiều tối.', customs:['Uống nước mát cả ngày','Tránh nắng buổi trưa','Tắm suối, tắm biển'], foods:['Nước chanh đá','Chè hạt é','Canh bí đao','Dưa leo'], farming:'Chăm sóc lúa hè thu, thu hoạch rau màu', fengshui:{colors:['Trắng','Xanh lam','Bạc'],doNow:['Nghỉ ngơi hợp lý','Uống đủ nước','Tĩnh tâm'],avoid:['Hoạt động ngoài trời trưa nắng']}, seoDesc:'Tiểu Thử 2026 ngày mấy? Ý nghĩa tiết Tiểu Thử, nóng nhất hè, cách giữ sức khoẻ mùa nóng.' },
  { slug:'dai-thu', name:'Đại Thử', hanViet:'大暑', position:14, sunDegree:120, season:'hạ', weather:{bac:'Nóng nhất năm, 35–40°C, mưa to',nam:'Mưa lũ, 28–32°C'}, meaning:'Nóng lớn — nóng nhất trong năm', detail:'Đại Thử là tiết nóng nhất năm, mặt trời đạt 120°. Nhiệt độ cực đại ở miền Bắc. Miền Nam vào mùa mưa lớn. Cần chú ý phòng chống nắng nóng và lũ lụt.', customs:['Uống nước mát giải nhiệt','Nghỉ ngơi buổi trưa','Thờ cúng mưa thuận'], foods:['Chè dưỡng sinh','Cháo tía tô','Nước sắn dây đá'], farming:'Thu hoạch lúa hè thu, chuẩn bị đất vụ mùa', fengshui:{colors:['Trắng','Xanh lam','Đen — thuỷ khắc hoả'],doNow:['Nghỉ ngơi dưỡng sức','Ở nhà làm việc'],avoid:['Vận động ngoài trời nắng','Ăn đồ nóng']}, seoDesc:'Đại Thử 2026 ngày mấy? Ý nghĩa tiết Đại Thử, ngày nóng nhất năm, bảo vệ sức khoẻ mùa nắng nóng.' },
  { slug:'lap-thu', name:'Lập Thu', hanViet:'立秋', position:15, sunDegree:135, season:'thu', weather:{bac:'Dịu mát dần, 28–34°C',nam:'Vẫn mưa nhiều, 27–33°C'}, meaning:'Bắt đầu Thu — thu về', detail:'Lập Thu đánh dấu bắt đầu mùa thu, mặt trời đạt 135°. Không khí dịu mát hơn dù vẫn còn nóng. Cây cối bắt đầu đổi màu lá ở vùng núi cao.', customs:['Ăn dưa hấu cuối mùa','Làm đèn lồng Trung Thu sớm','Thu hoạch hoa màu'], foods:['Dưa hấu','Nhãn','Vải thiều','Chuối'], farming:'Thu hoạch lúa mùa sớm, trồng rau vụ đông', fengshui:{colors:['Trắng','Xanh nhạt','Vàng nhạt'],doNow:['Thu hoạch thành quả','Tổng kết nửa năm','Chuẩn bị kế hoạch thu đông'],avoid:['Lãng phí nguồn lực']}, seoDesc:'Lập Thu 2026 ngày mấy? Ý nghĩa tiết Lập Thu, mùa thu về, phong tục và ẩm thực mùa thu Việt Nam.' },
  { slug:'xu-thu', name:'Xử Thử', hanViet:'處暑', position:16, sunDegree:150, season:'thu', weather:{bac:'Mát dần, 25–31°C, ít mưa hơn',nam:'Mưa giảm dần, 26–32°C'}, meaning:'Hết nóng — nóng bắt đầu lui', detail:'Xử Thử nghĩa là "nóng đi chỗ khác", mặt trời đạt 150°. Nắng nóng dịu bớt, đêm mát mẻ hơn. Đây là thời điểm chuyển giao rõ ràng từ hè sang thu.', customs:['Ăn vịt đầu mùa thu (miền Bắc)','Tảo mộ Tháng 7 âm lịch','Cúng cô hồn'], foods:['Vịt luộc','Bún măng vịt','Cháo vịt','Bánh cốm'], farming:'Thu hoạch lúa mùa chính, bón phân vụ đông', fengshui:{colors:['Trắng','Vàng','Xanh nhạt'],doNow:['Điều chỉnh kế hoạch','Học tập','Chuyển hướng kinh doanh'],avoid:['Khởi sự lớn trong Tháng 7 âm lịch (tháng cô hồn)']}, seoDesc:'Xử Thử 2026 ngày mấy? Ý nghĩa tiết Xử Thử, hết nóng mùa hè, tục ăn vịt đầu thu Việt Nam.' },
  { slug:'bach-lo', name:'Bạch Lộ', hanViet:'白露', position:17, sunDegree:165, season:'thu', weather:{bac:'Mát mẻ, sương sớm, 22–28°C',nam:'Ít mưa, mát, 25–31°C'}, meaning:'Sương trắng — sương móc xuất hiện', detail:'Bạch Lộ là tiết khí có sương trắng xuất hiện vào buổi sáng, mặt trời đạt 165°. Không khí khô và mát, đặc biệt vào sáng sớm. Đây là thời điểm đẹp nhất trong năm ở miền Bắc.', customs:['Uống nước sương mai','Ngắm sương buổi sáng','Hái hoa lá mùa thu'], foods:['Cốm Vòng','Hồng xiêm','Bưởi','Cháo cá'], farming:'Thu hoạch ngô, đậu, bắt đầu gieo rau đông', fengshui:{colors:['Trắng','Bạc','Xanh nhạt'],doNow:['Học hành','Suy nghĩ sâu','Viết lách sáng tạo'],avoid:['Ra ngoài khi sương còn dày']}, seoDesc:'Bạch Lộ 2026 ngày mấy? Ý nghĩa tiết Bạch Lộ, sương trắng mùa thu, cốm Vòng Hà Nội.' },
  { slug:'thu-phan', name:'Thu Phân', hanViet:'秋分', position:18, sunDegree:180, season:'thu', weather:{bac:'Dịu mát nhất năm, 20–26°C',nam:'Mát mẻ, 24–30°C'}, meaning:'Giữa Thu — ngày đêm bằng nhau lần hai', detail:'Thu Phân là điểm giữa mùa thu, mặt trời trở về xích đạo (180°). Ngày và đêm bằng nhau 12 giờ, sau đó đêm dài hơn ngày. Thời tiết đẹp nhất trong năm ở miền Bắc.', customs:['Tết Trung Thu (15/8 âm)', 'Phá cỗ trông trăng', 'Rước đèn lồng', 'Ăn bánh Trung Thu'], foods:['Bánh Trung Thu','Bưởi','Hồng','Cốm','Kẹo bánh'], farming:'Thu hoạch lúa mùa, trồng rau đông', fengshui:{colors:['Vàng','Cam','Đỏ — màu thu'],doNow:['Kết hôn','Khai trương','Đoàn tụ gia đình','Tổ chức sự kiện'],avoid:['Không có kiêng kỵ đặc biệt']}, seoDesc:'Thu Phân 2026 ngày mấy? Tiết Thu Phân và Tết Trung Thu, phong tục rước đèn, bánh trung thu Việt Nam.' },
  { slug:'han-lo', name:'Hàn Lộ', hanViet:'寒露', position:19, sunDegree:195, season:'thu', weather:{bac:'Lạnh dần, sương lạnh, 16–22°C',nam:'Mát, khô, 22–28°C'}, meaning:'Sương lạnh — sương bắt đầu lạnh', detail:'Hàn Lộ là tiết khí sương lạnh xuất hiện, mặt trời đạt 195°. Không khí bắt đầu se lạnh ở miền Bắc, lá cây chuyển vàng đỏ ở vùng núi cao.', customs:['Mặc thêm áo','Uống trà nóng','Ngắm lá vàng vùng cao'], foods:['Cháo nóng','Bánh cuốn','Phở bò','Trà gừng'], farming:'Thu hoạch khoai lang, thu gom rơm rạ, gieo mạ mùa', fengshui:{colors:['Vàng','Cam đỏ','Nâu'],doNow:['Tổng kết năm','Thu hoạch thành quả','Tích luỹ'],avoid:['Đầu tư mạo hiểm cuối năm']}, seoDesc:'Hàn Lộ 2026 ngày mấy? Ý nghĩa tiết Hàn Lộ, sương lạnh mùa thu, phong tục Việt Nam.' },
  { slug:'suong-giáng', name:'Sương Giáng', hanViet:'霜降', position:20, sunDegree:210, season:'thu', weather:{bac:'Lạnh rõ rệt, sương muối, 13–19°C',nam:'Mát khô, 20–27°C'}, meaning:'Sương xuống — sương muối xuất hiện', detail:'Sương Giáng là tiết cuối thu, sương muối bắt đầu xuất hiện ở vùng núi cao, mặt trời đạt 210°. Đây là thời điểm chuyển tiếp sang mùa đông, cây cối rụng lá.', customs:['Mặc áo ấm','Dự trữ lương thực đông','Sấy khô thức ăn'], foods:['Lẩu','Thịt nướng','Mọc hầm','Bánh gai'], farming:'Thu hoạch cuối vụ, làm đất trồng rau đông', fengshui:{colors:['Trắng','Xám','Bạc'],doNow:['Dự trữ','Kế hoạch dài hạn','Tĩnh tâm'],avoid:['Bắt đầu dự án lớn cuối năm']}, seoDesc:'Sương Giáng 2026 ngày mấy? Ý nghĩa tiết Sương Giáng, sương muối mùa thu, phong tục dự trữ đông.' },
  { slug:'lap-dong', name:'Lập Đông', hanViet:'立冬', position:21, sunDegree:225, season:'đông', weather:{bac:'Lạnh hẳn, 10–16°C',nam:'Mát dễ chịu, 22–28°C'}, meaning:'Bắt đầu Đông — mùa đông về', detail:'Lập Đông đánh dấu bắt đầu mùa đông, mặt trời đạt 225°. Miền Bắc lạnh hẳn, cần mặc áo ấm. Đây là lúc dự trữ lương thực và củng cố sức khoẻ.', customs:['Ăn bánh trôi tàu','Bổ sung dinh dưỡng','Dự trữ lương thực đông'], foods:['Bánh trôi tàu','Lẩu','Cháo hành gừng','Thịt đông'], farming:'Thu hoạch rau đông sớm, trồng hành tỏi', fengshui:{colors:['Đen','Xanh navy','Tím'],doNow:['Dưỡng sức','Học hành mùa đông','Lên kế hoạch'],avoid:['Xuất hành xa khi rét đậm']}, seoDesc:'Lập Đông 2026 ngày mấy? Ý nghĩa tiết Lập Đông, bắt đầu mùa đông, phong tục ăn bánh trôi tàu.' },
  { slug:'tieu-tuyet', name:'Tiểu Tuyết', hanViet:'小雪', position:22, sunDegree:240, season:'đông', weather:{bac:'Rét, 8–14°C, có thể có mưa tuyết vùng cao',nam:'Mát, 20–26°C'}, meaning:'Tuyết nhỏ — tuyết bắt đầu rơi', detail:'Tiểu Tuyết là tiết khí tuyết nhỏ, mặt trời đạt 240°. Vùng núi cao như Sa Pa, Mẫu Sơn có thể xuất hiện tuyết. Miền Bắc rét buốt, cần sưởi ấm.', customs:['Ngắm tuyết vùng cao','Sưởi ấm bằng than củi','Làm đồ dùng mùa đông'], foods:['Cháo tim gan','Canh củ cải','Thịt nướng than','Trà thuốc'], farming:'Chăm sóc rau đông trong nhà lưới, thu hoạch củ quả', fengshui:{colors:['Trắng','Bạc','Xanh nhạt'],doNow:['Ở nhà tĩnh tâm','Thiền định','Học tập nghiên cứu'],avoid:['Đi xa vùng tuyết nếu không chuẩn bị']}, seoDesc:'Tiểu Tuyết 2026 ngày mấy? Ý nghĩa tiết Tiểu Tuyết, tuyết rơi Sa Pa Mẫu Sơn, phong tục mùa đông.' },
  { slug:'dai-tuyet', name:'Đại Tuyết', hanViet:'大雪', position:23, sunDegree:255, season:'đông', weather:{bac:'Rét đậm, 6–12°C, tuyết vùng cao',nam:'Mát, 18–24°C'}, meaning:'Tuyết lớn — tuyết rơi nhiều', detail:'Đại Tuyết là tiết tuyết lớn, mặt trời đạt 255°. Tuyết có thể phủ trắng Sa Pa, Đồng Văn, Mẫu Sơn. Miền Bắc rét nhất từ đầu mùa đông. Gần dịp Giáng Sinh.', customs:['Ngắm tuyết trên đỉnh núi','Lễ Giáng Sinh','Sưởi ấm quây quần'], foods:['Canh xương hầm','Lẩu đủ loại','Cháo nóng','Khoai nướng'], farming:'Bảo vệ rau màu khỏi giá rét, thu hoạch củ cải', fengshui:{colors:['Trắng','Đỏ Giáng Sinh','Xanh lá thông'],doNow:['Đoàn tụ gia đình','Ở nhà ấm áp','Lên kế hoạch năm mới'],avoid:['Ra ngoài trời rét không cần thiết']}, seoDesc:'Đại Tuyết 2026 ngày mấy? Ý nghĩa tiết Đại Tuyết, tuyết Sa Pa mùa đông, phong tục Việt Nam.' },
  { slug:'dong-chi', name:'Đông Chí', hanViet:'冬至', position:24, sunDegree:270, season:'đông', weather:{bac:'Lạnh nhất, đêm dài nhất, 7–13°C',nam:'Mát, đêm dài nhất, 19–25°C'}, meaning:'Giữa Đông — đêm dài nhất trong năm', detail:'Đông Chí là điểm cực nam của mặt trời (270°), đêm dài nhất năm. Sau Đông Chí, ngày dần dài hơn. Đây là tiết khí quan trọng trong văn hoá Á Đông, nhiều gia đình sum họp ăn chè trôi nước.', customs:['Ăn chè trôi nước sum họp gia đình','Lễ tế đông chí','Cúng tổ tiên'], foods:['Chè trôi nước','Bánh tổ','Gà hầm thuốc bắc','Lẩu gia đình'], farming:'Nghỉ ngơi nông nhàn, sửa chữa nông cụ, lên kế hoạch xuân', fengshui:{colors:['Đỏ','Vàng','Cam — năng lượng dương trở lại'],doNow:['Sum họp gia đình','Thờ cúng tổ tiên','Bắt đầu lên kế hoạch mới'],avoid:['Cãi vã trong ngày đặc biệt này']}, seoDesc:'Đông Chí 2026 ngày mấy? Đêm dài nhất năm, ý nghĩa tiết Đông Chí, phong tục ăn chè sum họp gia đình.' },
];

export default TIET_KHI_DATA;
