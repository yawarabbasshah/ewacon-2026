import React, { useEffect, useState, useMemo, createContext, useContext, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Menu,
  X,
  CheckCircle2,
  Users,
  Building2,
  Leaf,
  Zap,
  LogIn,
  Clock,
  Globe,
  Sparkles,
  ShieldCheck,
  Award,
  Cpu,
  Droplets,
  Printer,
  Check,
  Search,
  FileText,
  UploadCloud,
  Edit,
  Trash2,
  Plus,
  Mail,
  Download,
  Key,
  DollarSign,
  Activity,
  UserCheck,
  Layers,
  Filter,
  RefreshCw,
  Send,
  AlertCircle,
  LogOut,
  UserPlus,
  Eye,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  XCircle,
  HelpCircle,
  CreditCard,
  CheckSquare
} from 'lucide-react';
import './styles.css';

const API_BASE = window.location.port === '5173' ? 'http://localhost:5000/api' : '/api';

const LanguageContext = createContext();

const TRANSLATIONS = {
  ar: {
    nav: {
      brandTag: '2026 — أكاديمية الطاقة والمياه',
      home: 'الرئيسية',
      about: 'عن المؤتمر',
      objectives: 'الأهداف',
      tracks: 'المحاور',
      agenda: 'البرنامج الزمني',
      speakers: 'المتحدثون',
      exhibition: 'المعرض والرعايات',
      abstracts: 'تقديم الأوراق العلمية',
      register: 'التسجيل',
      admin: 'بوابة الإدارة'
    },
    hero: {
      badge: 'أكاديمية الطاقة والمياه (EWA) · النسخة الأولى',
      title1: 'تمكين مستقبل',
      title2: 'مستدام.',
      desc: 'EWACON 2026 — مؤتمر سنوي تنظمه أكاديمية الطاقة والمياه بشعار «الطاقة الخضراء»، يجمع نخبة من المتخصصين والباحثين والشركات لربط البحث العلمي بالتطبيق الصناعي.',
      date: '22 ديسمبر 2026',
      venue: 'أكاديمية الطاقة والمياه (إيوا - رابغ) · مركز أعمال أكوا',
      ctaRegister: 'تسجيل الحضور والعارضين',
      ctaAbstract: 'تقديم ملخص بحثي',
      countdownTitle: 'العد التنازلي لانطلاق المؤتمر',
      countdownSub: '22 ديسمبر 2026 — إيوا رابغ',
      days: 'يوم',
      hours: 'ساعة',
      minutes: 'دقيقة',
      seconds: 'ثانية',
      h1_title: 'أكاديمية الطاقة والمياه (EWA)',
      h1_desc: 'تدريب وتأهيل وبناء كفاءات وطنية متخصصة',
      h2_title: 'النسخة السنوية الأولى',
      h2_desc: 'منصة تجمع الأكاديميا بالصناعة والقطاع الحكومي',
      h3_title: 'المعرض المصاحب',
      h3_desc: 'مساحات عرض وأجنحة مجهزة للشركات والجهات الرائدة'
    },
    organizer: {
      eyebrow: 'الجهة المنظمة',
      desc: 'أكاديمية الطاقة والمياه (EWA) منظمة رائدة متخصصة في التدريب المهني وبناء الكفاءات الوطنية في قطاعات الطاقة والمياه، وتنظم مؤتمر EWACON 2026 لتعزيز الشراكات النوعية بين قطاع الأعمال والجامعات ومراكز الأبحاث.',
      pillar1_title: 'التدريب والتأهيل',
      pillar1_desc: 'تطوير كفاءات وطنية منافسة في مجالات الطاقة والمياه',
      pillar2_title: 'شراكات استراتيجية',
      pillar2_desc: 'التعاون مع كبرى الشركات والجهات الحكومية والأكاديمية',
      pillar3_title: 'منصة سنوية متخصصة',
      pillar3_desc: 'ملتقى رائد لمناقشة أحدث تقنيات الاستدامة والابتكار'
    },
    about: {
      eyebrow: 'نبذة عن المؤتمر',
      title: 'EWACON 2026',
      sub: 'مؤتمر سنوي تنظمه أكاديمية الطاقة والمياه — شعار هذا العام: «الطاقة الخضراء»',
      card1_title: 'الفئات المستهدفة',
      card1_desc: 'الأكاديميون والباحثون، قيادات الصناعة، مسؤولو الجهات الحكومية، متدربو الأكاديمية والمهندسون',
      card2_title: 'المحتوى العلمي',
      card2_desc: 'أوراق بحثية وعروض ابتكارية في الطاقة المتجددة وأشباه الموصلات وأنظمة المياه الذكية',
      card3_title: 'الموقع',
      card3_desc: 'أكاديمية الطاقة والمياه (إيوا - رابغ)'
    },
    objectives: {
      eyebrow: 'أهداف المؤتمر',
      title: 'الأهداف الاستراتيجية لمؤتمر EWACON 2026',
      sub: 'خارطة طريق لربط البحث العلمي بالتطبيق العملي ودعم مستهدفات رؤية المملكة 2030.',
      list: [
        'دمج أنظمة الطاقة النظيفة والمياه المتقدمة مع تقنيات الذكاء الاصطناعي في الشبكات الذكية.',
        'سد الفجوة بين الأوساط الأكاديمية والصناعية وربط البحوث التطبيقية بفرص الاستثمار التجاري.',
        'ترسيخ إيوا-رابغ كمركز إقليمي للمؤتمرات والتعاون التقني في الطاقة والمياه.',
        'تعزيز الشراكات المستدامة وعرض الابتكارات والمواهب وبراءات الاختراع الوطنية.',
        'التعاون الفعّال بين القطاعين الحكومي والخاص والأوساط الأكاديمية لتحقيق أمن الطاقة والمياه.',
        'دعم التوطين ونقل المعرفة والتقنية تماشياً مع مستهدفات رؤية السعودية 2030.'
      ]
    },
    tracks: {
      eyebrow: 'المحاور العلمية',
      title: 'محاور المؤتمر الرئيسية',
      track1_badge: 'المحور الأول',
      track1_title: 'الطاقة الخضراء',
      track1_desc: 'مصادر الطاقة المتجددة وكفاءة الاستهلاك وحلول التخزين المتقدمة',
      track2_badge: 'المحور الثاني',
      track2_title: 'أشباه الموصلات',
      track2_desc: 'تطبيقات أشباه الموصلات في الشبكات الكهربائية الذكية وأنظمة التحكم'
    },
    agenda: {
      eyebrow: 'البرنامج',
      title: 'البرنامج الزمني لفعاليات المؤتمر',
      dateBadge: '22 ديسمبر 2026',
      items: [
        { time: '08:00 – 09:00', title: 'التسجيل والاستقبال والتواصل', venue: 'مركز أعمال أكوا' },
        { time: '09:00 – 09:20', title: 'الافتتاح | م. ثامر الشرهان - رئيس مجلس إدارة الأكاديمية', venue: 'قاعة د. غازي القصيبي' },
        { time: '09:20 – 10:00', title: 'كلمة رئيسية | د. أمل العمري — جامعة الملك عبدالعزيز', venue: 'قاعة د. غازي القصيبي' },
        { time: '10:00 – 10:40', title: 'كلمة رئيسية | د. فهد الحارثي — جامعة الملك فهد للبترول والمعادن', venue: 'قاعة د. غازي القصيبي' },
        { time: '11:40 – 12:20', title: 'كلمة رئيسية | د. مها الجهني — وزارة البيئة والمياه والزراعة', venue: 'قاعة د. غازي القصيبي' },
        { time: '12:20 – 13:20', title: 'كلمة رئيسية | د. نهى الحبشي — جامعة طيبة', venue: 'قاعة د. غازي القصيبي' },
        { time: '13:20 – 14:00', title: 'استراحة التواصل وجولة المعرض المصاحب', venue: 'قاعة المعرض' },
        { time: '14:00 – 14:30', title: 'كلمة رئيسية | د. يوسف الغزي — جامعة الملك عبدالله (كاوست)', venue: 'قاعة د. غازي القصيبي' }
      ]
    },
    speakers: {
      eyebrow: 'المتحدثون',
      title: 'المتحدثون الرئيسيون',
      list: [
        { letter: 'ث', name: 'م. ثامر الشرهان', role: 'رئيس مجلس إدارة أكاديمية الطاقة والمياه' },
        { letter: 'ف', name: 'د. فهد الحارثي', role: 'جامعة الملك فهد للبترول والمعادن' },
        { letter: 'م', name: 'د. مها الجهني', role: 'وزارة البيئة والمياه والزراعة' },
        { letter: 'ن', name: 'د. نهى الحبشي', role: 'جامعة طيبة' },
        { letter: 'ي', name: 'د. يوسف الغزي', role: 'جامعة الملك عبدالله (كاوست)' },
        { letter: 'أ', name: 'د. أمل العمري', role: 'جامعة الملك عبدالعزيز' }
      ]
    },
    whyPartner: {
      eyebrow: 'المعرض والمشاركة',
      title: 'مزايا المشاركة في المؤتمر',
      reasons: [
        'التواصل المباشر مع قيادات وصنّاع القرار في قطاعي الطاقة والمياه بالمملكة',
        'الظهور أمام نخبة من الخبراء والأكاديميين والمهندسين والمستثمرين',
        'استكشاف فرص الشراكات الاستراتيجية مع الأكاديمية والشركات الراعية',
        'حضور إعلامي وتسويقي نوعي ضمن المؤتمر العلمي الأول للأكاديمية',
        'المساهمة في تحقيق مستهدفات رؤية 2030 للاستدامة والطاقة النظيفة'
      ]
    },
    audience: {
      eyebrow: 'المشاركون',
      title: 'القطاعات والجهات المشاركة',
      list: [
        {
          title: 'الجهات الحكومية والمؤسسات الوطنية',
          desc: 'وزارة الطاقة • وزارة البيئة والمياه والزراعة • شركة المياه الوطنية • المؤسسة العامة لتحلية المياه المالحة • وزارة الصناعة والثروة المعدنية'
        },
        {
          title: 'شركاء التدريب والتأهيل',
          desc: 'المؤسسة العامة للتدريب التقني والمهني • صندوق تنمية الموارد البشرية • مدينة الملك عبدالله للطاقة الذرية والمتجددة'
        },
        {
          title: 'الجامعات ومراكز البحوث الرائدة',
          desc: 'جامعة الملك عبدالعزيز • جامعة الملك فهد للبترول والمعادن • جامعة طيبة • جامعة الملك عبدالله للعلوم والتقنية (كاوست) • جامعة جدة'
        },
        {
          title: 'شركات الطاقة والتقنية والصناعة',
          desc: 'أكوا باور، نيوم للهيدروجين الأخضر، إنجي، الخريف، ومجموعة من الشركات المتخصصة في الطاقة المتجددة وإدارة المياه'
        },
        {
          title: 'المهندسون والباحثون والمبتكرون',
          desc: 'الكفاءات الوطنية وطلاب الدراسات العليا والمبتكرون في تقنيات الطاقة المستدامة'
        }
      ]
    },
    exhibition: {
      eyebrow: 'المعرض والرعايات',
      title: 'المعرض المصاحب وباقات العارضين',
      desc: 'يتيح المعرض المصاحب للشركات والمؤسسات استعراض أحدث الحلول والمنتجات والابتكارات أمام حضور متميز من الخبراء وصنّاع القرار.',
      packagesTitle: 'باقات العارضين والرعاة',
      floorplan_title: 'مخطط المعرض المصاحب',
      floorplan_sub: 'اختر موقع الجناح المناسب لمشاركتكم',
      available: 'متاح',
      reserved: 'محجوز',
      selected: 'محدد',
      confirm_booth: 'حجز الجناح'
    },
    abstract: {
      eyebrow: 'الأوراق العلمية',
      title: 'تقديم الملخصات البحثية',
      sub: 'دعوة مفتوحة للأكاديميين والباحثين لتقديم ملخصاتهم في مجالات الطاقة الخضراء وأشباه الموصلات وكفاءة استهلاك المياه.',
      formTitle: 'نموذج تقديم الملخص البحثي',
      paperTitle: 'عنوان البحث *',
      paperTitlePlh: 'اكتب عنوان البحث العلمي...',
      abstractText: 'نص الملخص البحثي (بحد أقصى 300 كلمة) *',
      abstractTextPlh: 'اكتب نص الملخص هنا مع التركيز على الهدف والنتائج الرئيسية...',
      wordsCount: 'كلمة',
      authorName: 'اسم الباحث الرئيسي *',
      affiliation: 'الجهة / الجامعة *',
      email: 'البريد الإلكتروني *',
      phone: 'رقم الهاتف *',
      address: 'العنوان *',
      attachment: 'إرفاق ملف البحث (PDF أو Word)',
      submitBtn: 'إرسال الملخص البحثي',
      successTitle: 'تم استلام الملخص البحثي بنجاح',
      successDesc: 'شكراً لمشاركتكم. تم تسجيل ملخصكم برقم مرجعي معتمد، وسيتم إشعاركم بنتيجة المراجعة العلمية عبر البريد الإلكتروني.'
    },
    cta: {
      eyebrow: 'شارك معنا',
      title: 'انضم إلى EWACON 2026 كحاضر أو عارض أو باحث',
      team: 'أكاديمية الطاقة والمياه (EWA) — رابغ',
      button: 'سجل حضورك الآن'
    },
    footer: {
      aboutText: 'تنظم أكاديمية الطاقة والمياه مؤتمر EWACON 2026 كمنصة علمية وصناعية متخصصة لبناء شراكات استراتيجية بين الجامعات والصناعة والجهات الحكومية.',
      sectionsTitle: 'أقسام المؤتمر',
      participationTitle: 'المشاركة',
      locationTitle: 'الموقع والموعد',
      dateText: 'التاريخ: 22 ديسمبر 2026',
      venueText: 'الموقع: أكاديمية الطاقة والمياه — رابغ — مركز أعمال أكوا',
      rights: 'أكاديمية الطاقة والمياه | EWACON 2026 — جميع الحقوق محفوظة',
      vision: 'دعماً لرؤية المملكة 2030 في الاستدامة والطاقة النظيفة'
    }
  },

  en: {
    nav: {
      brandTag: '2026 — Energy & Water Academy',
      home: 'Home',
      about: 'About',
      objectives: 'Objectives',
      tracks: 'Tracks',
      agenda: 'Agenda',
      speakers: 'Speakers',
      exhibition: 'Exhibition & Packages',
      abstracts: 'Call for Abstracts',
      register: 'Register',
      admin: 'Admin Portal'
    },
    hero: {
      badge: 'Energy & Water Academy (EWA) · First Edition',
      title1: 'Empowering a',
      title2: 'Sustainable Future.',
      desc: 'EWACON 2026 — An annual conference organized by the Energy & Water Academy under the theme "Green Energy", bringing together leaders, researchers, and enterprises to bridge research with industry.',
      date: '22 December 2026',
      venue: 'Energy & Water Academy (EWA - Rabigh) · ACWA Business Center',
      ctaRegister: 'Register (Visitor / Exhibitor)',
      ctaAbstract: 'Submit Research Abstract',
      countdownTitle: 'Conference Countdown',
      countdownSub: '22 December 2026 — EWA Rabigh',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Mins',
      seconds: 'Secs',
      h1_title: 'Energy & Water Academy (EWA)',
      h1_desc: 'Professional training and national capability building',
      h2_title: 'Inaugural Annual Edition',
      h2_desc: 'Connecting academia, industry, and public sector',
      h3_title: 'Companion Exhibition',
      h3_desc: 'Specialized booths and sponsorship packages for industry leaders'
    },
    organizer: {
      eyebrow: 'Organizer',
      desc: 'Energy & Water Academy (EWA) is a leading institution dedicated to vocational excellence and human capital development in the energy and water sectors, organizing EWACON 2026 to foster valuable cross-sector partnerships.',
      pillar1_title: 'Training & Development',
      pillar1_desc: 'Developing competitive national expertise in energy and water',
      pillar2_title: 'Strategic Alliances',
      pillar2_desc: 'Partnering with government bodies, corporations, and universities',
      pillar3_title: 'Annual Technical Hub',
      pillar3_desc: 'A permanent platform for emerging green technologies and innovation'
    },
    about: {
      eyebrow: 'About the Conference',
      title: 'EWACON 2026',
      sub: 'Annual Conference Organized by the Energy & Water Academy — Theme: "Green Energy"',
      card1_title: 'Target Audience',
      card1_desc: 'Researchers, industry executives, government representatives, engineers, and academy trainees',
      card2_title: 'Scientific Character',
      card2_desc: 'Breakthrough research in green energy, semiconductors, and intelligent water management',
      card3_title: 'Location',
      card3_desc: 'Energy & Water Academy (EWA - Rabigh)'
    },
    objectives: {
      eyebrow: 'Objectives',
      title: 'Strategic Objectives of EWACON 2026',
      sub: 'A roadmap to align applied research with industrial implementation and Saudi Vision 2030.',
      list: [
        'Integrate clean energy and advanced water systems with artificial intelligence in smart infrastructure.',
        'Bridge academia and industry by connecting university research with commercial opportunities.',
        'Establish EWA-Rabigh as a regional conference and technical collaboration hub.',
        'Strengthen sustainable multi-sector partnerships and spotlight breakthrough innovations and patents.',
        'Foster collaboration between government, industry, and universities for energy and water security.',
        'Support Saudization, knowledge transfer, and localization in line with Vision 2030.'
      ]
    },
    tracks: {
      eyebrow: 'Technical Tracks',
      title: 'Core Conference Tracks',
      track1_badge: 'Track One',
      track1_title: 'Green Energy',
      track1_desc: 'Renewable resources, energy efficiency, and advanced storage systems',
      track2_badge: 'Track Two',
      track2_title: 'Semiconductors',
      track2_desc: 'Semiconductor technologies for smart grids and intelligent control systems'
    },
    agenda: {
      eyebrow: 'Program',
      title: 'Conference Day Agenda',
      dateBadge: '22 December 2026',
      items: [
        { time: '08:00 – 09:00', title: 'Registration, Welcome & Networking', venue: 'ACWA Business Center' },
        { time: '09:00 – 09:20', title: 'Opening Remarks | Eng. Thamer Al-Sharhan - Chairman of EWA Board', venue: 'Dr. Ghazi Al-Gosaibi Hall' },
        { time: '09:20 – 10:00', title: 'Keynote Address | Dr. Amal Al-Omari — King Abdulaziz University', venue: 'Dr. Ghazi Al-Gosaibi Hall' },
        { time: '10:00 – 10:40', title: 'Keynote Address | Dr. Fahad Al-Harthi — KFUPM', venue: 'Dr. Ghazi Al-Gosaibi Hall' },
        { time: '11:40 – 12:20', title: 'Keynote Address | Dr. Maha Al-Juhani — MEWA', venue: 'Dr. Ghazi Al-Gosaibi Hall' },
        { time: '12:20 – 13:20', title: 'Keynote Address | Dr. Noha Al-Habshi — Taibah University', venue: 'Dr. Ghazi Al-Gosaibi Hall' },
        { time: '13:20 – 14:00', title: 'Networking Break & Exhibition Tour', venue: 'Exhibition Hall' },
        { time: '14:00 – 14:30', title: 'Keynote Address | Dr. Yousef Al-Ghazi — KAUST', venue: 'Dr. Ghazi Al-Gosaibi Hall' }
      ]
    },
    speakers: {
      eyebrow: 'Speakers',
      title: 'Keynote Speakers',
      list: [
        { letter: 'T', name: 'Eng. Thamer Al-Sharhan', role: 'Chairman of the Board, Energy & Water Academy' },
        { letter: 'F', name: 'Dr. Fahad Al-Harthi', role: 'King Fahd University of Petroleum & Minerals (KFUPM)' },
        { letter: 'M', name: 'Dr. Maha Al-Juhani', role: 'Ministry of Environment, Water & Agriculture' },
        { letter: 'N', name: 'Dr. Noha Al-Habshi', role: 'Taibah University' },
        { letter: 'Y', name: 'Dr. Yousef Al-Ghazi', role: 'King Abdullah University of Science and Technology (KAUST)' },
        { letter: 'A', name: 'Dr. Amal Al-Omari', role: 'King Abdulaziz University' }
      ]
    },
    whyPartner: {
      eyebrow: 'Participation',
      title: 'Why Participate in EWACON 2026?',
      reasons: [
        'Direct engagement with key decision-makers in the Saudi energy and water ecosystem.',
        'High visibility among top-tier researchers, corporate leaders, and engineers.',
        'Opportunities for long-term strategic partnerships with the Academy and industry pioneers.',
        'Extensive marketing and media presence across the conference platform.',
        'Active contribution to Saudi Vision 2030 green energy and sustainability goals.'
      ]
    },
    audience: {
      eyebrow: 'Participants',
      title: 'Participating Organizations & Stakeholders',
      list: [
        {
          title: 'Government Entities & Regulators',
          desc: 'Ministry of Energy • Ministry of Environment, Water & Agriculture • National Water Company • SWCC • Ministry of Industry & Mineral Resources'
        },
        {
          title: 'Training & Development Partners',
          desc: 'Technical & Vocational Training Corporation (TVTC) • Human Resources Development Fund (HADAF) • KACARE'
        },
        {
          title: 'Leading Universities & Research Centers',
          desc: 'King Abdulaziz University • KFUPM • Taibah University • KAUST • University of Jeddah'
        },
        {
          title: 'Energy, Water & Technology Leaders',
          desc: 'ACWA Power, NEOM Green Hydrogen Company, ENGIE, Alkhorayef, and specialized technology providers'
        },
        {
          title: 'Engineers, Researchers & Innovators',
          desc: 'Specialized national talent, postgraduate scholars, and innovators in sustainability'
        }
      ]
    },
    exhibition: {
      eyebrow: 'Exhibition & Sponsorship',
      title: 'Companion Exhibition & Packages',
      desc: 'The companion exhibition offers participating organizations dedicated booths to showcase their solutions and initiatives to a targeted audience.',
      packagesTitle: 'Exhibitor Packages',
      floorplan_title: 'Exhibition Layout',
      floorplan_sub: 'Select an available booth location for your organization',
      available: 'Available',
      reserved: 'Reserved',
      selected: 'Selected',
      confirm_booth: 'Reserve Booth'
    },
    abstract: {
      eyebrow: 'Research Papers',
      title: 'Call for Research Abstracts',
      sub: 'An open invitation for researchers and academics to submit papers in Green Energy, Semiconductors, and Water Technology.',
      formTitle: 'Abstract Submission Form',
      paperTitle: 'Abstract / Paper Title *',
      paperTitlePlh: 'Enter research paper title...',
      abstractText: 'Abstract Text (Maximum 300 words) *',
      abstractTextPlh: 'Summarize your methodology, findings, and contribution up to 300 words...',
      wordsCount: 'words',
      authorName: 'Principal Author *',
      affiliation: 'University / Institution *',
      email: 'Email Address *',
      phone: 'Phone Number *',
      address: 'Address / Campus *',
      attachment: 'Upload Paper Document (PDF or Word)',
      submitBtn: 'Submit Abstract',
      successTitle: 'Abstract Submitted Successfully',
      successDesc: 'Thank you for your submission. Your abstract has been registered under an official reference code and will be reviewed by the scientific committee.'
    },
    cta: {
      eyebrow: 'Get Involved',
      title: 'Join EWACON 2026 as a Visitor, Exhibitor, or Researcher',
      team: 'Energy & Water Academy (EWA) — Rabigh',
      button: 'Register Now'
    },
    footer: {
      aboutText: 'Energy & Water Academy (EWA) organizes EWACON 2026 to foster high-value partnerships connecting academia, industry, and government.',
      sectionsTitle: 'Conference Sections',
      participationTitle: 'Participation',
      locationTitle: 'Date & Location',
      dateText: 'Date: 22 December 2026',
      venueText: 'Venue: Energy & Water Academy — Rabigh — ACWA Business Center',
      rights: 'Energy & Water Academy | EWACON 2026 — All rights reserved',
      vision: 'In support of Saudi Vision 2030 in sustainability and green energy'
    }
  }
};

