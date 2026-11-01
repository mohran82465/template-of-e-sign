export interface User {
  fullName: string;
  email: string;
  idNumber: string;
  role?: string;
  avatarUrl?: string;
}

export interface BilingualText {
  en: string;
  ar: string;
}

export interface ContractClause {
  number: string;
  title: BilingualText;
  body: BilingualText;
}

export interface ContractProperty {
  name: string;
  legalName: string;
  vatNumber: string;
  crNumber: string;
  shortAddress: string;
  phone: string;
  tourismLicence: string;
  representedBy: string;
  representativeName: string;
  representativeTitle: string;
}

export interface ContractGuest {
  name: string;
  idDisplay: string;
  nationality: string;
  mobile: string;
}

export interface ContractStay {
  unit: string;
  category: string;
  arrival: string;
  departure: string;
  nights: string;
  occupancy: string;
  ratePlan: string;
  mealPlan: string;
}

export interface ContractLineItem {
  label: BilingualText;
  rate: string;
  amount: string;
  isPlaceholder?: boolean;
}

export interface ContractFinancials {
  lineItems: ContractLineItem[];
  total: string;
  advanceDeposit: string;
  balance: string;
  securityDeposit: string;
  acceptedPayment: string;
}

export interface ContractPolicy {
  title: BilingualText;
  reference: string;
  body: BilingualText;
}

export interface ContractAcceptance {
  via: string;
  at: string;
  witnessedBy: string;
  id: string;
}

export interface ContractData {
  id: string;
  title: BilingualText;
  contractNumber: string;
  reservationNumber: string;
  date: string;
  termsVersion: string;
  property: ContractProperty;
  guest: ContractGuest;
  stay: ContractStay;
  financials: ContractFinancials;
  policies: ContractPolicy[];
  clauses: ContractClause[];
  acceptance: ContractAcceptance;
  printedBy: string;
  printedAt: string;
}

export type ConfirmationMethod = 'confirmed' | 'signed';

export interface ContractVersion {
  versionNumber: number;
  versionLabel: string;
  id: string;
  timestamp: string;
  method: ConfirmationMethod;
  signerName: string;
  signerEmail: string;
  signerIdNumber: string;
  signDate: string;
  signatureImage?: string; // Data URL for handwritten signature
  filledClientName: string;
  auditHash: string;
  ipAddressPlaceholder?: string;
  notes?: string;
}

export type ActiveOption = 'confirm' | 'signature';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
