// src/lib/vanKhan.ts — 24 bài văn khấn phổ biến

export interface VanKhan {
  slug:     string;
  ten:      string;
  icon:     string;
  category: 'le-tet' | 'gia-tien' | 'than-tai' | 'ngay-le' | 'khai-truong' | 'khac';
  dip:      string;  // dịp/thời điểm
  tomTat:   string;  // mô tả ngắn
  noiDung:  string;  // full text văn khấn
}

export const CATEGORY_LABEL: Record<string, string> = {
  'le-tet':    '🎊 Lễ Tết',
  'gia-tien':  '🕯 Gia Tiên / Giỗ',
  'than-tai':  '💰 Thần Tài',
  'ngay-le':   '🌕 Rằm / Mùng Một',
  'khai-truong':'🏪 Khai Trương',
  'khac':      '📿 Khác',
};

export const VAN_KHAN_DATA: VanKhan[] = [
  {
    slug:'giao-thua',
    ten:'Văn Khấn Giao Thừa',
    icon:'🎆', category:'le-tet', dip:'Đêm 30 Tết / Giao thừa',
    tomTat:'Bài văn khấn cúng giao thừa ngoài trời, tiễn năm cũ đón năm mới',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy chín phương Trời, mười phương chư Phật, chư Phật mười phương.
Con kính lạy Đức Đương Lai Hạ Sinh Di Lặc Tôn Phật.
Con kính lạy Đức Bồ Tát Quan Thế Âm.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy ngài Đương Niên Hành Khiển, ngài Bản Cảnh Thành Hoàng, các ngài Thổ Địa, Táo Quân, Long Mạch Tôn Thần.
Con kính lạy các Tổ tiên nội ngoại họ...

Hôm nay là đêm 30 tháng Chạp năm..., giờ Tý, nhằm giờ thiêng, cả nhà chúng con thành tâm sắm sanh hương hoa lễ vật, bày lên trước án, dâng hiến Tôn Thần.

Nguyện cầu Tôn Thần gia hộ cho gia đình chúng con năm mới:
- Được bình an, mạnh khỏe
- Làm ăn phát đạt, vạn sự như ý
- Gia đình hòa thuận, con cái học hành tấn tới
- Tai qua nạn khỏi, mọi điều tốt lành

Chúng con lễ bạc tâm thành, trước án kính lễ, cúi xin được phù hộ độ trì.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'ram-thang-gieng',
    ten:'Văn Khấn Rằm Tháng Giêng',
    icon:'🌕', category:'ngay-le', dip:'Ngày 15 tháng Giêng âm lịch',
    tomTat:'Cúng Rằm tháng Giêng - Tết Nguyên Tiêu, cầu bình an đầu năm',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Đức Phật A Di Đà.
Con kính lạy Đức Bồ Tát Quan Thế Âm.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy các chư Thần linh, Thổ Địa cai quản nơi này.

Hôm nay ngày 15 tháng Giêng năm..., gia đình chúng con thành tâm sắm sanh lễ vật, hương hoa, oản quả, dâng lên trước án.

Chúng con cầu nguyện:
- Gia đình bình an, mạnh khỏe cả năm
- Công việc thuận lợi, tài lộc dồi dào
- Học hành đỗ đạt, sự nghiệp thăng tiến
- Vạn sự như ý, mọi điều hanh thông

Chúng con lễ bạc tâm thành, cúi xin được chứng giám và phù hộ.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'gio-to-hung-vuong',
    ten:'Văn Khấn Giỗ Tổ Hùng Vương',
    icon:'👑', category:'le-tet', dip:'Ngày 10/3 âm lịch',
    tomTat:'Cúng Giỗ Tổ Hùng Vương - Quốc tổ dân tộc Việt Nam',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Kính lạy: Đột Ngột Cao Sơn cổ Việt Hùng Thị thập bát thế Thánh Vương.

Hôm nay là ngày 10 tháng 3 âm lịch năm..., chúng con là..., ngụ tại...

Thành tâm dâng lễ vật, hương hoa, trà quả tưởng nhớ công ơn của Tổ Tiên Hùng Vương - người đã có công dựng nước Văn Lang, khai mở bờ cõi Việt Nam.

Cầu nguyện cho:
- Quốc thái dân an, đất nước thái bình thịnh vượng
- Gia đình bình an, làm ăn phát đạt
- Con cháu hiếu thảo, giữ gìn truyền thống tổ tiên

Chúng con lễ bạc tâm thành, cúi xin được chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'doan-ngo',
    ten:'Văn Khấn Tết Đoan Ngọ',
    icon:'☀️', category:'le-tet', dip:'Ngày 5/5 âm lịch',
    tomTat:'Cúng Tết Đoan Ngọ - diệt sâu bọ, trừ bệnh tật đầu mùa hè',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy Ngài Đương Niên Hành Khiển.
Con kính lạy ngài Bản Cảnh Thành Hoàng.
Con kính lạy Tổ tiên nội ngoại.

Hôm nay là ngày Tết Đoan Ngọ, mồng 5 tháng 5 năm..., gia đình chúng con thành tâm sắm sanh lễ vật gồm: hoa quả, rượu nếp, bánh tro... dâng lên trước án.

Chúng con cầu nguyện:
- Gia đình mạnh khỏe, bình an
- Xua đuổi bệnh tật, tà khí
- Mùa màng tươi tốt, vật nuôi sinh sôi
- Vạn sự hanh thông

Chúng con lễ bạc tâm thành, cúi xin được phù hộ.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'vu-lan',
    ten:'Văn Khấn Vu Lan Báo Hiếu',
    icon:'💐', category:'ngay-le', dip:'Ngày 15/7 âm lịch - Lễ Vu Lan',
    tomTat:'Cúng Vu Lan báo hiếu cha mẹ, cúng thí thực cô hồn',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)
Nam mô Đại Hiếu Mục Kiền Liên Bồ Tát.

Con kính lạy Đức Phật A Di Đà.
Con kính lạy Đức Bồ Tát Quan Thế Âm.
Con kính lạy Đức Bồ Tát Địa Tạng.

Hôm nay ngày Rằm tháng Bảy - mùa Vu Lan Bồn, chúng con dâng lên lòng hiếu thảo, kính nhớ đến công ơn sinh thành dưỡng dục của cha mẹ.

Chúng con cầu nguyện:
- Cho cha mẹ hiện tiền được sống lâu, mạnh khỏe, an vui
- Cho cha mẹ đã khuất được siêu thoát, về cảnh giới an lành
- Chúng con nguyện sống hiếu thảo, báo đáp ân cha mẹ
- Nguyện hồi hướng công đức đến tất cả chúng sinh

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'trung-thu',
    ten:'Văn Khấn Tết Trung Thu',
    icon:'🥮', category:'le-tet', dip:'Rằm tháng 8 âm lịch',
    tomTat:'Cúng Tết Trung Thu - phá cỗ trông trăng, tạ ơn đất trời',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy Ngài Trăng (Hằng Nga).
Con kính lạy Tổ tiên nội ngoại.

Hôm nay là đêm Rằm tháng Tám năm..., đêm Trung Thu trăng tròn sáng tỏ, gia đình chúng con thành tâm bày cỗ hoa quả, bánh Trung Thu, đèn lồng dâng lên trước án.

Chúng con cầu nguyện:
- Gia đình đoàn viên, sum vầy hạnh phúc
- Con cái ngoan hiền, học hành giỏi giang
- Mọi sự bình an, hanh thông
- Vụ mùa bội thu, đất đai màu mỡ

Chúng con lễ bạc tâm thành, cúi xin được chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'ong-tao',
    ten:'Văn Khấn Tiễn Ông Táo',
    icon:'🔥', category:'le-tet', dip:'Ngày 23 tháng Chạp',
    tomTat:'Cúng tiễn Ông Công Ông Táo về trời báo cáo',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy ngài Đông Trù Tư Mệnh Táo Phủ Thần Quân.
Con kính lạy Thổ Công, Thổ Địa, Thổ Kỳ.

Hôm nay ngày 23 tháng Chạp năm..., gia đình chúng con thành tâm sắm sanh lễ vật: hương hoa, trà quả, vàng mã, cá chép... để tiễn Ngài về Thiên Đình.

Kính mong Ngài thưa với Ngọc Hoàng Thượng Đế:
- Gia đình chúng con chăm chỉ làm ăn, hiếu thảo
- Xin bỏ qua những lỗi lầm nhỏ trong năm qua
- Cầu xin ban phước, gia hộ cho năm mới
- Mang lại bình an, tài lộc, sức khỏe

Kính mong Táo Quân chứng giám lòng thành. Năm mới xin Ngài sớm trở về phù hộ gia đình.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'gia-tien-ram-mung',
    ten:'Văn Khấn Gia Tiên Rằm / Mùng Một',
    icon:'🕯', category:'ngay-le', dip:'Ngày Rằm 15 và Mùng Một hàng tháng',
    tomTat:'Cúng gia tiên vào ngày Rằm và Mùng Một mỗi tháng',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy ngài Bản Cảnh Thành Hoàng.
Con kính lạy ngài Thổ Địa, Táo Quân.
Con kính lạy Tổ tiên nội ngoại.

Hôm nay là ngày... tháng... năm..., gia đình chúng con thành tâm sắm sanh hương hoa lễ vật, bày lên trước án dâng lên Tổ tiên.

Kính mời hương hồn Tổ tiên nội ngoại, Cụ kị, Ông bà, Cha mẹ... về hưởng lễ vật.

Chúng con cầu nguyện Tổ tiên phù hộ:
- Gia đình bình an, mạnh khỏe
- Công việc hanh thông, tài lộc dồi dào  
- Con cái ngoan hiền, học hành tiến bộ

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'gio-chap',
    ten:'Văn Khấn Giỗ Chạp (Kỵ Nhật)',
    icon:'🕯', category:'gia-tien', dip:'Ngày giỗ hàng năm',
    tomTat:'Bài văn khấn ngày giỗ kỵ nhật ông bà tổ tiên',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy Đức Địa Tạng Bồ Tát.
Con kính lạy ngài Bản Cảnh Thành Hoàng.

Hôm nay là ngày... tháng... năm... (ngày kỵ nhật của...)

Gia đình chúng con thành tâm sắm sanh lễ vật, cơm canh, hoa quả... kính dâng lên trước án.

Kính mời hương hồn... (tên người mất) về hưởng lễ vật.

Chúng con nhớ ơn Ngài đã sinh thành dưỡng dục, dạy dỗ chúng con nên người. Nay kính dâng lễ mọn, bày tỏ lòng hiếu thảo nhớ thương.

Cúi xin Ngài chứng giám và phù hộ cho gia đình chúng con bình an, làm ăn phát đạt.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'than-tai-mung-mot',
    ten:'Văn Khấn Thần Tài Mùng Một',
    icon:'💰', category:'than-tai', dip:'Mùng 1 và Rằm hàng tháng',
    tomTat:'Cúng Thần Tài đầu tháng cầu tài lộc, buôn bán thuận lợi',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Thần Tài, Thổ Địa.
Con kính lạy Thần Tài Vương Đại Cát Thần.

Hôm nay là ngày... tháng... năm..., gia đình / cửa hàng chúng con thành tâm dâng lễ:
Hương, hoa, nước, oản quả...

Cầu nguyện Thần Tài phù hộ:
- Buôn may bán đắt, tiền vào như nước
- Khách đông, hàng chạy, lời lãi nhiều
- Tài lộc dồi dào, vận may đến mãi
- Tránh tai họa, xui xẻo, hao tán

Chúng con lễ bạc tâm thành, cúi xin Thần Tài chứng giám và phù hộ.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'than-tai-tan-nien',
    ten:'Văn Khấn Thần Tài Đầu Năm',
    icon:'🧧', category:'than-tai', dip:'Mùng 1-10 Tết Nguyên Đán',
    tomTat:'Cúng Thần Tài đầu năm mới cầu tài lộc, may mắn cả năm',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Thần Tài Vương Đại Cát Thần.
Con kính lạy Thổ Công, Thổ Địa.

Hôm nay là ngày... tháng Giêng năm..., gia đình chúng con thành tâm sắm sanh lễ vật đầu năm: hương hoa, trái cây, vàng mã... dâng lên Thần Tài.

Kính cầu Thần Tài ban phước năm mới:
- Tài lộc sung túc, tiền tài dồi dào
- Buôn bán phát đạt, làm ăn thịnh vượng
- Mọi sự bình an, gia đình hạnh phúc
- Năm mới vạn sự như ý, mọi điều thuận lợi

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'khai-truong',
    ten:'Văn Khấn Khai Trương',
    icon:'🏪', category:'khai-truong', dip:'Ngày khai trương cửa hàng, doanh nghiệp',
    tomTat:'Bài văn khấn ngày khai trương cửa hàng, công ty, doanh nghiệp',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy ngài Bản Cảnh Thành Hoàng.
Con kính lạy Thần Tài, Thổ Địa cai quản nơi này.

Hôm nay là ngày tốt... tháng... năm..., gia đình / công ty chúng con thành tâm khai trương cửa hàng / doanh nghiệp tại địa chỉ...

Chúng con dâng lễ vật: hương hoa, trà quả, vàng mã... kính mời các Ngài về chứng giám.

Cầu nguyện:
- Khai trương thuận lợi, mọi sự hanh thông
- Khách hàng đông đảo, buôn bán phát đạt
- Nhân viên làm việc vui vẻ, đoàn kết
- Cửa hàng / doanh nghiệp ngày càng phát triển
- Tránh mọi tai họa, điều xấu không đến

Chúng con lễ bạc tâm thành, cúi xin được phù hộ.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'xay-nha',
    ten:'Văn Khấn Xây Nhà / Động Thổ',
    icon:'🏠', category:'khai-truong', dip:'Ngày khởi công, động thổ xây nhà',
    tomTat:'Cúng động thổ khởi công xây dựng nhà cửa',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy Long Mạch Tôn Thần.
Con kính lạy ngài Bản Cảnh Thành Hoàng.
Con kính lạy Thổ Công, Thổ Địa.

Hôm nay là ngày... tháng... năm..., gia đình chúng con tên là... ngụ tại... xin được khởi công xây dựng nhà tại địa chỉ...

Chúng con thành tâm dâng lễ, kính cáo các Tôn Thần cho phép khởi công.

Cầu xin:
- Công trình xây dựng thuận lợi, an toàn
- Không gặp tai nạn, sự cố trong quá trình thi công
- Nhà mới xây xong bền vững, vượng khí
- Gia đình ở nhà mới bình an, hạnh phúc, phú quý

Chúng con lễ bạc tâm thành, cúi xin được chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'nhap-trach',
    ten:'Văn Khấn Nhập Trạch',
    icon:'🗝', category:'khai-truong', dip:'Ngày chuyển vào nhà mới',
    tomTat:'Bài văn khấn khi chuyển về nhà mới / nhập trạch',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy ngài Bản Cảnh Thành Hoàng.
Con kính lạy Thổ Công, Thổ Địa.
Con kính lạy Táo Quân Thần Quân.

Hôm nay là ngày... tháng... năm..., gia đình chúng con từ địa chỉ... chuyển đến sinh sống tại địa chỉ mới...

Chúng con thành tâm dâng lễ, kính cáo các Thần linh cai quản nơi ở mới, xin được về đây an cư lạc nghiệp.

Cầu xin:
- Nhà mới bình an, ấm cúng, hạnh phúc
- Gia đình mạnh khỏe, làm ăn thuận lợi
- Hàng xóm tốt bụng, láng giềng hòa thuận
- Mọi tai họa, xui xẻo không vào nhà

Chúng con lễ bạc tâm thành, cúi xin được chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'an-hoi',
    ten:'Văn Khấn Lễ Ăn Hỏi',
    icon:'💍', category:'khac', dip:'Lễ ăn hỏi, đính hôn',
    tomTat:'Bài văn khấn trong lễ ăn hỏi, thông báo với tổ tiên',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy Tổ tiên nội ngoại.

Hôm nay là ngày... tháng... năm..., gia đình chúng con thành tâm dâng lễ, kính cáo Tổ tiên:

Gia đình chúng con có con trai / con gái là... (tên), năm nay... tuổi, đã tìm được người bạn đời xứng đôi vừa lứa tên là... của gia đình...

Hôm nay tiến hành lễ ăn hỏi, trước là kính cáo Tổ tiên, sau là để hai gia đình chính thức kết thân.

Kính cầu Tổ tiên chứng giám và phù hộ cho:
- Đôi trẻ sớm kết duyên thành vợ thành chồng
- Hôn nhân bền chặt, hạnh phúc lâu dài
- Hai gia đình thông gia hòa thuận, vui vẻ
- Con cái sớm có cháu chắt nối dõi

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'cuoi-hoi',
    ten:'Văn Khấn Ngày Cưới',
    icon:'👰', category:'khac', dip:'Ngày cưới hỏi',
    tomTat:'Bài văn khấn trong ngày cưới thông báo với tổ tiên',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy Tổ tiên nội ngoại hai họ.

Hôm nay là ngày lành tháng tốt... tháng... năm..., gia đình chúng con thành tâm dâng lễ kính cáo Tổ tiên:

Con trai / con gái chúng con là... (tên) đã kết hôn cùng... (tên) con của gia đình...

Trước là kính cáo Tổ tiên, sau là để hai họ chính thức kết thân thông gia.

Kính cầu Tổ tiên hai họ chứng giám và ban phước:
- Đôi vợ chồng trẻ sống hòa thuận, hạnh phúc
- Sớm sinh con đẻ cái, nối dõi tông đường
- Làm ăn phát đạt, gia đình sung túc
- Vạn sự như ý, bách niên giai lão

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'phat-dan',
    ten:'Văn Khấn Lễ Phật Đản',
    icon:'🙏', category:'ngay-le', dip:'Rằm tháng 4 âm lịch',
    tomTat:'Bài văn khấn ngày Phật Đản, kỷ niệm ngày sinh Đức Phật',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)
