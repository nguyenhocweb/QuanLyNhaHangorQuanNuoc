import { reservationAuditLogsData } from "../constants/reservation_audit_log.data.js";

export const reservationAuditLogsExtension = async (prisma) => {

  console.log("Creating reservation audit logs...");





  // Lấy users
 



  

  const result = await prisma.reservation_Audit_Log.createMany({
    data:reservationAuditLogsData
  });

  console.log(`✅ Created ${result.count} reservation audit logs`);
};
