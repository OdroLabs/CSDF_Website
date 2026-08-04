/**
 * One-off data fix: a handful of live Service records have corrupted Sinhala
 * titles/descriptions (rendering as garbled, non-word Sinhala text — almost
 * certainly from Sinhala content originally typed in a legacy pre-Unicode
 * font and pasted in as if it were Unicode). Tamil fields for the same rows
 * were empty and were silently falling back to English on the public site.
 *
 * This script does NOT touch titleEn/descriptionEn (those are intact) — it
 * matches each row by its exact existing English description, then fills in
 * freshly-written Sinhala and Tamil title + description translations.
 *
 * IMPORTANT: these translations were produced by AI from the English source
 * text, not supplied by CSDF. Please have a Sinhala/Tamil speaker on your
 * team review them in Admin → Content → Services before treating them as
 * final — this script is meant to replace garbled text with clean, correct
 * Unicode Sinhala/Tamil, not to be the last word on wording.
 *
 * Run once with: npm run fix:service-translations
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fixes = [
  {
    matchDescriptionEn:
      "A confidential first point of contact for people facing urgent, sensitive or complex situations. We listen, assess needs and coordinate appropriate help.",
    titleSi: "රහස්‍ය සහාය",
    titleTa: "இரகசிய ஆதரவு",
    descriptionSi:
      "හදිසි, සංවේදී හෝ සංකීර්ණ තත්ත්වයන්ට මුහුණ දෙන පුද්ගලයින් සඳහා රහස්‍යභාවයෙන් යුත් පළමු සම්බන්ධතා ලක්ෂ්‍යය. අපි සවන් දී, අවශ්‍යතා තක්සේරු කර, සුදුසු සහාය සම්බන්ධීකරණය කරමු.",
    descriptionTa:
      "அவசர, உணர்திறன் அல்லது சிக்கலான சூழ்நிலைகளை எதிர்கொள்ளும் மக்களுக்கான இரகசியமான முதல் தொடர்பு புள்ளி. நாங்கள் கேட்டு, தேவைகளை மதிப்பீடு செய்து, பொருத்தமான உதவியை ஒருங்கிணைக்கிறோம்.",
  },
  {
    matchDescriptionEn:
      "Health awareness, emotional wellbeing activities and trusted referrals that make care easier to reach.",
    titleSi: "සෞඛ්‍යය හා යහපැවැත්ම",
    titleTa: "சுகாதாரம் & நல்வாழ்வு",
    descriptionSi:
      "සෞඛ්‍ය දැනුවත්කරණය, චිත්තවේගී යහපැවැත්ම වැඩසටහන් සහ සත්කාරය ලබා ගැනීම පහසු කරන විශ්වාසනීය යොමු කිරීම්.",
    descriptionTa:
      "சுகாதார விழிப்புணர்வு, உணர்ச்சி நல்வாழ்வு நடவடிக்கைகள் மற்றும் பராமரிப்பை எளிதாக அணுக உதவும் நம்பகமான பரிந்துரைகள்.",
  },
  {
    matchDescriptionEn:
      "Skills, mentoring and enterprise pathways—including our community Nail Spa—that support sustainable income.",
    titleSi: "ජීවනෝපාය හා ව්‍යවසාය",
    titleTa: "வாழ்வாதாரம் & தொழில் முனைவு",
    descriptionSi:
      "තිරසාර ආදායමකට සහාය වන කුසලතා, උපදේශනය සහ ව්‍යවසාය මාර්ග — අපගේ ප්‍රජා නියපොතු සැලෝනය ඇතුළුව.",
    descriptionTa:
      "நிலையான வருமானத்திற்கு உதவும் திறன்கள், வழிகாட்டல் மற்றும் தொழில் முனைவு பாதைகள் — எங்கள் சமூக நகக் கலை நிலையம் உட்பட.",
  },
  {
    matchDescriptionEn:
      "Practical guidance, learning support and safe connections for young people and families navigating change.",
    titleSi: "තරුණ හා පවුල් සහාය",
    titleTa: "இளையோர் & குடும்ப ஆதரவு",
    descriptionSi:
      "වෙනස්කම් හරහා ගමන් කරන තරුණයින් සහ පවුල් සඳහා ප්‍රායෝගික මඟපෙන්වීම, අධ්‍යාපන සහාය සහ ආරක්ෂිත සම්බන්ධතා.",
    descriptionTa:
      "மாற்றத்தை எதிர்கொள்ளும் இளையோர் மற்றும் குடும்பங்களுக்கான நடைமுறை வழிகாட்டுதல், கற்றல் ஆதரவு மற்றும் பாதுகாப்பான தொடர்புகள்.",
  },
  {
    matchDescriptionEn:
      "Meaningful ways for individuals and teams to contribute time, skills and care to community-led initiatives.",
    titleSi: "ස්වේච්ඡා සේවය හා ප්‍රජා සහභාගිත්වය",
    titleTa: "தன்னார்வம் & சமூக ஈடுபாடு",
    descriptionSi:
      "ප්‍රජා මූලික ව්‍යාපෘතීන් සඳහා කාලය, කුසලතා සහ සත්කාරය දායක කිරීමට පුද්ගලයින්ට සහ කණ්ඩායම්වලට අර්ථවත් ක්‍රම.",
    descriptionTa:
      "சமூகம் வழிநடத்தும் முயற்சிகளுக்கு நேரம், திறன்கள் மற்றும் அக்கறையை வழங்க தனிநபர்களுக்கும் குழுக்களுக்கும் அர்த்தமுள்ள வழிகள்.",
  },
  {
    matchDescriptionEn:
      "Community evidence, publications and constructive advocacy that turn lived experience into better decisions.",
    titleSi: "පර්යේෂණ හා අනුමෝදන කටයුතු",
    titleTa: "ஆராய்ச்சி & வக்காலத்து",
    descriptionSi:
      "ජීවත් වූ අත්දැකීම් වඩා හොඳ තීරණ බවට හරවන ප්‍රජා සාක්ෂි, ප්‍රකාශන සහ නිර්මාණාත්මක අනුමෝදන කටයුතු.",
    descriptionTa:
      "வாழ்ந்த அனுபவத்தை சிறந்த முடிவுகளாக மாற்றும் சமூக சான்றுகள், வெளியீடுகள் மற்றும் ஆக்கபூர்வமான வக்காலத்து.",
  },
];

async function main() {
  let matched = 0;
  for (const fix of fixes) {
    const result = await prisma.service.updateMany({
      where: { descriptionEn: fix.matchDescriptionEn },
      data: {
        titleSi: fix.titleSi,
        titleTa: fix.titleTa,
        descriptionSi: fix.descriptionSi,
        descriptionTa: fix.descriptionTa,
      },
    });
    if (result.count === 0) {
      console.warn(`No row matched for: "${fix.matchDescriptionEn.slice(0, 60)}..."`);
    } else {
      matched += result.count;
    }
  }
  console.log(`Updated ${matched} of ${fixes.length} service row(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
