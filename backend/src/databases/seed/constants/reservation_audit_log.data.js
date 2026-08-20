export const reservationAuditLogsData = [

  {
    reservationCode: "RES-2026-AB12CD",
    userEmail: "customer1@example.com",
    action: "created",

    new_values: {
      status: "PENDING",
      party_size: 4
    },

    ip_address: "192.168.1.10",
    user_agent: "Chrome"
  },

  {
    reservationCode: "RES-2026-AB12CD",
    userEmail: "customer1@example.com",
    action: "confirmed",

    old_values: {
      status: "PENDING"
    },

    new_values: {
      status: "CONFIRMED"
    },

    ip_address: "192.168.1.10",
    user_agent: "Chrome"
  },

  {
    reservationCode: "RES-2026-PL9S2K",
    userEmail: "customer2@example.com",
    action: "created",

    new_values: {
      status: "PENDING",
      party_size: 6
    },

    ip_address: "192.168.1.12",
    user_agent: "Mobile Safari"
  },

  {
    reservationCode: "RES-2026-HF82KD",
    userEmail: "customer3@example.com",
    action: "completed",

    old_values: {
      status: "SEATED"
    },

    new_values: {
      status: "COMPLETED"
    },

    ip_address: "192.168.1.15",
    user_agent: "Firefox"
  }

];