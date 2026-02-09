import { useNavigate } from "react-router-dom";
import { Camera, Shield, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import EmergencyBanner from "@/components/EmergencyBanner";
import heroBg from "@/assets/hero-bg.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const steps = [
    { icon: Camera, title: t("step1"), desc: t("step1Desc") },
    { icon: Shield, title: t("step2"), desc: t("step2Desc") },
    { icon: MapPin, title: t("step3"), desc: t("step3Desc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <EmergencyBanner />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          <span className="text-lg font-bold text-foreground">{t("appName")}</span>
        </div>
        <LanguageToggle />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-lg px-4 pb-8 pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 w-48 overflow-hidden rounded-3xl card-shadow">
              <img src={heroBg} alt="Medical app" className="w-full" />
            </div>
            <h1 className="mb-3 text-3xl font-extrabold leading-tight text-foreground">
              {t("heroTitle")}
            </h1>
            <p className="mb-6 text-lg text-muted-foreground">
              {t("heroSubtitle")}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/consent")}
              className="saffron-gradient inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-bold text-secondary-foreground shadow-lg transition-all"
            >
              <Camera className="h-5 w-5" />
              {t("scanNow")}
            </motion.button>
          </motion.div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-center text-sm font-medium text-muted-foreground"
          >
            ✅ {t("helpedUsers")}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-8">
        <h2 className="mb-6 text-center text-xl font-bold text-foreground">
          {t("howItWorks")}
        </h2>
        <div className="mx-auto grid max-w-lg gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="flex items-start gap-4 rounded-2xl bg-card p-4 card-shadow"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
                <step.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="px-4 pb-6">
        <div className="mx-auto flex max-w-lg items-center justify-center gap-4 rounded-2xl bg-accent/50 px-4 py-3 text-sm text-accent-foreground">
          <Shield className="h-4 w-4 shrink-0" />
          <span>{t("noImageStored")} · {t("secureProcessing")}</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        <p>⚠️ {t("disclaimer")}</p>
      </footer>
    </div>
  );
};

export default HomePage;
