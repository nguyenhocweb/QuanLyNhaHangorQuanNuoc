import { reservationAuditLogsData } from "../constants/reservation_audit_log.data.js";

export const reservationAuditLogsExtension = async (prisma) => {

  console.log("Creating reservation audit logs...");

  // Lấy reservations
  const reservations = await prisma.reservations.findMany({
    where: {
      OR: reservationAuditLogsData.map(e => ({
        confirmation_code: e.reservationCode
      }))
    },
    select: {
      id: true,
      confirmation_code: true
    }
  });

  const mapReservation = new Map(
    reservations.map(e => [e.confirmation_code, e.id])
  );

  // Lấy users
  const users = await prisma.user.findMany({
    where: {
      OR: reservationAuditLogsData.map(e => ({
        email: e.userEmail
      }))
    },
    select: {
      id: true,
      email: true
    }
  });

  const mapUser = new Map(
    users.map(e => [e.email, e.id])
  );

  // build data
  const data = reservationAuditLogsData.map(e => ({
    reservationId: mapReservation.get(e.reservationCode),
    changedByUserId: mapUser.get(e.userEmail),

    action: e.action,

    old_values: e.old_values ?? null,
    new_values: e.new_values ?? null,

    ip_address: e.ip_address,
    user_agent: e.user_agent
  }));

  const result = await prisma.reservation_Audit_Log.createMany({
    data
  });

  console.log(`✅ Created ${result.count} reservation audit logs`);
};