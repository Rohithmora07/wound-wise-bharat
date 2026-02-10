import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Volume2, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAssessment, type SeverityLevel, type RemedyStep } from "@/contexts/AssessmentContext";
import SeverityBadge from "@/components/SeverityBadge";

const fallbackRemedyData: Record<SeverityLevel, RemedyStep[]> = {
  critical: [
    { icon: "🩸", en: "Apply firm pressure with a clean cloth to stop bleeding", hi: "खून रोकने के लिए साफ कपड़े से मजबूती से दबाएँ" },
    { icon: "🚑", en: "Call ambulance (108) immediately", hi: "तुरंत एम्बुलेंस (108) को कॉल करें" },
    { icon: "👁️", en: "Monitor breathing and consciousness", hi: "सांस और होश पर नज़र रखें" },
  ],
  moderate: [
    { icon: "💧", en: "Gently clean wound with clean water", hi: "साफ पानी से घाव को धीरे से साफ करें" },
    { icon: "🩹", en: "Cover with a sterile bandage", hi: "एक साफ पट्टी से ढकें" },
    { icon: "🏥", en: "Visit hospital within 24 hours", hi: "24 घंटे के भीतर अस्पताल जाएँ" },
  ],
  minor: [
    { icon: "🧊", en: "Rest the injured area", hi: "घायल हिस्से को आराम दें" },
    { icon: "❄️", en: "Apply ice for 15-20 minutes", hi: "15-20 मिनट के लिए बर्फ लगाएँ" },
    { icon: "🩹", en: "Compress with an elastic bandage", hi: "इलास्टिक पट्टी से दबाएँ" },
  ],
};

const RemediesPage = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { result } = useAssessment();

  if (!result) {
    navigate("/");
    return null;
  }

  const steps = result.remedySteps && result.remedySteps.length > 0 
    ? result.remedySteps 
    : fallbackRemedyData[result.severity];

  const handleVoice = () => {
    const text = steps.map((s) => (lang === "hi" ? s.hi : s.en)).join(". ");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/results")} className="rounded-xl p-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <span className="font-bold text-foreground">{t("remediesTitle")}</span>
        </div>
        <button
          onClick={handleVoice}
          className="flex items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground"
        >
          <Volume2 className="h-4 w-4" />
          {t("voiceReadout")}
        </button>
      </header>

      <div className="mx-auto max-w-sm px-4">
        <div className="mb-4 flex items-center justify-between">
          <SeverityBadge severity={result.severity} large />
        </div>

        <div className="mb-6 space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 rounded-2xl bg-card p-4 card-shadow"
            >
              <span className="mt-0.5 text-2xl">{step.icon}</span>
              <div>
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="font-medium text-foreground">
                  {lang === "hi" ? step.hi : step.en}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/hospitals")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl saffron-gradient px-6 py-4 font-bold text-secondary-foreground shadow-lg"
          >
            <MapPin className="h-5 w-5" />
            {t("findHospital")}
          </motion.button>

          {result.severity === "critical" && (
            <motion.a
              href="tel:108"
              whileTap={{ scale: 0.97 }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-severity-critical px-6 py-4 font-bold text-destructive-foreground"
            >
              <Phone className="h-5 w-5" />
              {t("callAmbulance")}
            </motion.a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemediesPage;
