export {
  listVisitors,
  getVisitorById,
  createVisitor,
  checkOutVisitor,
  countVisitorsByStatus,
} from './visitors'

export {
  listComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  countComplaintsByStatus,
} from './complaints'

export {
  listResidents,
  getResidentById,
  createResident,
  updateResident,
  checkoutResident,
  softDeleteResident,
  countResidentsByStatus,
} from './residents'

export {
  listRooms,
  getRoomById,
  createRoom,
  updateRoom,
  softDeleteRoom,
  countRoomsByStatus,
  getRoomsWithVacancy,
  updateRoomOccupancy,
} from './rooms'

export {
  listRentRecords,
  getRentRecordById,
  createRentRecord,
  markRentPaid,
  generateRentForMonth,
  recordPayment,
  getReceipts,
  calculateAndApplyLateFees,
  getRevenueStats,
  listRecurringRevenue,
  countPendingRent,
  countCollectedRent,
  countOverdueRent,
  countPendingRecords,
} from './rents'

export {
  listNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  publishNotice,
  archiveNotice,
  countPublishedNotices,
} from './notices'

export {
  listMaintenanceRequests,
  getMaintenanceRequestById,
  createMaintenanceRequest,
  updateMaintenanceRequestStatus,
  assignMaintenanceRequest,
  countMaintenanceRequestsByStatus,
} from './maintenance'

export {
  listAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  listActiveAnnouncements,
} from './announcements'

export {
  dispatchNotification,
  notifyRentDue,
  notifyRentOverdue,
  notifyMaintenanceResolved,
  notifyAnnouncement,
  registerProvider,
  sendPendingNotifications,
  listNotificationLogs,
  listNotificationTemplates,
} from './notifications'

export type { StayNestAnalytics } from './analytics'
export {
  getStayNestAnalytics,
  getRevenueTrend,
  buildOccupancyTrend,
  getMaintenanceTrend,
} from './analytics'

export type { GlobalSearchResult } from './search'
export {
  globalSearch,
} from './search'

export {
  exportResidentsCSV,
  exportRentRecordsCSV,
  exportMaintenanceCSV,
  exportVisitorsCSV,
} from './export'

export { isOrganizationEmpty, seedDemoData } from './demo'
