/**
 * Populate the database with ALL editable website content.
 *
 *   npm run db:seed:settings          # fill in anything missing
 *   npm run db:seed:settings -- --force   # overwrite everything back to these values
 *
 * The public site reads content only from these rows — nothing is hard-coded in
 * the page files any more. A key with no row (or a blank value) means that
 * element or section simply does not render.
 *
 * Two groups are written:
 *   1. Every key in `settingPages` (src/lib/settings.ts)
 *   2. Every `label.*` row backing the interface labels (src/lib/labels.ts)
 *
 * The script fails loudly if a value here does not match a real registry key,
 * or if a registry key has no value here — so the two can never drift apart.
 */
import { PrismaClient } from "@prisma/client";
import { allSettingDefs } from "../src/lib/settings";
import { allLabelDefs } from "../src/lib/labels";
import { dictionaries } from "../src/lib/dictionaries";

const prisma = new PrismaClient();
const FORCE = process.argv.includes("--force");

type Val = { en: string; si?: string; ta?: string };

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1707409066859-a90674383d19?auto=format&fit=crop&w=1800&q=80";
const COMMUNITY_IMAGE =
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80";

/** Shorthand for the many on/off switches. */
const ON: Val = { en: "1" };
/** Deliberately empty — the admin fills these in with their own material. */
const BLANK: Val = { en: "" };

const VIEW_ALL: Val = { en: "View All", si: "සියල්ල බලන්න", ta: "அனைத்தையும் காண்க" };
const CONTACT_US: Val = { en: "Contact Us", si: "අප අමතන්න", ta: "தொடர்பு கொள்ள" };
const SUPPORT_CSDF: Val = { en: "Support CSDF", si: "CSDF සඳහා සහාය වන්න", ta: "CSDF-க்கு ஆதரவு" };

