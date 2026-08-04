import { PrismaClient } from './src/databases/prisma/generated/prisma/index.js';

const prisma = new PrismaClient();

const RESTAURANT_ID = "a9efb714aa3cc91c57335c4b";

const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
const lastNames = ["Hải", "Lan", "Nam", "Mai", "Tuấn", "Hoa", "Anh", "Minh", "Hương", "Huy", "Hằng", "Khoa", "Nhung", "Thành", "Phương", "Đạt"];

function getRandomName() {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const mid = ["Thị", "Văn", "Đình", "Thanh", "Bảo", "Ngọc"][Math.floor(Math.random() * 6)];
    return `${first} ${mid} ${last}`;
}

const reviewTemplates = [
    { text: "Nhà hàng có không gian tuyệt vời, rất thích hợp cho hẹn hò. Món steak chín vừa tới, rượu vang kết hợp rất hoàn hảo. Sẽ quay lại!", rating: 5, occasion: "DATE" },
    { text: "Phục vụ cực kỳ chuyên nghiệp và chu đáo. Từng món ăn đều là một tác phẩm nghệ thuật. Rất đáng giá tiền.", rating: 5, occasion: "ANNIVERSARY" },
    { text: "Không gian sang trọng, yên tĩnh. Đồ ăn ngon nhưng món tráng miệng hơi ngọt so với khẩu vị của tôi. Tổng thể vẫn rất tuyệt.", rating: 4, occasion: "NORMAL" },
    { text: "Tổ chức sinh nhật ở đây là một quyết định đúng đắn. Nhà hàng tặng bánh sinh nhật nhỏ rất dễ thương, nhân viên hát chúc mừng nhiệt tình.", rating: 5, occasion: "BIRTHDAY" },
    { text: "Bàn VIP có view nhìn ra thành phố tuyệt đẹp. Tiếp khách đối tác ở đây rất hợp lý. Tuy nhiên lên món lúc đông khách hơi chậm một chút.", rating: 4, occasion: "BUSINESS" },
    { text: "Mọi thứ đều hoàn hảo từ lúc bước vào đến lúc ra về. Chef đã ra tận bàn để hỏi thăm khẩu vị, một trải nghiệm Fine Dining đúng nghĩa.", rating: 5, occasion: "DATE" },
    { text: "Đồ ăn tươi ngon, decor đẹp mắt. Giá cả tương xứng với chất lượng. Rất khuyến khích thử món Signature của nhà hàng.", rating: 5, occasion: "NORMAL" },
    { text: "Nhà hàng trang trí siêu đẹp, góc nào chụp ảnh cũng lung linh. Nhân viên hỗ trợ nhiệt tình.", rating: 5, occasion: "OTHER" },
    { text: "Hôm nay gia đình mình đi ăn cuối tuần, không gian rộng rãi thoải mái. Đồ ăn lên nhanh, nóng hổi.", rating: 5, occasion: "NORMAL" },
    { text: "Thịt bò Kobe nướng đá muối cực phẩm! Lần đầu tiên trải nghiệm hương vị tan chảy trong miệng tuyệt vời đến vậy.", rating: 5, occasion: "DATE" },
    { text: "Chất lượng dịch vụ xuất sắc. Mình có dị ứng hải sản và nhà hàng đã đặc biệt cẩn thận trong khâu chế biến. Cảm ơn rất nhiều.", rating: 5, occasion: "NORMAL" },
    { text: "Món ăn ổn, decor đẹp nhưng không gian hơi ồn do có một bàn tổ chức tiệc kế bên. Hy vọng nhà hàng có vách ngăn tốt hơn.", rating: 3, occasion: "BUSINESS" },
    { text: "Trải nghiệm ẩm thực đẳng cấp 5 sao. Menu nếm thử (Tasting Menu) kết hợp cùng Wine Pairing là một hành trình hương vị tuyệt diệu.", rating: 5, occasion: "ANNIVERSARY" },
    { text: "Giá khá chát nhưng tiền nào của nấy. Không gian luxury, riêng tư, thích hợp để cầu hôn hoặc kỷ niệm ngày cưới.", rating: 5, occasion: "DATE" },
    { text: "Nhân viên nhiệt tình, tư vấn món rất chuẩn. Tuy nhiên hôm nay nhà hàng hết món tôm hùm nên hơi tiếc.", rating: 4, occasion: "NORMAL" },
    { text: "Nơi lý tưởng để tiếp đãi khách VIP. Phong cách phục vụ lịch sự, nhã nhặn, món ăn bài trí tinh tế.", rating: 5, occasion: "BUSINESS" },
    { text: "Mình đặt bàn trước 1 tuần và khi đến thì bàn đã được set up vô cùng lãng mạn. Rất ưng ý!", rating: 5, occasion: "DATE" },
    { text: "Món ăn ngon, vị vừa vặn, không gian sang trọng ấm cúng. Phù hợp cho những buổi tối hẹn hò lãng mạn.", rating: 5, occasion: "DATE" },
    { text: "Mình hơi thất vọng vì phải đợi bàn khoảng 10 phút dù đã đặt trước. Bù lại đồ ăn ngon cứu vớt lại.", rating: 3, occasion: "NORMAL" },
    { text: "Khu vực phòng riêng (Private Room) thiết kế rất đẹp, cách âm tốt. Các món hải sản rất tươi.", rating: 5, occasion: "BUSINESS" },
    { text: "Rất ấn tượng với bộ sưu tập rượu vang của nhà hàng. Sommelier tư vấn rượu rất có tâm.", rating: 5, occasion: "NORMAL" },
    { text: "Vị trí đẹp, dễ tìm, bãi đỗ xe rộng rãi. Món súp nấm nấm truffles rất thơm và béo ngậy.", rating: 5, occasion: "NORMAL" },
    { text: "Hương vị đồ ăn đạt chuẩn sao Michelin. Tuy nhiên khẩu phần hơi ít so với người ăn khỏe như mình.", rating: 4, occasion: "NORMAL" },
    { text: "Được bạn bè giới thiệu và quả thực không thất vọng. Mình sẽ giới thiệu cho nhiều người khác.", rating: 5, occasion: "NORMAL" },
    { text: "Bánh chocolate lava tráng miệng ở đây là đỉnh nhất mình từng ăn. Lớp vỏ giòn, nhân socola nóng hổi chảy ra siêu ngon.", rating: 5, occasion: "DATE" },
    { text: "Nhân viên nhớ tên khách hàng và khẩu vị từ lần trước đến. Rất ngạc nhiên và hài lòng với sự tận tâm này.", rating: 5, occasion: "NORMAL" },
    { text: "Nhà hàng có không gian mở thoáng đãng. Nhạc nền nhẹ nhàng, thư giãn. Món cá hồi áp chảo sốt chanh dây rất tuyệt.", rating: 5, occasion: "NORMAL" },
    { text: "Hôm nay trời mưa nhưng bước vào nhà hàng cảm giác vô cùng ấm cúng. Trải nghiệm tuyệt vời.", rating: 5, occasion: "DATE" },
    { text: "Phục vụ lúc đông khách có chút bối rối, gọi thêm nước đợi hơi lâu. Đồ ăn thì vẫn giữ vững phong độ ngon.", rating: 4, occasion: "NORMAL" },
    { text: "Bàn mình đặt có view nhìn thẳng ra sông rất đẹp. Cảm ơn nhà hàng đã sắp xếp chu đáo.", rating: 5, occasion: "ANNIVERSARY" },
    { text: "Không gian trang trí tinh tế, ánh sáng vàng ấm áp phù hợp với phong cách Fine Dining. Món ăn bài trí như một bức tranh.", rating: 5, occasion: "DATE" },
    { text: "Mình đi ăn với gia đình, có trẻ nhỏ nhưng nhà hàng chuẩn bị sẵn ghế em bé và có món riêng cho bé. Rất tâm lý.", rating: 5, occasion: "BIRTHDAY" },
    { text: "Set menu mùa đông rất ngon, hương vị đậm đà, ấm áp. Chắc chắn sẽ quay lại thử các set menu mùa khác.", rating: 5, occasion: "NORMAL" },
    { text: "Rất thích phong cách phục vụ tại bàn (Tableside service) của nhà hàng, vừa ăn vừa được xem trình diễn món ăn.", rating: 5, occasion: "DATE" },
    { text: "Giá cả hợp lý so với một nhà hàng ở phân khúc cao cấp. Điểm 10 cho chất lượng phục vụ.", rating: 5, occasion: "NORMAL" },
    { text: "Nhà hàng có nhiều loại cocktail ngon và lạ miệng. Ngồi ở quầy bar nhâm nhi cũng rất thú vị.", rating: 5, occasion: "NORMAL" },
    { text: "Thịt cừu nướng không hề bị hôi, thịt mềm mọng nước. Một trong những nhà hàng làm món cừu ngon nhất mình từng ăn.", rating: 5, occasion: "NORMAL" },
    { text: "Mình đã có một kỷ niệm khó quên tại đây. Nhà hàng rất tuyệt vời, sẽ là điểm đến quen thuộc của mình trong thời gian tới.", rating: 5, occasion: "ANNIVERSARY" }
];

