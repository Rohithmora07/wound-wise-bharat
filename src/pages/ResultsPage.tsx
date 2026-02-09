import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAssessment } from "@/contexts/AssessmentContext";
import SeverityBadge from "@/components/SeverityBadge";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { capturedImage, result } = useAssessment();

  if (!result) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => navigate("/capture")} className="rounded-xl p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="font-bold text-foreground">{t("resultsTitle")}</span>
      </header>

      <div className="mx-auto max-w-sm px-4">
        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-start gap-2 rounded-xl bg-severity-moderate-bg p-3 text-sm"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-severity-moderate" />
          <span className="text-severity-moderate font-medium">
            {lang === "hi"
              ? "यह AI-सहायित आकलन है, चिकित्सा निदान नहीं।"
              : "This is an AI-assisted assessment, not a medical diagnosis."}
          </span>
        </motion.div>

        {/* Image preview */}
        {capturedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 overflow-hidden rounded-2xl card-shadow"
          >
            <img src={capturedImage} alt="Injury" className="w-full max-h-48 object-cover" />
          </motion.div>
        )}

        {/* Result card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 rounded-2xl bg-card p-5 card-shadow"
        >
          <div className="mb-4 flex items-center justify-between">
            <SeverityBadge severity={result.severity} large />
            <span className="text-2xl font-extrabold text-foreground">{result.confidence}%</span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">{t("injuryType")}</p>
              <p className="text-lg font-bold text-foreground">
                {lang === "hi" ? result.injuryTypeHi : result.injuryType}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">{t("nextAction")}</p>
              <p className="font-medium text-foreground">
                {lang === "hi" ? result.nextActionHi : result.nextAction}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/remedies")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl saffron-gradient px-6 py-4 font-bold text-secondary-foreground shadow-lg"
          >
            {t("remediesTitle")}
            <ArrowRight className="h-5 w-5" />
          </motion.button>

          {result.severity === "critical" && (
            <motion.a
              href="tel:108"
              whileTap={{ scale: 0.97 }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-severity-critical px-6 py-4 font-bold text-destructive-foreground"
            >
              🚑 {t("callAmbulance")}
            </motion.a>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/hospitals")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-4 font-bold text-foreground"
          >
            🏥 {t("findHospital")}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
