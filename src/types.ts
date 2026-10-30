export interface User {
  fullName: string;
  email: string;
  idNumber: string;
  role?: string;
  avatarUrl?: string;
}

export interface ContractClause {
  number: number;
  title: string;
  body: string;
}

export interface ContractParty {
  role: string;
  name: string;
  entityType?: string;
  address?: string;
  email?: string;
  idNumber?: string;
}

export interface ContractData {
  id: string;
  title: string;
  contractNumber: string;
  date: string;
  parties: {
    serviceProvider: ContractParty;
    client: ContractParty;
  };
  clauses: ContractClause[];
  securityStamp?: string;
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
