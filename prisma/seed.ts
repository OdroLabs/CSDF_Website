import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---------- Admin user ----------
  await prisma.user.upsert({
    where: { email: "admin@csdf.lk" },
    update: {},
    create: {
      name: "CSDF Admin",
      email: "admin@csdf.lk",
      password: await hash("admin12345", 10),
    },
  });

  // ---------- Settings ----------
  const settings: Record<string, { en: string; si?: string; ta?: string }> = {
    site_name: {
      en: "Community Strength Development Foundation",
      si: "ප්‍රජා ශක්ති සංවර්ධන පදනම",
      ta: "சமூக வலிமை மேம்பாட்டு மன்றம்",
    },
    site_tagline: {
      en: "Supporting marginalized women in Sri Lanka since 2002 — with dignity, respect, and equal opportunity.",
      si: "2002 සිට ශ්‍රී ලංකාවේ කොන් වූ කාන්තාවන්ට ගෞරවය, ගරුත්වය සහ සම අවස්ථා සහිතව සහාය වෙමින්.",
      ta: "2002 முதல் இலங்கையில் ஓரங்கட்டப்பட்ட பெண்களுக்கு கண்ணியம், மரியாதை மற்றும் சம வாய்ப்புடன் ஆதரவு.",
    },
    address: { en: "No. 68, Kolonnawa Road,\nKolonnawa, Colombo,\nSri Lanka" },
    phone: { en: "0112 534 838" },
    email: { en: "info@csdf.lk" },
    whatsapp: { en: "94112534838" },
    office_hours: {
      en: "Mon – Fri, 8.30 am to 4.30 pm",
      si: "සඳුදා – සිකුරාදා, පෙ.ව. 8.30 – ප.ව. 4.30",
      ta: "திங்கள் – வெள்ளி, மு.ப 8.30 – பி.ப 4.30",
    },
    facebook: { en: "" },
    youtube: { en: "" },
    instagram: { en: "" },
    map_embed: { en: "" },
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
    about_overview: {
      en: "Community Strength Development Foundation (CSDF) is a non-profit, voluntary organization registered with the Department of Social Services and inaugurated in 2002. Working independently — irrespective of race, religion, caste, and party politics — CSDF focuses on marginalized women in Sri Lanka, providing the support services needed to uplift their lives with dignity, respect, and equal opportunity.",
      si: "ප්‍රජා ශක්ති සංවර්ධන පදනම (CSDF) සමාජ සේවා දෙපාර්තමේන්තුවේ ලියාපදිංචි, 2002 දී ආරම්භ කරන ලද ලාභ නොලබන ස්වේච්ඡා සංවිධානයකි. ජාති, ආගම්, කුල සහ පක්ෂ දේශපාලනයෙන් තොරව ස්වාධීනව කටයුතු කරමින්, CSDF ශ්‍රී ලංකාවේ කොන් වූ කාන්තාවන් කෙරෙහි අවධානය යොමු කරමින්, ගෞරවය, ගරුත්වය සහ සම අවස්ථා සහිතව ඔවුන්ගේ ජීවිත නංවාලීමට අවශ්‍ය සහාය සේවා සපයයි.",
      ta: "சமூக வலிமை மேம்பாட்டு மன்றம் (CSDF) சமூக சேவைகள் திணைக்களத்தில் பதிவுசெய்யப்பட்ட, 2002 இல் ஆரம்பிக்கப்பட்ட இலாப நோக்கற்ற தன்னார்வ அமைப்பாகும். இனம், மதம், சாதி மற்றும் கட்சி அரசியலுக்கு அப்பால் சுயாதீனமாக செயல்படும் CSDF, இலங்கையில் ஓரங்கட்டப்பட்ட பெண்களில் கவனம் செலுத்தி, கண்ணியம், மரியாதை மற்றும் சம வாய்ப்புடன் அவர்களின் வாழ்க்கையை மேம்படுத்த தேவையான ஆதரவு சேவைகளை வழங்குகிறது.",
    },
    about_vision: {
      en: "A society where every marginalized woman in Sri Lanka lives with dignity, health, safety, and equal opportunity.",
      si: "ශ්‍රී ලංකාවේ සෑම කොන් වූ කාන්තාවක්ම ගෞරවය, සෞඛ්‍යය, ආරක්ෂාව සහ සම අවස්ථා සහිතව ජීවත් වන සමාජයක්.",
      ta: "இலங்கையில் ஓரங்கட்டப்பட்ட ஒவ்வொரு பெண்ணும் கண்ணியம், ஆரோக்கியம், பாதுகாப்பு மற்றும் சம வாய்ப்புடன் வாழும் சமூகம்.",
    },
    about_mission: {
      en: "To provide community-led support, healthcare access, rights awareness, and economic opportunity to marginalized women — working with dignity, confidentiality, and respect, irrespective of race, religion, caste, or politics.",
      si: "ජාති, ආගම්, කුල හෝ දේශපාලනයෙන් තොරව — ගෞරවය, රහස්‍යභාවය සහ ගරුත්වයෙන් යුතුව කොන් වූ කාන්තාවන්ට ප්‍රජා නායකත්වයෙන් යුත් සහාය, සෞඛ්‍ය ප්‍රවේශය, අයිතිවාසිකම් දැනුවත් කිරීම සහ ආර්ථික අවස්ථා ලබා දීම.",
      ta: "இனம், மதம், சாதி அல்லது அரசியல் வேறுபாடின்றி — கண்ணியம், இரகசியம் மற்றும் மரியாதையுடன் ஓரங்கட்டப்பட்ட பெண்களுக்கு சமூகம் சார்ந்த ஆதரவு, சுகாதார அணுகல், உரிமை விழிப்புணர்வு மற்றும் பொருளாதார வாய்ப்புகளை வழங்குதல்.",
    },
    about_community: {
      en: "CSDF serves marginalized women across Sri Lanka, including female sex workers and women facing stigma, violence, or economic hardship. Our programs are community-led: designed and delivered by people who understand the lived experience of the women we serve, across 10 districts with 8+ partner organizations.",
      si: "CSDF ශ්‍රී ලංකාව පුරා කොන් වූ කාන්තාවන්ට සේවය කරයි. අපගේ වැඩසටහන් ප්‍රජා නායකත්වයෙන් යුක්තයි: අප සේවය කරන කාන්තාවන්ගේ ජීවන අත්දැකීම් තේරුම් ගන්නා අය විසින් නිර්මාණය කර ක්‍රියාත්මක කරනු ලැබේ — දිස්ත්‍රික්ක 10ක්, හවුල්කාර ආයතන 8+ක් සමඟ.",
      ta: "CSDF இலங்கை முழுவதும் ஓரங்கட்டப்பட்ட பெண்களுக்கு சேவை செய்கிறது. எங்கள் திட்டங்கள் சமூகத்தால் வழிநடத்தப்படுகின்றன: நாங்கள் சேவை செய்யும் பெண்களின் வாழ்க்கை அனுபவத்தைப் புரிந்துகொள்பவர்களால் வடிவமைக்கப்பட்டு வழங்கப்படுகின்றன — 10 மாவட்டங்களில், 8+ பங்காளர் அமைப்புகளுடன்.",
    },
    donate_intro: {
      en: "Your support funds direct services, peer leadership, health education, and safe community spaces.",
      si: "ඔබගේ සහාය සෘජු සේවා, සම නායකත්වය, සෞඛ්‍ය අධ්‍යාපනය සහ ආරක්ෂිත ප්‍රජා අවකාශ සඳහා යොදවනු ලැබේ.",
      ta: "உங்கள் ஆதரவு நேரடி சேவைகள், சக தலைமைத்துவம், சுகாதாரக் கல்வி மற்றும் பாதுகாப்பான சமூக இடங்களுக்கு நிதியளிக்கிறது.",
    },
    bank_details: {
      en: "Account Name: Community Strength Development Foundation\nBank: (your bank)\nBranch: (your branch)\nAccount No: (your account number)\nSWIFT: (for international transfers)",
    },
  };

  for (const [key, v] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, valueEn: v.en, valueSi: v.si ?? null, valueTa: v.ta ?? null },
    });
  }

  // ---------- Stats ----------
  const stats = [
    { labelEn: "Community Members Supported", labelSi: "සහාය ලැබූ ප්‍රජා සාමාජිකයින්", labelTa: "ஆதரவு பெற்ற சமூக உறுப்பினர்கள்", value: "5,000+", order: 1 },
    { labelEn: "Health Clinics Conducted", labelSi: "පවත්වන ලද සෞඛ්‍ය සායන", labelTa: "நடத்தப்பட்ட சுகாதார கிளினிக்குகள்", value: "320+", order: 2 },
    { labelEn: "Training Sessions", labelSi: "පුහුණු සැසි", labelTa: "பயிற்சி அமர்வுகள்", value: "450+", order: 3 },
    { labelEn: "Districts Reached", labelSi: "ළඟා වූ දිස්ත්‍රික්ක", labelTa: "சென்றடைந்த மாவட்டங்கள்", value: "10", order: 4 },
  ];
  if ((await prisma.stat.count()) === 0) {
    await prisma.stat.createMany({ data: stats });
  }

  // ---------- Services ----------
  const services = [
    {
      icon: "❤️",
      titleEn: "Healthcare",
      titleSi: "සෞඛ්‍ය සේවා",
      titleTa: "சுகாதாரம்",
      descriptionEn: "Medical referrals and wellness support that connect women to responsive, respectful care.",
      descriptionSi: "කාන්තාවන්ට ගරුත්වයෙන් යුත් සෞඛ්‍ය සේවා වෙත සම්බන්ධ කරන වෛද්‍ය යොමු කිරීම් සහ සුවතා සහාය.",
      descriptionTa: "பெண்களை மரியாதையான சுகாதாரப் பராமரிப்புடன் இணைக்கும் மருத்துவ பரிந்துரைகள் மற்றும் நல ஆதரவு.",
      order: 1,
    },
    {
      icon: "🩺",
      titleEn: "HIV Prevention",
      titleSi: "HIV වැළැක්වීම",
      titleTa: "HIV தடுப்பு",
      descriptionEn: "Awareness, prevention, and testing support that prioritizes confidentiality and informed choice.",
      descriptionSi: "රහස්‍යභාවය සහ දැනුවත් තේරීම ප්‍රමුඛ කරගත් දැනුවත් කිරීම, වැළැක්වීම සහ පරීක්ෂණ සහාය.",
      descriptionTa: "இரகசியத்தன்மை மற்றும் அறிவார்ந்த தேர்வுக்கு முன்னுரிமை அளிக்கும் விழிப்புணர்வு, தடுப்பு மற்றும் பரிசோதனை ஆதரவு.",
      order: 2,
    },
    {
      icon: "💬",
      titleEn: "Mental Health & Counselling",
      titleSi: "මානසික සෞඛ්‍යය සහ උපදේශනය",
      titleTa: "மனநலம் & ஆலோசனை",
      descriptionEn: "Professional counselling and peer support that build resilience, healing, and confidence.",
      descriptionSi: "ඔරොත්තු දීමේ හැකියාව, සුවවීම සහ විශ්වාසය ගොඩනගන වෘත්තීය උපදේශන සහ සම සහාය.",
      descriptionTa: "மீள்திறன், குணமடைதல் மற்றும் நம்பிக்கையை வளர்க்கும் தொழில்முறை ஆலோசனை மற்றும் சக ஆதரவு.",
      order: 3,
    },
    {
      icon: "⚖️",
      titleEn: "Legal Assistance",
      titleSi: "නීති සහාය",
      titleTa: "சட்ட உதவி",
      descriptionEn: "Rights awareness and legal guidance to help women navigate violence, stigma, and barriers.",
      descriptionSi: "ප්‍රචණ්ඩත්වය, අපකීර්තිය සහ බාධක ජය ගැනීමට කාන්තාවන්ට උපකාර වන අයිතිවාසිකම් දැනුවත් කිරීම සහ නීති මඟපෙන්වීම.",
      descriptionTa: "வன்முறை, களங்கம் மற்றும் தடைகளை எதிர்கொள்ள பெண்களுக்கு உதவும் உரிமை விழிப்புணர்வு மற்றும் சட்ட வழிகாட்டுதல்.",
      order: 4,
    },
    {
      icon: "🌍",
      titleEn: "Community Outreach",
      titleSi: "ප්‍රජා සම්බන්ධතා",
      titleTa: "சமூக அணுகல்",
      descriptionEn: "Field visits and community engagement that bring practical support closer to where women are.",
      descriptionSi: "කාන්තාවන් සිටින තැනට ප්‍රායෝගික සහාය ළං කරන ක්ෂේත්‍ර චාරිකා සහ ප්‍රජා මැදිහත්වීම්.",
      descriptionTa: "பெண்கள் இருக்கும் இடத்திற்கு நடைமுறை ஆதரவை நெருக்கமாக்கும் கள விஜயங்கள் மற்றும் சமூக ஈடுபாடு.",
      order: 5,
    },
    {
      icon: "📚",
      titleEn: "Capacity Building",
      titleSi: "ධාරිතා සංවර්ධනය",
      titleTa: "திறன் மேம்பாடு",
      descriptionEn: "Skills development and leadership programs that strengthen long-term independence.",
      descriptionSi: "දිගුකාලීන ස්වාධීනත්වය ශක්තිමත් කරන කුසලතා සංවර්ධන සහ නායකත්ව වැඩසටහන්.",
      descriptionTa: "நீண்டகால சுதந்திரத்தை வலுப்படுத்தும் திறன் மேம்பாடு மற்றும் தலைமைத்துவ திட்டங்கள்.",
      order: 6,
    },
  ];
  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({ data: services });
  }

  // ---------- Projects ----------
  const projects = [
    {
      titleEn: "Women's Health Program",
      titleSi: "කාන්තා සෞඛ්‍ය වැඩසටහන",
      titleTa: "பெண்கள் சுகாதாரத் திட்டம்",
      descriptionEn: "Improving access to quality, respectful healthcare through mobile clinics and referrals.",
      descriptionSi: "ජංගම සායන සහ යොමු කිරීම් හරහා ගුණාත්මක, ගරුත්වයෙන් යුත් සෞඛ්‍ය සේවා ප්‍රවේශය වැඩිදියුණු කිරීම.",
      descriptionTa: "நடமாடும் கிளினிக்குகள் மற்றும் பரிந்துரைகள் மூலம் தரமான, மரியாதையான சுகாதார அணுகலை மேம்படுத்துதல்.",
      status: "ongoing",
      order: 1,
    },
    {
      titleEn: "Rights Awareness Initiative",
      titleSi: "අයිතිවාසිකම් දැනුවත් කිරීමේ වැඩසටහන",
      titleTa: "உரிமை விழிப்புணர்வு முயற்சி",
      descriptionEn: "Educating communities on legal rights and protections through workshops and peer educators.",
      descriptionSi: "වැඩමුළු සහ සම අධ්‍යාපනඥයින් හරහා නීතිමය අයිතිවාසිකම් සහ ආරක්ෂාවන් පිළිබඳ ප්‍රජාවන් දැනුවත් කිරීම.",
      descriptionTa: "பட்டறைகள் மற்றும் சக கல்வியாளர்கள் மூலம் சட்ட உரிமைகள் மற்றும் பாதுகாப்புகள் குறித்து சமூகங்களுக்கு கற்பித்தல்.",
      status: "ongoing",
      order: 2,
    },
    {
      titleEn: "Peer Leadership Training",
      titleSi: "සම නායකත්ව පුහුණුව",
      titleTa: "சக தலைமைத்துவ பயிற்சி",
      descriptionEn: "Training community members to become confident advocates for themselves and others.",
      descriptionSi: "ප්‍රජා සාමාජිකයින් තමන් සහ අන් අය වෙනුවෙන් විශ්වාසයෙන් පෙනී සිටින්නන් බවට පුහුණු කිරීම.",
      descriptionTa: "சமூக உறுப்பினர்களை தங்களுக்கும் பிறருக்கும் நம்பிக்கையான வக்கீல்களாக பயிற்றுவித்தல்.",
      status: "ongoing",
      order: 3,
    },
    {
      titleEn: "Economic Empowerment Project",
      titleSi: "ආර්ථික සවිබල ගැන්වීමේ ව්‍යාපෘතිය",
      titleTa: "பொருளாதார மேம்பாட்டுத் திட்டம்",
      descriptionEn: "Supporting financial independence through livelihood skills and community-based business.",
      descriptionSi: "ජීවනෝපාය කුසලතා සහ ප්‍රජා ව්‍යාපාර හරහා මූල්‍ය ස්වාධීනත්වයට සහාය වීම.",
      descriptionTa: "வாழ்வாதார திறன்கள் மற்றும் சமூக வணிகம் மூலம் நிதி சுதந்திரத்தை ஆதரித்தல்.",
      status: "ongoing",
      order: 4,
    },
  ];
  if ((await prisma.project.count()) === 0) {
    await prisma.project.createMany({ data: projects });
  }

  // ---------- Testimonials ----------
  const testimonials = [
    {
      quoteEn: "CSDF helped me access healthcare without fear or judgment. The support team treated me with respect and made it easier to ask for help.",
      quoteSi: "CSDF මට බියෙන් හෝ විනිශ්චයෙන් තොරව සෞඛ්‍ය සේවා ලබා ගැනීමට උදව් කළා. සහාය කණ්ඩායම මට ගෞරවයෙන් සැලකූ අතර උදව් ඉල්ලීම පහසු කළා.",
      quoteTa: "CSDF பயமோ தீர்ப்போ இன்றி சுகாதாரப் பராமரிப்பை அணுக எனக்கு உதவியது. ஆதரவு குழு என்னை மரியாதையுடன் நடத்தியது.",
      authorEn: "Peer educator, outreach program participant",
      authorSi: "සම අධ්‍යාපනඥ, ප්‍රජා වැඩසටහන් සහභාගිකාරිය",
      authorTa: "சக கல்வியாளர், அணுகல் திட்ட பங்கேற்பாளர்",
      order: 1,
    },
    {
      quoteEn: "The leadership training gave me confidence to speak up for myself and support others in my community.",
      quoteSi: "නායකත්ව පුහුණුව මට මා වෙනුවෙන් කතා කිරීමට සහ මගේ ප්‍රජාවේ අනෙක් අයට සහාය වීමට විශ්වාසය ලබා දුන්නා.",
      quoteTa: "தலைமைத்துவ பயிற்சி எனக்காக பேசவும் என் சமூகத்தில் மற்றவர்களை ஆதரிக்கவும் நம்பிக்கை அளித்தது.",
      authorEn: "Community leader, peer leadership cohort",
      authorSi: "ප්‍රජා නායිකාව, සම නායකත්ව කණ්ඩායම",
      authorTa: "சமூகத் தலைவர், சக தலைமைத்துவ குழு",
      order: 2,
    },
    {
      quoteEn: "Counselling and legal guidance helped me navigate a difficult situation and reconnect with my future goals.",
      quoteSi: "උපදේශනය සහ නීති මඟපෙන්වීම මට දුෂ්කර තත්ත්වයක් ජය ගැනීමට සහ මගේ අනාගත ඉලක්ක සමඟ නැවත සම්බන්ධ වීමට උදව් කළා.",
      quoteTa: "ஆலோசனையும் சட்ட வழிகாட்டுதலும் கடினமான சூழ்நிலையை கடக்கவும் என் எதிர்கால இலக்குகளுடன் மீண்டும் இணையவும் உதவின.",
      authorEn: "Programme participant, legal support initiative",
      authorSi: "වැඩසටහන් සහභාගිකාරිය, නීති සහාය වැඩසටහන",
      authorTa: "திட்ட பங்கேற்பாளர், சட்ட ஆதரவு முயற்சி",
      order: 3,
    },
  ];
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({ data: testimonials });
  }

  // ---------- Partners ----------
  const partners = [
    "Health Alliance",
    "Women Rise Network",
    "Safe Access Foundation",
    "Community Justice Hub",
    "Urban Outreach Lab",
    "CareLink Initiative",
  ].map((name, i) => ({ name, order: i + 1 }));
  if ((await prisma.partner.count()) === 0) {
    await prisma.partner.createMany({ data: partners });
  }

  // ---------- Sample news ----------
  const news = [
    {
      titleEn: "Mobile clinic reaches new outreach areas",
      titleSi: "ජංගම සායනය නව ප්‍රදේශ වෙත ළඟා වේ",
      titleTa: "நடமாடும் கிளினிக் புதிய பகுதிகளை சென்றடைகிறது",
      excerptEn: "Expanded community visits are improving referral access and preventive care uptake.",
      contentEn: "Expanded community visits are improving referral access and preventive care uptake. Our mobile clinic team has begun regular visits to new outreach areas, bringing health screenings, referrals, and wellness education directly to communities.\n\nThe expansion was made possible through our partner network and the dedication of our peer educators, who help build trust and make services accessible without stigma.",
      contentSi: "පුළුල් කරන ලද ප්‍රජා චාරිකා යොමු කිරීමේ ප්‍රවේශය සහ නිවාරණ සත්කාර වැඩිදියුණු කරයි. අපගේ ජංගම සායන කණ්ඩායම නව ප්‍රදේශවලට නිතිපතා චාරිකා ආරම්භ කර ඇති අතර, සෞඛ්‍ය පරීක්ෂණ, යොමු කිරීම් සහ සුවතා අධ්‍යාපනය ප්‍රජාවන් වෙත සෘජුවම ගෙන යයි.",
      contentTa: "விரிவாக்கப்பட்ட சமூக விஜயங்கள் பரிந்துரை அணுகலையும் தடுப்புப் பராமரிப்பையும் மேம்படுத்துகின்றன. எங்கள் நடமாடும் கிளினிக் குழு புதிய பகுதிகளுக்கு வழக்கமான விஜயங்களைத் தொடங்கியுள்ளது.",
      publishedAt: new Date("2026-07-12"),
    },
    {
      titleEn: "Peer leaders complete advocacy training",
      titleSi: "සම නායකයින් පෙනී සිටීමේ පුහුණුව සම්පූර්ණ කරයි",
      titleTa: "சக தலைவர்கள் வாதிடல் பயிற்சியை நிறைவு செய்தனர்",
      excerptEn: "New graduates are supporting rights awareness and local community mobilization.",
      contentEn: "New graduates are supporting rights awareness and local community mobilization. This cohort of peer leaders completed an intensive training program covering legal literacy, communication skills, and community organizing.\n\nGraduates will now lead awareness sessions in their own communities, extending the reach of our rights awareness initiative.",
      contentSi: "නව උපාධිධාරීන් අයිතිවාසිකම් දැනුවත් කිරීම සහ ප්‍රාදේශීය ප්‍රජා බලමුලු ගැන්වීමට සහාය වේ. මෙම සම නායක කණ්ඩායම නීති සාක්ෂරතාව, සන්නිවේදන කුසලතා සහ ප්‍රජා සංවිධානය ආවරණය කරන දැඩි පුහුණු වැඩසටහනක් සම්පූර්ණ කළහ.",
      contentTa: "புதிய பட்டதாரிகள் உரிமை விழிப்புணர்வு மற்றும் உள்ளூர் சமூக அணிதிரட்டலுக்கு ஆதரவளிக்கின்றனர். இந்த சக தலைவர்கள் குழு சட்ட எழுத்தறிவு, தொடர்பு திறன்கள் மற்றும் சமூக ஒழுங்கமைப்பை உள்ளடக்கிய தீவிர பயிற்சித் திட்டத்தை நிறைவு செய்தது.",
      publishedAt: new Date("2026-07-01"),
    },
  ];
  if ((await prisma.news.count()) === 0) {
    for (const n of news) await prisma.news.create({ data: n });
  }

  // ---------- Sample events ----------
  const events = [
    {
      titleEn: "Community Health Camp",
      titleSi: "ප්‍රජා සෞඛ්‍ය කඳවුර",
      titleTa: "சமூக சுகாதார முகாம்",
      descriptionEn: "Health screening, referrals, and wellness education in a welcoming environment.",
      descriptionSi: "සුහද පරිසරයක සෞඛ්‍ය පරීක්ෂාව, යොමු කිරීම් සහ සුවතා අධ්‍යාපනය.",
      descriptionTa: "வரவேற்கத்தக்க சூழலில் சுகாதார பரிசோதனை, பரிந்துரைகள் மற்றும் நலக் கல்வி.",
      location: "Kolonnawa, Colombo",
      startDate: new Date(Date.now() + 14 * 24 * 3600 * 1000),
    },
    {
      titleEn: "Rights and Safety Workshop",
      titleSi: "අයිතිවාසිකම් සහ ආරක්ෂාව පිළිබඳ වැඩමුළුව",
      titleTa: "உரிமைகள் மற்றும் பாதுகாப்பு பட்டறை",
      descriptionEn: "Practical legal literacy, response planning, and community protection strategies.",
      descriptionSi: "ප්‍රායෝගික නීති සාක්ෂරතාව, ප්‍රතිචාර සැලසුම් සහ ප්‍රජා ආරක්ෂණ උපාය මාර්ග.",
      descriptionTa: "நடைமுறை சட்ட எழுத்தறிவு, மறுமொழி திட்டமிடல் மற்றும் சமூக பாதுகாப்பு உத்திகள்.",
      location: "Colombo",
      startDate: new Date(Date.now() + 21 * 24 * 3600 * 1000),
    },
  ];
  if ((await prisma.event.count()) === 0) {
    for (const e of events) await prisma.event.create({ data: e });
  }

  console.log("✔ Seed complete.");
  console.log("  Admin login: admin@csdf.lk / admin12345");
  console.log("  ⚠ Change the password after first login (Dashboard → Change Password).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
