import React, { createContext, useContext, useState, useCallback } from "react";

type Lang = "en" | "hi";

const translations = {
  en: {
    appName: "WoundWise Bharat",
    heroTitle: "Instant Injury Assessment",
    heroSubtitle: "Take a photo. Understand the risk. Act fast.",
    scanNow: "Scan Injury Now",
    emergencyBanner: "Severe injury? Call 108 immediately.",
    helpedUsers: "Helped 10,000+ users",
    disclaimer: "This is an AI-assisted guidance tool, not a medical diagnosis. Always consult a doctor for professional care.",
    consentTitle: "Before We Begin",
    consentText: "I understand this tool provides first-aid guidance only, not medical diagnosis. Images are processed securely and not stored.",
    consentAgree: "I Understand, Continue",
    captureTitle: "Capture Injury",
    captureBtn: "Take Photo",
    uploadBtn: "Upload Image",
    retakeBtn: "Retake",
    analyzeBtn: "Analyze Injury",
    analyzing: "Analyzing injury…",
    resultsTitle: "Assessment Results",
    injuryType: "Possible Injury Type",
    severity: "Severity Level",
    confidence: "Confidence",
    nextAction: "Recommended Action",
    critical: "Critical",
    moderate: "Moderate",
    minor: "Minor",
    remediesTitle: "Immediate First Aid",
    findHospital: "Find Nearest Hospital",
    callAmbulance: "Call 108",
    hospitalTitle: "Nearby Hospitals",
    directions: "Directions",
    callNow: "Call Now",
    govtHospital: "Government",
    privateHospital: "Private",
    available24x7: "24/7",
    shareReport: "Share Report",
    voiceReadout: "Read Aloud",
    back: "Back",
    home: "Home",
    stepByStep: "Step-by-step guidance",
    escalate: "Need urgent help?",
    photoCapture: "Photo Capture",
    remedies: "Remedies",
    hospitals: "Hospitals",
    noImageStored: "No images are stored",
    secureProcessing: "Processed securely",
    privacyNotice: "Your privacy is protected",
    howItWorks: "How It Works",
    step1: "Capture Photo",
    step1Desc: "Take a clear photo of the injury",
    step2: "AI Assessment",
    step2Desc: "Get instant severity analysis",
    step3: "Get Guidance",
    step3Desc: "Follow first-aid steps & find hospitals",
  },
  hi: {
    appName: "वाउंडवाइज़ भारत",
    heroTitle: "तुरंत चोट का आकलन",
    heroSubtitle: "फ़ोटो लें। जोखिम समझें। तेज़ी से काम करें।",
    scanNow: "चोट स्कैन करें",
    emergencyBanner: "गंभीर चोट? तुरंत 108 पर कॉल करें।",
    helpedUsers: "10,000+ उपयोगकर्ताओं की मदद की",
    disclaimer: "यह AI-सहायित मार्गदर्शन उपकरण है, चिकित्सा निदान नहीं। हमेशा डॉक्टर से परामर्श लें।",
    consentTitle: "शुरू करने से पहले",
    consentText: "मैं समझता/समझती हूँ कि यह उपकरण केवल प्राथमिक चिकित्सा मार्गदर्शन प्रदान करता है, चिकित्सा निदान नहीं। छवियाँ सुरक्षित रूप से संसाधित की जाती हैं और संग्रहीत नहीं की जातीं।",
    consentAgree: "मैं समझता/समझती हूँ, जारी रखें",
    captureTitle: "चोट की फ़ोटो लें",
    captureBtn: "फ़ोटो लें",
    uploadBtn: "छवि अपलोड करें",
    retakeBtn: "दोबारा लें",
    analyzeBtn: "चोट का विश्लेषण करें",
    analyzing: "चोट का विश्लेषण हो रहा है…",
    resultsTitle: "आकलन परिणाम",
    injuryType: "संभावित चोट का प्रकार",
    severity: "गंभीरता स्तर",
    confidence: "विश्वसनीयता",
    nextAction: "अनुशंसित कार्रवाई",
    critical: "गंभीर",
    moderate: "मध्यम",
    minor: "मामूली",
    remediesTitle: "तुरंत प्राथमिक चिकित्सा",
    findHospital: "नज़दीकी अस्पताल खोजें",
    callAmbulance: "108 पर कॉल करें",
    hospitalTitle: "नज़दीकी अस्पताल",
    directions: "दिशा-निर्देश",
    callNow: "अभी कॉल करें",
    govtHospital: "सरकारी",
    privateHospital: "निजी",
    available24x7: "24/7",
    shareReport: "रिपोर्ट साझा करें",
    voiceReadout: "ज़ोर से पढ़ें",
    back: "वापस",
    home: "होम",
    stepByStep: "चरण-दर-चरण मार्गदर्शन",
    escalate: "तत्काल मदद चाहिए?",
    photoCapture: "फ़ोटो कैप्चर",
    remedies: "उपचार",
    hospitals: "अस्पताल",
    noImageStored: "कोई छवि संग्रहीत नहीं",
    secureProcessing: "सुरक्षित रूप से संसाधित",
    privacyNotice: "आपकी गोपनीयता सुरक्षित है",
    howItWorks: "यह कैसे काम करता है",
    step1: "फ़ोटो लें",
    step1Desc: "चोट की स्पष्ट तस्वीर लें",
    step2: "AI आकलन",
    step2Desc: "तुरंत गंभीरता का विश्लेषण पाएँ",
    step3: "मार्गदर्शन पाएँ",
    step3Desc: "प्राथमिक चिकित्सा करें और अस्पताल खोजें",
  },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("en");
  const t = useCallback(
    (key: keyof typeof translations.en) => translations[lang][key] || key,
    [lang]
  );
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