const content: Record<string, Val> = {
  /* ====================================================== General ========= */
  site_name: {
    en: "Community Strength Development Foundation",
    si: "ප්‍රජා ශක්ති සංවර්ධන පදනම",
    ta: "சமூக வலிமை மேம்பாட்டு மன்றம்",
  },
  site_short_name: { en: "CSDF" },
  site_tagline: {
    en: "Supporting marginalized women in Sri Lanka since 2002 — with dignity, respect, and equal opportunity.",
    si: "2002 සිට ශ්‍රී ලංකාවේ කොන් වූ කාන්තාවන්ට ගෞරවය, ගරුත්වය සහ සම අවස්ථා සහිතව සහාය වෙමින්.",
    ta: "2002 முதல் இலங்கையில் ஓரங்கட்டப்பட்ட பெண்களுக்கு கண்ணியம், மரியாதை மற்றும் சம வாய்ப்புடன் ஆதரவு.",
  },
  logo_image: BLANK,
  logo_letter: { en: "C" },
  favicon: BLANK,

  address: { en: "No. 68, Kolonnawa Road,\nKolonnawa, Colombo,\nSri Lanka" },
  phone: { en: "0112 534 838" },
  phone2: BLANK,
  email: { en: "info@csdf.lk" },
  email2: BLANK,
  whatsapp: { en: "94112534838" },
  office_hours: {
    en: "Mon – Fri, 8.30 am to 4.30 pm",
    si: "සඳුදා – සිකුරාදා, පෙ.ව. 8.30 – ප.ව. 4.30",
    ta: "திங்கள் – வெள்ளி, மு.ப 8.30 – பி.ப 4.30",
  },
  map_embed: BLANK,

  facebook: BLANK,
  youtube: BLANK,
  instagram: BLANK,
  twitter: BLANK,
  linkedin: BLANK,
  tiktok: BLANK,

  seo_title: {
    en: "Community Strength Development Foundation",
    si: "ප්‍රජා ශක්ති සංවර්ධන පදනම",
    ta: "சமூக வலிமை மேம்பாட்டு மன்றம்",
  },
  seo_description: {
    en: "CSDF improves health, safety, dignity, and rights for marginalized women in Sri Lanka through community-led support, advocacy, and education.",
    si: "CSDF ප්‍රජා නායකත්වයෙන් යුත් සහාය, පෙනී සිටීම සහ අධ්‍යාපනය හරහා ශ්‍රී ලංකාවේ කොන් වූ කාන්තාවන්ගේ සෞඛ්‍යය, ආරක්ෂාව, ගෞරවය සහ අයිතිවාසිකම් වැඩිදියුණු කරයි.",
    ta: "CSDF சமூகம் சார்ந்த ஆதரவு, வாதிடல் மற்றும் கல்வி மூலம் இலங்கையில் ஓரங்கட்டப்பட்ட பெண்களின் சுகாதாரம், பாதுகாப்பு, கண்ணியம் மற்றும் உரிமைகளை மேம்படுத்துகிறது.",
  },
  seo_keywords: {
    en: "CSDF, Sri Lanka, women's health, HIV support, community development, human rights, Colombo",
  },
  og_image: BLANK,
  // On by default while the site is being built — turn off in Admin →
  // Site Settings → General once ready to be indexed by search engines.
  seo_noindex: { en: "1" },

  // Off by default — an admin opts in once real SMTP credentials are on hand.
  smtp_enabled: { en: "0" },
  smtp_host: BLANK,
  smtp_port: { en: "587" },
  smtp_secure: { en: "0" },
  smtp_user: BLANK,
  smtp_pass: BLANK,
  smtp_from: BLANK,
  contact_notify_to: BLANK,
  contact_notify_cc: BLANK,

  /* ============================================ Header & navigation ======= */
  announce_text: BLANK,
  announce_link: BLANK,
  show_header_topbar: ON,
  show_header_langs: ON,
  nav_show_about: ON,
  nav_show_projects: ON,
  nav_show_services: ON,
  nav_show_publications: ON,
  nav_show_news: ON,
  nav_show_events: ON,
  nav_show_business: ON,
  nav_show_suggestions: ON,
  nav_show_contact: ON,
  show_header_donate: ON,
  show_floating_donate: ON,
  header_donate_label: { en: "Donation", si: "පරිත්‍යාග", ta: "நன்கொடை" },

  /* ======================================================== Footer ======== */
  footer_about: {
    en: "Supporting marginalized women in Sri Lanka since 2002 — with dignity, respect, and equal opportunity.",
    si: "2002 සිට ශ්‍රී ලංකාවේ කොන් වූ කාන්තාවන්ට ගෞරවය, ගරුත්වය සහ සම අවස්ථා සහිතව සහාය වෙමින්.",
    ta: "2002 முதல் இலங்கையில் ஓரங்கட்டப்பட்ட பெண்களுக்கு கண்ணியம், மரியாதை மற்றும் சம வாய்ப்புடன் ஆதரவு.",
  },
  show_footer_explore: ON,
  show_footer_involved: ON,
  show_footer_social: ON,
  show_footer_newsletter: ON,
  footer_newsletter_title: {
    en: "Stay informed about programs, events, and resources",
    si: "වැඩසටහන්, සිදුවීම් සහ සම්පත් පිළිබඳ දැනුවත් වන්න",
    ta: "நிகழ்ச்சிகள், நிகழ்வுகள் மற்றும் வளங்கள் பற்றி அறிந்திருங்கள்",
  },
  footer_newsletter_text: BLANK,
  footer_copyright: {
    en: "CSDF. All rights reserved.",
    si: "CSDF. සියලුම හිමිකම් ඇවිරිණි.",
    ta: "CSDF. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
  },
  footer_credit: BLANK,

  /* ===================================================== Home page ======== */
  hero_badge: {
    en: "Free · Confidential · Non-Judgmental",
    si: "නොමිලේ · රහස්‍ය · විනිශ්චයෙන් තොර",
    ta: "இலவசம் · இரகசியம் · தீர்ப்பற்றது",
  },
  hero_title: {
    en: "Empowering Women Through Health, Support & Advocacy",
    si: "සෞඛ්‍යය, සහාය සහ පෙනී සිටීම හරහා කාන්තාවන් සවිබල ගැන්වීම",
    ta: "சுகாதாரம், ஆதரவு மற்றும் வாதிடல் மூலம் பெண்களை மேம்படுத்துதல்",
  },
  hero_subtitle: {
    en: "CSDF works alongside marginalized women to improve access to healthcare, promote human rights, strengthen communities, and create healthier and safer lives.",
    si: "CSDF කොන් වූ කාන්තාවන් සමඟ එක්ව සෞඛ්‍ය සේවා ලබාගැනීම වැඩිදියුණු කිරීමට, මානව හිමිකම් ප්‍රවර්ධනයට, ප්‍රජාවන් ශක්තිමත් කිරීමට සහ සෞඛ්‍ය සම්පන්න, ආරක්ෂිත ජීවිත ගොඩනැගීමට කටයුතු කරයි.",
    ta: "CSDF ஓரங்கட்டப்பட்ட பெண்களுடன் இணைந்து சுகாதார அணுகலை மேம்படுத்தவும், மனித உரிமைகளை ஊக்குவிக்கவும், சமூகங்களை வலுப்படுத்தவும், ஆரோக்கியமான பாதுகாப்பான வாழ்க்கையை உருவாக்கவும் செயல்படுகிறது.",
  },
  hero_image: { en: HERO_IMAGE },
  hero_cta1_label: { en: "Get Support", si: "සහාය ලබාගන්න", ta: "உதவி பெற" },
  hero_cta1_link: { en: "/contact" },
  hero_cta2_label: { en: "Learn More", si: "තව දැනගන්න", ta: "மேலும் அறிய" },
  hero_cta2_link: { en: "/about" },
  hero_points: {
    en: "All information kept strictly confidential\nNon-judgmental support for every person\nCommunity-led by people who understand\nFree services — no cost, no barriers",
    si: "සියලුම තොරතුරු දැඩි රහස්‍යභාවයෙන් තබා ගැනේ\nසෑම කෙනෙකුටම විනිශ්චයෙන් තොර සහාය\nතේරුම් ගන්නා අය විසින් මෙහෙයවන ප්‍රජා නායකත්වය\nනොමිලේ සේවා — වියදමක් නැත, බාධක නැත",
    ta: "அனைத்து தகவல்களும் முற்றிலும் இரகசியமாக பாதுகாக்கப்படும்\nஒவ்வொருவருக்கும் தீர்ப்பற்ற ஆதரவு\nபுரிந்துகொள்பவர்களால் வழிநடத்தப்படும் சமூகம்\nஇலவச சேவைகள் — செலவு இல்லை, தடைகள் இல்லை",
  },
  hero_footnote: {
    en: "08+ partner organizations · 10 districts across Sri Lanka",
    si: "හවුල්කාර ආයතන 08+ · ශ්‍රී ලංකාව පුරා දිස්ත්‍රික්ක 10ක්",
    ta: "08+ பங்காளர் அமைப்புகள் · இலங்கை முழுவதும் 10 மாவட்டங்கள்",
  },

  show_home_marquee: ON,
  home_marquee_items: {
    en: "Community Voices\nHelp Create Someone's Turning Point\nProgress Begins When Communities Lead\nSupport Shaped Around Real Life\nProjects Built With Communities",
    si: "ප්‍රජා හඬ\nකෙනෙකුගේ හැරවුම් ලක්ෂ්‍යයක් නිර්මාණය කිරීමට උදව් කරන්න\nප්‍රජාවන් මෙහෙයවන විට ප්‍රගතිය ආරම්භ වේ\nඇත්ත ජීවිතය වටා හැඩගැසුණු සහාය\nප්‍රජාවන් සමඟ ගොඩනගන ලද ව්‍යාපෘති",
    ta: "சமூகக் குரல்கள்\nஒருவரின் திருப்புமுனையை உருவாக்க உதவுங்கள்\nசமூகங்கள் வழிநடத்தும்போது முன்னேற்றம் தொடங்குகிறது\nஉண்மையான வாழ்க்கையைச் சுற்றி வடிவமைக்கப்பட்ட ஆதரவு\nசமூகங்களுடன் கட்டமைக்கப்பட்ட திட்டங்கள்",
  },

  show_home_about: ON,
  home_about_eyebrow: { en: "Who We Are", si: "අපි කවුද", ta: "நாங்கள் யார்" },
  home_about_title: {
    en: "Community Strength Development Foundation",
    si: "ප්‍රජා ශක්ති සංවර්ධන පදනම",
    ta: "சமூக வலிமை மேம்பாட்டு மன்றம்",
  },
  home_about_text: {
    en: "Community Strength Development Foundation (CSDF) is a non-profit, voluntary organization registered with the Department of Social Services and inaugurated in 2002. Working independently — irrespective of race, religion, caste, and party politics — CSDF focuses on marginalized women in Sri Lanka, providing the support services needed to uplift their lives with dignity, respect, and equal opportunity.",
    si: "ප්‍රජා ශක්ති සංවර්ධන පදනම (CSDF) සමාජ සේවා දෙපාර්තමේන්තුවේ ලියාපදිංචි, 2002 දී ආරම්භ කරන ලද ලාභ නොලබන ස්වේච්ඡා සංවිධානයකි. ජාති, ආගම්, කුල සහ පක්ෂ දේශපාලනයෙන් තොරව ස්වාධීනව කටයුතු කරමින්, CSDF ශ්‍රී ලංකාවේ කොන් වූ කාන්තාවන් කෙරෙහි අවධානය යොමු කරමින්, ගෞරවය, ගරුත්වය සහ සම අවස්ථා සහිතව ඔවුන්ගේ ජීවිත නංවාලීමට අවශ්‍ය සහාය සේවා සපයයි.",
    ta: "சமூக வலிமை மேம்பாட்டு மன்றம் (CSDF) சமூக சேவைகள் திணைக்களத்தில் பதிவுசெய்யப்பட்ட, 2002 இல் ஆரம்பிக்கப்பட்ட இலாப நோக்கற்ற தன்னார்வ அமைப்பாகும். இனம், மதம், சாதி மற்றும் கட்சி அரசியலுக்கு அப்பால் சுயாதீனமாக செயல்படும் CSDF, இலங்கையில் ஓரங்கட்டப்பட்ட பெண்களில் கவனம் செலுத்தி, கண்ணியம், மரியாதை மற்றும் சம வாய்ப்புடன் அவர்களின் வாழ்க்கையை மேம்படுத்த தேவையான ஆதரவு சேவைகளை வழங்குகிறது.",
  },
  home_about_image: { en: COMMUNITY_IMAGE },
  home_about_caption: {
    en: "Community Strength Development Foundation",
    si: "ප්‍රජා ශක්ති සංවර්ධන පදනම",
    ta: "சமூக வலிமை மேம்பாட்டு மன்றம்",
  },
  home_about_link_label: { en: "Learn More", si: "තව දැනගන්න", ta: "மேலும் அறிய" },

  show_home_stats: ON,
  home_stats_eyebrow: { en: "Our Impact", si: "අපගේ බලපෑම", ta: "எங்கள் தாக்கம்" },
  home_stats_title: {
    en: "The difference we make together",
    si: "අපි එකට කරන වෙනස",
    ta: "நாம் ஒன்றாக ஏற்படுத்தும் மாற்றம்",
  },
  home_stats_image: { en: HERO_IMAGE },

  show_home_services: ON,
  home_services_eyebrow: { en: "Our Services", si: "අපගේ සේවාවන්", ta: "எங்கள் சேவைகள்" },
  home_services_title: {
    en: "How we support our community",
    si: "අපි අපගේ ප්‍රජාවට සහාය දෙන ආකාරය",
    ta: "எங்கள் சமூகத்திற்கு நாம் ஆதரவளிக்கும் விதம்",
  },
  home_services_text: BLANK,
  home_services_count: { en: "6" },
  home_services_link_label: VIEW_ALL,

  show_home_projects: ON,
  home_projects_eyebrow: { en: "Projects", si: "ව්‍යාපෘති", ta: "திட்டங்கள்" },
  home_projects_title: {
    en: "Featured Projects",
    si: "විශේෂ ව්‍යාපෘති",
    ta: "சிறப்புத் திட்டங்கள்",
  },
  home_projects_text: BLANK,
  home_projects_count: { en: "4" },
  home_projects_link_label: VIEW_ALL,

  show_home_contact: ON,
  home_contact_eyebrow: { en: "Get In Touch", si: "සම්බන්ධ වන්න", ta: "தொடர்பு கொள்ளுங்கள்" },
  home_contact_title: {
    en: "Don't hesitate to contact us",
    si: "පසුබට නොවී අප හා සම්බන්ධ වන්න",
    ta: "தயங்காமல் எங்களை தொடர்பு கொள்ளுங்கள்",
  },
  home_contact_text: {
    en: "Reach out to us — all inquiries are treated confidentially.",
    si: "අප වෙත සම්බන්ධ වන්න — සියලුම විමසීම් රහස්‍යභාවයෙන් යුතුව සලකනු ලැබේ.",
    ta: "எங்களை அணுகவும் — அனைத்து விசாரணைகளும் இரகசியமாக கையாளப்படும்.",
  },
  home_contact_card_title: { en: "Call Us", si: "අමතන්න", ta: "அழைக்கவும்" },
  home_contact_image: { en: HERO_IMAGE },
  home_contact_button: CONTACT_US,

  show_home_testimonials: ON,
  home_testimonials_eyebrow: { en: "Community Voices", si: "ප්‍රජා හඬ", ta: "சமூகக் குரல்கள்" },
  home_testimonials_title: {
    en: "Stories from the women we serve",
    si: "අප සේවය කරන කාන්තාවන්ගේ කථා",
    ta: "நாங்கள் சேவை செய்யும் பெண்களின் கதைகள்",
  },

  show_home_news: ON,
  home_news_eyebrow: { en: "Latest News", si: "නවතම පුවත්", ta: "சமீபத்திய செய்திகள்" },
  home_news_title: { en: "Latest News", si: "නවතම පුවත්", ta: "சமீபத்திய செய்திகள்" },
  home_news_count: { en: "3" },

  show_home_events: ON,
  home_events_eyebrow: {
    en: "Upcoming Events",
    si: "ඉදිරි සිදුවීම්",
    ta: "வரவிருக்கும் நிகழ்வுகள்",
  },
  home_events_title: {
    en: "Upcoming Events",
    si: "ඉදිරි සිදුවීම්",
    ta: "வரவிருக்கும் நிகழ்வுகள்",
  },
  home_events_count: { en: "2" },
  home_events_link_label: VIEW_ALL,

  show_home_partners: ON,
  home_partners_eyebrow: { en: "Our Partners", si: "අපගේ හවුල්කරුවන්", ta: "எங்கள் பங்காளிகள்" },
  home_partners_title: {
    en: "Working together",
    si: "එකට වැඩ කරමින්",
    ta: "ஒன்றாக செயல்படுகிறோம்",
  },

  show_home_donate: ON,
  home_donate_eyebrow: SUPPORT_CSDF,
  home_donate_title: {
    en: "Your gift keeps these services running",
    si: "ඔබගේ දායකත්වය මෙම සේවා පවත්වාගෙන යයි",
    ta: "உங்கள் நன்கொடை இந்த சேவைகளைத் தொடர வைக்கிறது",
  },
  home_donate_text: {
    en: "Your support funds direct services, peer leadership, health education, and safe community spaces.",
    si: "ඔබගේ සහාය සෘජු සේවා, නායකත්ව පුහුණුව, සෞඛ්‍ය අධ්‍යාපනය සහ ආරක්ෂිත ප්‍රජා අවකාශයන් සඳහා යොදවනු ලැබේ.",
    ta: "உங்கள் ஆதரவு நேரடி சேவைகள், தலைமைத்துவ பயிற்சி, சுகாதாரக் கல்வி மற்றும் பாதுகாப்பான சமூக இடங்களுக்கு பயன்படுகிறது.",
  },
  home_donate_button: { en: "Make a Donation", si: "පරිත්‍යාගයක් කරන්න", ta: "நன்கொடை வழங்க" },
  home_donate_button2: CONTACT_US,

  /* ==================================================== About page ======== */
  about_hero_title: { en: "About Us", si: "අප ගැන", ta: "எங்களைப் பற்றி" },
  about_hero_intro: {
    en: "Supporting marginalized women in Sri Lanka since 2002 — with dignity, respect, and equal opportunity.",
    si: "2002 සිට ශ්‍රී ලංකාවේ කොන් වූ කාන්තාවන්ට ගෞරවය, ගරුත්වය සහ සම අවස්ථා සහිතව සහාය වෙමින්.",
    ta: "2002 முதல் இலங்கையில் ஓரங்கட்டப்பட்ட பெண்களுக்கு கண்ணியம், மரியாதை மற்றும் சம வாய்ப்புடன் ஆதரவு.",
  },
  about_hero_image: BLANK,

  about_overview_title: { en: "Overview", si: "දළ විශ්ලේෂණය", ta: "மேலோட்டம்" },
  about_overview: {
    en: "Community Strength Development Foundation (CSDF) is a non-profit, voluntary organization registered with the Department of Social Services and inaugurated in 2002. Working independently — irrespective of race, religion, caste, and party politics — CSDF focuses on marginalized women in Sri Lanka, providing the support services needed to uplift their lives with dignity, respect, and equal opportunity.",
    si: "ප්‍රජා ශක්ති සංවර්ධන පදනම (CSDF) සමාජ සේවා දෙපාර්තමේන්තුවේ ලියාපදිංචි, 2002 දී ආරම්භ කරන ලද ලාභ නොලබන ස්වේච්ඡා සංවිධානයකි. ජාති, ආගම්, කුල සහ පක්ෂ දේශපාලනයෙන් තොරව ස්වාධීනව කටයුතු කරමින්, CSDF ශ්‍රී ලංකාවේ කොන් වූ කාන්තාවන් කෙරෙහි අවධානය යොමු කරමින්, ගෞරවය, ගරුත්වය සහ සම අවස්ථා සහිතව ඔවුන්ගේ ජීවිත නංවාලීමට අවශ්‍ය සහාය සේවා සපයයි.",
    ta: "சமூக வலிமை மேம்பாட்டு மன்றம் (CSDF) சமூக சேவைகள் திணைக்களத்தில் பதிவுசெய்யப்பட்ட, 2002 இல் ஆரம்பிக்கப்பட்ட இலாப நோக்கற்ற தன்னார்வ அமைப்பாகும். இனம், மதம், சாதி மற்றும் கட்சி அரசியலுக்கு அப்பால் சுயாதீனமாக செயல்படும் CSDF, இலங்கையில் ஓரங்கட்டப்பட்ட பெண்களில் கவனம் செலுத்தி, கண்ணியம், மரியாதை மற்றும் சம வாய்ப்புடன் அவர்களின் வாழ்க்கையை மேம்படுத்த தேவையான ஆதரவு சேவைகளை வழங்குகிறது.",
  },
  about_overview_image: BLANK,

  about_vision_title: { en: "Our Vision", si: "අපගේ දැක්ම", ta: "எங்கள் தொலைநோக்கு" },
  about_vision: {
    en: "A society where every marginalized woman in Sri Lanka lives with dignity, health, safety, and equal opportunity.",
    si: "ශ්‍රී ලංකාවේ සෑම කොන් වූ කාන්තාවක්ම ගෞරවය, සෞඛ්‍යය, ආරක්ෂාව සහ සම අවස්ථා සහිතව ජීවත් වන සමාජයක්.",
    ta: "இலங்கையில் ஓரங்கட்டப்பட்ட ஒவ்வொரு பெண்ணும் கண்ணியம், ஆரோக்கியம், பாதுகாப்பு மற்றும் சம வாய்ப்புடன் வாழும் சமூகம்.",
  },
  about_mission_title: { en: "Our Mission", si: "අපගේ මෙහෙවර", ta: "எங்கள் பணி" },
  about_mission: {
    en: "To provide community-led support, healthcare access, rights awareness, and economic opportunity to marginalized women — working with dignity, confidentiality, and respect, irrespective of race, religion, caste, or politics.",
    si: "ජාති, ආගම්, කුල හෝ දේශපාලනයෙන් තොරව — ගෞරවය, රහස්‍යභාවය සහ ගරුත්වයෙන් යුතුව කොන් වූ කාන්තාවන්ට ප්‍රජා නායකත්වයෙන් යුත් සහාය, සෞඛ්‍ය ප්‍රවේශය, අයිතිවාසිකම් දැනුවත් කිරීම සහ ආර්ථික අවස්ථා ලබා දීම.",
    ta: "இனம், மதம், சாதி அல்லது அரசியல் வேறுபாடின்றி — கண்ணியம், இரகசியம் மற்றும் மரியாதையுடன் ஓரங்கட்டப்பட்ட பெண்களுக்கு சமூகம் சார்ந்த ஆதரவு, சுகாதார அணுகல், உரிமை விழிப்புணர்வு மற்றும் பொருளாதார வாய்ப்புகளை வழங்குதல்.",
  },

  about_values_title: { en: "Our Values", si: "අපගේ වටිනාකම්", ta: "எங்கள் மதிப்புகள்" },
  about_values: {
    en: "Confidentiality :: Everything shared with us stays private. No names, no records passed on, no exceptions.\nNo judgement :: Every person is met with respect regardless of their circumstances, work, or health status.\nCommunity-led :: Our programs are designed and delivered by people with lived experience of the issues.\nEqual access :: Services are free and open to all — cost is never a barrier to support.\nDignity first :: We work with women, never on their behalf. Decisions always remain theirs.\nIndependence :: We operate free of race, religion, caste, and party politics.",
    si: "රහස්‍යභාවය :: අප සමඟ බෙදාගන්නා සියල්ල පුද්ගලිකව තබා ගැනේ. නම් නැත, වාර්තා ලබා නොදේ, ව්‍යතිරේක නැත.\nවිනිශ්චයක් නැත :: තත්ත්වය, රැකියාව හෝ සෞඛ්‍ය තත්ත්වය නොසලකා සෑම කෙනෙකුටම ගරුත්වයෙන් සලකනු ලැබේ.\nප්‍රජා නායකත්වය :: අපගේ වැඩසටහන් එම ගැටලු අත්විඳි අය විසින් නිර්මාණය කර ක්‍රියාත්මක කරනු ලැබේ.\nසම ප්‍රවේශය :: සේවා නොමිලේ සහ සියල්ලන්ට විවෘතයි — වියදම කිසිදා බාධාවක් නොවේ.\nගෞරවය පළමුව :: අපි කාන්තාවන් සමඟ වැඩ කරමු, ඔවුන් වෙනුවෙන් නොවේ. තීරණ සැමවිටම ඔවුන්ගේය.\nස්වාධීනත්වය :: අපි ජාති, ආගම්, කුල සහ පක්ෂ දේශපාලනයෙන් තොරව කටයුතු කරමු.",
    ta: "இரகசியம் :: எங்களுடன் பகிரப்படும் அனைத்தும் தனிப்பட்டதாக இருக்கும். பெயர்கள் இல்லை, பதிவுகள் பகிரப்படாது, விதிவிலக்கு இல்லை.\nதீர்ப்பு இல்லை :: சூழ்நிலை, தொழில் அல்லது சுகாதார நிலை எதுவாக இருந்தாலும் ஒவ்வொருவரும் மரியாதையுடன் நடத்தப்படுவார்.\nசமூகம் சார்ந்தது :: எங்கள் திட்டங்கள் அந்த பிரச்சினைகளை அனுபவித்தவர்களால் வடிவமைக்கப்பட்டு வழங்கப்படுகின்றன.\nசம அணுகல் :: சேவைகள் இலவசம், அனைவருக்கும் திறந்தவை — செலவு ஒருபோதும் தடையல்ல.\nகண்ணியம் முதலில் :: நாங்கள் பெண்களுடன் இணைந்து பணியாற்றுகிறோம், அவர்களுக்குப் பதிலாக அல்ல. முடிவுகள் எப்போதும் அவர்களுடையவை.\nசுயாதீனம் :: இனம், மதம், சாதி மற்றும் கட்சி அரசியலுக்கு அப்பால் செயல்படுகிறோம்.",
  },

  about_community_title: {
    en: "Communities We Serve",
    si: "අප සේවය කරන ප්‍රජාවන්",
    ta: "நாங்கள் சேவை செய்யும் சமூகங்கள்",
  },
  about_community: {
    en: "CSDF serves marginalized women across Sri Lanka, including female sex workers and women facing stigma, violence, or economic hardship. Our programs are community-led: designed and delivered by people who understand the lived experience of the women we serve, across 10 districts with 8+ partner organizations.",
    si: "CSDF ශ්‍රී ලංකාව පුරා කොන් වූ කාන්තාවන්ට සේවය කරයි. අපගේ වැඩසටහන් ප්‍රජා නායකත්වයෙන් යුක්තයි: අප සේවය කරන කාන්තාවන්ගේ ජීවන අත්දැකීම් තේරුම් ගන්නා අය විසින් නිර්මාණය කර ක්‍රියාත්මක කරනු ලැබේ — දිස්ත්‍රික්ක 10ක්, හවුල්කාර ආයතන 8+ක් සමඟ.",
    ta: "CSDF இலங்கை முழுவதும் ஓரங்கட்டப்பட்ட பெண்களுக்கு சேவை செய்கிறது. எங்கள் திட்டங்கள் சமூகத்தால் வழிநடத்தப்படுகின்றன: நாங்கள் சேவை செய்யும் பெண்களின் வாழ்க்கை அனுபவத்தைப் புரிந்துகொள்பவர்களால் வடிவமைக்கப்பட்டு வழங்கப்படுகின்றன — 10 மாவட்டங்களில், 8+ பங்காளர் அமைப்புகளுடன்.",
  },

  about_history_title: { en: "Our Story", si: "අපගේ කථාව", ta: "எங்கள் கதை" },
  about_history: {
    en: "CSDF was founded in 2002 by a small group of community members who saw that the women most in need of health services were the least likely to receive them. What began as informal peer outreach in Kolonnawa has grown into a registered organization working across 10 districts.\n\nOver two decades we have become a frontline partner in Sri Lanka's HIV response, reaching communities that formal health systems often miss. The approach has not changed: confidentiality first, no judgement, and programs shaped by the women they serve.",
    si: "CSDF 2002 දී ආරම්භ කරන ලද්දේ, සෞඛ්‍ය සේවා වඩාත් අවශ්‍ය කාන්තාවන්ට ඒවා ලැබීමේ ඉඩකඩ අවම බව දුටු කුඩා ප්‍රජා කණ්ඩායමක් විසිනි. කොළොන්නාවේ අවිධිමත් සම-සම්බන්ධතාවක් ලෙස ආරම්භ වූ දේ දිස්ත්‍රික්ක 10ක් පුරා කටයුතු කරන ලියාපදිංචි සංවිධානයක් බවට වර්ධනය වී ඇත.\n\nදශක දෙකකට වැඩි කාලයක් තුළ අපි ශ්‍රී ලංකාවේ HIV ප්‍රතිචාරයේ පෙරමුණේ හවුල්කරුවෙකු බවට පත් වී ඇත. ප්‍රවේශය වෙනස් වී නැත: රහස්‍යභාවය පළමුව, විනිශ්චයක් නැත, සහ සේවය කරන කාන්තාවන් විසින් හැඩගස්වන වැඩසටහන්.",
    ta: "சுகாதார சேவைகள் மிகவும் தேவைப்படும் பெண்களே அவற்றைப் பெறும் வாய்ப்பு குறைவாக இருப்பதைக் கண்ட ஒரு சிறு சமூகக் குழுவினால் CSDF 2002 இல் நிறுவப்பட்டது. கொலன்னாவையில் முறைசாரா சக அணுகுமுறையாகத் தொடங்கியது இன்று 10 மாவட்டங்களில் செயல்படும் பதிவுசெய்யப்பட்ட அமைப்பாக வளர்ந்துள்ளது.\n\nஇரு தசாப்தங்களுக்கும் மேலாக இலங்கையின் HIV பதிலிறுப்பில் நாங்கள் முன்னணி பங்காளியாக மாறியுள்ளோம். அணுகுமுறை மாறவில்லை: இரகசியம் முதலில், தீர்ப்பு இல்லை, சேவை பெறும் பெண்களால் வடிவமைக்கப்படும் திட்டங்கள்.",
  },
  about_history_image: BLANK,

  about_gallery_title: { en: "Gallery", si: "ගැලරිය", ta: "படத்தொகுப்பு" },
  about_testimonials_title: { en: "What People Say", si: "අය පවසන දේ", ta: "மக்கள் கூறுவது" },

  about_extra_title: BLANK,
  about_extra_text: BLANK,

  /* ================================================== Contact page ======== */
  contact_hero_title: CONTACT_US,
  contact_hero_intro: {
    en: "Reach out to us — all inquiries are treated confidentially.",
    si: "අප වෙත සම්බන්ධ වන්න — සියලුම විමසීම් රහස්‍යභාවයෙන් යුතුව සලකනු ලැබේ.",
    ta: "எங்களை அணுகவும் — அனைத்து விசாரணைகளும் இரகசியமாக கையாளப்படும்.",
  },
  contact_hero_image: BLANK,

  show_contact_form: ON,
  contact_form_title: {
    en: "Send us a message",
    si: "අපට පණිවිඩයක් යවන්න",
    ta: "எங்களுக்கு செய்தி அனுப்புங்கள்",
  },
  contact_form_note: BLANK,
  contact_success_message: {
    en: "Your message has been sent. We will get back to you soon.",
    si: "ඔබගේ පණිවිඩය යවන ලදී. අපි ඉක්මනින් ඔබ හා සම්බන්ධ වන්නෙමු.",
    ta: "உங்கள் செய்தி அனுப்பப்பட்டது. விரைவில் உங்களைத் தொடர்பு கொள்வோம்.",
  },

  show_contact_details: ON,
  contact_details_title: {
    en: "Our details",
    si: "අපගේ විස්තර",
    ta: "எங்கள் விவரங்கள்",
  },
  show_contact_map: ON,

  /* =================================================== Donate page ======== */
  donate_hero_title: { en: "Make a Donation", si: "පරිත්‍යාගයක් කරන්න", ta: "நன்கொடை வழங்க" },
  donate_intro: {
    en: "Every contribution helps sustain healthcare, outreach, and advocacy programs for the women we serve.",
    si: "සෑම දායකත්වයක්ම අප සේවය කරන කාන්තාවන් සඳහා සෞඛ්‍ය, ප්‍රජා සම්බන්ධතා සහ අයිතිවාසිකම් වැඩසටහන් පවත්වාගෙන යාමට උපකාරී වේ.",
    ta: "ஒவ்வொரு பங்களிப்பும் நாங்கள் சேவை செய்யும் பெண்களுக்கான சுகாதாரம், சமூக அணுகல் மற்றும் உரிமைகள் திட்டங்களை நிலைநிறுத்த உதவுகிறது.",
  },
  donate_hero_image: BLANK,

  show_donate_online: ON,
  donate_amounts: { en: "1000\n2500\n5000\n10000\n25000" },
  donate_note: {
    en: "CSDF is a registered non-profit. Donations are processed securely by PayHere; we never see or store your card details.",
    si: "CSDF ලියාපදිංචි ලාභ නොලබන සංවිධානයකි. පරිත්‍යාග PayHere මගින් ආරක්ෂිතව සකසනු ලැබේ; අපි කිසිදා ඔබගේ කාඩ්පත් විස්තර නොදකිමු හෝ නොගබඩා කරමු.",
    ta: "CSDF ஒரு பதிவுசெய்யப்பட்ட இலாப நோக்கற்ற அமைப்பு. நன்கொடைகள் PayHere மூலம் பாதுகாப்பாக செயலாக்கப்படுகின்றன; உங்கள் அட்டை விவரங்களை நாங்கள் ஒருபோதும் பார்ப்பதில்லை அல்லது சேமிப்பதில்லை.",
  },

  donate_bank_title: {
    en: "Direct Bank Transfer",
    si: "බැංකු හුවමාරුව",
    ta: "நேரடி வங்கி பரிமாற்றம்",
  },
  bank_details: {
    en: "Account Name: Community Strength Development Foundation\nBank: (your bank)\nBranch: (your branch)\nAccount No: (your account number)\nSWIFT: (for international transfers)",
  },

  donate_impact_title: SUPPORT_CSDF,
  donate_impact_items: {
    en: "Where it's needed most :: Flexible funding lets us respond to the most urgent needs first.\nHealth services :: Clinics, testing, treatment linkage and peer accompaniment.\nEducation & awareness :: Peer-led health education and rights training in the community.\nCommunity programs :: Safe spaces, peer leadership and economic opportunity.",
    si: "වඩාත්ම අවශ්‍ය තැනට :: නම්‍යශීලී අරමුදල් මගින් වඩාත් හදිසි අවශ්‍යතාවලට මුලින්ම ප්‍රතිචාර දැක්විය හැක.\nසෞඛ්‍ය සේවා :: සායන, පරීක්ෂණ, ප්‍රතිකාර සම්බන්ධ කිරීම සහ සම සහාය.\nඅධ්‍යාපනය සහ දැනුවත් කිරීම :: ප්‍රජාව තුළ සම-නායකත්ව සෞඛ්‍ය අධ්‍යාපනය සහ අයිතිවාසිකම් පුහුණුව.\nප්‍රජා වැඩසටහන් :: ආරක්ෂිත අවකාශ, සම නායකත්වය සහ ආර්ථික අවස්ථා.",
    ta: "மிகவும் தேவையான இடத்திற்கு :: நெகிழ்வான நிதி மிக அவசரமான தேவைகளுக்கு முதலில் பதிலளிக்க உதவுகிறது.\nசுகாதார சேவைகள் :: கிளினிக்குகள், பரிசோதனை, சிகிச்சை இணைப்பு மற்றும் சக ஆதரவு.\nகல்வி & விழிப்புணர்வு :: சமூகத்தில் சக தலைமையிலான சுகாதாரக் கல்வி மற்றும் உரிமைப் பயிற்சி.\nசமூக திட்டங்கள் :: பாதுகாப்பான இடங்கள், சக தலைமைத்துவம் மற்றும் பொருளாதார வாய்ப்பு.",
  },

  /* =================================================== Other pages ======== */
  projects_hero_title: { en: "Projects", si: "ව්‍යාපෘති", ta: "திட்டங்கள்" },
  projects_hero_intro: {
    en: "Ongoing and completed work across 10 districts of Sri Lanka.",
    si: "ශ්‍රී ලංකාවේ දිස්ත්‍රික්ක 10ක් පුරා ක්‍රියාත්මක සහ සම්පූර්ණ කළ කටයුතු.",
    ta: "இலங்கையின் 10 மாவட்டங்களில் நடைபெறும் மற்றும் நிறைவடைந்த பணிகள்.",
  },
  projects_hero_image: BLANK,
  projects_empty_text: {
    en: "No projects have been published yet. Please check back soon.",
    si: "තවම ව්‍යාපෘති ප්‍රකාශයට පත් කර නැත. කරුණාකර නැවත පරීක්ෂා කරන්න.",
    ta: "இன்னும் திட்டங்கள் வெளியிடப்படவில்லை. விரைவில் மீண்டும் பார்க்கவும்.",
  },

  services_hero_title: { en: "Our Services", si: "අපගේ සේවාවන්", ta: "எங்கள் சேவைகள்" },
  services_hero_intro: {
    en: "Free, confidential and non-judgmental support — open to everyone.",
    si: "නොමිලේ, රහස්‍ය සහ විනිශ්චයෙන් තොර සහාය — සියල්ලන්ට විවෘතයි.",
    ta: "இலவச, இரகசிய மற்றும் தீர்ப்பற்ற ஆதரவு — அனைவருக்கும் திறந்தது.",
  },
  services_hero_image: BLANK,
  services_empty_text: {
    en: "No services have been published yet. Please check back soon.",
    si: "තවම සේවා ප්‍රකාශයට පත් කර නැත. කරුණාකර නැවත පරීක්ෂා කරන්න.",
    ta: "இன்னும் சேவைகள் வெளியிடப்படவில்லை. விரைவில் மீண்டும் பார்க்கவும்.",
  },

  publications_hero_title: { en: "Publications", si: "ප්‍රකාශන", ta: "வெளியீடுகள்" },
  publications_hero_intro: {
    en: "Research, reports and annual reviews available to download.",
    si: "බාගත කිරීමට ඇති පර්යේෂණ, වාර්තා සහ වාර්ෂික සමාලෝචන.",
    ta: "பதிவிறக்கம் செய்யக் கிடைக்கும் ஆய்வுகள், அறிக்கைகள் மற்றும் வருடாந்த மதிப்பாய்வுகள்.",
  },
  publications_hero_image: BLANK,
  publications_empty_text: {
    en: "No publications have been added yet. Please check back soon.",
    si: "තවම ප්‍රකාශන එකතු කර නැත. කරුණාකර නැවත පරීක්ෂා කරන්න.",
    ta: "இன்னும் வெளியீடுகள் சேர்க்கப்படவில்லை. விரைவில் மீண்டும் பார்க்கவும்.",
  },

  news_hero_title: { en: "News", si: "පුවත්", ta: "செய்திகள்" },
  news_hero_intro: {
    en: "Updates from our programs, partners and the communities we work with.",
    si: "අපගේ වැඩසටහන්, හවුල්කරුවන් සහ අපි කටයුතු කරන ප්‍රජාවන්ගෙන් යාවත්කාලීන කිරීම්.",
    ta: "எங்கள் திட்டங்கள், பங்காளர்கள் மற்றும் நாங்கள் பணியாற்றும் சமூகங்களின் புதுப்பிப்புகள்.",
  },
  news_hero_image: BLANK,
  news_empty_text: {
    en: "No news articles have been published yet. Please check back soon.",
    si: "තවම පුවත් ලිපි ප්‍රකාශයට පත් කර නැත. කරුණාකර නැවත පරීක්ෂා කරන්න.",
    ta: "இன்னும் செய்திக் கட்டுரைகள் வெளியிடப்படவில்லை. விரைவில் மீண்டும் பார்க்கவும்.",
  },

  events_hero_title: {
    en: "Events & Gallery",
    si: "සිදුවීම් සහ ගැලරිය",
    ta: "நிகழ்வுகள் & படத்தொகுப்பு",
  },
  events_hero_intro: {
    en: "Clinics, workshops and community gatherings — past and upcoming.",
    si: "සායන, වැඩමුළු සහ ප්‍රජා රැස්වීම් — පසුගිය සහ ඉදිරි.",
    ta: "கிளினிக்குகள், பயிலரங்குகள் மற்றும் சமூகக் கூட்டங்கள் — கடந்த மற்றும் வரவிருக்கும்.",
  },
  events_hero_image: BLANK,
  events_empty_text: {
    en: "There are no upcoming events scheduled right now. Please check back soon.",
    si: "දැනට ඉදිරි සිදුවීම් කිසිවක් සැලසුම් කර නැත. කරුණාකර නැවත පරීක්ෂා කරන්න.",
    ta: "தற்போது வரவிருக்கும் நிகழ்வுகள் திட்டமிடப்படவில்லை. விரைவில் மீண்டும் பார்க்கவும்.",
  },
  show_gallery: ON,
  gallery_title: { en: "Gallery", si: "ගැලරිය", ta: "படத்தொகுப்பு" },

  business_hero_title: { en: "Community Business", si: "ප්‍රජා ව්‍යාපාර", ta: "சமூக வணிகம்" },
  business_hero_intro: {
    en: "Products made by the women in our programs. Every order supports a livelihood.",
    si: "අපගේ වැඩසටහන්වල කාන්තාවන් විසින් සාදන ලද නිෂ්පාදන. සෑම ඇණවුමක්ම ජීවනෝපායකට සහාය වේ.",
    ta: "எங்கள் திட்டங்களில் உள்ள பெண்களால் தயாரிக்கப்பட்ட பொருட்கள். ஒவ்வொரு ஆர்டரும் ஒரு வாழ்வாதாரத்திற்கு ஆதரவு.",
  },
  business_hero_image: BLANK,
  business_empty_text: {
    en: "No products are listed yet. Please check back soon.",
    si: "තවම නිෂ්පාදන ලැයිස්තුගත කර නැත. කරුණාකර නැවත පරීක්ෂා කරන්න.",
    ta: "இன்னும் பொருட்கள் பட்டியலிடப்படவில்லை. விரைவில் மீண்டும் பார்க்கவும்.",
  },

  suggestions_hero_title: { en: "Suggestions", si: "යෝජනා", ta: "ஆலோசனைகள்" },
  suggestions_hero_intro: {
    en: "We value your ideas. Share your suggestions to help us improve our services.",
    si: "ඔබගේ අදහස් අපට වටී. අපගේ සේවාවන් වැඩිදියුණු කිරීමට ඔබගේ යෝජනා බෙදාගන්න.",
    ta: "உங்கள் கருத்துக்கள் எங்களுக்கு முக்கியம். எங்கள் சேவைகளை மேம்படுத்த உங்கள் ஆலோசனைகளைப் பகிரவும்.",
  },
  suggestions_hero_image: BLANK,
  suggestions_success_message: {
    en: "Your suggestion has been submitted. Thank you!",
    si: "ඔබගේ යෝජනාව යොමු කරන ලදී. ස්තූතියි!",
    ta: "உங்கள் ஆலோசனை சமர்ப்பிக்கப்பட்டது. நன்றி!",
  },
};

