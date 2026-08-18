export interface QuickReplyOption {
  id: string;
  label: string;
  flowId?: string;       // Target scenario flow ID
  action?: 'link' | 'flow' | 'reset';
  path?: string;         // Internal route path
}

export interface ChatNode {
  id: string;
  title: string;
  message: string;
  quickReplies: QuickReplyOption[];
}

export const CHAT_FLOWS: Record<string, ChatNode> = {
  mainMenu: {
    id: 'mainMenu',
    title: 'القائمة الرئيسية',
    message: 'مرحبًا بكم.\nكيف يمكننا مساعدتكم؟',
    quickReplies: [
      { id: 'm_apply', label: 'تقديم طلب مساعدة', flowId: 'apply' },
      { id: 'm_track', label: 'متابعة الطلب', flowId: 'track' },
      { id: 'm_programs', label: 'البرامج والمبادرات', flowId: 'programs' },
      { id: 'm_faq', label: 'الأسئلة الشائعة', flowId: 'faq' },
      { id: 'm_complaints', label: 'مكتب الشكاوى', flowId: 'complaints' },
      { id: 'm_contact', label: 'تواصل معنا', flowId: 'contact' },
    ],
  },

  apply: {
    id: 'apply',
    title: 'تقديم طلب مساعدة',
    message: 'يمكنكم تقديم طلب المساعدة من خلال النموذج الإلكتروني المخصص، ثم متابعة حالة الطلب من خلال صفحة المتابعة.',
    quickReplies: [
      { id: 'a_link', label: 'تقديم طلب مساعدة', action: 'link', path: '/apply' },
      { id: 'a_main', label: 'الرجوع للقائمة الرئيسية', flowId: 'mainMenu' },
    ],
  },

  track: {
    id: 'track',
    title: 'متابعة الطلب',
    message: 'يمكنكم متابعة حالة طلبكم من خلال صفحة متابعة الطلب باستخدام البيانات المطلوبة.',
    quickReplies: [
      { id: 't_link', label: 'متابعة الطلب', action: 'link', path: '/track' },
      { id: 't_main', label: 'الرجوع للقائمة الرئيسية', flowId: 'mainMenu' },
    ],
  },

  programs: {
    id: 'programs',
    title: 'البرامج والمبادرات',
    message: 'يمكنكم الاطلاع على خدمات وبرامج ومشاريع مؤسسة الوليد للإنسانية عبر الأقسام الرسمية المتاحة:',
    quickReplies: [
      { id: 'p_programs', label: 'برامج المؤسسة', action: 'link', path: '/programs' },
      { id: 'p_initiatives', label: 'المبادرات', action: 'link', path: '/programs' },
      { id: 'p_projects', label: 'المشاريع', action: 'link', path: '/projects' },
      { id: 'p_news', label: 'الأخبار', action: 'link', path: '/news' },
      { id: 'p_main', label: 'الرجوع للقائمة الرئيسية', flowId: 'mainMenu' },
    ],
  },

  faq: {
    id: 'faq',
    title: 'الأسئلة الشائعة',
    message: 'يمكنكم الاطلاع على أبرز الأسئلة والإجابات المتعلقة بخدمات المؤسسة وطلبات المساعدة.',
    quickReplies: [
      { id: 'f_q1', label: 'كيف يمكنني تقديم طلب؟', flowId: 'faq_apply' },
      { id: 'f_q2', label: 'كيف أتابع طلبي؟', flowId: 'faq_track' },
      { id: 'f_q3', label: 'كيف أتواصل مع المؤسسة؟', flowId: 'faq_contact' },
      { id: 'f_q4', label: 'كيف أقدم شكوى؟', flowId: 'faq_complaint' },
      { id: 'f_q5', label: 'أين أجد معلومات البرامج؟', flowId: 'faq_programs' },
      { id: 'f_page', label: 'الأسئلة الشائعة', action: 'link', path: '/faq' },
      { id: 'f_main', label: 'الرجوع للقائمة الرئيسية', flowId: 'mainMenu' },
    ],
  },

  faq_apply: {
    id: 'faq_apply',
    title: 'كيف يمكنني تقديم طلب؟',
    message: 'تتيح المؤسسة تقديم طلب المساعدة إلكترونيًا عبر نموذج التقديم المخصص وإرفاق البيانات والمستندات المطلوبة مباشرة.',
    quickReplies: [
      { id: 'fa_link', label: 'تقديم طلب مساعدة', action: 'link', path: '/apply' },
      { id: 'fa_main', label: 'الرجوع للقائمة الرئيسية', flowId: 'mainMenu' },
    ],
  },

  faq_track: {
    id: 'faq_track',
    title: 'كيف أتابع طلبي؟',
    message: 'يمكنكم الاستعلام عن حالة طلبكم المرفوع باستخدام البيانات المطلوبة مثل رقم الهوية الوطنية أو رقم الطلب المرجعي.',
    quickReplies: [
      { id: 'ft_link', label: 'متابعة الطلب', action: 'link', path: '/track' },
      { id: 'ft_main', label: 'الرجوع للقائمة الرئيسية', flowId: 'mainMenu' },
    ],
  },

  faq_contact: {
    id: 'faq_contact',
    title: 'كيف أتواصل مع المؤسسة؟',
    message: 'يسعدنا تواصلكم معنا عبر قنوات التواصل الرسمية المتاحة في صفحة اتصل بنا أو عبر الأرقام الرسمية.',
    quickReplies: [
      { id: 'fc_link', label: 'صفحة التواصل', action: 'link', path: '/contact' },
      { id: 'fc_main', label: 'الرجوع للقائمة الرئيسية', flowId: 'mainMenu' },
    ],
  },

  faq_complaint: {
    id: 'faq_complaint',
    title: 'كيف أقدم شكوى؟',
    message: 'يمكنكم رفع الملاحظات أو البلاغات من خلال مكتب الشكاوى، حيث يتم مراجعة جميع الواردات بمهنية واهتمام.',
    quickReplies: [
      { id: 'fcm_link', label: 'تقديم شكوى', action: 'link', path: '/contact' },
      { id: 'fcm_main', label: 'الرجوع للقائمة الرئيسية', flowId: 'mainMenu' },
    ],
  },

  faq_programs: {
    id: 'faq_programs',
    title: 'أين أجد معلومات البرامج؟',
    message: 'يمكنكم الاطلاع على التفاصيل الكاملة وشروط ومعايير البرامج التنموية والإنسانية عبر صفحة البرامج والمبادرات.',
    quickReplies: [
      { id: 'fp_link', label: 'البرامج والمبادرات', action: 'link', path: '/programs' },
      { id: 'fp_main', label: 'الرجوع للقائمة الرئيسية', flowId: 'mainMenu' },
    ],
  },

  complaints: {
    id: 'complaints',
    title: 'مكتب الشكاوى',
    message: 'يمكنكم تقديم شكوى أو ملاحظة من خلال مكتب الشكاوى، حيث يتم استقبال البلاغات ومراجعتها وفق الإجراءات المعتمدة.',
    quickReplies: [
      { id: 'c_sub', label: 'تقديم شكوى', action: 'link', path: '/contact' },
      { id: 'c_track', label: 'متابعة شكوى', action: 'link', path: '/track' },
      { id: 'c_main', label: 'الرجوع للقائمة الرئيسية', flowId: 'mainMenu' },
    ],
  },

  contact: {
    id: 'contact',
    title: 'تواصل معنا',
    message: 'يسعدنا تواصلكم معنا. يمكنكم الوصول إلى قنوات التواصل الرسمية من خلال صفحة التواصل.',
    quickReplies: [
      { id: 'ct_link', label: 'صفحة التواصل', action: 'link', path: '/contact' },
      { id: 'ct_main', label: 'الرجوع للقائمة الرئيسية', flowId: 'mainMenu' },
    ],
  },
};

