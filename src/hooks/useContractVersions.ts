import { useState, useEffect, useCallback } from 'react';
import { ContractVersion, ContractData, ConfirmationMethod } from '../types';

const STORAGE_KEY = 'signflow_contract_versions_v1';

// Helper to create realistic audit hash
function generateAuditHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function useContractVersions(initialContract: ContractData) {
  const [versions, setVersions] = useState<ContractVersion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load contract versions from localStorage:', e);
    }
    return [];
  });

  const [activeViewingVersion, setActiveViewingVersion] = useState<ContractVersion | null>(null);

  // Sync with localStorage whenever versions change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
    } catch (e) {
      console.error('Failed to save contract versions to localStorage:', e);
    }
  }, [versions]);

  const saveVersion = useCallback(
    (params: {
      method: ConfirmationMethod;
      signerName: string;
      signerEmail: string;
      signerIdNumber: string;
      signDate: string;
      signatureImage?: string;
      contractSnapshot: ContractData;
    }): ContractVersion => {
      const nextVersionNumber = versions.length > 0 ? versions[0].versionNumber + 1 : 1;
      
      const newVersion: ContractVersion = {
        versionNumber: nextVersionNumber,
        versionLabel: `v${nextVersionNumber}`,
        id: `ver-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        method: params.method,
        signerName: params.signerName,
        signerEmail: params.signerEmail,
        signerIdNumber: params.signerIdNumber,
        signDate: params.signDate,
        signatureImage: params.signatureImage,
        filledClientName: params.signerName,
        auditHash: generateAuditHash(),
        ipAddressPlaceholder: '192.168.1.104 (TLS Verified)',
        notes: params.method === 'signed' ? 'Drawn handwritten signature mark' : 'Electronic click-to-agree confirmation',
      };

      setVersions((prev) => [newVersion, ...prev]);
      // If we were viewing a past version, switch back to current draft/newest
      setActiveViewingVersion(null);
      return newVersion;
    },
    [versions]
  );

  const viewVersion = useCallback((version: ContractVersion) => {
    setActiveViewingVersion(version);
  }, []);

  const returnToCurrent = useCallback(() => {
    setActiveViewingVersion(null);
  }, []);

  const clearAllVersions = useCallback(() => {
    setVersions([]);
    setActiveViewingVersion(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const latestVersion = versions.length > 0 ? versions[0] : null;

  return {
    versions,
    latestVersion,
    activeViewingVersion,
    isViewingPastVersion: activeViewingVersion !== null,
    saveVersion,
    viewVersion,
    returnToCurrent,
    clearAllVersions,
  };
}
