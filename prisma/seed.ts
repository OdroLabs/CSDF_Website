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
    { labelEn: "Community Members Supported", labelSi: "සහාය ලැබූ ප්‍රජා සාමාජිකයින්", labelTa: "ஆதரவு பெற்ற சமூக உறுப்பினர்கள்", value: "5000+", order: 1 },
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
      contentEn:
        "Access to respectful, responsive healthcare is at the heart of everything CSDF does. Many of the women we serve face stigma, cost barriers, or fear of judgment when seeking medical care — so we walk with them through every step of the journey.\n\nOur healthcare service connects women to trusted clinics and hospitals through a referral network built over two decades. Peer navigators accompany women to appointments where needed, help explain procedures and results, and follow up to make sure treatment plans are completed. Regular mobile wellness clinics bring screenings and basic care directly into communities.",
      featuresEn:
        "Trusted referral network of clinics & hospitals\nPeer navigators who accompany appointments\nMobile wellness clinics in 10 districts\nFree health screenings and follow-up\nConfidential, judgment-free care\nHealth education workshops",
      benefitsEn:
        "Better Health Outcomes :: Women complete treatment plans at far higher rates when supported by a peer navigator from first referral to final follow-up.\nCare Without Stigma :: Every partner facility in our network is oriented to provide respectful, confidential, judgment-free care.\nEarly Detection :: Regular mobile clinic screenings catch health issues early, when they are easiest and least costly to treat.",
      faqsEn:
        "Is the service really free? :: Yes. Screenings, referrals, and accompaniment are provided at no cost. Where hospital fees apply, we help access fee-waiver schemes.\nWill my information be kept private? :: Absolutely. All records are confidential and nothing is shared without your written consent.\nHow do I get a referral? :: Contact our office, speak to any CSDF peer educator, or visit a mobile clinic — no documents or prior appointment needed.\nCan you accompany me to the hospital? :: Yes. A trained peer navigator can accompany you to appointments if you would like support.",
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
      contentEn:
        "CSDF has been a frontline partner in Sri Lanka's HIV response for over two decades, reaching communities that formal health systems often miss. Our approach puts confidentiality and informed choice first — no one is ever pressured, and no one is ever judged.\n\nTrained peer educators deliver accurate prevention information in community settings, distribute prevention materials, and support access to voluntary testing. For anyone who tests positive, we provide immediate emotional support, fast-tracked linkage to treatment, and ongoing peer accompaniment so nobody faces the journey alone.",
      featuresEn:
        "Peer-led prevention education\nFree condom & prevention material distribution\nSupport for voluntary, confidential testing\nFast-track linkage to treatment services\nOngoing peer support after diagnosis\nStigma-reduction campaigns",
      benefitsEn:
        "Informed Choices :: Accurate, judgment-free information lets every person make their own decisions about testing and prevention.\nEarlier Diagnosis :: Community-based outreach means testing reaches people years earlier than clinic-only models.\nNo One Left Alone :: Peer supporters stay connected after diagnosis, improving treatment retention and wellbeing.",
      faqsEn:
        "Is testing confidential? :: Yes. Testing is voluntary and confidential, and we can connect you to anonymous testing options.\nWhat happens if I test positive? :: A trained peer supporter will be with you from day one — emotionally and practically — and help you start treatment quickly.\nDo you only work with certain communities? :: We serve everyone, with dedicated programs for communities facing the highest barriers to care.\nHow can I get prevention materials? :: Through any peer educator, our office, or community outreach events — always free.",
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
      contentEn:
        "Healing takes more than medicine. Many of the women CSDF serves carry the weight of violence, stigma, loss, and economic stress — often with nowhere safe to talk about it.\n\nOur counselling service offers a safe, confidential space with trained counsellors, in person or by phone, in Sinhala and Tamil. Alongside professional counselling, peer support circles bring women together to share experiences and build resilience with others who truly understand. Sessions are free, and women decide the pace — there is no pressure and no time limit on healing.",
      featuresEn:
        "Trained, compassionate counsellors\nSessions in Sinhala and Tamil\nIn-person and phone counselling\nPeer support circles\nCrisis support referrals\nCompletely free and confidential",
      benefitsEn:
        "A Safe Space :: A confidential room and a trusted listener — often the first safe space a woman has ever had to speak freely.\nStronger Together :: Peer circles turn isolation into community, with women supporting each other long after sessions end.\nPractical Coping Tools :: Counsellors teach concrete techniques for stress, grief, and anxiety that work in daily life.",
      faqsEn:
        "Do I need an appointment? :: Walk-ins are welcome, but calling ahead helps us match you with the right counsellor in your language.\nIs counselling really confidential? :: Yes. Nothing you share leaves the room without your consent, except where someone's immediate safety is at risk.\nWhat if I just want to talk once? :: That's fine. There's no minimum commitment — come once, or come every week.\nCan you help in an emergency? :: We can connect you to crisis services immediately, including shelter and urgent medical or legal help.",
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
      contentEn:
        "Knowing your rights is the first step to defending them. CSDF's legal assistance program helps marginalized women understand and use the protections the law already gives them — and stands beside them when those rights are violated.\n\nWe run rights-awareness workshops in communities, provide one-to-one legal guidance for issues such as violence, harassment, documentation, and discrimination, and connect women to sympathetic lawyers and legal aid services. When a woman must face police stations or courts, a trained CSDF companion can accompany her so she never stands alone.",
      featuresEn:
        "Rights-awareness workshops\nOne-to-one legal guidance\nReferrals to legal aid & lawyers\nAccompaniment to police & courts\nHelp with ID and documentation\nSupport for violence survivors",
      benefitsEn:
        "Rights Made Real :: Legal knowledge is translated into plain Sinhala and Tamil, so every woman knows exactly what protections she holds.\nConfidence to Act :: Accompaniment to police stations and courts removes the fear that stops most women from seeking justice.\nFaster Resolutions :: Early legal guidance resolves many disputes before they ever reach a courtroom.",
      faqsEn:
        "I can't afford a lawyer — can you still help? :: Yes. Our guidance is free and we connect you to legal aid services that cost nothing.\nWill you come with me to the police station? :: Yes, a trained companion can accompany you to police stations, courts, and government offices.\nI'm missing my NIC / birth certificate. Can you help? :: Yes, helping women obtain identity documents is one of our most common services.\nIs my case kept confidential? :: Completely. We never share your information without your consent.",
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
      contentEn:
        "The women who most need support are often the least able to travel to find it. That is why CSDF goes to them. Our outreach teams — most of them women from the very communities we serve — make regular field visits across 10 districts.\n\nEach visit brings practical help: health information and referrals, prevention materials, counselling check-ins, legal signposting, and simply a trusted face who listens. Outreach is also how we learn — every field visit shapes our programs around what communities actually need, not what we assume they need.",
      featuresEn:
        "Regular field visits in 10 districts\nCommunity-based peer educators\nOn-the-spot referrals & signposting\nPrevention material distribution\nTrust built over 20+ years\nCommunity feedback drives programs",
      benefitsEn:
        "Support That Travels :: Services reach women where they live and work, removing transport cost and time barriers entirely.\nTrusted Faces :: Outreach is led by peers from the same communities, so trust is built in from the first visit.\nPrograms That Fit :: Continuous community feedback means our services evolve with real needs on the ground.",
      faqsEn:
        "How do I know when outreach visits my area? :: Peer educators announce visits through community networks — or contact our office and we'll tell you the schedule.\nCan I request a visit? :: Yes. Community groups can request outreach visits or awareness sessions at any time.\nWho are the outreach workers? :: Trained peer educators, most of whom come from the communities they serve.\nIs everything at outreach free? :: Yes — materials, referrals, and support are always free.",
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
      contentEn:
        "Lasting change comes when women lead it themselves. CSDF's capacity building programs develop the skills, confidence, and networks that turn today's participants into tomorrow's community leaders.\n\nTraining covers practical livelihoods — tailoring, food production, small-business management, and financial literacy — alongside leadership development: public speaking, advocacy, and peer education. Graduates go on to run their own businesses, lead outreach teams, and represent their communities in forums where decisions are made.",
      featuresEn:
        "Livelihood & vocational training\nSmall-business & financial literacy\nLeadership & advocacy development\nPeer educator certification\nMentoring by program graduates\nSeed support for new businesses",
      benefitsEn:
        "Economic Independence :: Practical skills and seed support help women build stable incomes on their own terms.\nLeaders From Within :: Graduates become peer educators and advocates, multiplying the program's impact across communities.\nConfidence That Lasts :: Public speaking and advocacy training gives women a voice in decisions that affect their lives.",
      faqsEn:
        "Who can join the training programs? :: Any woman in our partner communities — no prior education or experience required.\nAre the courses free? :: Yes, all training is free, and materials are provided.\nHow long do programs run? :: Most livelihood courses run 6–12 weeks; leadership tracks continue with ongoing mentoring.\nWhat happens after I finish? :: Graduates receive follow-up mentoring, and promising business plans can access seed support.",
      order: 6,
    },
  ];
  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({ data: services });
  } else {
    // Backfill detail-page demo content into existing services that don't have it yet
    for (const svc of services) {
      await prisma.service.updateMany({
        where: { titleEn: svc.titleEn, contentEn: null },
        data: {
          contentEn: svc.contentEn,
          featuresEn: svc.featuresEn,
          benefitsEn: svc.benefitsEn,
          faqsEn: svc.faqsEn,
        },
      });
    }
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
      contentEn:
        "The Women's Health Program is CSDF's flagship initiative, born from a simple observation: the women who most need healthcare are often the least able to reach it. Cost, distance, stigma, and fear of judgment keep too many women away from clinics until small problems become serious ones.\n\nThe program runs regular mobile wellness clinics across our partner districts, staffed by nurses and supported by trained peer navigators. Each clinic offers free screenings, health education, and direct referrals into our trusted network of hospitals and specialist services. Peer navigators then follow each referral through to completion — accompanying women to appointments, explaining procedures, and making sure no one falls through the cracks.",
      objectivesEn:
        "Bring free health screenings to underserved communities\nBuild a trusted referral network of respectful providers\nTrain peer navigators from within the community\nRaise health awareness through community education\nReduce late diagnosis through early screening\nEliminate stigma as a barrier to care",
      outcomesEn:
        "Screenings Delivered :: Over 320 mobile clinics conducted, delivering thousands of free screenings across 10 districts.\nReferrals Completed :: Peer navigation more than doubled the rate of completed hospital referrals among participants.\nCommunity Trust :: Clinics are now requested by community leaders, with attendance growing every quarter.",
      location: "10 districts across Sri Lanka",
      beneficiariesEn: "5,000+ women reached",
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
      contentEn:
        "Rights that women don't know about are rights they cannot use. The Rights Awareness Initiative translates Sri Lanka's legal protections into plain Sinhala and Tamil and delivers them where women actually are — in markets, community halls, and workplaces.\n\nWorkshops cover protection from violence and harassment, labour rights, access to identity documentation, and how to engage police and courts safely. Sessions are led by trained peer educators alongside sympathetic legal professionals, and every participant leaves with a simple rights handbook and a direct line to CSDF's legal assistance service when they need real help.",
      objectivesEn:
        "Translate legal rights into plain, practical language\nRun community workshops in Sinhala and Tamil\nTrain peer educators to sustain rights education\nConnect participants to free legal assistance\nHelp women obtain missing identity documents\nBuild confidence to engage police and courts",
      outcomesEn:
        "Workshops Held :: Hundreds of rights-awareness sessions delivered across partner communities.\nDocuments Secured :: Many women supported to obtain NICs and birth certificates, unlocking services and voting rights.\nCases Resolved :: Early legal guidance resolved disputes before escalation in a majority of supported cases.",
      location: "Community venues in 10 districts",
      beneficiariesEn: "2,500+ workshop participants",
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
      contentEn:
        "Change lasts when it is led from within. Peer Leadership Training identifies women with the trust of their communities and equips them to become educators, advocates, and organizers.\n\nThe curriculum combines practical skills — public speaking, facilitation, basic counselling, and outreach methods — with deeper leadership development over a six-month mentored journey. Graduates lead CSDF outreach teams, run their own community sessions, and represent their communities in district forums. Many of today's CSDF staff and peer educators are graduates of this very program.",
      objectivesEn:
        "Identify and mentor emerging community leaders\nTeach facilitation, outreach, and advocacy skills\nProvide six months of guided field experience\nCertify graduates as CSDF peer educators\nCreate pathways into program leadership roles\nBuild a self-sustaining leadership pipeline",
      outcomesEn:
        "Leaders Certified :: Multiple cohorts of certified peer educators now lead outreach across all partner districts.\nPrograms Multiplied :: Graduate-led sessions have extended CSDF's reach far beyond what staff alone could deliver.\nVoices Heard :: Graduates now represent their communities in district coordination forums.",
      location: "CSDF training centres & field sites",
      beneficiariesEn: "450+ training sessions delivered",
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
      contentEn:
        "Economic dependence keeps women trapped in unsafe situations. The Economic Empowerment Project builds the practical foundations of financial independence: marketable skills, business knowledge, and a supportive community of women entrepreneurs.\n\nParticipants choose a livelihood track — tailoring, food production, handicrafts, or small trade — and pair it with financial literacy training covering budgeting, savings, and pricing. Promising business plans receive seed support and mentoring, and finished products are showcased through CSDF's Community Business platform, connecting women producers directly to buyers.",
      objectivesEn:
        "Deliver vocational training in four livelihood tracks\nTeach budgeting, savings, and business basics\nProvide seed support for viable business plans\nMentor new entrepreneurs through their first year\nMarket products via the Community Business platform\nBuild peer networks of women producers",
      outcomesEn:
        "Businesses Launched :: Dozens of women-led micro-businesses now generate independent income.\nIncomes Raised :: Participants report meaningfully higher and more stable household income after graduation.\nProducts to Market :: The Community Business showcase connects producers directly to customers via WhatsApp ordering.",
      location: "6 districts, expanding annually",
      beneficiariesEn: "300+ women entrepreneurs supported",
      status: "ongoing",
      order: 4,
    },
  ];
  if ((await prisma.project.count()) === 0) {
    await prisma.project.createMany({ data: projects });
  } else {
    // Backfill detail-page demo content into existing projects that don't have it yet
    for (const proj of projects) {
      await prisma.project.updateMany({
        where: { titleEn: proj.titleEn, contentEn: null },
        data: {
          contentEn: proj.contentEn,
          objectivesEn: proj.objectivesEn,
          outcomesEn: proj.outcomesEn,
          location: proj.location,
          beneficiariesEn: proj.beneficiariesEn,
        },
      });
    }
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
      highlightsEn:
        "Regular visits now cover several new outreach areas\nFree screenings, referrals, and wellness education\nPeer educators build trust and reduce stigma\nMade possible through our partner network",
      quoteEn:
        "For many women, this is the first time healthcare has come to them instead of the other way around. :: Mobile clinic team lead",
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
      highlightsEn:
        "Intensive training in legal literacy and communication\nGraduates will lead sessions in their own communities\nExtends the reach of the rights awareness initiative\nOngoing mentoring for every graduate",
      quoteEn:
        "I came here quiet. I am leaving as someone my community can turn to. :: Peer leadership graduate",
      publishedAt: new Date("2026-07-01"),
    },
  ];
  if ((await prisma.news.count()) === 0) {
    for (const n of news) await prisma.news.create({ data: n });
  } else {
    // Backfill rich demo content into existing news that don't have it yet
    for (const n of news) {
      await prisma.news.updateMany({
        where: { titleEn: n.titleEn, highlightsEn: null },
        data: { highlightsEn: n.highlightsEn, quoteEn: n.quoteEn },
      });
    }
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
      contentEn:
        "Join us for a full day of free health services in a welcoming, judgment-free environment. The Community Health Camp brings CSDF's mobile clinic team, partner medical staff, and peer educators together under one roof.\n\nAll services are free and confidential. No appointment, documents, or referral letters are needed — just come as you are. Sinhala- and Tamil-speaking staff will be available throughout the day.",
      highlightsEn:
        "Free general health screenings\nConfidential testing and counselling\nReferrals to partner hospitals\nWellness and nutrition education\nSinhala & Tamil speaking staff\nChild-friendly waiting area",
      agendaEn:
        "9.00 am :: Registration & welcome\n9.30 am :: Health screenings begin\n11.00 am :: Wellness education session\n1.00 pm :: Community lunch\n2.00 pm :: Counselling & referral desk\n4.00 pm :: Closing & follow-up scheduling",
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
      contentEn:
        "A practical, hands-on workshop that turns legal rights from abstract ideas into tools women can actually use. Led by CSDF peer educators alongside sympathetic legal professionals, the session covers protection from violence and harassment, safe engagement with police, and community response planning.\n\nParticipation is free and confidential. Every participant receives a plain-language rights handbook in Sinhala or Tamil and direct contacts for CSDF's legal assistance service.",
      highlightsEn:
        "Plain-language legal literacy training\nSafe police & court engagement guidance\nCommunity protection planning\nFree rights handbook for every participant\nDirect line to CSDF legal assistance\nConfidential, women-only space",
      agendaEn:
        "9.30 am :: Welcome & introductions\n10.00 am :: Know your rights — core session\n11.30 am :: Engaging police and courts safely\n1.00 pm :: Lunch break\n2.00 pm :: Community response planning\n3.30 pm :: Q&A with legal professionals",
      startDate: new Date(Date.now() + 21 * 24 * 3600 * 1000),
    },
  ];
  if ((await prisma.event.count()) === 0) {
    for (const e of events) await prisma.event.create({ data: e });
  } else {
    // Backfill rich demo content into existing events that don't have it yet
    for (const e of events) {
      await prisma.event.updateMany({
        where: { titleEn: e.titleEn, contentEn: null },
        data: { contentEn: e.contentEn, highlightsEn: e.highlightsEn, agendaEn: e.agendaEn },
      });
    }
  }

  // ---------- URL slugs ----------
  // Generate slugs from the English title for any row that doesn't have one yet
  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  for (const model of ["project", "service", "news", "event"] as const) {
    const delegate = (prisma as any)[model];
    const rows: { id: number; titleEn: string }[] = await delegate.findMany({
      where: { slug: null },
      select: { id: true, titleEn: true },
    });
    for (const row of rows) {
      const base = toSlug(row.titleEn) || `${model}-${row.id}`;
      let candidate = base;
      for (let i = 2; ; i++) {
        const clash = await delegate.findFirst({
          where: { slug: candidate, id: { not: row.id } },
          select: { id: true },
        });
        if (!clash) break;
        candidate = `${base}-${i}`;
      }
      await delegate.update({ where: { id: row.id }, data: { slug: candidate } });
    }
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