const DEFAULT_PACKAGES = [
  {
    id: 'platinum-pkg',
    name: 'Platinum Exhibitor Package',
    price: 300000,
    currency: 'SAR',
    desc: 'Prime pavilion presence with maximum brand coverage across print and digital platforms',
    benefits: [
      'Prominent logo on attendee badges',
      'Prime exhibition booth in main hall',
      'Interactive digital screen & branded directional flags',
      'Logo on scientific poster template',
      'Logo on venue directional signage',
      'Featured placement on official website',
      'Coverage across conference media campaigns'
    ]
  },
  {
    id: 'gold-pkg',
    name: 'Gold Exhibitor Package',
    price: 100000,
    currency: 'SAR',
    desc: 'High-visibility presence across core exhibition areas and digital collateral',
    benefits: [
      'Logo on attendee badges',
      'Dedicated exhibition booth',
      'Interactive digital screen',
      'Logo on scientific poster template',
      'Logo on venue directional signage',
      'Logo on official website',
      'Social media recognition'
    ]
  },
  {
    id: 'silver-pkg',
    name: 'Silver Exhibitor Package',
    price: 50000,
    currency: 'SAR',
    desc: 'Direct presence within the companion exhibition',
    benefits: [
      'Logo on attendee badges',
      'Exhibition booth space',
      'Directional flags',
      'Logo on scientific poster template',
      'Logo on venue directional signage',
      'Logo on official website'
    ]
  }
];

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('show');
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCountdown() {
  const targetDate = useMemo(() => new Date('2026-12-22T08:00:00+03:00').getTime(), []);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

// Global Status Badge Component
function StatusBadge({ status }) {
  const s = (status || 'pending').toLowerCase();
  if (s === 'confirmed' || s === 'approved') {
    return <span className="status-badge confirmed">{s === 'approved' ? 'Approved' : 'Confirmed'}</span>;
  }
  if (s === 'pending_payment') {
    return <span className="status-badge pending_payment">Pending Payment</span>;
  }
  if (s === 'pending_review' || s === 'pending') {
    return <span className="status-badge pending_review">Pending Review</span>;
  }
  if (s === 'cancelled' || s === 'rejected') {
    return <span className="status-badge cancelled">{s === 'rejected' ? 'Rejected' : 'Cancelled'}</span>;
  }
  return <span className="status-badge pending_review">{status}</span>;
}

// Navigation Bar
function Nav() {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="nav">
      <div className="navin">
        <Link className="brand" to="/">
          <div className="brand-emblem">
            <Zap size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">
              EWA <b>EWACON</b>
            </span>
            <span className="brand-tag">{t.nav.brandTag}</span>
          </div>
        </Link>

        <div className="nav-center">
          <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
            {t.nav.home}
          </Link>
          <a className="nav-link" href="/#about">
            {t.nav.about}
          </a>
          <a className="nav-link" href="/#objectives">
            {t.nav.objectives}
          </a>
          <a className="nav-link" href="/#tracks">
            {t.nav.tracks}
          </a>
          <a className="nav-link" href="/#agenda">
            {t.nav.agenda}
          </a>
          <a className="nav-link" href="/#speakers">
            {t.nav.speakers}
          </a>
          <Link className={`nav-link ${location.pathname === '/exhibition' ? 'active' : ''}`} to="/exhibition">
            {t.nav.exhibition}
          </Link>
          <Link className={`nav-link ${location.pathname === '/abstracts' ? 'active' : ''}`} to="/abstracts">
            {t.nav.abstracts}
          </Link>
        </div>

        <div className="nav-actions">
          <button
            className="lang-btn"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            title="Switch language"
          >
            <Globe size={15} />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <Link className="btn small" to="/register">
            {t.nav.register}
            {lang === 'ar' ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
          </Link>

          <Link to="/admin" className="admin-link" title={t.nav.admin}>
            <LogIn size={15} />
            <span>{t.nav.admin}</span>
          </Link>

          <button className="menub" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mobile-menu-drawer">
          <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>
            {t.nav.home}
          </Link>
          <a className="nav-link" href="/#about" onClick={() => setIsOpen(false)}>
            {t.nav.about}
          </a>
          <a className="nav-link" href="/#objectives" onClick={() => setIsOpen(false)}>
            {t.nav.objectives}
          </a>
          <a className="nav-link" href="/#tracks" onClick={() => setIsOpen(false)}>
            {t.nav.tracks}
          </a>
          <a className="nav-link" href="/#agenda" onClick={() => setIsOpen(false)}>
            {t.nav.agenda}
          </a>
          <a className="nav-link" href="/#speakers" onClick={() => setIsOpen(false)}>
            {t.nav.speakers}
          </a>
          <Link className="nav-link" to="/exhibition" onClick={() => setIsOpen(false)}>
            {t.nav.exhibition}
          </Link>
          <Link className="nav-link" to="/abstracts" onClick={() => setIsOpen(false)}>
            {t.nav.abstracts}
          </Link>
          <button
            className="lang-btn"
            style={{ width: 'fit-content' }}
            onClick={() => {
              setLang(lang === 'ar' ? 'en' : 'ar');
              setIsOpen(false);
            }}
          >
            <Globe size={15} /> {lang === 'ar' ? 'English' : 'العربية'}
          </button>
          <Link className="btn small" to="/register" onClick={() => setIsOpen(false)}>
            {t.nav.register}
          </Link>
          <Link className="admin-link" to="/admin" onClick={() => setIsOpen(false)}>
            <LogIn size={15} /> {t.nav.admin}
          </Link>
        </div>
      )}
    </nav>
  );
}

