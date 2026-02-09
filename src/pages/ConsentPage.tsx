import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const ConsentPage = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => navigate("/")} className="rounded-xl p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="font-bold text-foreground">{t("appName")}</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="mb-3 text-center text-2xl font-bold text-foreground">
            {t("consentTitle")}
          </h1>

          <div className="mb-6 rounded-2xl bg-card p-5 card-shadow">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("consentText")}
            </p>
          </div>

          <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-5 w-5 accent-primary"
            />
            <span className="text-sm font-medium text-foreground">
              {t("consentText")}
            </span>
          </label>

          <motion.button
            whileHover={agreed ? { scale: 1.02 } : {}}
            whileTap={agreed ? { scale: 0.98 } : {}}
            disabled={!agreed}
            onClick={() => navigate("/capture")}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-lg font-bold transition-all ${
              agreed
                ? "saffron-gradient text-secondary-foreground shadow-lg"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {t("consentAgree")}
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ConsentPage;
