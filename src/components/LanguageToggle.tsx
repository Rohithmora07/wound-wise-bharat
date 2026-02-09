import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-border bg-card p-0.5 text-sm font-medium">
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 transition-all ${
          lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hi")}
        className={`rounded-full px-3 py-1 transition-all ${
          lang === "hi" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};

export default LanguageToggle;
