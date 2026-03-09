import type { ServiceType } from "@/lib/types";
import { AR } from "@/lib/ar";

export type Locale = "ar" | "en" | "tr";

export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALES: Locale[] = ["ar", "en", "tr"];
export const LOCALE_COOKIE = "esun_locale";
export const LOCALE_STORAGE_KEY = "esun_locale";

const ar = {
  ...AR,
  nav: {
    ...AR.nav,
    events: AR.admin.events,
  },
  serviceModal: {
    ...AR.serviceModal,
    genericError: "حدث خطأ ما.",
  },
  community: {
    ...AR.community,
    teaser:
      "يمكنك متابعة حساب إنستغرام للحصول على أحدث التحديثات والفعاليات.",
  },
  contact: {
    ...AR.contact,
    signedInHint:
      "أنت مسجل دخول. سيتم استخدام بياناتك من الملف الشخصي تلقائياً.",
    useProfile: "اكتب رسالتك فقط وسنتولى الباقي.",
  },
  gpa: {
    ...AR.gpa,
    backHome: "← الرئيسية",
  },
  dashboard: {
    ...AR.dashboard,
    pageTitle: "ملفي الشخصي",
    backHome: "← الرئيسية",
    unionSubtitle: "اتحاد الطلاب المصريين · جامعة نيشان تاشي",
  },
  events: {
    title: "الفعاليات القادمة",
    subtitle: "شارك في فعاليات الاتحاد القادمة واحجز مقعدك مبكراً.",
    empty: "لا توجد فعاليات قادمة حالياً.",
    registerNow: "سجل الآن",
    comingSoon: "قريباً",
  },
  footer: {
    title: "تواصل معنا",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    emailForm: "البريد الإلكتروني",
    whatsappPrefill: "مرحباً، أود التواصل مع اتحاد الطلاب المصريين في نيشان تاشي.",
  },
  language: {
    label: "اللغة",
    switchAria: "تغيير اللغة",
    ar: "العربية",
    en: "English",
    tr: "Türkçe",
  },
  auth: {
    ...AR.auth,
    domainError: "هذا النطاق البريدي غير مسموح للوصول للأعضاء.",
    authFailed: "فشلت المصادقة. يرجى المحاولة مرة أخرى.",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    configError: "Supabase غير مهيأ. أضف القيم الصحيحة في .env.local.",
    signupFailed: "فشل إنشاء الحساب. حاول مرة أخرى.",
  },
} as const;

type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? ReadonlyArray<DeepWiden<U>>
        : { [K in keyof T]: DeepWiden<T[K]> };

export type AppCopy = DeepWiden<typeof ar>;

