export const reservationsData = [

  {
    confirmation_code: "RES-2026-AB12CD",
    restaurantName: "Hương Việt Quận 1",
    guest_name: "Nguyễn Minh Anh",
    guest_phone: "0908000001",
    guest_email: "minhanh@gmail.com",

    reservation_date: new Date("2026-06-10"),
    start_time: "18:00",
    end_time: "20:00",

    party_size: 4,
    status: "CONFIRMED",
    source: "WEB",

    special_requests: "Bàn gần cửa sổ",
    occasion: "BIRTHDAY",

    deposit_paid: true,
    deposit_amount: 200000
  },

  {
    confirmation_code: "RES-2026-X91KQ2",
    restaurantName: "Tokyo Sushi Vincom",
    guest_name: "Trần Văn Bình",
    guest_phone: "0912000002",
    guest_email: "binhtran@gmail.com",

    reservation_date: new Date("2026-06-11"),
    start_time: "19:00",
    end_time: "21:00",

    party_size: 2,
    status: "PENDING",
    source: "MOBILE",

    special_requests: "Không wasabi",
    dietary_restrictions: ["no_wasabi"],

    occasion: "DATE",

    deposit_paid: false
  },

  {
    confirmation_code: "RES-2026-PL9S2K",
    restaurantName: "BBQ Master Phạm Văn Đồng",
    guest_name: "Lê Hoàng Nam",
    guest_phone: "0933000003",

    reservation_date: new Date("2026-06-12"),
    start_time: "18:30",
    end_time: "20:30",

    party_size: 6,
    status: "CONFIRMED",
    source: "PHONE",

    special_requests: "Bàn gần máy hút khói mạnh",

    deposit_paid: true,
    deposit_amount: 300000
  },

  {
    confirmation_code: "RES-2026-HF82KD",
    restaurantName: "Hương Việt Quận 7",
    guest_name: "Phạm Thu Trang",
    guest_phone: "0944000004",

    reservation_date: new Date("2026-06-13"),
    start_time: "17:30",
    end_time: "19:30",

    party_size: 3,
    status: "COMPLETED",
    source: "WEB",

    seated_at:new Date( "2026-06-13T17:35:00"),
    completed_at: new Date("2026-06-13T19:20:00")
  }

]