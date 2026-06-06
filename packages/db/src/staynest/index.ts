export {
  listVisitors,
  getVisitorById,
  createVisitor,
  checkOutVisitor,
  countVisitorsByStatus,
} from './visitors'

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
  toggleNotificationTemplate,
  listNotificationRules,
  createNotificationRule,
  updateNotificationRule,
  deleteNotificationRule,
  retryNotificationLog,
  consoleNotificationProvider,
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

export {
  listReceipts,
  getReceiptById,
  getReceiptsByResident,
  voidReceipt,
  regenerateReceipt,
  getResidentPaymentSummary,
  getAllResidentPaymentSummaries,
} from './receipts'

export { notificationEngine, NotificationEngine, getNotificationEngineStats } from './notification-engine'
export type { ExecutionResult } from './notification-engine'

export { isOrganizationEmpty, seedDemoData } from './demo'

export { getProviderSettings, saveProviderSettings, PROVIDER_DEFINITIONS } from './provider-settings'
export type { ProviderName, ProviderConfig, ProviderField } from './provider-settings'
export { getProvider, getActiveProvider } from './providers/provider-router'