// Footer
function Footer() {
  const { t } = useContext(LanguageContext);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand">
              <div className="brand-emblem">
                <Zap size={22} />
              </div>
              <div className="brand-text">
                <span className="brand-title">
                  EWA <b>EWACON</b>
                </span>
                <span className="brand-tag">{t.nav.brandTag}</span>
              </div>
            </div>
            <p>{t.footer.aboutText}</p>
          </div>

          <div className="footer-col">
            <h5>{t.footer.sectionsTitle}</h5>
            <ul className="footer-links">
              <li><a href="/#about">{t.nav.about}</a></li>
              <li><a href="/#objectives">{t.nav.objectives}</a></li>
              <li><a href="/#tracks">{t.nav.tracks}</a></li>
              <li><a href="/#agenda">{t.nav.agenda}</a></li>
              <li><a href="/#speakers">{t.nav.speakers}</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>{t.footer.participationTitle}</h5>
            <ul className="footer-links">
              <li><Link to="/register">{t.nav.register}</Link></li>
              <li><Link to="/exhibition">{t.exhibition.title}</Link></li>
              <li><Link to="/abstracts">{t.abstract.title}</Link></li>
              <li><Link to="/admin">{t.nav.admin}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>{t.footer.locationTitle}</h5>
            <p style={{ color: '#D3E0E4', fontSize: '0.9rem', lineHeight: '1.8' }}>
              <strong>{t.footer.dateText}</strong><br />
              {t.footer.venueText}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t.footer.rights}</span>
          <span>{t.footer.vision}</span>
        </div>
      </div>
    </footer>
  );
}

