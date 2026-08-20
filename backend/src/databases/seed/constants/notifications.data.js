export const notificationsData = [

  {
    reservationCode: "RES-2026-AB12CD",
    type: "CONFIRMATION",
    channel: "EMAIL",
    recipient: "minhanh@gmail.com",

    subject: "Xác nhận đặt bàn",
    body: "Đặt bàn của bạn tại Hương Việt Quận 1 đã được xác nhận.",

    status: "DELIVERED",
    sent_at: new Date("2026-06-09T10:00:00"),
    delivered_at: new Date("2026-06-09T10:00:05"),

    external_id: "sendgrid_msg_001",

    is_read: true,
    read_at: new Date("2026-06-09T10:05:00")
  },

  {
    reservationCode: "RES-2026-X91KQ2",
    type: "CONFIRMATION",
    channel: "SMS",
    recipient: "0912000002",

    body: "Tokyo Sushi Vincom: Đặt bàn của bạn đang chờ xác nhận.",

    status: "SENT",
    sent_at: new Date("2026-06-10T14:00:00"),

    external_id: "twilio_sms_002",

    is_read: false
  },

  {
    reservationCode: "RES-2026-PL9S2K",
    type: "REMINDER",
    channel: "ZALO",
    recipient: "0933000003",

    body: "Nhắc nhở: Bạn có đặt bàn tại BBQ Master Phạm Văn Đồng lúc 18:30 hôm nay.",

    status: "DELIVERED",
    sent_at: new Date("2026-06-12T16:30:00"),
    delivered_at: new Date("2026-06-12T16:30:03"),

    external_id: "zalo_msg_003",

    is_read: false
  },

  {
    reservationCode: "RES-2026-HF82KD",
    type: "CUSTOM",
    channel: "EMAIL",
    recipient: "phamtrang@gmail.com",

    subject: "Cảm ơn bạn đã dùng bữa",
    body: "Cảm ơn bạn đã dùng bữa tại Hương Việt Quận 7.",

    status: "DELIVERED",
    sent_at: new Date("2026-06-13T19:30:00"),
    delivered_at: new Date("2026-06-13T19:30:02"),

    external_id: "sendgrid_msg_004",

    is_read: true,
    read_at: new Date("2026-06-13T19:35:00")
  }

]