// Keyword Matching Rule Engine (Pure Static / Rule-Based / No External AI)
export function matchUserQueryToFlow(query: string): { flowNode: ChatNode; customText?: string } {
  const q = query.trim().toLowerCase();

  // Keyword intents check
  if (['شكوى', 'شكاوي', 'بلاغ', 'ملاحظة', 'اعتراض'].some(k => q.includes(k))) {
    return { flowNode: CHAT_FLOWS.complaints };
  }

  if (['متابعة', 'حالة', 'استعلام', 'تتبع', 'رقم الطلب', 'نتيجة'].some(k => q.includes(k))) {
    return { flowNode: CHAT_FLOWS.track };
  }

  if (['طلب', 'تقديم', 'تقديم طلب', 'اقدم', 'مساعدة', 'استمارة', 'نموذج', 'تسجيل'].some(k => q.includes(k))) {
    return { flowNode: CHAT_FLOWS.apply };
  }

  if (['برنامج', 'برامج', 'مبادرة', 'مبادرات', 'مشروع', 'مشاريع', 'أخبار', 'اخبار', 'سكن', 'مركبة'].some(k => q.includes(k))) {
    return { flowNode: CHAT_FLOWS.programs };
  }

  if (['تواصل', 'اتصال', 'هاتف', 'رقم', 'بريد', 'عنوان', 'موقع'].some(k => q.includes(k))) {
    return { flowNode: CHAT_FLOWS.contact };
  }

  if (['سؤال', 'أسئلة', 'اسئلة', 'استفسار', 'شروط', 'معايير', 'كيف'].some(k => q.includes(k))) {
    return { flowNode: CHAT_FLOWS.faq };
  }

  // Fallback Rule if no keyword matches
  return {
    flowNode: CHAT_FLOWS.mainMenu,
    customText: 'نعتذر، لم نتمكن من تحديد الخدمة المطلوبة. يمكنكم اختيار إحدى الخدمات التالية:',
  };
}

