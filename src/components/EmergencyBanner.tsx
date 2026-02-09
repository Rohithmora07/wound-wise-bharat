import { Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const EmergencyBanner = () => {
  const { t } = useLanguage();

  return (
    <motion.a
      href="tel:108"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2 bg-severity-critical px-4 py-2.5 text-sm font-semibold text-destructive-foreground"
    >
      <Phone className="h-4 w-4 animate-pulse" />
      {t("emergencyBanner")}
    </motion.a>
  );
};

export default EmergencyBanner;