const en: AppCopy = {
  siteName: "Egyptian Students Union",
  siteSubtitle: "Nisantasi University",
  nav: {
    ourStory: "Our Story",
    services: "Services",
    gpaCalculator: "GPA Calculator",
    library: "Library",
    community: "Community",
    contact: "Contact",
    logIn: "Log In",
    joinUnion: "Join Union",
    dashboard: "Dashboard",
    logOut: "Log Out",
    events: "Events",
  },
  hero: {
    title: "Egyptian Students Union",
    subtitle: "Nisantasi University",
    cta: "Join the Union",
  },
  ourStory: {
    title: "Our Story",
    mission: "Mission",
    missionText:
      "To represent, support, and unite Egyptian students at Nisantasi University through academic support, cultural activities, and trusted guidance.",
    vision: "Vision",
    visionText:
      "A strong, confident community where every Egyptian student feels supported and connected.",
    historyTitle: "Three-Year Journey",
    historyShort:
      "The union was founded more than three years ago by Egyptian students at Nisantasi University who saw the need for a dedicated union. Since then, it has grown into a recognized body",
    historyFull:
      "The union was founded more than three years ago by Egyptian students at Nisantasi University who saw the need for a dedicated union. Since then, it has grown into a recognized body offering academic support, cultural events, and religious and social guidance. Our leadership works closely with the university and local communities to ensure members have the resources they need to succeed. We continue to expand our services and events every year.",
    readMore: "Read More",
    showLess: "Show Less",
  },
  services: {
    title: "Student Service Hub",
    subtitle:
      "Request support in one of the following areas. Every request is reviewed by the union team.",
    applyNow: "Apply Now",
    academicSupport: "Academic Support",
    culturalActivities: "Cultural Activities",
    religiousSocialGuidance: "New Student Guidance",
    academicSupportDesc:
      "We provide complete academic support for Egyptian students at Nisantasi University, including tutoring, study materials, exam preparation, and one-on-one advising.",
    culturalActivitiesDesc:
      "We build a vibrant student community through cultural events, trips, and activities that reflect Egyptian culture and strengthen student connections.",
    religiousSocialGuidanceDesc:
      "We support your first steps at university, from understanding campus systems to handling academic and daily-life procedures.",
  },
  serviceModal: {
    title: "Service Request -",
    signedInHint:
      "You are signed in. We will use your profile data automatically, just describe your request.",
    name: "Name",
    namePlaceholder: "Full name",
    studentId: "Student Number",
    studentIdPlaceholder: "20232022109",
    issue: "Issue / Request",
    issuePlaceholder: "Describe your issue or request...",
    cancel: "Cancel",
    submit: "Submit",
    submitting: "Submitting...",
    errorName: "Please enter your name.",
    errorStudentId:
      "Student number must be exactly 11 digits (example: 20232022109).",
    errorIssue: "Please describe your issue or request.",
    genericError: "Something went wrong.",
  },
  community: {
    title: "Community",
    subtitle:
      "Follow us on Instagram for events, updates, and community moments.",
    visitProfile: "Visit Profile",
    instagramHandle: "esu.nisantasi",
    teaser:
      "You can embed the Instagram feed here or sync it via API. For now, use our profile button for latest updates.",
  },
  contact: {
    title: "Contact",
    subtitle: "Istanbul, Turkiye. Send us a message and we will get back to you.",
    name: "Name",
    phone: "Phone Number",
    message: "Message",
    sendMessage: "Send Message",
    sending: "Sending...",
    sent: "Your message has been sent.",
    error: "Failed to send message. Please try again.",
    signedInHint:
      "You are signed in. We will use your name and phone number from your profile.",
    useProfile: "Only write your message and submit.",
  },
  joinForm: {
    title: "Join the Union",
    subtitle:
      "Create an account with your Nisantasi University email to access the member portal and services.",
    goToRegistration: "Go to Registration",
  },
  gpa: {
    title: "GPA Calculator",
    subtitle: "Enter courses, credits, and grades to calculate your GPA.",
    courseName: "Course Name",
    credits: "Credits",
    grade: "Grade",
    addCourse: "Add Course",
    remove: "Remove",
    totalGPA: "Total GPA",
    totalCredits: "Total Credits",
    placeholderCourse: "Example: Mathematics",
    backHome: "← Home",
  },
  library: {
    title: "Library",
    subtitle: "Union and community resources with an Instagram-style feed.",
    generalCategory: "General Resource",
    authorLabel: "Author",
    noDescription: "No description is available for this resource yet.",
    openResource: "Open Resource",
    comingSoon: "Coming Soon",
    viewPost: "View",
    likes: "Likes",
    noPosts: "No library resources are available right now.",
  },
  auth: {
    loginTitle: "Log In",
    loginSubtitle: "Use any valid email address.",
    signupTitle: "Join the Union",
    signupSubtitle: "Sign up with any valid email address.",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    studentNumber: "Student Number",
    phoneNumber: "Phone Number",
    signIn: "Log In",
    signingIn: "Signing in...",
    signUp: "Create Account",
    creatingAccount: "Creating account...",
    checkEmail: "Check your email",
    checkEmailText: "We sent a confirmation link to",
    goToLogin: "Go to Login",
    alreadyHaveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    backToHome: "← Back to Home",
    emailError: "Please enter a valid email address.",
    studentIdError:
      "Student number must be exactly 11 digits (example: 20232022109).",
    phoneError:
      "Please enter a valid phone number (10-15 digits with optional +).",
    domainError: "This email domain is not allowed for member access.",
    authFailed: "Authentication failed. Please try again.",
    invalidCredentials: "Invalid email or password.",
    configError: "Supabase is not configured. Add valid values in .env.local.",
    signupFailed: "Sign up failed. Please try again.",
  },
  dashboard: {
    title: "Member Dashboard",
    profile: "Profile",
    name: "Name",
    studentNumber: "Student Number",
    phoneNumber: "Phone Number",
    email: "Email",
    unionCard: "Digital Union Card",
    member: "Member",
    statusTracker: "Request Tracker",
    statusTrackerSub: "Status of your service requests.",
    noApplications: "No requests yet.",
    pending: "Pending",
    inProgress: "In Progress",
    resolved: "Resolved",
    pageTitle: "My Dashboard",
    backHome: "← Home",
    unionSubtitle: "Egyptian Students Union · Nisantasi University",
  },
  admin: {
    title: "Union Admin",
    applications: "Applications",
    events: "Events",
    manageRequests: "Manage service requests.",
  },
  grades: [...AR.grades],
  events: {
    title: "Upcoming Events",
    subtitle: "Join upcoming union events and reserve your spot early.",
    empty: "No upcoming events at the moment.",
    registerNow: "Register Now",
    comingSoon: "Coming Soon",
  },
  footer: {
    title: "Contact Us",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    emailForm: "Email",
    whatsappPrefill:
      "Hello, I would like to contact the Egyptian Students Union at Nisantasi.",
  },
  language: {
    label: "Language",
    switchAria: "Switch language",
    ar: "Arabic",
    en: "English",
    tr: "Turkish",
  },
};