Nam mô Bổn Sư Thích Ca Mâu Ni Phật!

Con kính lạy Đức Phật Thích Ca Mâu Ni.
Con kính lạy Đức Bồ Tát Quan Thế Âm.
Con kính lạy Đức Bồ Tát Địa Tạng.

Hôm nay là ngày Rằm tháng Tư - ngày Phật Đản, kỷ niệm ngày sinh của Đức Bổn Sư Thích Ca Mâu Ni, chúng con thành tâm dâng hương hoa, lễ vật kính mừng.

Chúng con nguyện:
- Theo gương Đức Phật, sống từ bi, hỷ xả
- Không sát sinh, không trộm cắp, không tà dâm
- Thực hành bố thí, giúp đỡ người khác
- Cầu cho chúng sinh thoát khổ, được an vui

Nam mô Bổn Sư Thích Ca Mâu Ni Phật! (3 lần)`,
  },
  {
    slug:'tho-cung-hang-ngay',
    ten:'Văn Khấn Thờ Cúng Hàng Ngày',
    icon:'🪔', category:'gia-tien', dip:'Thắp hương hàng ngày sáng tối',
    tomTat:'Bài văn khấn ngắn thắp hương hàng ngày buổi sáng hoặc tối',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy Thổ Công, Thổ Địa.
Con kính lạy Tổ tiên nội ngoại.

Hôm nay ngày... tháng... năm..., con (chúng con) thành tâm thắp nén hương thơm, dâng lên trước án.

Kính cầu:
- Gia đình bình an, mạnh khỏe
- Công việc suôn sẻ, tài lộc dồi dào
- Mọi sự hanh thông, vạn sự như ý

Chúng con lễ bạc tâm thành, cúi xin được chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'tan-nien',
    ten:'Văn Khấn Tất Niên',
    icon:'🍽', category:'le-tet', dip:'Ngày 30 tháng Chạp - Tất Niên',
    tomTat:'Bài văn khấn bữa cơm tất niên cuối năm',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy Tổ tiên nội ngoại.

Hôm nay là ngày 30 tháng Chạp năm..., gia đình chúng con thành tâm dâng mâm cơm tất niên, kính mời Tổ tiên về cùng ăn bữa cơm cuối năm.

Năm qua gia đình chúng con đã được Tổ tiên phù hộ. Chúng con thành tâm dâng lễ để tạ ơn và kính báo:

- Gia đình bình an, mạnh khỏe trong năm qua
- Cầu xin Tổ tiên tiếp tục phù hộ năm mới
- Năm mới mọi sự tốt lành, vạn điều như ý

Chúng con lễ bạc tâm thành, kính mời Tổ tiên về hưởng.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'xuat-hanh',
    ten:'Văn Khấn Xuất Hành Đầu Năm',
    icon:'🧧', category:'le-tet', dip:'Mùng 1-3 Tết - Xuất hành hái lộc',
    tomTat:'Bài văn khấn khi xuất hành đầu năm mới',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn Thần.
Con kính lạy ngài Đương Niên Hành Khiển.
Con kính lạy Thổ Công, Thổ Địa.

Hôm nay là ngày... tháng Giêng năm..., con (chúng con) tên... ngụ tại... thành tâm sắm lễ vật dâng lên trước án.

Con cầu xin:
- Xuất hành gặp may, mọi việc thuận lợi
- Đi đường bình an, không gặp tai nạn
- Năm mới tài lộc đến, công việc hanh thông
- Vạn sự như ý, bách phúc lâm môn

Con lễ bạc tâm thành, cúi xin được chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'khai-but',
    ten:'Văn Khấn Khai Bút Đầu Năm',
    icon:'✍️', category:'le-tet', dip:'Mùng 1-7 Tết - Khai bút',
    tomTat:'Cúng khai bút đầu năm cầu học hành tấn tới, sự nghiệp thăng tiến',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Đức Khổng Tử Tiên Sư.
Con kính lạy chư vị Thần linh.

Hôm nay là ngày... tháng Giêng năm..., con thành tâm dâng lễ khai bút đầu năm.

Con cầu xin:
- Học hành thông minh, tiến bộ
- Thi cử đỗ đạt, bằng cấp cao
- Sự nghiệp thăng tiến, công việc thuận lợi
- Văn hay chữ tốt, tài năng phát triển

Con lễ bạc tâm thành, cúi xin được chứng giám và phù hộ.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'cung-co-hon',
    ten:'Văn Khấn Cúng Cô Hồn',
    icon:'👻', category:'ngay-le', dip:'Rằm tháng 7 - Tháng cô hồn',
    tomTat:'Bài văn khấn cúng thí thực cô hồn tháng 7 âm lịch',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Đức Địa Tạng Bồ Tát.
Con kính lạy các Tôn Thần cai quản cõi âm.

Hôm nay ngày... tháng Bảy âm lịch năm..., gia đình chúng con thành tâm bày lễ vật: cháo, muối gạo, hoa quả, vàng mã... để thí thực cho các cô hồn, vong linh chưa siêu thoát.

Chúng con cầu nguyện:
- Các cô hồn, vong linh nhận lễ vật và siêu thoát
- Gia đình bình an trong tháng cô hồn
- Tránh mọi xui xẻo, tai họa
- Mọi người trong nhà mạnh khỏe

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'than-tai-dat-tien',
    ten:'Văn Khấn Đặt Bàn Thờ Thần Tài',
    icon:'💰', category:'than-tai', dip:'Khi lập bàn thờ Thần Tài mới',
    tomTat:'Cúng khi mới lập bàn thờ Thần Tài - Thổ Địa',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Thổ Địa Tôn Thần.
Con kính lạy Thần Tài Vương Đại Cát Thần.
Con kính lạy Phúc Đức Chính Thần.

Hôm nay ngày... tháng... năm..., gia đình chúng con tên là... tại địa chỉ... thành tâm lập bàn thờ Thần Tài - Thổ Địa tại nơi này.

Chúng con kính cáo và cầu xin:
- Thần Tài - Thổ Địa về ngự trị tại bàn thờ này
- Phù hộ cho gia đình / cửa hàng chúng con
- Tài lộc dồi dào, tiền vào như nước
- Buôn bán phát đạt, vạn sự như ý
- Giữ gìn bình yên, tránh tai họa

Chúng con lễ bạc tâm thành, cúi xin được chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'cau-an',
    ten:'Văn Khấn Cầu An Đầu Năm',
    icon:'🌸', category:'le-tet', dip:'Đầu năm mới - đi chùa cầu an',
    tomTat:'Bài văn khấn cầu bình an cho gia đình đầu năm mới',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Đức Phật A Di Đà.
Con kính lạy Đức Bồ Tát Quan Thế Âm.
Con kính lạy chư Tổ, chư Thầy.

Hôm nay ngày... tháng... năm..., con (chúng con) tên... đến nơi đây thành tâm lễ Phật, cầu nguyện.

Con cầu nguyện cho:
- Gia đình bình an, mạnh khỏe suốt năm
- Tai qua nạn khỏi, mọi việc suôn sẻ
- Công việc thuận lợi, học hành tấn tới
- Gia đình hạnh phúc, sum vầy
- Phát tâm làm việc thiện, giúp ích cho mọi người

Nam mô A Di Đà Phật! (3 lần)`,
  },
  {
    slug:'hinh-nhon',
    ten:'Văn Khấn Hóa Vàng',
    icon:'🔥', category:'gia-tien', dip:'Sau lễ cúng - hóa vàng mã',
    tomTat:'Bài văn khấn khi hóa vàng mã sau buổi lễ cúng',
    noiDung:`Nam mô A Di Đà Phật! (3 lần)

Con kính lạy Tổ tiên nội ngoại.
Con kính lạy các Tôn Thần.

Lễ cúng đã xong, chúng con thành tâm hóa vàng mã để dâng lên Tổ tiên và các Tôn Thần.

Kính mong:
- Tổ tiên nhận lễ vật gửi qua âm phủ
- Phù hộ cho gia đình bình an, may mắn
- Vàng mã hóa thành vật thật nơi cõi âm
- Tổ tiên sung túc, an vui nơi chín suối

Chúng con lễ bạc tâm thành, cúi xin được chứng giám.

Nam mô A Di Đà Phật! (3 lần)`,
  },
];

export function getVanKhanByCategory(cat: string): VanKhan[] {
  if (cat === 'all') return VAN_KHAN_DATA;
  return VAN_KHAN_DATA.filter(v => v.category === cat);
}

export function getVanKhanBySlug(slug: string): VanKhan | undefined {
  return VAN_KHAN_DATA.find(v => v.slug === slug);
}