async function seed() {
    try {
        console.log("Tìm kiếm Role Khách hàng...");
        let customerRole = await prisma.role.findFirst({
            where: { name: "Khách hàng" }
        });

        if (!customerRole) {
            console.log("Không tìm thấy role 'Khách hàng', lấy role đầu tiên làm mặc định...");
            customerRole = await prisma.role.findFirst();
        }

        console.log("Cập nhật phần giới thiệu (description) cho nhà hàng...");
        const description = `Tọa lạc tại vị trí đắc địa, nhà hàng mang đến một không gian Fine Dining đẳng cấp bậc nhất, kết hợp hài hòa giữa lối kiến trúc đương đại sang trọng và nét đẹp tinh tế cổ điển. Chúng tôi tự hào giới thiệu thực đơn đa dạng được chế tác bởi những siêu đầu bếp hàng đầu, sử dụng nguyên liệu thượng hạng tươi ngon nhất tuyển chọn mỗi ngày.

Mỗi món ăn không chỉ là sự bùng nổ về hương vị mà còn là một kiệt tác nghệ thuật đầy tính sáng tạo. Với dịch vụ chăm sóc khách hàng tận tâm, chuyên nghiệp chuẩn 5 sao và không gian riêng tư lãng mạn, nhà hàng chính là điểm đến hoàn hảo cho những buổi tiệc kỷ niệm, gặp gỡ đối tác hay những buổi hẹn hò khó quên. Hãy để chúng tôi đánh thức mọi giác quan của bạn trong một hành trình ẩm thực tinh hoa tuyệt mỹ.`;

        await prisma.restaurant.update({
            where: { id: RESTAURANT_ID },
            data: { description: description }
        });

        console.log("Bắt đầu tạo dữ liệu 38 reviews...");

        for (let i = 0; i < reviewTemplates.length; i++) {
            const template = reviewTemplates[i];
            const name = getRandomName();
            
            // 1. Tạo User ngẫu nhiên
            const user = await prisma.user.create({
                data: {
                    user_name: `user_seed_${Date.now()}_${i}`,
                    email: `user${Date.now()}_${i}@example.com`,
                    name: name,
                    avatar: "https://res.cloudinary.com/dcbzxjswz/image/upload/v1739501538/quan_ly_nha_hang/user/default-avatar.png",
                    is_active: "ACTIVE",
                    roleId: customerRole.id
                }
            });

            // 2. Tạo Reservation (Đã ăn xong)
            const reservation = await prisma.reservations.create({
                data: {
                    confirmation_code: `RES${Date.now()}${i}`,
                    restaurantId: RESTAURANT_ID,
                    userId: user.id,
                    guest_name: user.name,
                    guest_phone: "090" + Math.floor(1000000 + Math.random() * 9000000),
                    reservation_date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random trong 30 ngày qua
                    start_time: "19:00",
                    end_time: "21:00",
                    party_size: Math.floor(Math.random() * 4) + 2,
                    status: "COMPLETED",
                    occasion: template.occasion,
                    source: "WEB"
                }
            });

            // 3. Tạo Review
            await prisma.review_Restaurant.create({
                data: {
                    reservationId: reservation.id,
                    userId: user.id,
                    restaurantId: RESTAURANT_ID,
                    overall_rating: template.rating,
                    food_rating: template.rating,
                    service_rating: template.rating,
                    ambiance_rating: template.rating >= 4 ? template.rating : 5,
                    comment: template.text,
                    status: "APPROVED",
                    helpful_count: Math.floor(Math.random() * 20),
                    images: Math.random() > 0.7 ? ["https://res.cloudinary.com/dcbzxjswz/image/upload/v1739501538/quan_ly_nha_hang/restaurant/sample-food.jpg"] : []
                }
            });

            console.log(`Đã tạo review ${i + 1}/${reviewTemplates.length}`);
        }

        // Cập nhật lại tổng số rating cho nhà hàng
        const allReviews = await prisma.review_Restaurant.findMany({
            where: { restaurantId: RESTAURANT_ID }
        });

        const totalRating = allReviews.length;
        const avg = allReviews.reduce((sum, r) => sum + r.overall_rating, 0) / totalRating;

        await prisma.restaurant.update({
            where: { id: RESTAURANT_ID },
            data: {
                totalRating: totalRating,
                averageRating: parseFloat(avg.toFixed(1)),
                weightedScore: parseFloat(avg.toFixed(1))
            }
        });

        console.log("Hoàn thành quá trình seed dữ liệu!");

    } catch (error) {
        console.error("Lỗi:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