const tr: AppCopy = {
  siteName: "Misirli Ogrenciler Birligi",
  siteSubtitle: "Nisantasi Universitesi",
  nav: {
    ourStory: "Hikayemiz",
    services: "Hizmetler",
    gpaCalculator: "Not Ortalamasi",
    library: "Kutuphane",
    community: "Topluluk",
    contact: "Iletisim",
    logIn: "Giris Yap",
    joinUnion: "Birlige Katil",
    dashboard: "Panel",
    logOut: "Cikis Yap",
    events: "Etkinlikler",
  },
  hero: {
    title: "Misirli Ogrenciler Birligi",
    subtitle: "Nisantasi Universitesi",
    cta: "Birlige Katil",
  },
  ourStory: {
    title: "Hikayemiz",
    mission: "Misyon",
    missionText:
      "Nisantasi Universitesindeki Misirli ogrencileri akademik destek, kulturel etkinlikler ve guvenilir rehberlik ile temsil etmek, desteklemek ve birlestirmek.",
    vision: "Vizyon",
    visionText:
      "Her Misirli ogrencinin desteklendigini ve bagli oldugunu hissettigi guclu bir topluluk.",
    historyTitle: "Uc Yillik Yolculuk",
    historyShort:
      "Birlik, Nisantasi Universitesindeki Misirli ogrenciler tarafindan uc yildan uzun sure once ozel bir birlik ihtiyaciyla kuruldu. O gunden beri taninan bir yapiya donustu",
    historyFull:
      "Birlik, Nisantasi Universitesindeki Misirli ogrenciler tarafindan uc yildan uzun sure once ozel bir birlik ihtiyaciyla kuruldu. O gunden beri akademik destek, kulturel etkinlikler ve dini-sosyal rehberlik sunan taninan bir yapiya donustu. Liderligimiz, uyelerin basari icin ihtiyac duydugu kaynaklara ulasmasi icin universite ve yerel topluluklarla yakin calisir. Her yil hizmet ve etkinliklerimizi genisletiyoruz.",
    readMore: "Devamini Oku",
    showLess: "Daha Az Goster",
  },
  services: {
    title: "Ogrenci Hizmet Merkezi",
    subtitle:
      "Asagidaki alanlardan birinde destek talep edin. Her talep birlik ekibi tarafindan incelenir.",
    applyNow: "Basvur",
    academicSupport: "Akademik Destek",
    culturalActivities: "Kulturel Etkinlikler",
    religiousSocialGuidance: "Yeni Ogrenci Rehberligi",
    academicSupportDesc:
      "Nisantasi Universitesindeki Misirli ogrencilere ozel ders, calisma materyalleri, sinav hazirligi ve birebir danismanlik dahil kapsamli akademik destek sagliyoruz.",
    culturalActivitiesDesc:
      "Misir kulturunu yansitan etkinlikler, geziler ve aktivitelerle canli bir ogrenci toplulugu olusturuyoruz.",
    religiousSocialGuidanceDesc:
      "Universitedeki ilk adimlarinizda, kampus sistemi tanitimi ve akademik/gunluk islemler dahil size rehberlik ediyoruz.",
  },
  serviceModal: {
    title: "Hizmet Talebi -",
    signedInHint:
      "Giris yaptiniz. Profil bilgileriniz otomatik kullanilacak, sadece talebinizi yazin.",
    name: "Ad Soyad",
    namePlaceholder: "Ad soyad",
    studentId: "Ogrenci Numarasi",
    studentIdPlaceholder: "20232022109",
    issue: "Sorun / Talep",
    issuePlaceholder: "Sorununuzu veya talebinizi yazin...",
    cancel: "Iptal",
    submit: "Gonder",
    submitting: "Gonderiliyor...",
    errorName: "Lutfen adinizi girin.",
    errorStudentId:
      "Ogrenci numarasi tam 11 hane olmali (ornek: 20232022109).",
    errorIssue: "Lutfen sorununuzu veya talebinizi yazin.",
    genericError: "Bir hata olustu.",
  },
  community: {
    title: "Topluluk",
    subtitle:
      "Etkinlikler, guncellemeler ve topluluk anlari icin bizi Instagram'da takip edin.",
    visitProfile: "Profili Ziyaret Et",
    instagramHandle: "esu.nisantasi",
    teaser:
      "Instagram akisi buraya gomulebilir veya API ile senkronize edilebilir. Simdilik en guncel paylasimlar icin profil tusunu kullanin.",
  },
  contact: {
    title: "Iletisim",
    subtitle: "Istanbul, Turkiye. Bize mesaj gonderin, size donelim.",
    name: "Ad Soyad",
    phone: "Telefon",
    message: "Mesaj",
    sendMessage: "Mesaj Gonder",
    sending: "Gonderiliyor...",
    sent: "Mesajiniz gonderildi.",
    error: "Mesaj gonderilemedi. Lutfen tekrar deneyin.",
    signedInHint:
      "Giris yaptiniz. Ad ve telefon bilginiz profilinizden otomatik alinacak.",
    useProfile: "Sadece mesajinizi yazip gonderin.",
  },
  joinForm: {
    title: "Birlige Katil",
    subtitle:
      "Uye paneli ve hizmetlere erismek icin Nisantasi Universitesi e-postanizla hesap olusturun.",
    goToRegistration: "Kayda Git",
  },
  gpa: {
    title: "Not Ortalamasi Hesaplayici",
    subtitle: "Ortalamanizi hesaplamak icin ders, kredi ve not bilgilerini girin.",
    courseName: "Ders Adi",
    credits: "Kredi",
    grade: "Not",
    addCourse: "Ders Ekle",
    remove: "Kaldir",
    totalGPA: "Genel Ortalama",
    totalCredits: "Toplam Kredi",
    placeholderCourse: "Ornek: Matematik",
    backHome: "← Ana Sayfa",
  },
  library: {
    title: "Kutuphane",
    subtitle: "Birlik ve topluluk icerikleri Instagram tarzinda gorunumle.",
    generalCategory: "Genel Kaynak",
    authorLabel: "Yazar",
    noDescription: "Bu kaynak icin henuz aciklama yok.",
    openResource: "Kaynagi Ac",
    comingSoon: "Yakininda",
    viewPost: "Goruntule",
    likes: "Begeni",
    noPosts: "Su anda kutuphane kaynagi bulunmuyor.",
  },
  auth: {
    loginTitle: "Giris Yap",
    loginSubtitle: "Gecerli bir e-posta adresi kullanin.",
    signupTitle: "Birlige Katil",
    signupSubtitle: "Gecerli bir e-posta adresi ile kayit olun.",
    email: "E-posta",
    password: "Sifre",
    fullName: "Ad Soyad",
    studentNumber: "Ogrenci Numarasi",
    phoneNumber: "Telefon",
    signIn: "Giris Yap",
    signingIn: "Giris yapiliyor...",
    signUp: "Hesap Olustur",
    creatingAccount: "Hesap olusturuluyor...",
    checkEmail: "E-postanizi kontrol edin",
    checkEmailText: "Dogrulama baglantisi su adrese gonderildi:",
    goToLogin: "Girise Git",
    alreadyHaveAccount: "Zaten hesabin var mi?",
    noAccount: "Hesabin yok mu?",
    backToHome: "← Ana Sayfaya Don",
    emailError: "Lutfen gecerli bir e-posta adresi girin.",
    studentIdError:
      "Ogrenci numarasi tam 11 hane olmali (ornek: 20232022109).",
    phoneError:
      "Lutfen gecerli bir telefon numarasi girin (10-15 hane, + istege bagli).",
    domainError: "Bu e-posta alani uye erisimi icin uygun degil.",
    authFailed: "Kimlik dogrulama basarisiz. Lutfen tekrar deneyin.",
    invalidCredentials: "E-posta veya sifre hatali.",
    configError: "Supabase yapilandirilmamis. .env.local dosyasini kontrol edin.",
    signupFailed: "Kayit basarisiz. Lutfen tekrar deneyin.",
  },
  dashboard: {
    title: "Uye Paneli",
    profile: "Profil",
    name: "Ad Soyad",
    studentNumber: "Ogrenci Numarasi",
    phoneNumber: "Telefon",
    email: "E-posta",
    unionCard: "Dijital Birlik Karti",
    member: "Uye",
    statusTracker: "Talep Takibi",
    statusTrackerSub: "Hizmet taleplerinizin durumu.",
    noApplications: "Henuz talep yok.",
    pending: "Beklemede",
    inProgress: "Islemde",
    resolved: "Cozuldu",
    pageTitle: "Panelim",
    backHome: "← Ana Sayfa",
    unionSubtitle: "Misirli Ogrenciler Birligi · Nisantasi Universitesi",
  },
  admin: {
    title: "Birlik Yonetimi",
    applications: "Basvurular",
    events: "Etkinlikler",
    manageRequests: "Hizmet taleplerini yonetin.",
  },
  grades: [...AR.grades],
  events: {
    title: "Yaklasan Etkinlikler",
    subtitle:
      "Yaklasan birlik etkinliklerine katilin ve yerinizi erken ayirtin.",
    empty: "Su anda yaklasan etkinlik yok.",
    registerNow: "Simdi Kayit Ol",
    comingSoon: "Yakininda",
  },
  footer: {
    title: "Bize Ulasin",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    emailForm: "E-posta",
    whatsappPrefill:
      "Merhaba, Nisantasi Misirli Ogrenciler Birligi ile iletisime gecmek istiyorum.",
  },
  language: {
    label: "Dil",
    switchAria: "Dili degistir",
    ar: "Arapca",
    en: "Ingilizce",
    tr: "Turkce",
  },
};

export const COPY: Record<Locale, AppCopy> = {
  ar,
  en,
  tr,
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "ar" || value === "en" || value === "tr";
}

export function getDir(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getCopy(locale: Locale): AppCopy {
  return COPY[locale];
}

export function getLocaleTag(locale: Locale) {
  if (locale === "ar") return "ar-EG";
  if (locale === "tr") return "tr-TR";
  return "en-GB";
}

export function getServiceLabels(copy: AppCopy): Record<ServiceType, string> {
  return {
    academic_support: copy.services.academicSupport,
    cultural_activities: copy.services.culturalActivities,
    religious_social_guidance: copy.services.religiousSocialGuidance,
  };
}