// Homepage
function Home() {
  useReveal();
  const { lang, t } = useContext(LanguageContext);
  const countdown = useCountdown();
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);

  useEffect(() => {
    fetch(`${API_BASE}/public/packages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPackages(data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-grid" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />

          <div className="container heroIn">
            <div className="hero-content">
              <div className="hero-main reveal">
                <div className="hero-badge">
                  <div className="hero-badge-pulse" />
                  <span>{t.hero.badge}</span>
                </div>

                <h1>
                  {t.hero.title1}<br />
                  <span className="gradient-text">{t.hero.title2}</span>
                </h1>

                <p className="hero-desc">{t.hero.desc}</p>

                <div className="hero-meta-tags">
                  <div className="meta-pill">
                    <CalendarDays size={16} />
                    <span>{t.hero.date}</span>
                  </div>
                  <div className="meta-pill">
                    <MapPin size={16} />
                    <span>{t.hero.venue}</span>
                  </div>
                </div>

                <div className="hero-actions">
                  <Link className="btn" to="/register">
                    {t.hero.ctaRegister}
                    {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </Link>
                  <Link className="ghost" to="/abstracts">
                    <FileText size={18} />
                    {t.hero.ctaAbstract}
                  </Link>
                </div>
              </div>

              {/* Countdown & Highlights */}
              <div className="hero-card reveal">
                <div className="countdown-header">
                  <h4>{t.hero.countdownTitle}</h4>
                  <p>{t.hero.countdownSub}</p>
                </div>

                <div className="countdown-grid">
                  <div className="countdown-box">
                    <div className="countdown-num">{countdown.days}</div>
                    <div className="countdown-lbl">{t.hero.days}</div>
                  </div>
                  <div className="countdown-box">
                    <div className="countdown-num">{String(countdown.hours).padStart(2, '0')}</div>
                    <div className="countdown-lbl">{t.hero.hours}</div>
                  </div>
                  <div className="countdown-box">
                    <div className="countdown-num">{String(countdown.minutes).padStart(2, '0')}</div>
                    <div className="countdown-lbl">{t.hero.minutes}</div>
                  </div>
                  <div className="countdown-box">
                    <div className="countdown-num">{String(countdown.seconds).padStart(2, '0')}</div>
                    <div className="countdown-lbl">{t.hero.seconds}</div>
                  </div>
                </div>

                <div className="hero-highlights">
                  <div className="highlight-row">
                    <div className="highlight-icon">
                      <Zap size={16} />
                    </div>
                    <div>
                      <strong>{t.hero.h1_title}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#B3CCD4' }}>{t.hero.h1_desc}</div>
                    </div>
                  </div>

                  <div className="highlight-row">
                    <div className="highlight-icon">
                      <Users size={16} />
                    </div>
                    <div>
                      <strong>{t.hero.h2_title}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#B3CCD4' }}>{t.hero.h2_desc}</div>
                    </div>
                  </div>

                  <div className="highlight-row">
                    <div className="highlight-icon">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <strong>{t.hero.h3_title}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#B3CCD4' }}>{t.hero.h3_desc}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ORGANIZER OVERVIEW */}
        <section className="organizer-section" id="about">
          <div className="container">
            <div className="organizer-box reveal">
              <div className="eyebrow eyebrow-pill">{t.organizer.eyebrow}</div>
              <p className="organizer-text">{t.organizer.desc}</p>
            </div>

            <div className="pillars-3-grid">
              <div className="pillar-3-card reveal">
                <b>{t.organizer.pillar1_title}</b>
                <span>{t.organizer.pillar1_desc}</span>
              </div>
              <div className="pillar-3-card reveal">
                <b>{t.organizer.pillar2_title}</b>
                <span>{t.organizer.pillar2_desc}</span>
              </div>
              <div className="pillar-3-card reveal">
                <b>{t.organizer.pillar3_title}</b>
                <span>{t.organizer.pillar3_desc}</span>
              </div>
            </div>
          </div>
        </section>

        {/* CONFERENCE OVERVIEW */}
        <section className="section">
          <div className="container">
            <div className="section-head center reveal">
              <div className="eyebrow eyebrow-pill">{t.about.eyebrow}</div>
              <h2 className="section-title">{t.about.title}</h2>
              <p className="section-desc">{t.about.sub}</p>
            </div>

            <div className="info-3-grid">
              <div className="info-3-card reveal">
                <div className="info-num-badge">1</div>
                <h4>{t.about.card1_title}</h4>
                <p>{t.about.card1_desc}</p>
              </div>

              <div className="info-3-card reveal">
                <div className="info-num-badge">2</div>
                <h4>{t.about.card2_title}</h4>
                <p>{t.about.card2_desc}</p>
              </div>

              <div className="info-3-card reveal">
                <div className="info-num-badge">3</div>
                <h4>{t.about.card3_title}</h4>
                <p>{t.about.card3_desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* OBJECTIVES */}
        <section className="section section-subtle" id="objectives">
          <div className="container">
            <div className="section-head center reveal">
              <div className="eyebrow eyebrow-pill">{t.objectives.eyebrow}</div>
              <h2 className="section-title">{t.objectives.title}</h2>
              <p className="section-desc">{t.objectives.sub}</p>
            </div>

            <div className="objectives-grid">
              {t.objectives.list.map((obj, i) => (
                <div className="objective-item reveal" key={i}>
                  <div className="obj-num">{i + 1}</div>
                  <p>{obj}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRACKS */}
        <section className="section" id="tracks">
          <div className="container">
            <div className="section-head center reveal">
              <div className="eyebrow eyebrow-pill">{t.tracks.eyebrow}</div>
              <h2 className="section-title">{t.tracks.title}</h2>
            </div>

            <div className="tracks-grid">
              <div className="track-card green reveal">
                <div className="track-card-head">
                  <div className="track-icon">
                    <Leaf size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: 800 }}>
                      {t.tracks.track1_badge}
                    </span>
                    <h3>{t.tracks.track1_title}</h3>
                  </div>
                </div>
                <p>{t.tracks.track1_desc}</p>
              </div>

              <div className="track-card teal reveal">
                <div className="track-card-head">
                  <div className="track-icon">
                    <Cpu size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: 800 }}>
                      {t.tracks.track2_badge}
                    </span>
                    <h3>{t.tracks.track2_title}</h3>
                  </div>
                </div>
                <p>{t.tracks.track2_desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* AGENDA */}
        <section className="section section-subtle" id="agenda">
          <div className="container">
            <div className="agenda-wrapper reveal">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div className="eyebrow">{t.agenda.eyebrow}</div>
                  <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>{t.agenda.title}</h2>
                </div>
                <div style={{ background: 'var(--bg-muted)', padding: '8px 18px', borderRadius: 'var(--radius-full)', fontWeight: 800, color: 'var(--teal)', fontSize: '0.9rem' }}>
                  <CalendarDays size={16} style={{ display: 'inline', marginInlineEnd: '6px' }} />
                  {t.agenda.dateBadge}
                </div>
              </div>

              <div>
                {t.agenda.items.map((item, idx) => (
                  <div className="agenda-row" key={idx}>
                    <div className="agenda-row-time">
                      <Clock size={16} />
                      <span>{item.time}</span>
                    </div>
                    <div className="agenda-row-details">
                      <strong>{item.title}</strong>
                    </div>
                    <div className="agenda-row-venue">
                      <MapPin size={14} />
                      <span>{item.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SPEAKERS */}
        <section className="section" id="speakers">
          <div className="container">
            <div className="section-head center reveal">
              <div className="eyebrow eyebrow-pill">{t.speakers.eyebrow}</div>
              <h2 className="section-title">{t.speakers.title}</h2>
            </div>

            <div className="speakers-grid">
              {t.speakers.list.map((s, idx) => (
                <div className="speaker-card reveal" key={idx}>
                  <div className="speaker-avatar-letter">{s.letter}</div>
                  <h4>{s.name}</h4>
                  <p>{s.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY PARTICIPATE */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-head center reveal">
              <div className="eyebrow eyebrow-light">{t.whyPartner.eyebrow}</div>
              <h2 className="section-title">{t.whyPartner.title}</h2>
            </div>

            <div className="reasons-list">
              {t.whyPartner.reasons.map((r, i) => (
                <div className="reason-item reveal" key={i}>
                  <div className="reason-num">0{i + 1}</div>
                  <div className="reason-text">{r}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TARGET AUDIENCE */}
        <section className="section section-subtle">
          <div className="container">
            <div className="section-head center reveal">
              <div className="eyebrow eyebrow-pill">{t.audience.eyebrow}</div>
              <h2 className="section-title">{t.audience.title}</h2>
            </div>

            <div className="audience-grid">
              {t.audience.list.map((aud, idx) => (
                <div className="audience-card reveal" key={idx}>
                  <div className="aud-num">{idx + 1}</div>
                  <div className="aud-content">
                    <h4>{aud.title}</h4>
                    <p>{aud.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXHIBITION & PACKAGES */}
        <section className="section section-dark" id="exhibition">
          <div className="container">
            <div className="section-head center reveal">
              <div className="eyebrow eyebrow-light">{t.exhibition.eyebrow}</div>
              <h2 className="section-title">{t.exhibition.packagesTitle}</h2>
              <p className="section-desc">{t.exhibition.desc}</p>
            </div>

            <div className="packages-grid">
              {packages.map((pkg) => (
                <div className={`package-card reveal ${pkg.name.toLowerCase().includes('platinum') ? 'platinum' : ''}`} key={pkg.id}>
                  <div className="package-tier-title">{pkg.name}</div>
                  <div className="package-price-val">
                    {Number(pkg.price).toLocaleString()} <small>SAR</small>
                  </div>
                  <div className="package-sub">{pkg.description || pkg.desc}</div>

                  <ul className="package-perks">
                    {(pkg.benefits || []).map((perk, i) => (
                      <li key={i}>
                        <CheckCircle2 size={16} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={`/register?type=exhibitor&pkg=${pkg.id}`} className="btn">
                    {lang === 'ar' ? 'حجز باقة العارض' : 'Book Exhibitor Package'}
                    {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </Link>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '36px' }} className="reveal">
              <Link to="/exhibition" className="ghost">
                {t.exhibition.floorplan_title} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="section section-subtle">
          <div className="container">
            <div className="overview-banner reveal" style={{ padding: '44px 30px' }}>
              <div className="eyebrow eyebrow-light">{t.cta.eyebrow}</div>
              <h2 style={{ fontSize: '2.1rem', color: '#fff', marginBottom: '12px' }}>
                {t.cta.title}
              </h2>
              <p style={{ fontSize: '1.08rem', color: 'var(--blue)', marginBottom: '24px', fontWeight: 600 }}>
                {t.cta.team}
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn">
                  {t.cta.button}
                  {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </Link>
                <Link to="/abstracts" className="ghost">
                  <FileText size={16} />
                  {t.abstract.title}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Exhibition & Packages Page
function ExhibitionPage() {
  useReveal();
  const { lang, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [booths, setBooths] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/public/packages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPackages(data);
      })
      .catch(() => {});

    fetch(`${API_BASE}/public/booths`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setBooths(data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Nav />
      <div className="section section-dark" style={{ paddingTop: '140px', paddingBottom: '70px' }}>
        <div className="container">
          <div className="eyebrow eyebrow-light">{t.exhibition.eyebrow}</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{t.exhibition.title}</h1>
          <p style={{ maxWidth: '800px', color: '#BCD0D6', fontSize: '1.05rem' }}>{t.exhibition.desc}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="eyebrow eyebrow-pill">{t.exhibition.packagesTitle}</div>
            <h2 className="section-title">{t.exhibition.packagesTitle}</h2>
          </div>

          <div className="packages-grid reveal" style={{ marginBottom: '60px' }}>
            {packages.map((pkg) => (
              <div className={`package-card ${pkg.name.toLowerCase().includes('platinum') ? 'platinum' : ''}`} key={pkg.id}>
                <div className="package-tier-title">{pkg.name}</div>
                <div className="package-price-val">
                  {Number(pkg.price).toLocaleString()} <small>SAR</small>
                </div>
                <div className="package-sub">{pkg.description || pkg.desc}</div>

                <ul className="package-perks">
                  {(pkg.benefits || []).map((perk, i) => (
                    <li key={i}>
                      <CheckCircle2 size={16} />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <Link to={`/register?type=exhibitor&pkg=${pkg.id}`} className="btn">
                  {lang === 'ar' ? 'حجز باقة العارض' : 'Book Exhibitor Package'}
                  {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </Link>
              </div>
            ))}
          </div>

          {/* Interactive Floorplan */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', padding: '36px', boxShadow: 'var(--shadow-sm)' }} className="reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div className="eyebrow">{t.exhibition.floorplan_title}</div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>{t.exhibition.floorplan_sub}</h3>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.84rem', fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'var(--white)', border: '2px solid var(--teal)', borderRadius: '3px' }} />
                  {t.exhibition.available}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: '#E2ECEF', border: '2px solid var(--line)', borderRadius: '3px' }} />
                  {t.exhibition.reserved}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'var(--teal)', border: '2px solid var(--teal)', borderRadius: '3px' }} />
                  {t.exhibition.selected}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', padding: '24px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)' }}>
              {(booths.length > 0 ? booths : Array.from({ length: 18 }, (_, i) => ({ id: `b-${i+1}`, booth_no: `B-${String(i+1).padStart(2, '0')}`, width_m: i < 2 ? 6 : 3, depth_m: 3, status: 'available' }))).map((b) => {
                const isSelected = selectedBooth?.id === b.id;
                const isReserved = b.status === 'reserved' || b.status === 'occupied';
                return (
                  <div
                    key={b.id}
                    onClick={() => !isReserved && setSelectedBooth(b)}
                    style={{
                      background: isSelected ? 'var(--teal)' : isReserved ? '#E8EFF2' : 'var(--white)',
                      color: isSelected ? 'var(--white)' : 'var(--primary)',
                      border: isSelected ? '2px solid var(--teal)' : '2px solid #C4D6DC',
                      borderRadius: 'var(--radius-md)',
                      minHeight: '85px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isReserved ? 'not-allowed' : 'pointer',
                      padding: '8px',
                      opacity: isReserved ? 0.6 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <strong style={{ fontSize: '1.05rem' }}>{b.booth_no}</strong>
                    <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>{b.width_m}m × {b.depth_m}m</span>
                    <small style={{ fontSize: '0.65rem', marginTop: '4px', fontWeight: 700 }}>
                      {isReserved ? (b.organization ? b.organization : t.exhibition.reserved) : isSelected ? t.exhibition.selected : t.exhibition.available}
                    </small>
                  </div>
                );
              })}
            </div>

            {selectedBooth && (
              <div style={{ marginTop: '24px', padding: '18px 24px', background: 'rgba(18, 106, 107, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--teal-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>
                    {lang === 'ar' ? 'تم تحديد جناح' : 'Selected Booth'} {selectedBooth.booth_no} ({selectedBooth.width_m}m × {selectedBooth.depth_m}m)
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {lang === 'ar' ? 'جاهز للتأكيد ضمن بيانات التسجيل.' : 'Ready to confirm with your exhibitor registration.'}
                  </p>
                </div>

                <button
                  className="btn"
                  onClick={() => navigate(`/register?type=exhibitor&booth=${selectedBooth.booth_no}`)}
                >
                  {t.exhibition.confirm_booth}
                  {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// Abstract Submission Page
function AbstractPage() {
  useReveal();
  const { lang, t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    abstractTitle: '',
    abstractText: '',
    authorName: '',
    affiliation: '',
    email: '',
    phone: '',
    address: '',
    attachmentName: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const wordCount = useMemo(() => {
    return formData.abstractText.trim() ? formData.abstractText.trim().split(/\s+/).length : 0;
  }, [formData.abstractText]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, attachmentName: file.name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (wordCount > 300) {
      alert(lang === 'ar' ? 'الحد الأقصى للملخص هو 300 كلمة.' : 'Abstract maximum length is 300 words.');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationType: 'abstract',
          fullName: formData.authorName,
          email: formData.email,
          phone: formData.phone,
          organization: formData.affiliation,
          ...formData
        })
      });
      const data = await res.json();
      setResult({
        refNo: data.registration?.registration_no || 'EWA-ABS-' + Math.floor(100000 + Math.random() * 900000),
        ...formData
      });
    } catch {
      setResult({
        refNo: 'EWA-ABS-' + Math.floor(100000 + Math.random() * 900000),
        ...formData
      });
    }
    setLoading(false);
  };

  if (result) {
    return (
      <>
        <Nav />
        <div style={{ minHeight: '85vh', padding: '140px 24px 80px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-subtle)' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', maxWidth: '580px', width: '100%', padding: '40px', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(18, 106, 107, 0.1)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={36} />
            </div>
            <div className="eyebrow eyebrow-pill">{t.abstract.eyebrow}</div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '8px' }}>
              {t.abstract.successTitle}
            </h2>
            <div style={{ background: 'var(--bg-muted)', padding: '12px 20px', borderRadius: 'var(--radius-md)', margin: '20px 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--teal)' }}>
              {result.refNo}
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: '1.8' }}>
              {t.abstract.successDesc}
            </p>

            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: lang === 'ar' ? 'right' : 'left', marginBottom: '24px', fontSize: '0.9rem' }}>
              <div><strong>{t.abstract.paperTitle}:</strong> {result.abstractTitle}</div>
              <div style={{ marginTop: '6px' }}><strong>{t.abstract.authorName}:</strong> {result.authorName}</div>
              <div style={{ marginTop: '6px' }}><strong>{t.abstract.affiliation}:</strong> {result.affiliation}</div>
              {result.attachmentName && <div style={{ marginTop: '6px' }}><strong>{t.abstract.attachment}:</strong> {result.attachmentName}</div>}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn small" onClick={() => window.print()}>
                <Printer size={15} /> {lang === 'ar' ? 'طباعة الإشعار' : 'Print Confirmation'}
              </button>
              <Link className="ghost darktext small" to="/">
                {lang === 'ar' ? 'الرئيسية' : 'Home'}
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="section section-dark" style={{ paddingTop: '140px', paddingBottom: '70px' }}>
        <div className="container">
          <div className="eyebrow eyebrow-light">{t.abstract.eyebrow}</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{t.abstract.title}</h1>
          <p style={{ maxWidth: '800px', color: '#BCD0D6', fontSize: '1.05rem' }}>{t.abstract.sub}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', padding: '40px', boxShadow: 'var(--shadow-md)' }}>
            <div className="eyebrow eyebrow-pill">{t.abstract.eyebrow}</div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '24px' }}>
              {t.abstract.formTitle}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  {t.abstract.paperTitle}
                </label>
                <input
                  required
                  name="abstractTitle"
                  placeholder={t.abstract.paperTitlePlh}
                  value={formData.abstractTitle}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    {t.abstract.abstractText}
                  </label>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: wordCount > 300 ? '#e53e3e' : 'var(--teal)' }}>
                    {wordCount} / 300 {t.abstract.wordsCount}
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  name="abstractText"
                  placeholder={t.abstract.abstractTextPlh}
                  value={formData.abstractText}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A', lineHeight: '1.6' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                    {t.abstract.authorName}
                  </label>
                  <input
                    required
                    name="authorName"
                    placeholder="e.g. Dr. Yousef Al-Ghazi"
                    value={formData.authorName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                    {t.abstract.affiliation}
                  </label>
                  <input
                    required
                    name="affiliation"
                    placeholder="e.g. KAUST / KFUPM / King Abdulaziz University"
                    value={formData.affiliation}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                    {t.abstract.email}
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="author@university.edu.sa"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                    {t.abstract.phone}
                  </label>
                  <input
                    required
                    name="phone"
                    placeholder="+966 50 000 0000"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  {t.abstract.address}
                </label>
                <input
                  required
                  name="address"
                  placeholder="City, Campus / Department, Country"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  {t.abstract.attachment}
                </label>
                <div style={{ border: '2px dashed var(--line)', borderRadius: '8px', padding: '20px', textAlign: 'center', background: 'var(--bg-subtle)' }}>
                  <UploadCloud size={30} style={{ color: 'var(--teal)', marginBottom: '8px' }} />
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {formData.attachmentName || (lang === 'ar' ? 'اختر ملف البحث المكتمل لإرفاقه' : 'Upload full paper or research document')}
                  </p>
                  <input
                    type="file"
                    onChange={handleFile}
                    style={{ marginTop: '10px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                {loading ? (lang === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...') : t.abstract.submitBtn}
                {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// 2-Type Registration (Visitor / Exhibitor) with Email Verification Code flow
function Register() {
  useReveal();
  const { lang, t } = useContext(LanguageContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') === 'exhibitor' ? 'exhibitor' : 'visitor';
  const initialBooth = queryParams.get('booth') || '';

  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(false);

  // Email verification state
  const [emailVerified, setEmailVerified] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationMsg, setVerificationMsg] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devCode, setDevCode] = useState('');

  const [data, setData] = useState({
    registrationType: initialType,
    fullName: '',
    email: '',
    organization: '',
    jobTitle: '',
    phone: '',
    country: lang === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia',
    packageId: '',
    boothId: initialBooth,
    notes: ''
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/public/packages`)
      .then((res) => res.json())
      .then((pkgs) => {
        if (Array.isArray(pkgs) && pkgs.length > 0) {
          setPackages(pkgs);
          if (!data.packageId) setData((prev) => ({ ...prev, packageId: pkgs[0].id }));
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/public/booths`)
      .then((res) => res.json())
      .then((b) => {
        if (Array.isArray(b) && b.length > 0) setBooths(b);
      })
      .catch(() => {});
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const upd = (e) => setData({ ...data, [e.target.name]: e.target.value });

  // Send email verification code
  const handleSendVerificationCode = async () => {
    if (!data.email) {
      alert(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني أولاً' : 'Please enter your email address first.');
      return;
    }
    setVerificationError('');
    setVerificationMsg('');
    try {
      const res = await fetch(`${API_BASE}/auth/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });
      const resJson = await res.json();
      if (!res.ok) {
        setVerificationError(resJson.error || 'Failed to send verification code.');
        return;
      }
      setVerificationMsg(resJson.message || 'Verification code sent to your email.');
      setDevCode(resJson.devCode || '');
      setResendCooldown(45);
      setShowVerifyModal(true);
    } catch {
      setVerificationError('Unable to send code. Please verify server connection.');
    }

  };

  // Verify entered code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setVerificationError('');
    try {
      const res = await fetch(`${API_BASE}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, code: verificationCode })
      });
      const resJson = await res.json();
      if (!res.ok) {
        setVerificationError(resJson.error || 'Invalid code.');
        return;
      }
      setEmailVerified(true);
      setShowVerifyModal(false);
      setVerificationMsg('Email verified successfully!');
    } catch {
      setVerificationError('Verification failed. Please try again.');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, email_verified: emailVerified })
      });
      const resData = await res.json();
      setResult({
        registration: resData.registration || {
          ...data,
          registration_no: (data.registrationType === 'exhibitor' ? 'EWA-EXH-' : 'EWA-VIS-') + Math.floor(100000 + Math.random() * 900000)
        },
        qr: resData.qr || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          JSON.stringify({ name: data.fullName, org: data.organization, type: data.registrationType })
        )}`
      });
    } catch {
      const mockId = (data.registrationType === 'exhibitor' ? 'EWA-EXH-' : 'EWA-VIS-') + Math.floor(100000 + Math.random() * 900000);
      setResult({
        registration: {
          ...data,
          registration_no: mockId
        },
        qr: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          JSON.stringify({ reg: mockId, name: data.fullName, org: data.organization, type: data.registrationType })
        )}`
      });
    }
    setLoading(false);
  };

  if (result) {
    return (
      <>
        <Nav />
        <div style={{ minHeight: '85vh', padding: '130px 24px 80px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-subtle)' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', maxWidth: '480px', width: '100%', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--green))', color: '#fff', padding: '24px' }}>
              <div className="eyebrow eyebrow-light" style={{ marginBottom: '4px' }}>
                {lang === 'ar' ? 'بطاقة مؤتمر EWACON 2026 الرسمية' : 'EWACON 2026 Official Conference Pass'}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--blue)' }}>
                {result.registration.registration_no}
              </div>
              <small style={{ color: '#BCD0D6' }}>{t.footer.venueText}</small>
            </div>

            <div style={{ padding: '30px 24px' }}>
              <img src={result.qr} alt="QR Code" style={{ width: '180px', height: '180px', borderRadius: '8px', border: '1px solid var(--line)', padding: '8px', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '4px' }}>
                {result.registration.fullName || result.registration.full_name}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                {result.registration.organization} {result.registration.jobTitle && `· ${result.registration.jobTitle}`}
              </p>

              <div style={{ display: 'inline-block', background: 'rgba(18, 106, 107, 0.1)', color: 'var(--teal)', padding: '5px 16px', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '20px' }}>
                {(result.registration.registrationType || result.registration.registration_type) === 'exhibitor' ? (lang === 'ar' ? 'عارض' : 'Exhibitor') : (lang === 'ar' ? 'حضور المؤتمر' : 'Conference Attendee')}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn small" style={{ flex: 1 }} onClick={() => window.print()}>
                  <Printer size={15} /> {lang === 'ar' ? 'طباعة البطاقة' : 'Print Badge'}
                </button>
                <Link className="ghost darktext small" style={{ flex: 1 }} to="/">
                  {lang === 'ar' ? 'الرئيسية' : 'Home'}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="container" style={{ padding: '130px 24px 80px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', padding: '40px', boxShadow: 'var(--shadow-md)' }}>
          <div className="eyebrow eyebrow-pill">{lang === 'ar' ? 'التسجيل في المؤتمر' : 'Conference Registration'}</div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '8px' }}>
            {lang === 'ar' ? 'تسجيل الحضور والعارضين' : 'Visitor & Exhibitor Registration'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.92rem' }}>
            {lang === 'ar' ? 'حضور الزوار متاح لكافة المهتمين. باقات العارضين تتضمن مساحات عرض مجهزة.' : 'Visitor attendance is open to all professionals. Exhibitor packages include booth space.'}
          </p>

          <form onSubmit={submit}>
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--teal)' }}>
                  {lang === 'ar' ? '1. البيانات الشخصية وجهة العمل' : '1. Personal & Contact Information'}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      required
                      placeholder={lang === 'ar' ? 'الاسم الثلاثي' : 'Full Name'}
                      name="fullName"
                      value={data.fullName}
                      onChange={upd}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                      </label>
                      {emailVerified ? (
                        <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} /> {lang === 'ar' ? 'تم التحقق' : 'Verified'}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendVerificationCode}
                          style={{ background: 'none', border: 'none', color: 'var(--teal)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {lang === 'ar' ? 'تأكيد البريد برمز' : 'Verify with Code'}
                        </button>
                      )}
                    </div>
                    <input
                      required
                      type="email"
                      placeholder="name@example.com"
                      name="email"
                      value={data.email}
                      onChange={upd}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      {lang === 'ar' ? 'الجهة / المنظمة' : 'Organization / Company'}
                    </label>
                    <input
                      placeholder={lang === 'ar' ? 'الجامعة أو الشركة أو الوزارة' : 'University, Enterprise, or Ministry'}
                      name="organization"
                      value={data.organization}
                      onChange={upd}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      {lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}
                    </label>
                    <input
                      placeholder={lang === 'ar' ? 'مهندس / مدير / باحث...' : 'Engineer / Director / Specialist...'}
                      name="jobTitle"
                      value={data.jobTitle}
                      onChange={upd}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      placeholder="+966 50 000 0000"
                      name="phone"
                      value={data.phone}
                      onChange={upd}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      {lang === 'ar' ? 'الدولة' : 'Country'}
                    </label>
                    <input
                      name="country"
                      value={data.country}
                      onChange={upd}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      if (!data.fullName || !data.email) {
                        alert(lang === 'ar' ? 'يرجى كتابة الاسم والبريد الإلكتروني' : 'Please enter full name and email');
                        return;
                      }
                      setStep(2);
                    }}
                  >
                    {lang === 'ar' ? 'متابعة لاختيار الفئة' : 'Continue to Participation Type'}
                    {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--teal)' }}>
                  {lang === 'ar' ? '2. اختيار فئة المشاركة' : '2. Select Participation Type'}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div
                    onClick={() => setData({ ...data, registrationType: 'visitor' })}
                    style={{
                      padding: '24px 20px',
                      border: data.registrationType === 'visitor' ? '2px solid var(--teal)' : '1px solid var(--line)',
                      background: data.registrationType === 'visitor' ? 'rgba(18, 106, 107, 0.06)' : 'var(--white)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <Users size={28} style={{ color: 'var(--teal)' }} />
                      <span style={{ background: '#E2F7E6', color: '#166534', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 800 }}>
                        {lang === 'ar' ? 'حضور مجاني' : 'Complimentary'}
                      </span>
                    </div>
                    <strong style={{ display: 'block', color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '6px' }}>
                      {lang === 'ar' ? 'زائر / حضور فعاليات المؤتمر' : 'Conference Visitor'}
                    </strong>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {lang === 'ar' ? 'حضور الجلسات والمحاضرات والجولات بالمعرض المصاحب.' : 'Access to all scientific keynotes, plenary talks, and exhibition visits.'}
                    </small>
                  </div>

                  <div
                    onClick={() => setData({ ...data, registrationType: 'exhibitor' })}
                    style={{
                      padding: '24px 20px',
                      border: data.registrationType === 'exhibitor' ? '2px solid var(--teal)' : '1px solid var(--line)',
                      background: data.registrationType === 'exhibitor' ? 'rgba(18, 106, 107, 0.06)' : 'var(--white)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <Building2 size={28} style={{ color: 'var(--teal)' }} />
                      <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 800 }}>
                        {lang === 'ar' ? 'باقة عارض' : 'Exhibitor Package'}
                      </span>
                    </div>
                    <strong style={{ display: 'block', color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '6px' }}>
                      {lang === 'ar' ? 'عارض بالمعرض المصاحب' : 'Exhibitor / Booth'}
                    </strong>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {lang === 'ar' ? 'حجز باقة ومساحة مجهزة ضمن المعرض المصاحب.' : 'Book an exhibitor sponsorship package and dedicated booth.'}
                    </small>
                  </div>
                </div>

                {data.registrationType === 'exhibitor' && (
                  <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', marginBottom: '20px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                        {lang === 'ar' ? 'اختر باقة العارض *' : 'Select Exhibitor Package *'}
                      </label>
                      <select
                        name="packageId"
                        value={data.packageId}
                        onChange={upd}
                        style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                      >
                        {packages.map((p) => (
                          <option value={p.id} key={p.id}>
                            {p.name} — {Number(p.price).toLocaleString()} SAR
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                        {lang === 'ar' ? 'تفضيل موقع الجناح (اختياري)' : 'Booth Preference (Optional)'}
                      </label>
                      <select
                        name="boothId"
                        value={data.boothId}
                        onChange={upd}
                        style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                      >
                        <option value="">{lang === 'ar' ? 'تحديد لاحقاً أو تعيين آلي' : 'Assign later or auto-assign'}</option>
                        {(booths.length > 0 ? booths : Array.from({ length: 18 }, (_, i) => ({ id: `b-${i+1}`, booth_no: `B-${String(i+1).padStart(2, '0')}`, width_m: 3, depth_m: 3, status: 'available' }))).map((b) => (
                          <option value={b.booth_no} key={b.id} disabled={b.status === 'reserved' || b.status === 'occupied'}>
                            {b.booth_no} ({b.width_m}m × {b.depth_m}m) — {b.status === 'reserved' || b.status === 'occupied' ? (lang === 'ar' ? 'محجوز' : 'Reserved') : (lang === 'ar' ? 'متاح' : 'Available')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    {lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={lang === 'ar' ? 'أي متطلبات أو استفسارات إضافية...' : 'Any special requests or notes...'}
                    name="notes"
                    value={data.notes}
                    onChange={upd}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" className="ghost darktext" onClick={() => setStep(1)}>
                    {lang === 'ar' ? 'السابق' : 'Back'}
                  </button>
                  <button type="button" className="btn" onClick={() => setStep(3)}>
                    {lang === 'ar' ? 'مراجعة البيانات' : 'Review Details'}
                    {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--teal)' }}>
                  {lang === 'ar' ? '3. مراجعة وتأكيد التسجيل' : '3. Review & Confirm'}
                </h3>

                <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
                  <div><strong>{lang === 'ar' ? 'الاسم:' : 'Name:'}</strong> {data.fullName}</div>
                  <div>
                    <strong>{lang === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</strong> {data.email}{' '}
                    {emailVerified && <span style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 700 }}>(✓ Verified)</span>}
                  </div>
                  <div><strong>{lang === 'ar' ? 'الجهة:' : 'Organization:'}</strong> {data.organization || '—'}</div>
                  <div>
                    <strong>{lang === 'ar' ? 'نوع المشاركة:' : 'Category:'}</strong>{' '}
                    {data.registrationType === 'exhibitor' ? (
                      <span style={{ color: 'var(--teal)', fontWeight: 800 }}>{lang === 'ar' ? 'عارض' : 'Exhibitor'}</span>
                    ) : (
                      <span style={{ color: '#166534', fontWeight: 800 }}>{lang === 'ar' ? 'حضور المؤتمر' : 'Visitor'}</span>
                    )}
                  </div>
                  {data.registrationType === 'exhibitor' && (
                    <>
                      <div><strong>{lang === 'ar' ? 'باقة العارض:' : 'Package:'}</strong> {packages.find((p) => p.id === data.packageId)?.name || 'Selected Package'} ({Number(packages.find((p) => p.id === data.packageId)?.price || 0).toLocaleString()} SAR)</div>
                      {data.boothId && <div><strong>{lang === 'ar' ? 'موقع الجناح:' : 'Booth:'}</strong> {data.boothId}</div>}
                    </>
                  )}
                  <div><strong>{lang === 'ar' ? 'الموقع والموعد:' : 'Venue & Date:'}</strong> {t.footer.dateText} — {t.footer.venueText}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" className="ghost darktext" onClick={() => setStep(2)}>
                    {lang === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                  <button type="submit" className="btn" disabled={loading}>
                    {loading ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Submitting...') : (lang === 'ar' ? 'تأكيد التسجيل' : 'Confirm Registration')}
                    {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* EMAIL VERIFICATION CODE MODAL */}
          {showVerifyModal && (
            <div className="modal-overlay" onClick={() => setShowVerifyModal(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '440px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(18, 106, 107, 0.1)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Mail size={28} />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '6px' }}>
                  {lang === 'ar' ? 'تأكيد البريد الإلكتروني' : 'Verify Email Address'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  {lang === 'ar' ? `تم إرسال رمز تحقق مكوّن من 6 أرقام إلى:` : `We sent a 6-digit verification code to:`}<br />
                  <strong style={{ color: 'var(--primary)' }}>{data.email}</strong>
                </p>

                {verificationError && (
                  <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px' }}>
                    {verificationError}
                  </div>
                )}
                {verificationMsg && !verificationError && (
                  <div style={{ background: '#ECFDF5', color: '#065F46', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px' }}>
                    {verificationMsg}
                  </div>
                )}

                {devCode && (
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px 16px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.85rem', color: '#1E40AF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demo / Dev Code</div>
                      <code style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '2px', color: '#1E40AF' }}>{devCode}</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVerificationCode(devCode)}
                      style={{ background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {lang === 'ar' ? 'تعبئة تلقائية' : 'Auto-Fill'}
                    </button>
                  </div>
                )}


                <form onSubmit={handleVerifyCode}>
                  <div style={{ marginBottom: '20px' }}>
                    <input
                      required
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      style={{ width: '100%', padding: '14px', textAlign: 'center', fontSize: '1.4rem', letterSpacing: '8px', fontWeight: 800, border: '2px solid var(--teal)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                    />
                  </div>

                  <button type="submit" className="btn" style={{ width: '100%', marginBottom: '12px' }}>
                    {lang === 'ar' ? 'تأكيد الرمز' : 'Verify Code'}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                    <button
                      type="button"
                      disabled={resendCooldown > 0}
                      onClick={handleSendVerificationCode}
                      style={{ background: 'none', border: 'none', color: resendCooldown > 0 ? 'var(--text-muted)' : 'var(--teal)', fontWeight: 700, cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer' }}
                    >
                      {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                    <button type="button" onClick={() => setShowVerifyModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

// Professional Administration Portal
function AdminPanel() {
  const [token, setToken] = useState(() => localStorage.getItem('ewacon_token'));
  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ewacon_admin_user') || 'null');
    } catch {
      return null;
    }
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Active Tab: 'registrations', 'abstracts', 'users', 'activity'
  const [activeTab, setActiveTab] = useState(() => {
    return adminUser?.role === 'research_manager' ? 'abstracts' : 'registrations';
  });

  // State
  const [dashboard, setDashboard] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [booths, setBooths] = useState([]);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [viewDetails, setViewDetails] = useState(null);
  const [editingReg, setEditingReg] = useState(null);
  const [showAddRegModal, setShowAddRegModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(null);
  const [showEmailGroupModal, setShowEmailGroupModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  // Dedicated Payment Confirmation Modal
  const [paymentModalReg, setPaymentModalReg] = useState(null);
  const [paymentData, setPaymentData] = useState({
    payment_method: 'Bank Wire Transfer',
    payment_reference: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_amount: ''
  });

  // Comprehensive Offline Form (mirrors online flow completely)
  const [newReg, setNewReg] = useState({
    registrationType: 'visitor',
    fullName: '',
    email: '',
    organization: '',
    jobTitle: '',
    phone: '',
    country: 'Saudi Arabia',
    address: '',
    packageId: '',
    boothNo: '',
    billingContact: '',
    paymentMethod: 'Bank Wire Transfer',
    paymentRef: '',
    notes: '',
    status: '',
    abstractTitle: '',
    abstractText: '',
    authorName: '',
    affiliation: '',
    attachmentName: ''
  });

  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'event_manager'
  });

  // Show Toast Helper
  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Fetch real data from backend
  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [dashRes, regRes, logsRes, pkgsRes, boothsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`, { headers }),
        fetch(`${API_BASE}/admin/registrations`, { headers }),
        fetch(`${API_BASE}/admin/activity`, { headers }),
        fetch(`${API_BASE}/public/packages`),
        fetch(`${API_BASE}/public/booths`)
      ]);

      if (dashRes.ok) setDashboard(await dashRes.json());
      if (regRes.ok) setRegistrations(await regRes.json());
      if (logsRes.ok) setActivityLogs(await logsRes.json());
      if (pkgsRes.ok) setPackages(await pkgsRes.json());
      if (boothsRes.ok) setBooths(await boothsRes.json());

      if (adminUser?.role === 'superadmin') {
        const usersRes = await fetch(`${API_BASE}/admin/users`, { headers });
        if (usersRes.ok) setAdminUsers(await usersRes.json());
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  }, [token, adminUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Standard Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      localStorage.setItem('ewacon_token', data.token);
      localStorage.setItem('ewacon_admin_user', JSON.stringify(data.admin));
      setToken(data.token);
      setAdminUser(data.admin);
      if (data.admin.role === 'research_manager') {
        setActiveTab('abstracts');
      } else {
        setActiveTab('registrations');
      }
      notify('Signed in successfully.');
    } catch {
      setLoginError('Unable to connect to server. Please check your connection.');
    }
    setLoading(false);
  };

  // Google Sign-In
  const handleGoogleSignIn = async (googleEmail, googleName) => {
    setLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: googleEmail, name: googleName, googleId: 'google_' + Date.now() })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Google Sign-In failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('ewacon_token', data.token);
      localStorage.setItem('ewacon_admin_user', JSON.stringify(data.admin));
      setToken(data.token);
      setAdminUser(data.admin);
      setShowGoogleModal(false);
      if (data.admin.role === 'research_manager') {
        setActiveTab('abstracts');
      } else {
        setActiveTab('registrations');
      }
      notify('Signed in with Google successfully.');
    } catch {
      setLoginError('Google Sign-In connection error.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('ewacon_token');
    localStorage.removeItem('ewacon_admin_user');
    setToken(null);
    setAdminUser(null);
  };

  const role = adminUser?.role || 'superadmin';

  // Strict Data Partitioning
  const eventRegistrations = useMemo(() => {
    return registrations.filter((r) => r.registration_type !== 'abstract');
  }, [registrations]);

  const abstractSubmissions = useMemo(() => {
    return registrations.filter((r) => r.registration_type === 'abstract');
  }, [registrations]);

  // Filtered registrations
  const filteredRegs = useMemo(() => {
    return eventRegistrations.filter((r) => {
      const matchSearch =
        search === '' ||
        r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.email?.toLowerCase().includes(search.toLowerCase()) ||
        r.registration_no?.toLowerCase().includes(search.toLowerCase()) ||
        r.organization?.toLowerCase().includes(search.toLowerCase());

      const matchType = typeFilter === 'all' || r.registration_type === typeFilter;
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [eventRegistrations, search, typeFilter, statusFilter]);

  // Filtered abstracts
  const filteredAbstracts = useMemo(() => {
    return abstractSubmissions.filter((r) => {
      const matchSearch =
        search === '' ||
        r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.email?.toLowerCase().includes(search.toLowerCase()) ||
        r.registration_no?.toLowerCase().includes(search.toLowerCase()) ||
        r.affiliation?.toLowerCase().includes(search.toLowerCase()) ||
        r.abstract_title?.toLowerCase().includes(search.toLowerCase()) ||
        r.author_name?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || r.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [abstractSubmissions, search, statusFilter]);

  // Offline abstract word count
  const offlineAbstractWordCount = useMemo(() => {
    return newReg.abstractText.trim() ? newReg.abstractText.trim().split(/\s+/).length : 0;
  }, [newReg.abstractText]);

  // Selection toggle
  const toggleSelectAll = (list) => {
    if (selectedIds.length === list.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(list.map((r) => r.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]
    );
  };

  // Open Payment Confirmation Modal
  const openConfirmPaymentModal = (reg) => {
    setPaymentModalReg(reg);
    setPaymentData({
      payment_method: reg.payment_method || 'Bank Wire Transfer',
      payment_reference: reg.gateway_reference || '',
      payment_date: new Date().toISOString().split('T')[0],
      payment_amount: reg.payment_amount || reg.package_price || 100000
    });
  };

  // Submit Payment Confirmation Form (Requirements 1 & 2)
  const handleConfirmPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentData.payment_method.trim() || !paymentData.payment_reference.trim()) {
      alert('Payment method and transaction reference number are required to confirm payment.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${paymentModalReg.id}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to confirm payment.');
        return;
      }

      setPaymentModalReg(null);
      if (viewDetails?.id === paymentModalReg.id) {
        setViewDetails({
          ...viewDetails,
          status: 'confirmed',
          payment_method: paymentData.payment_method,
          gateway_reference: paymentData.payment_reference,
          payment_date: paymentData.payment_date,
          payment_amount: paymentData.payment_amount
        });
      }
      notify(data.message || 'Payment confirmed and badge issued successfully!');
      fetchData();
    } catch (err) {
      alert('Error confirming payment: ' + err.message);
    }
  };

  // Quick Status Update for Abstracts & Visitors
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.requiresPaymentForm) {
          const reg = registrations.find((r) => r.id === id);
          if (reg) openConfirmPaymentModal(reg);
        } else {
          alert(data.error || 'Status update failed.');
        }
        return;
      }

      if (viewDetails?.id === id) {
        setViewDetails({ ...viewDetails, status: newStatus });
      }
      notify(`Status updated to ${newStatus}.`);
      fetchData();
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  // Badge Delivery / Resend
  const handleSendBadge = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${id}/send-badge`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to send badge');
        return;
      }
      notify(data.message || 'Badge sent successfully.');
      fetchData();
    } catch (err) {
      alert('Error delivering badge: ' + err.message);
    }
  };

  // Delete Record
  const handleDeleteReg = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        if (viewDetails?.id === id) setViewDetails(null);
        notify('Record deleted successfully.');
        fetchData();
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Save Record Edit
  const handleSaveEditReg = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${editingReg.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingReg)
      });
      if (res.ok) {
        setEditingReg(null);
        notify('Record updated successfully.');
        fetchData();
      }
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  // Add Comprehensive Offline Entry
  const handleAddOfflineReg = async (e) => {
    e.preventDefault();
    if (newReg.registrationType === 'abstract' && offlineAbstractWordCount > 300) {
      alert('Abstract text cannot exceed 300 words.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newReg)
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddRegModal(false);
        setNewReg({
          registrationType: role === 'research_manager' ? 'abstract' : 'visitor',
          fullName: '',
          email: '',
          organization: '',
          jobTitle: '',
          phone: '',
          country: 'Saudi Arabia',
          address: '',
          packageId: '',
          boothNo: '',
          billingContact: '',
          paymentMethod: 'Bank Wire Transfer',
          paymentRef: '',
          notes: '',
          status: '',
          abstractTitle: '',
          abstractText: '',
          authorName: '',
          affiliation: '',
          attachmentName: ''
        });
        notify('Offline entry added successfully.');
        fetchData();
      } else {
        alert(data.error || 'Failed to save record');
      }
    } catch (err) {
      alert('Error adding record: ' + err.message);
    }
  };

  // User Management
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setShowAddUserModal(false);
        setNewUser({ fullName: '', email: '', password: '', role: 'event_manager' });
        notify('Staff account created.');
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create user account');
      }
    } catch (err) {
      alert('Error creating user: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this management account?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        notify('User account deleted.');
        fetchData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newPw = e.target.newPassword.value;
    const sendToEmail = e.target.sendToEmail?.value;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${showResetPasswordModal.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: newPw, sendToEmail })
      });
      const data = await res.json();
      if (res.ok) {
        notify(data.message || `Password updated and emailed to ${data.sentTo}`);
        setShowResetPasswordModal(null);
      } else {
        alert(data.error || 'Password reset failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    const form = e.target;
    const subject = form.broadcastSubject.value;
    const message = form.broadcastMessage.value;
    const targetGroup = form.targetGroup?.value || 'selected';

    setSendingBroadcast(true);
    try {
      const res = await fetch(`${API_BASE}/admin/broadcast-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientIds: selectedIds,
          targetGroup,
          subject,
          message
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to dispatch broadcast email');
        setSendingBroadcast(false);
        return;
      }
      notify(data.message || `Broadcast email delivered to ${data.sentCount} recipients via SMTP!`);
      setShowEmailGroupModal(false);
    } catch (err) {
      alert('Broadcast error: ' + err.message);
    }
    setSendingBroadcast(false);
  };


  // Export CSV
  const exportCSV = (list, filename = 'EWACON_Data.csv') => {
    if (list.length === 0) return alert('No records to export.');
    const header = ['Reference', 'Name', 'Email', 'Organization', 'Role', 'Category', 'Status', 'Date'];
    const rows = list.map((r) => [
      r.registration_no,
      `"${r.full_name || r.author_name || ''}"`,
      r.email,
      `"${r.organization || r.affiliation || ''}"`,
      `"${r.job_title || ''}"`,
      r.registration_type,
      r.status,
      r.created_at ? new Date(r.created_at).toLocaleDateString() : ''
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = filename;
    link.click();
  };

  const exportBadgeList = () => {
    const list = registrations.filter((r) => r.status === 'confirmed');
    const header = ['Badge ID', 'Full Name', 'Organization', 'Category'];
    const rows = list.map((r) => [
      r.registration_no,
      `"${r.full_name}"`,
      `"${r.organization || r.affiliation || ''}"`,
      r.registration_type
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `EWACON_Badge_Printing_List.csv`;
    link.click();
  };

  // Login Screen with "Continue with Google"
  if (!token) {
    return (
      <>
        <Nav />
        <div style={{ minHeight: '85vh', padding: '140px 24px 80px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-subtle)' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', padding: '36px', maxWidth: '420px', width: '100%', boxShadow: 'var(--shadow-md)' }}>
            <div className="eyebrow eyebrow-pill">Administration</div>
            <h2 style={{ fontSize: '1.7rem', color: 'var(--primary)', marginBottom: '8px' }}>
              Portal Sign In
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Authorized management access for EWACON 2026.
            </p>

            {loginError && (
              <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #DADCE0',
                background: '#fff',
                color: '#3C4043',
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '20px',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.37 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
              <span>OR SIGN IN WITH EMAIL</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
            </div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  placeholder="name@ewacon.sa"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A' }}
                />
              </div>

              <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* GOOGLE SIGN-IN SELECTOR MODAL */}
        {showGoogleModal && (
          <div className="modal-overlay" onClick={() => setShowGoogleModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '420px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px' }}>
                <svg width="48" height="48" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.37 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '4px' }}>Sign in with Google</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>Select an account to proceed to EWACON 2026 portal</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('admin@ewacon.sa', 'Administrator')}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#7C3AED', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>A</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>admin@ewacon.sa</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Administrator Account</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('research@ewacon.sa', 'Dr. Research Director')}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>R</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>research@ewacon.sa</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Research Director Account</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('event@ewacon.sa', 'Event Operations')}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0284C7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>E</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>event@ewacon.sa</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Event Operations Account</div>
                  </div>
                </button>
              </div>

              <button type="button" className="ghost darktext small" onClick={() => setShowGoogleModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      {/* Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, background: '#071B2A', color: '#fff', padding: '14px 20px', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', border: '1px solid var(--teal)' }}>
          <CheckCircle size={18} style={{ color: 'var(--teal)' }} />
          <span>{toast.msg}</span>
        </div>
      )}

      <div style={{ padding: '120px 24px 80px', background: 'var(--bg-subtle)', minHeight: '100vh' }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="eyebrow eyebrow-pill">EWACON 2026</span>
                <span style={{ background: role === 'superadmin' ? '#7C3AED' : role === 'research_manager' ? 'var(--teal)' : '#0284C7', color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {role === 'superadmin' ? 'Administrator' : role === 'research_manager' ? 'Research Director' : 'Event Operations'}
                </span>
              </div>
              <h1 style={{ fontSize: '2.1rem', color: 'var(--primary)' }}>
                {role === 'research_manager' ? 'Research & Abstracts' : role === 'event_manager' ? 'Registrations & Attendance' : 'Administration Dashboard'}
              </h1>
              <small style={{ color: 'var(--text-muted)' }}>Signed in: <b>{adminUser?.fullName}</b> ({adminUser?.email})</small>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn small" onClick={fetchData} title="Refresh">
                <RefreshCw size={14} /> Refresh
              </button>
              {role !== 'research_manager' && (
                <button className="btn small" onClick={exportBadgeList}>
                  <Printer size={14} /> Export Badges
                </button>
              )}
              <button className="btn small" onClick={() => exportCSV(role === 'research_manager' ? filteredAbstracts : filteredRegs, 'EWACON_Data.csv')}>
                <Download size={14} /> Export CSV
              </button>
              <button className="ghost darktext small" onClick={handleLogout}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: role === 'research_manager' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '30px' }}>
            {role !== 'research_manager' && (
              <div style={{ background: 'var(--white)', padding: '22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Registrations</span>
                <strong style={{ display: 'block', fontSize: '1.9rem', color: 'var(--primary)', marginTop: '4px' }}>
                  {eventRegistrations.length}
                </strong>
                <small style={{ color: 'var(--teal)', fontWeight: 600 }}>
                  Visitors: {eventRegistrations.filter((r) => r.registration_type === 'visitor').length} | Exhibitors: {eventRegistrations.filter((r) => r.registration_type === 'exhibitor').length}
                </small>
              </div>
            )}

            {(role === 'superadmin' || role === 'research_manager') && (
              <div style={{ background: 'var(--white)', padding: '22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Research Abstracts</span>
                <strong style={{ display: 'block', fontSize: '1.9rem', color: 'var(--teal)', marginTop: '4px' }}>
                  {abstractSubmissions.length}
                </strong>
                <small style={{ color: 'var(--text-muted)' }}>
                  Approved: {abstractSubmissions.filter((r) => r.status === 'approved').length} | Review: {abstractSubmissions.filter((r) => r.status === 'pending_review' || r.status === 'pending').length}
                </small>
              </div>
            )}

            {role !== 'research_manager' && (
              <>
                <div style={{ background: 'var(--white)', padding: '22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Confirmed Revenue</span>
                  <strong style={{ display: 'block', fontSize: '1.9rem', color: 'var(--green)', marginTop: '4px' }}>
                    SAR {(dashboard?.revenue ?? 0).toLocaleString()}
                  </strong>
                  <small style={{ color: 'var(--text-muted)' }}>Exhibitor Sponsorships</small>
                </div>

                <div style={{ background: 'var(--white)', padding: '22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Booth Occupancy</span>
                  <strong style={{ display: 'block', fontSize: '1.9rem', color: 'var(--primary)', marginTop: '4px' }}>
                    {dashboard?.booths?.reserved ?? eventRegistrations.filter((r) => r.booth_no).length} / 18
                  </strong>
                  <small style={{ color: 'var(--text-muted)' }}>Reserved Exhibition Spaces</small>
                </div>
              </>
            )}
          </div>

          {/* Navigation Tabs (Strictly role-separated) */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
            {role !== 'research_manager' && (
              <button
                className={`filter-btn ${activeTab === 'registrations' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('registrations');
                  setSelectedIds([]);
                  setStatusFilter('all');
                }}
              >
                <Users size={16} /> Registrations ({eventRegistrations.length})
              </button>
            )}

            {(role === 'superadmin' || role === 'research_manager') && (
              <button
                className={`filter-btn ${activeTab === 'abstracts' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('abstracts');
                  setSelectedIds([]);
                  setStatusFilter('all');
                }}
              >
                <FileText size={16} /> Abstracts ({abstractSubmissions.length})
              </button>
            )}

            {role === 'superadmin' && (
              <button
                className={`filter-btn ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <ShieldCheck size={16} /> User Accounts
              </button>
            )}

            <button
              className={`filter-btn ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <Activity size={16} /> Activity History
            </button>
          </div>

          {/* TAB 1: REGISTRATIONS (Clean table with combined status & Payment Confirmation flow) */}
          {activeTab === 'registrations' && role !== 'research_manager' && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input
                      placeholder="Search registrations..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ padding: '10px 14px 10px 36px', border: '1px solid var(--line)', borderRadius: '8px', minWidth: '240px', background: '#fff', color: '#071B2A', fontSize: '0.88rem' }}
                    />
                  </div>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Categories</option>
                    <option value="visitor">Visitors</option>
                    <option value="exhibitor">Exhibitors</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending_payment">Pending Payment</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {selectedIds.length > 0 && (
                    <>
                      <button className="btn small btn-secondary" onClick={() => exportCSV(filteredRegs.filter((r) => selectedIds.includes(r.id)), 'Selected_Registrations.csv')}>
                        <Download size={14} /> Export ({selectedIds.length})
                      </button>
                      <button className="btn small" onClick={() => setShowEmailGroupModal(true)}>
                        <Mail size={14} /> Send Group Email
                      </button>
                    </>
                  )}
                  <button className="btn small" onClick={() => {
                    setNewReg((prev) => ({ ...prev, registrationType: 'visitor', status: 'confirmed' }));
                    setShowAddRegModal(true);
                  }}>
                    <Plus size={14} /> Add Offline Entry
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--line)' }}>
                      <th style={{ padding: '14px 16px', width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.length === filteredRegs.length && filteredRegs.length > 0}
                          onChange={() => toggleSelectAll(filteredRegs)}
                        />
                      </th>
                      <th style={{ padding: '14px 16px' }}>Reference</th>
                      <th style={{ padding: '14px 16px' }}>Name & Email</th>
                      <th style={{ padding: '14px 16px' }}>Organization</th>
                      <th style={{ padding: '14px 16px' }}>Category</th>
                      <th style={{ padding: '14px 16px' }}>Status</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegs.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No registration records found.
                        </td>
                      </tr>
                    ) : (
                      filteredRegs.map((r) => (
                        <tr
                          key={r.id}
                          style={{ borderBottom: '1px solid var(--line)' }}
                          className="clickable-row"
                          onClick={() => setViewDetails(r)}
                        >
                          <td style={{ padding: '14px 16px' }} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(r.id)}
                              onChange={() => toggleSelect(r.id)}
                            />
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{r.registration_no}</span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.full_name}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{r.email}</small>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div>{r.organization || '—'}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{r.job_title || ''}</small>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: 700, color: r.registration_type === 'exhibitor' ? 'var(--teal)' : '#166534' }}>
                              {r.registration_type === 'exhibitor' ? 'Exhibitor' : 'Visitor'}
                            </span>
                            {r.package_name && <small style={{ display: 'block', color: 'var(--text-muted)' }}>{r.package_name}</small>}
                          </td>
                          <td style={{ padding: '14px 16px' }} onClick={(e) => e.stopPropagation()}>
                            <StatusBadge status={r.status} />
                            {r.status === 'pending_payment' && (
                              <button
                                className="btn small"
                                style={{ display: 'inline-block', marginTop: '4px', padding: '3px 8px', fontSize: '0.72rem' }}
                                onClick={() => openConfirmPaymentModal(r)}
                                title="Record & Confirm Payment"
                              >
                                <CreditCard size={12} style={{ display: 'inline', marginInlineEnd: '4px' }} />
                                Record Payment
                              </button>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button
                                className="ghost darktext small"
                                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                                onClick={() => setViewDetails(r)}
                              >
                                <Eye size={13} /> More Details
                              </button>
                              <button
                                className="ghost darktext small"
                                style={{ padding: '4px 8px' }}
                                onClick={() => setEditingReg(r)}
                                title="Edit"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                className="ghost darktext small"
                                style={{ padding: '4px 8px', color: '#e53e3e', borderColor: '#feb2b2' }}
                                onClick={() => handleDeleteReg(r.id)}
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ABSTRACTS (Dedicated Tab with limited summary columns & More Details) */}
          {activeTab === 'abstracts' && (role === 'superadmin' || role === 'research_manager') && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input
                      placeholder="Search title, author, university..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ padding: '10px 14px 10px 36px', border: '1px solid var(--line)', borderRadius: '8px', minWidth: '260px', background: '#fff', color: '#071B2A', fontSize: '0.88rem' }}
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: '#071B2A', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {selectedIds.length > 0 && (
                    <>
                      <button className="btn small btn-secondary" onClick={() => exportCSV(filteredAbstracts.filter((r) => selectedIds.includes(r.id)), 'Selected_Abstracts.csv')}>
                        <Download size={14} /> Export ({selectedIds.length})
                      </button>
                      <button className="btn small" onClick={() => setShowEmailGroupModal(true)}>
                        <Mail size={14} /> Send Group Email
                      </button>
                    </>
                  )}
                  <button className="btn small" onClick={() => {
                    setNewReg((prev) => ({ ...prev, registrationType: 'abstract', status: 'pending_review' }));
                    setShowAddRegModal(true);
                  }}>
                    <Plus size={14} /> Add Offline Abstract
                  </button>
                </div>
              </div>

              {/* Limited Essential Information Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--line)' }}>
                      <th style={{ padding: '14px 16px', width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.length === filteredAbstracts.length && filteredAbstracts.length > 0}
                          onChange={() => toggleSelectAll(filteredAbstracts)}
                        />
                      </th>
                      <th style={{ padding: '14px 16px' }}>Reference</th>
                      <th style={{ padding: '14px 16px' }}>Paper Title</th>
                      <th style={{ padding: '14px 16px' }}>Author & Institution</th>
                      <th style={{ padding: '14px 16px' }}>Submission Date</th>
                      <th style={{ padding: '14px 16px' }}>Status</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAbstracts.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No research abstracts found.
                        </td>
                      </tr>
                    ) : (
                      filteredAbstracts.map((r) => (
                        <tr
                          key={r.id}
                          style={{ borderBottom: '1px solid var(--line)' }}
                          className="clickable-row"
                          onClick={() => setViewDetails(r)}
                        >
                          <td style={{ padding: '14px 16px' }} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(r.id)}
                              onChange={() => toggleSelect(r.id)}
                            />
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{r.registration_no}</span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--primary)', maxWidth: '320px', lineHeight: '1.4' }}>
                              {r.abstract_title || 'Untitled Research'}
                            </div>
                            {r.attachment_name && (
                              <small style={{ color: 'var(--teal)', fontWeight: 600 }}>📎 {r.attachment_name}</small>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.author_name || r.full_name}</div>
                            <small style={{ color: 'var(--text-muted)' }}>{r.affiliation || r.organization || '—'}</small>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                            {r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <StatusBadge status={r.status} />
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button
                                className="ghost darktext small"
                                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                                onClick={() => setViewDetails(r)}
                              >
                                <Eye size={13} /> More Details
                              </button>
                              <button
                                className="ghost darktext small"
                                style={{ padding: '4px 8px' }}
                                onClick={() => setEditingReg(r)}
                                title="Edit"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                className="ghost darktext small"
                                style={{ padding: '4px 8px', color: '#e53e3e', borderColor: '#feb2b2' }}
                                onClick={() => handleDeleteReg(r.id)}
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: USER ACCOUNTS (Super Admin Only) */}
          {activeTab === 'users' && role === 'superadmin' && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>Internal Staff Accounts</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Access permissions for <b>Research Directors</b> (abstracts only) and <b>Event Operations</b> (attendees only).
                  </p>
                </div>
                <button className="btn small" onClick={() => setShowAddUserModal(true)}>
                  <UserPlus size={14} /> Add User Account
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--line)' }}>
                      <th style={{ padding: '14px 16px' }}>Name</th>
                      <th style={{ padding: '14px 16px' }}>Email</th>
                      <th style={{ padding: '14px 16px' }}>Assigned Role</th>
                      <th style={{ padding: '14px 16px' }}>Status</th>
                      <th style={{ padding: '14px 16px' }}>Created Date</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--line)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>{u.full_name}</td>
                        <td style={{ padding: '14px 16px' }}>{u.email}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ textTransform: 'uppercase', fontWeight: 800, fontSize: '0.75rem', background: u.role === 'superadmin' ? 'rgba(124, 58, 237, 0.1)' : u.role === 'research_manager' ? 'rgba(18, 106, 107, 0.1)' : 'rgba(2, 132, 199, 0.1)', color: u.role === 'superadmin' ? '#7C3AED' : u.role === 'research_manager' ? 'var(--teal)' : '#0284C7', padding: '4px 10px', borderRadius: '4px' }}>
                            {u.role === 'research_manager' ? 'Research Director' : u.role === 'event_manager' ? 'Event Operations' : 'Administrator'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="status-badge confirmed">Active</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              className="ghost darktext small"
                              style={{ padding: '4px 8px' }}
                              onClick={() => setShowResetPasswordModal(u)}
                            >
                              <Key size={13} /> Reset Password
                            </button>
                            {u.id !== adminUser?.id && (
                              <button
                                className="ghost darktext small"
                                style={{ padding: '4px 8px', color: '#e53e3e', borderColor: '#feb2b2' }}
                                onClick={() => handleDeleteUser(u.id)}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DETAILED ACTIVITY HISTORY (Audit Trail with Field Diffs) */}
          {activeTab === 'activity' && (
            <div style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xl)', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '4px' }}>Activity History</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Complete audit trail of system modifications, payment transactions, and status changes.</p>
                </div>
                <button className="btn small" onClick={fetchData}>
                  <RefreshCw size={13} /> Refresh Log
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activityLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No activity records logged yet.</div>
                ) : (
                  activityLogs.map((log) => {
                    const details = log.details || {};
                    const changes = details.changes || [];
                    return (
                      <div
                        key={log.id}
                        style={{
                          background: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--line)',
                          padding: '16px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(18, 106, 107, 0.1)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Activity size={16} />
                            </div>
                            <div>
                              <strong style={{ fontSize: '0.98rem', color: 'var(--primary)' }}>
                                {details.action_title || log.action.replace('.', ' ').toUpperCase()}
                              </strong>
                              {log.registration_no && (
                                <span style={{ marginInlineStart: '8px', background: '#E2ECEF', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                                  {log.registration_no}
                                </span>
                              )}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>

                        {/* Affected entity and Actor */}
                        <div style={{ fontSize: '0.88rem', color: 'var(--primary)', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                          {log.entity_name && (
                            <div>
                              <span style={{ color: 'var(--text-muted)' }}>User / Attendee: </span>
                              <b>{log.entity_name}</b>
                            </div>
                          )}
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Changed by: </span>
                            <b>{log.admin_name || 'System / User'}</b>{' '}
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({log.admin_role || 'Staff'})</span>
                          </div>
                        </div>

                        {/* Payment Specific Badges */}
                        {(details.payment_method || details.payment_reference || details.payment_amount) && (
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {details.payment_method && (
                              <span style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                                Method: {details.payment_method}
                              </span>
                            )}
                            {details.payment_reference && (
                              <span style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                                Reference: {details.payment_reference}
                              </span>
                            )}
                            {details.payment_amount && (
                              <span style={{ background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                                Amount: SAR {Number(details.payment_amount).toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Individual Field Diffs */}
                        {changes.length > 0 && (
                          <div style={{ marginTop: '6px', background: '#fff', border: '1px solid var(--line)', borderRadius: '6px', padding: '10px 14px', fontSize: '0.82rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>Changed Fields:</div>
                            {changes.map((c, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 0' }}>
                                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{c.field}:</span>
                                <span style={{ textDecoration: 'line-through', color: '#991B1B' }}>{c.from || '—'}</span>
                                <ArrowRight size={12} style={{ color: 'var(--teal)' }} />
                                <span style={{ fontWeight: 700, color: '#065F46' }}>{c.to}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* DEDICATED CONFIRM PAYMENT MODAL (Requirement 1 & 2) */}
          {paymentModalReg && (
            <div className="modal-overlay" onClick={() => setPaymentModalReg(null)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '520px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                  <div>
                    <span className="eyebrow eyebrow-pill">PAYMENT CONFIRMATION</span>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--primary)', marginTop: '4px' }}>
                      {paymentModalReg.registration_no}
                    </h3>
                  </div>
                  <button onClick={() => setPaymentModalReg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Confirming payment for <b>{paymentModalReg.full_name}</b> ({paymentModalReg.organization}). Please enter the required payment information to mark this registration as Confirmed.
                </p>

                <form onSubmit={handleConfirmPaymentSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      Payment Method *
                    </label>
                    <select
                      required
                      value={paymentData.payment_method}
                      onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
                      style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A', fontSize: '0.9rem' }}
                    >
                      <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                      <option value="Corporate Cheque">Corporate Cheque</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Online Payment Gateway">Online Payment Gateway</option>
                      <option value="Cash / Direct Deposit">Cash / Direct Deposit</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      Payment Reference / Transaction Number *
                    </label>
                    <input
                      required
                      placeholder="e.g. WIRE-849201 or TXN-491028"
                      value={paymentData.payment_reference}
                      onChange={(e) => setPaymentData({ ...paymentData, payment_reference: e.target.value })}
                      style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                        Payment Date *
                      </label>
                      <input
                        required
                        type="date"
                        value={paymentData.payment_date}
                        onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
                        style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                        Amount (SAR) *
                      </label>
                      <input
                        required
                        type="number"
                        value={paymentData.payment_amount}
                        onChange={(e) => setPaymentData({ ...paymentData, payment_amount: e.target.value })}
                        style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" className="ghost darktext small" onClick={() => setPaymentModalReg(null)}>Cancel</button>
                    <button type="submit" className="btn small">
                      <CheckCircle size={14} /> Save & Confirm Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MORE DETAILS DEDICATED MODAL */}
          {viewDetails && (
            <div className="modal-overlay" onClick={() => setViewDetails(null)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '14px' }}>
                  <div>
                    <span className="eyebrow eyebrow-pill">
                      {viewDetails.registration_type === 'abstract' ? 'RESEARCH ABSTRACT' : viewDetails.registration_type?.toUpperCase()}
                    </span>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginTop: '4px' }}>
                      {viewDetails.registration_no}
                    </h2>
                  </div>
                  <button onClick={() => setViewDetails(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge status={viewDetails.status} />
                      {viewDetails.status === 'confirmed' && (
                        <button
                          className="btn small"
                          style={{ padding: '3px 10px', fontSize: '0.75rem' }}
                          onClick={() => handleSendBadge(viewDetails.id)}
                          title="Send Badge Email"
                        >
                          <Send size={12} style={{ display: 'inline', marginInlineEnd: '4px' }} />
                          {viewDetails.badge_delivery_status === 'delivered' ? 'Resend Badge' : 'Send Badge'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <strong>{viewDetails.registration_type === 'abstract' ? 'Author Name:' : 'Full Name:'}</strong> {viewDetails.full_name || viewDetails.author_name}
                  </div>

                  <div>
                    <strong>Email Address:</strong> <a href={`mailto:${viewDetails.email}`} style={{ color: 'var(--teal)' }}>{viewDetails.email}</a>{' '}
                    {viewDetails.email_verified && <span style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 700 }}>(✓ Verified)</span>}
                  </div>

                  <div>
                    <strong>Phone Number:</strong> {viewDetails.phone || '—'}
                  </div>

                  <div>
                    <strong>{viewDetails.registration_type === 'abstract' ? 'Affiliation / University:' : 'Organization:'}</strong> {viewDetails.organization || viewDetails.affiliation || '—'}
                  </div>

                  {viewDetails.job_title && (
                    <div><strong>Job Title:</strong> {viewDetails.job_title}</div>
                  )}

                  {viewDetails.address && (
                    <div><strong>Address:</strong> {viewDetails.address}</div>
                  )}

                  <div><strong>Country:</strong> {viewDetails.country || 'Saudi Arabia'}</div>

                  {/* Research Abstract Details */}
                  {viewDetails.registration_type === 'abstract' && (
                    <div className="detail-section">
                      <strong style={{ color: 'var(--primary)', display: 'block', fontSize: '1.05rem', marginBottom: '8px' }}>
                        Title: {viewDetails.abstract_title}
                      </strong>
                      <p style={{ lineHeight: '1.8', color: 'var(--primary)', margin: '8px 0', whiteSpace: 'pre-line' }}>
                        {viewDetails.abstract_text}
                      </p>
                      {viewDetails.attachment_name && (
                        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--line)', fontWeight: 700, color: 'var(--teal)' }}>
                          📎 Attachment: {viewDetails.attachment_name}
                        </div>
                      )}

                      {/* Scientific Reviewer Actions */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                        <button
                          className="btn small"
                          style={{ background: '#059669', borderColor: '#059669' }}
                          onClick={() => handleUpdateStatus(viewDetails.id, 'approved')}
                        >
                          <CheckCircle size={14} /> Approve Abstract
                        </button>
                        <button
                          className="btn small btn-secondary"
                          style={{ background: '#DC2626', borderColor: '#DC2626', color: '#fff' }}
                          onClick={() => handleUpdateStatus(viewDetails.id, 'rejected')}
                        >
                          <XCircle size={14} /> Reject Abstract
                        </button>
                        <button
                          className="ghost darktext small"
                          onClick={() => handleUpdateStatus(viewDetails.id, 'pending_review')}
                        >
                          <HelpCircle size={14} /> Mark Under Review
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Exhibitor Specific Details with Payment Info */}
                  {viewDetails.registration_type === 'exhibitor' && (
                    <div className="detail-section">
                      <div><strong>Exhibitor Package:</strong> {viewDetails.package_name || 'Exhibitor Tier'} ({Number(viewDetails.package_price || 0).toLocaleString()} SAR)</div>
                      <div style={{ marginTop: '6px' }}><strong>Exhibition Booth:</strong> {viewDetails.booth_no ? `Booth ${viewDetails.booth_no}` : 'Unassigned'}</div>
                      
                      {/* Payment information display */}
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--line)' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>Payment Information:</div>
                        <div><strong>Payment Method:</strong> {viewDetails.payment_method || '—'}</div>
                        <div><strong>Reference / Transaction Number:</strong> {viewDetails.gateway_reference || '—'}</div>
                        {viewDetails.payment_date && <div><strong>Payment Date:</strong> {new Date(viewDetails.payment_date).toLocaleDateString()}</div>}
                        {viewDetails.payment_amount && <div><strong>Amount Paid:</strong> SAR {Number(viewDetails.payment_amount).toLocaleString()}</div>}
                      </div>

                      {viewDetails.status === 'pending_payment' && (
                        <div style={{ marginTop: '12px' }}>
                          <button className="btn small" onClick={() => openConfirmPaymentModal(viewDetails)}>
                            <CreditCard size={14} style={{ display: 'inline', marginInlineEnd: '4px' }} />
                            Record & Confirm Payment
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {viewDetails.notes && (
                    <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '6px', fontSize: '0.88rem' }}>
                      <strong>Notes:</strong> {viewDetails.notes}
                    </div>
                  )}

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Submitted on: {viewDetails.created_at ? new Date(viewDetails.created_at).toLocaleString() : '—'}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                  <button className="ghost darktext small" onClick={() => setViewDetails(null)}>Close</button>
                  <button className="btn small" onClick={() => {
                    setEditingReg(viewDetails);
                    setViewDetails(null);
                  }}>
                    <Edit size={14} /> Edit Record
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT RECORD MODAL */}
          {editingReg && (
            <div className="modal-overlay" onClick={() => setEditingReg(null)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>Edit: {editingReg.registration_no}</h3>
                  <button onClick={() => setEditingReg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSaveEditReg}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Full Name / Author *</label>
                      <input
                        required
                        value={editingReg.full_name || editingReg.author_name || ''}
                        onChange={(e) => setEditingReg({ ...editingReg, full_name: e.target.value, author_name: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Email Address *</label>
                      <input
                        required
                        type="email"
                        value={editingReg.email || ''}
                        onChange={(e) => setEditingReg({ ...editingReg, email: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Organization / Affiliation</label>
                      <input
                        value={editingReg.organization || editingReg.affiliation || ''}
                        onChange={(e) => setEditingReg({ ...editingReg, organization: e.target.value, affiliation: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Job Title</label>
                      <input
                        value={editingReg.job_title || ''}
                        onChange={(e) => setEditingReg({ ...editingReg, job_title: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                  </div>

                  {editingReg.registration_type === 'abstract' ? (
                    <>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Abstract / Paper Title *</label>
                        <input
                          required
                          value={editingReg.abstract_title || ''}
                          onChange={(e) => setEditingReg({ ...editingReg, abstract_title: e.target.value })}
                          style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                        />
                      </div>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Abstract Text (300 words)</label>
                        <textarea
                          rows={5}
                          value={editingReg.abstract_text || ''}
                          onChange={(e) => setEditingReg({ ...editingReg, abstract_text: e.target.value })}
                          style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                        />
                      </div>
                    </>
                  ) : (
                    editingReg.registration_type === 'exhibitor' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Exhibitor Package</label>
                          <select
                            value={editingReg.package_id || ''}
                            onChange={(e) => setEditingReg({ ...editingReg, package_id: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                          >
                            {packages.map((p) => (
                              <option value={p.id} key={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Booth Location</label>
                          <select
                            value={editingReg.booth_no || ''}
                            onChange={(e) => setEditingReg({ ...editingReg, booth_no: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                          >
                            <option value="">No Booth / Unassigned</option>
                            {booths.map((b) => (
                              <option value={b.booth_no} key={b.id}>{b.booth_no}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Overall Status</label>
                      <select
                        value={editingReg.status || 'confirmed'}
                        onChange={(e) => setEditingReg({ ...editingReg, status: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      >
                        {editingReg.registration_type === 'abstract' ? (
                          <>
                            <option value="pending_review">Pending Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </>
                        ) : (
                          <>
                            <option value="confirmed">Confirmed</option>
                            {editingReg.registration_type === 'exhibitor' && <option value="pending_payment">Pending Payment</option>}
                            <option value="cancelled">Cancelled</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Phone Number</label>
                      <input
                        value={editingReg.phone || ''}
                        onChange={(e) => setEditingReg({ ...editingReg, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button type="button" className="ghost darktext small" onClick={() => setEditingReg(null)}>Cancel</button>
                    <button type="submit" className="btn small">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* COMPREHENSIVE OFFLINE REGISTRATION MODAL */}
          {showAddRegModal && (
            <div className="modal-overlay" onClick={() => setShowAddRegModal(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>
                    Add Offline Entry
                  </h3>
                  <button onClick={() => setShowAddRegModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleAddOfflineReg}>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      Entry Category
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {role !== 'research_manager' && (
                        <>
                          <button
                            type="button"
                            className={`filter-btn ${newReg.registrationType === 'visitor' ? 'active' : ''}`}
                            onClick={() => setNewReg({ ...newReg, registrationType: 'visitor', status: 'confirmed' })}
                          >
                            Visitor
                          </button>
                          <button
                            type="button"
                            className={`filter-btn ${newReg.registrationType === 'exhibitor' ? 'active' : ''}`}
                            onClick={() => setNewReg({ ...newReg, registrationType: 'exhibitor', status: 'pending_payment' })}
                          >
                            Exhibitor
                          </button>
                        </>
                      )}
                      {(role === 'superadmin' || role === 'research_manager') && (
                        <button
                          type="button"
                          className={`filter-btn ${newReg.registrationType === 'abstract' ? 'active' : ''}`}
                          onClick={() => setNewReg({ ...newReg, registrationType: 'abstract', status: 'pending_review' })}
                        >
                          Research Abstract
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                        {newReg.registrationType === 'abstract' ? 'Author Name *' : 'Full Name *'}
                      </label>
                      <input
                        required
                        placeholder="Full Name"
                        value={newReg.fullName}
                        onChange={(e) => setNewReg({ ...newReg, fullName: e.target.value, authorName: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="email@example.com"
                        value={newReg.email}
                        onChange={(e) => setNewReg({ ...newReg, email: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                        {newReg.registrationType === 'abstract' ? 'Affiliation / University *' : 'Organization / Company'}
                      </label>
                      <input
                        required={newReg.registrationType === 'abstract' || newReg.registrationType === 'exhibitor'}
                        placeholder="Organization or Institution"
                        value={newReg.organization}
                        onChange={(e) => setNewReg({ ...newReg, organization: e.target.value, affiliation: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                        Phone Number *
                      </label>
                      <input
                        required
                        placeholder="+966 50 000 0000"
                        value={newReg.phone}
                        onChange={(e) => setNewReg({ ...newReg, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                        {newReg.registrationType === 'abstract' ? 'Address / Campus *' : 'Physical Address'}
                      </label>
                      <input
                        required={newReg.registrationType === 'abstract'}
                        placeholder="City, Department / Campus"
                        value={newReg.address}
                        onChange={(e) => setNewReg({ ...newReg, address: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                        Job Title
                      </label>
                      <input
                        placeholder="Position / Title"
                        value={newReg.jobTitle}
                        onChange={(e) => setNewReg({ ...newReg, jobTitle: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                  </div>

                  {/* Exhibitor Specific Fields */}
                  {newReg.registrationType === 'exhibitor' && (
                    <div className="detail-section" style={{ marginBottom: '14px' }}>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--primary)' }}>Exhibitor & Package Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Sponsorship Package *</label>
                          <select
                            required
                            value={newReg.packageId}
                            onChange={(e) => setNewReg({ ...newReg, packageId: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                          >
                            <option value="">Select Package</option>
                            {packages.map((p) => (
                              <option value={p.id} key={p.id}>{p.name} ({Number(p.price).toLocaleString()} SAR)</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Booth Allocation</label>
                          <select
                            value={newReg.boothNo}
                            onChange={(e) => setNewReg({ ...newReg, boothNo: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                          >
                            <option value="">Select Booth (Optional)</option>
                            {booths.map((b) => (
                              <option value={b.booth_no} key={b.id} disabled={b.status === 'reserved' || b.status === 'occupied'}>
                                {b.booth_no} ({b.width_m}m × {b.depth_m}m) {b.status === 'reserved' || b.status === 'occupied' ? '- Reserved' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Payment Method *</label>
                          <select
                            value={newReg.paymentMethod}
                            onChange={(e) => setNewReg({ ...newReg, paymentMethod: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                          >
                            <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                            <option value="Corporate Cheque">Corporate Cheque</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Cash / Direct Deposit">Cash / Direct Deposit</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Payment Reference Number *</label>
                          <input
                            placeholder="e.g. WIRE-849201"
                            value={newReg.paymentRef}
                            onChange={(e) => setNewReg({ ...newReg, paymentRef: e.target.value })}
                            style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Billing Contact</label>
                        <input
                          placeholder="Billing Contact / Email"
                          value={newReg.billingContact}
                          onChange={(e) => setNewReg({ ...newReg, billingContact: e.target.value })}
                          style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Abstract Specific Fields */}
                  {newReg.registrationType === 'abstract' && (
                    <div className="detail-section" style={{ marginBottom: '14px' }}>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--primary)' }}>Research Submission Details</h4>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Research Paper Title *</label>
                        <input
                          required
                          placeholder="Title of scientific paper"
                          value={newReg.abstractTitle}
                          onChange={(e) => setNewReg({ ...newReg, abstractTitle: e.target.value })}
                          style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                        />
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Abstract Text (Max 300 words) *</label>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: offlineAbstractWordCount > 300 ? '#e53e3e' : 'var(--teal)' }}>
                            {offlineAbstractWordCount} / 300 words
                          </span>
                        </div>
                        <textarea
                          required
                          rows={4}
                          placeholder="Complete abstract summary..."
                          value={newReg.abstractText}
                          onChange={(e) => setNewReg({ ...newReg, abstractText: e.target.value })}
                          style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A', lineHeight: '1.5' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Attachment File Name</label>
                        <input
                          placeholder="e.g. kaust_green_energy_paper.pdf"
                          value={newReg.attachmentName}
                          onChange={(e) => setNewReg({ ...newReg, attachmentName: e.target.value })}
                          style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Initial Status</label>
                      <select
                        value={newReg.status}
                        onChange={(e) => setNewReg({ ...newReg, status: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      >
                        {newReg.registrationType === 'abstract' ? (
                          <>
                            <option value="pending_review">Pending Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </>
                        ) : (
                          <>
                            <option value="confirmed">Confirmed</option>
                            {newReg.registrationType === 'exhibitor' && <option value="pending_payment">Pending Payment</option>}
                            <option value="cancelled">Cancelled</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Internal Notes</label>
                      <input
                        placeholder="Remarks or offline notes..."
                        value={newReg.notes}
                        onChange={(e) => setNewReg({ ...newReg, notes: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button type="button" className="ghost darktext small" onClick={() => setShowAddRegModal(false)}>Cancel</button>
                    <button type="submit" className="btn small">Save Record</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ADD USER ACCOUNT MODAL (Super Admin Only) */}
          {showAddUserModal && role === 'superadmin' && (
            <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '480px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>Create User Account</h3>
                  <button onClick={() => setShowAddUserModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleCreateUser}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Full Name *</label>
                    <input required value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }} />
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Email Address *</label>
                    <input required type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }} />
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Password *</label>
                    <input required type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }} />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Role</label>
                    <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}>
                      <option value="research_manager">Research Director (Abstracts only)</option>
                      <option value="event_manager">Event Operations (Visitors & Exhibitors)</option>
                      <option value="superadmin">Administrator (Full Access)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" className="ghost darktext small" onClick={() => setShowAddUserModal(false)}>Cancel</button>
                    <button type="submit" className="btn small">Create Account</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* RESET PASSWORD MODAL */}
          {showResetPasswordModal && role === 'superadmin' && (
            <div className="modal-overlay" onClick={() => setShowResetPasswordModal(null)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '440px' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '8px' }}>Reset Staff Password</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                  Set a new password for <strong>{showResetPasswordModal.full_name || showResetPasswordModal.email}</strong>.
                </p>
                <form onSubmit={handleResetPassword}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>New Password *</label>
                    <input
                      required
                      name="newPassword"
                      type="text"
                      placeholder="At least 6 characters"
                      style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A', fontFamily: 'monospace', fontWeight: 700 }}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      Deliver Password To Email
                    </label>
                    <input
                      name="sendToEmail"
                      type="email"
                      defaultValue={showResetPasswordModal.email}
                      style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A' }}
                    />
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Credentials will be emailed via SMTP from <code>ewainnovationvr1@gmail.com</code>.
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" className="ghost darktext small" onClick={() => setShowResetPasswordModal(null)}>Cancel</button>
                    <button type="submit" className="btn small">Update & Email Password</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* GROUP EMAIL MODAL (Live SMTP Broadcast Engine) */}
          {showEmailGroupModal && (
            <div className="modal-overlay" onClick={() => !sendingBroadcast && setShowEmailGroupModal(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                  <div>
                    <span className="eyebrow eyebrow-pill">SMTP BROADCAST</span>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginTop: '4px' }}>
                      Send Group Announcement Email
                    </h3>
                  </div>
                  <button disabled={sendingBroadcast} onClick={() => setShowEmailGroupModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSendBroadcast}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Target Audience *</label>
                    <select
                      name="targetGroup"
                      defaultValue={selectedIds.length > 0 ? 'selected' : 'all'}
                      style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A', fontSize: '0.88rem' }}
                    >
                      {selectedIds.length > 0 && (
                        <option value="selected">Currently Selected Rows ({selectedIds.length} recipients)</option>
                      )}
                      <option value="all">All Registered Attendees (Entire Conference)</option>
                      <option value="visitors">All Visitors Only</option>
                      <option value="exhibitors">All Exhibitor Companies</option>
                      <option value="abstracts">All Research Authors / Presenters</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Subject *</label>
                    <input
                      required
                      name="broadcastSubject"
                      defaultValue="Important Update: EWACON 2026 Conference Notice"
                      style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ marginBottom: '22px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Message Body *</label>
                    <textarea
                      required
                      name="broadcastMessage"
                      rows={6}
                      defaultValue="Dear Participant,&#10;&#10;We look forward to welcoming you to the Energy & Water Academy (EWA Rabigh) on 22 December 2026.&#10;&#10;Please ensure you have your confirmed badge ready upon arrival.&#10;&#10;Best regards,&#10;EWACON 2026 Organizing Committee"
                      style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fff', color: '#071B2A', fontSize: '0.88rem', lineHeight: '1.5' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      Emails will be dispatched via Gmail SMTP from <code>ewainnovationvr1@gmail.com</code> with official EWACON 2026 branding.
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" disabled={sendingBroadcast} className="ghost darktext small" onClick={() => setShowEmailGroupModal(false)}>Cancel</button>
                    <button type="submit" disabled={sendingBroadcast} className="btn small" style={{ minWidth: '150px' }}>
                      {sendingBroadcast ? (
                        <>
                          <RefreshCw size={14} className="spin" style={{ display: 'inline', marginInlineEnd: '6px' }} />
                          Sending via SMTP...
                        </>
                      ) : (
                        <>
                          <Send size={14} style={{ display: 'inline', marginInlineEnd: '6px' }} />
                          Dispatch Broadcast Email
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}

// Language Provider & Router
function AppWrapper() {
  const [lang, setLang] = useState(() => localStorage.getItem('ewacon_lang') || 'ar');

  useEffect(() => {
    localStorage.setItem('ewacon_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: TRANSLATIONS[lang]
  };

  return (
    <LanguageContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exhibition" element={<ExhibitionPage />} />
          <Route path="/sponsorship" element={<ExhibitionPage />} />
          <Route path="/abstracts" element={<AbstractPage />} />
          <Route path="/admin/login" element={<AdminPanel />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(<AppWrapper />);
