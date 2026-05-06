export type UserRole = 'ADMIN' | 'DEAN' | 'CHAIR' | 'FACULTY';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  program?: string;
  position: string;
  initials: string;
  avatarColor: string;
}

export type IPCRStatus = 'IN_PROGRESS' | 'PENDING_REVIEW' | 'REVISION_REQUIRED' | 'COMPLETED';
export type IPCRPhase = 'TARGET_SETTING' | 'MID_YEAR_REVIEW' | 'TERMINAL_REVIEW' | 'CLOSED';
export type FunctionCategory = 'STRATEGIC' | 'CORE' | 'SUPPORT';

export interface SuccessIndicator {
  id: string;
  code: string;
  description: string;
  measures: string;
  timeline: string;
  targetValue: number;
  actualValue: number;
  percentAccomplished: number;
  accountableUnits: string;
}

export interface MajorFunction {
  id: string;
  title: string;
  category: FunctionCategory;
  weight: number;
  successIndicators: SuccessIndicator[];
}

export interface OPCR {
  id: string;
  year: number;
  period: string;
  officeName: string;
  deanId: string;
  status: string;
  currentPhase: string;
  majorFunctions: MajorFunction[];
}

export interface IPCRTarget {
  id: string;
  parentOpIndicatorId: string;
  description: string;
  measures: string;
  q1Rating: number | null;
  e2Rating: number | null;
  t3Rating: number | null;
  a4Rating: number | null;
  actualAccomplishments: string;
  remarks: string;
  movFileUrls: string[];
}

export interface IPCRMajorFunction {
  id: string;
  title: string;
  category: FunctionCategory;
  weight: number;
  targets: IPCRTarget[];
}

export interface IPCR {
  id: string;
  year: number;
  period: string;
  facultyId: string;
  notedByChairId: string | null;
  verifiedByVpaa: string | null;
  approvedByDeanId: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  status: IPCRStatus;
  currentPhase: IPCRPhase;
  finalRating: number | null;
  adjectivalRating: string | null;
  majorFunctions: IPCRMajorFunction[];
  createdAt?: string;
}

export type NotificationType = 'IPCR_APPROVED' | 'IPCR_REVISION' | 'IPCR_SUBMITTED' | 'DEADLINE_REMINDER';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  createdAt: string;
}

export interface RatingCalculation {
  strategicAvg: number;
  coreAvg: number;
  supportAvg: number;
  strategicWeighted: number;
  coreWeighted: number;
  supportWeighted: number;
  final: number;
  adjectival: string;
}
