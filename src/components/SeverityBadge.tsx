import { useLanguage } from "@/contexts/LanguageContext";
import type { SeverityLevel } from "@/contexts/AssessmentContext";

const severityConfig = {
  critical: { bg: "bg-severity-critical-bg", text: "text-severity-critical", dot: "bg-severity-critical" },
  moderate: { bg: "bg-severity-moderate-bg", text: "text-severity-moderate", dot: "bg-severity-moderate" },
  minor: { bg: "bg-severity-minor-bg", text: "text-severity-minor", dot: "bg-severity-minor" },
};

const SeverityBadge = ({ severity, large = false }: { severity: SeverityLevel; large?: boolean }) => {
  const { t } = useLanguage();
  const config = severityConfig[severity];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${config.bg} ${config.text} font-semibold ${large ? "px-4 py-2 text-base" : "px-3 py-1 text-sm"}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${config.dot}`} />
      {t(severity)}
    </span>
  );
};

export default SeverityBadge;