/* -------------------------------------------------------------------------- */

/** Fail fast if the registry and this file have drifted apart. */
function validate() {
  const registryKeys = allSettingDefs.map((d) => d.key);
  const seedKeys = Object.keys(content);

  const missing = registryKeys.filter((k) => !(k in content)).sort();
  const extra = seedKeys.filter((k) => !registryKeys.includes(k)).sort();

  if (missing.length) {
    throw new Error(
      `These settings are editable in the admin but have no seed value:\n  ${missing.join("\n  ")}`
    );
  }
  if (extra.length) {
    throw new Error(
      `These seed values do not match any setting in the admin:\n  ${extra.join("\n  ")}`
    );
  }
}

async function main() {
  validate();

  // Interface labels: seed straight from the built-in dictionaries so every
  // label exists as a real, editable database row in all three languages.
  const labelRows: Record<string, Val> = {};
  for (const def of allLabelDefs) {
    const [group, name] = def.path.split(".");
    const pick = (locale: "en" | "si" | "ta") =>
      ((dictionaries[locale] as any)[group]?.[name] as string) ?? "";
    labelRows[def.key] = { en: pick("en"), si: pick("si"), ta: pick("ta") };
  }

  const all = { ...content, ...labelRows };

  let created = 0;
  let updated = 0;
  let kept = 0;

  for (const [key, v] of Object.entries(all)) {
    const data = { valueEn: v.en, valueSi: v.si ?? null, valueTa: v.ta ?? null };
    const existing = await prisma.setting.findUnique({ where: { key } });

    if (!existing) {
      await prisma.setting.create({ data: { key, ...data } });
      created++;
    } else if (FORCE) {
      await prisma.setting.update({ where: { key }, data });
      updated++;
    } else {
      kept++;
    }
  }

  console.log(
    `Content seeded — ${created} created, ${updated} overwritten, ${kept} left as-is ` +
      `(${Object.keys(content).length} settings + ${Object.keys(labelRows).length} labels).`
  );
  if (!FORCE && kept > 0) {
    console.log("Run with --force to reset existing rows to these values.");
  }
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
