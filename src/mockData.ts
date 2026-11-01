import { User, ContractData } from './types';

export const mockUser: User = {
  fullName: 'عبدالرحمن سويلم الحربي',
  email: 'ahmed@example.com',
  idNumber: '1234567890',
  role: 'Guest',
};

export const mockContract: ContractData = {
  id: 'contract-reservation-2026-00001',
  title: { en: 'Reservation Contract', ar: 'عقد الحجز' },
  contractNumber: 'CON-2026-00001',
  reservationNumber: 'RES-2026-00001',
  date: '24 Oct 2026',
  termsVersion: 'v3 · eff. 01 Oct 2026',
  property: {
    name: 'Riyadh Demo Suites',
    legalName: 'Riyadh Demo Hospitality Co.',
    vatNumber: '300000000000003',
    crNumber: '1010000000',
    shortAddress: 'Olaya St, Riyadh',
    phone: '+966 11 000 0000',
    tourismLicence: 'TL-0000000',
    representedBy: 'Khalid Al-Otaibi, General Manager',
    representativeName: 'Khalid Al-Otaibi',
    representativeTitle: 'General Manager',
  },
  guest: {
    name: mockUser.fullName,
    idDisplay: 'National ID •••• 7890',
    nationality: 'Saudi',
    mobile: '+966 50 000 0000',
  },
  stay: {
    unit: 'Room 200',
    category: 'Deluxe Room',
    arrival: '24 Oct 2026 · 15:00',
    departure: '02 Nov 2026 · 12:00',
    nights: '9',
    occupancy: '1 adult, 0 children',
    ratePlan: 'Best Available Rate',
    mealPlan: 'Room Only',
  },
  financials: {
    lineItems: [
      {
        label: { en: 'Accommodation · 9 nights', ar: 'الإقامة · 9 ليالٍ' },
        rate: '100.00',
        amount: '900.00',
      },
      {
        label: { en: 'Occupancy Fee', ar: 'رسوم الإشغال' },
        rate: '0%',
        amount: '0.00',
      },
      {
        label: { en: 'VAT', ar: 'ضريبة القيمة المضافة' },
        rate: '0%',
        amount: '0.00',
      },
    ],
    total: '900.00',
    advanceDeposit: '900.00',
    balance: '0.00',
    securityDeposit: '0.00',
    acceptedPayment: 'Cash · Mada · Card',
  },
  policies: [
    {
      title: { en: 'Cancellation', ar: 'الإلغاء' },
      reference: 'Standard Cancellation · v2',
      body: {
        en: 'Free cancellation until 48 hours before arrival. Later cancellations are charged 1 night.',
        ar: 'إلغاء مجاني حتى 48 ساعة قبل الوصول، ويُحتسب بعدها ليلة واحدة.',
      },
    },
    {
      title: { en: 'No-show', ar: 'عدم الحضور' },
      reference: 'Standard No-show · v1',
      body: {
        en: 'First night charged; remaining nights released.',
        ar: 'تُحتسب الليلة الأولى وتُلغى بقية الليالي.',
      },
    },
    {
      title: { en: 'Deposit', ar: 'الدفعة المقدمة' },
      reference: 'Full Prepayment · v1',
      body: {
        en: '100% of the stay is due at confirmation.',
        ar: 'يُستحق 100% من قيمة الإقامة عند التأكيد.',
      },
    },
  ],
  clauses: [
    {
      number: '5.1',
      title: { en: 'Check-in and check-out', ar: 'الدخول والمغادرة' },
      body: {
        en: 'Check-in is from 15:00 on the arrival date and check-out is by 12:00 on the departure date. Late check-out depends on availability and may be charged.',
        ar: 'يبدأ تسجيل الدخول من الساعة 15:00 في تاريخ الوصول، ويكون تسجيل الخروج قبل الساعة 12:00 في تاريخ المغادرة. يخضع تأخير المغادرة للتوفر وقد تترتب عليه رسوم.',
      },
    },
    {
      number: '5.2',
      title: { en: 'Use of the unit', ar: 'استخدام الوحدة' },
      body: {
        en: 'The unit is for the named guests only, up to the stated occupancy. It may not be sublet, transferred, or used for any purpose other than residence.',
        ar: 'الوحدة مخصصة للضيوف المذكورين فقط وبحد أقصى الإشغال المحدد، ولا يجوز تأجيرها من الباطن أو التنازل عنها أو استخدامها لغير غرض السكن.',
      },
    },
    {
      number: '5.3',
      title: { en: 'Conduct and identification', ar: 'السلوك والهوية' },
      body: {
        en: "The guest follows the property's house rules and the laws of the Kingdom of Saudi Arabia, and presents a valid ID for every guest at check-in.",
        ar: 'يلتزم الضيف بأنظمة المنشأة الداخلية وأنظمة المملكة العربية السعودية، ويقدم هوية سارية لكل ضيف عند تسجيل الدخول.',
      },
    },
    {
      number: '5.4',
      title: { en: 'Damage and security deposit', ar: 'الأضرار ومبلغ التأمين' },
      body: {
        en: 'The guest is liable for loss or damage caused during the stay. Any security deposit is refunded at check-out after inspection, less agreed deductions.',
        ar: 'يتحمل الضيف مسؤولية أي فقدان أو تلف يقع خلال الإقامة، ويُسترد مبلغ التأمين عند المغادرة بعد المعاينة مخصوماً منه أي استقطاعات مستحقة.',
      },
    },
    {
      number: '5.5',
      title: { en: 'Early departure and extension', ar: 'المغادرة المبكرة والتمديد' },
      body: {
        en: 'Leaving early follows the cancellation policy in section 4. Extending the stay depends on availability and is charged at the rate in force at the time.',
        ar: 'تخضع المغادرة المبكرة لسياسة الإلغاء الواردة في البند 4، ويخضع تمديد الإقامة للتوفر وبالسعر المعمول به حينها.',
      },
    },
    {
      number: '5.6',
      title: { en: 'Personal data', ar: 'البيانات الشخصية' },
      body: {
        en: 'Personal data is processed under the Personal Data Protection Law (PDPL) for registration, billing, and mandatory reporting to government platforms.',
        ar: 'تُعالج البيانات الشخصية وفق نظام حماية البيانات الشخصية لأغراض التسجيل والفوترة والإبلاغ النظامي للمنصات الحكومية.',
      },
    },
    {
      number: '5.7',
      title: { en: 'Terms and conditions', ar: 'الشروط والأحكام' },
      body: {
        en: "The property's Terms & Conditions, version v3, form part of this contract. If the two texts differ, the Arabic text prevails.",
        ar: 'تُعد الشروط والأحكام الخاصة بالمنشأة، الإصدار v3، جزءاً لا يتجزأ من هذا العقد، وفي حال الاختلاف بين النصين يُعتمد النص العربي.',
      },
    },
    {
      number: '5.8',
      title: { en: 'Governing law', ar: 'النظام الواجب التطبيق' },
      body: {
        en: 'This contract is governed by the laws of the Kingdom of Saudi Arabia. Disputes are referred to the competent authorities in Riyadh.',
        ar: 'يخضع هذا العقد لأنظمة المملكة العربية السعودية، وتُحال أي نزاعات إلى الجهات المختصة في الرياض.',
      },
    },
  ],
  acceptance: {
    via: 'Signature / OTP',
    at: 'Pending',
    witnessedBy: 'Noura Al-Qahtani',
    id: 'Pending',
  },
  printedBy: 'Noura Al-Qahtani',
  printedAt: '24 Oct 2026, 14:30',
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
      `You hereby represent, covenant, and warrant that you are the individual identified in this transaction (${mockUser.fullName}, ID: ${mockUser.idNumber}), that you are at least eighteen (18) years of age, and that you possess full legal capacity and corporate authority to bind yourself and/or your designated entity to all covenants and obligations set forth in the underlying contract document.`,
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
