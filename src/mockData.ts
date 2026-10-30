import { User, ContractData } from './types';

export const mockUser: User = {
  fullName: 'Ahmed Ali',
  email: 'ahmed@example.com',
  idNumber: '1234567890',
  role: 'Authorized Principal / Client Signatory',
};

export const mockContract: ContractData = {
  id: 'contract-master-2026-8842',
  title: 'Master Commercial Services & Engagement Agreement',
  contractNumber: 'AGR-2026-8842-EMEA',
  date: 'October 30, 2026',
  parties: {
    serviceProvider: {
      role: 'Service Provider',
      name: 'Nexus Cloud Enterprise Solutions Ltd.',
      entityType: 'Delaware Corporation',
      address: '450 Innovation Parkway, Suite 1200, San Francisco, CA 94107',
      email: 'legal@nexuscloud.io',
      idNumber: 'US-EIN-94-3829104',
    },
    client: {
      role: 'Client & Counterparty',
      name: '{{CLIENT_NAME}}',
      address: '742 Evergreen Terrace, Sector 4, Capital District',
      email: 'ahmed@example.com',
      idNumber: '1234567890',
    },
  },
  clauses: [
    {
      number: 1,
      title: 'Engagement & Scope of Services',
      body: 'Nexus Cloud Enterprise Solutions Ltd. ("Provider") agrees to perform the digital architecture, cloud engineering, and technical advisory services as set forth herein. Client {{CLIENT_NAME}} hereby retains Provider as an independent contractor, subject to the agreed performance milestones and standards of care standard in the technology industry.',
    },
    {
      number: 2,
      title: 'Term, Duration & Renewal',
      body: 'This Agreement shall commence on {{SIGN_DATE}} ("Effective Date") and shall remain in full force and effect for an initial period of twelve (12) consecutive months, unless terminated earlier in accordance with Clause 7. Upon conclusion of the initial term, this Agreement shall automatically renew for successive one-year intervals unless either party delivers written notice of non-renewal at least thirty (30) days prior.',
    },
    {
      number: 3,
      title: 'Fees, Invoicing & Electronic Invoicing Schedule',
      body: 'Client {{CLIENT_NAME}} shall remit payment within thirty (30) calendar days following receipt of an undisputed itemized invoice. Late disbursements shall accrue statutory interest at the rate of one and one-half percent (1.5%) per month or the highest permissible lawful threshold. All statutory taxes or cross-border levies applicable to the services shall be borne directly by Client.',
    },
    {
      number: 4,
      title: 'Intellectual Property Ownership & Work Product',
      body: 'All pre-existing intellectual property belonging to each respective party prior to the execution of this Agreement on {{SIGN_DATE}} shall remain the exclusive property of that party. All deliverables, customized software repositories, and technical documentation authored specifically for Client upon receipt of full remuneration shall vest irrevocably in {{CLIENT_NAME}}.',
    },
    {
      number: 5,
      title: 'Confidentiality & Non-Disclosure Covenants',
      body: 'Each party warrants and undertakes to maintain the strictest confidence regarding all proprietary technical, financial, or commercial disclosures received from the other party. The obligations under this clause shall survive the termination or expiration of this Agreement for a period of five (5) consecutive years from {{SIGN_DATE}}.',
    },
    {
      number: 6,
      title: 'Warranties, Disclaimers & Limitation of Liability',
      body: 'Provider covenants that all work product will be conducted in a workmanlike and diligent manner consistent with prevailing industrial standards. Except as expressly stated herein, both parties disclaim all other implied warranties. Under no circumstances shall either party be liable to the other for indirect, special, punitive, or consequential damages.',
    },
    {
      number: 7,
      title: 'Termination for Cause & Convenience',
      body: 'Either party may terminate this Agreement without cause upon giving forty-five (45) days advance written notice. In the event of a material breach by either party that remains uncured for fifteen (15) business days following written notice, the non-breaching party may immediately terminate this Agreement with written effect.',
    },
    {
      number: 8,
      title: 'Governing Law, Jurisdiction & Binding Electronic Execution',
      body: 'This Agreement shall be governed by, and construed in accordance with, the laws of the State of Delaware, without giving effect to conflict of laws principles. The parties agree that electronic confirmation or electronic signatures affixed via {{SIGNATURE}} on {{SIGN_DATE}} carry the same binding legal force and admissibility as original wet-ink signatures.',
    },
  ],
  securityStamp: 'CRYPTOGRAPHIC-VERIFIED-SHA256-SIGNFLOW-AUTH',
};

export const mockTermsAndConditions = [
  {
    heading: '1. Electronic Record & Electronic Signature Disclosure',
    content:
      'By electing to proceed and access this Agreement, you consent to receive, read, verify, and electronically execute records relating to this transaction in digital format. You acknowledge that your electronic confirmation, whether executed via digital checkbox consent or drawn cryptographic signature mark, constitutes an authentic, legally enforceable signature under the Electronic Signatures in Global and National Commerce Act (E-SIGN Act), the Uniform Electronic Transactions Act (UETA), and applicable international standards.',
  },
  {
    heading: '2. Identity Verification & Authorized Capacity',
    content:
      'You hereby represent, covenant, and warrant that you are the individual identified in this transaction (Ahmed Ali, ID: 1234567890), that you are at least eighteen (18) years of age, and that you possess full legal capacity and corporate authority to bind yourself and/or your designated entity to all covenants and obligations set forth in the underlying contract document.',
  },
  {
    heading: '3. Technical Requirements & Record Retention',
    content:
      'To review and maintain your records, you must have an active internet connection, a modern web browser supporting modern cryptography (Transport Layer Security 1.3 or higher), and software capable of rendering PDF documents. You are advised to download and retain an electronic or printed copy of every executed version for your permanent records.',
  },
  {
    heading: '4. Audit Trail, Timestamping & Anti-Tamper Mechanisms',
    content:
      'All user interactions, including viewing the document, consenting to these terms, applying a digitized signature, and saving contract revisions, are timestamped and assigned a verifiable audit hash. These records may be produced in evidence in any judicial, administrative, or arbitral proceeding arising out of or concerning this transaction.',
  },
  {
    heading: '5. Irrevocability of Executed Document Versions',
    content:
      'Once a contract version is saved with your confirmation or signature, that version snapshot is permanently recorded to the version ledger and cannot be altered retrospectively. Subsequent versions create discrete new audited records, maintaining a comprehensive chain of custody for all modifications.',
  },
  {
    heading: '6. Explicit Scroll-to-Bottom Verification',
    content:
      'To ensure fair review and procedural integrity, you are required to scroll completely through this disclosure before the acceptance option is unlocked. By clicking "Accept Terms & Open Contract", you confirm that you have read, understood, and agreed to all provisions contained within this disclosure.',
  },
];
