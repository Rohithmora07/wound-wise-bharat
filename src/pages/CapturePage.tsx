import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, RotateCcw, ArrowLeft, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAssessment, type AssessmentResult } from "@/contexts/AssessmentContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CapturePage = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { setCapturedImage, setResult, setIsAnalyzing } = useAssessment();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setLocalAnalyzing] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setLocalAnalyzing(true);
    setIsAnalyzing(true);
    setCapturedImage(preview);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-injury", {
        body: { imageBase64: preview },
      });

      if (error) throw error;

      if (!data.isInjury) {
        toast({
          title: lang === "hi" ? "कोई चोट नहीं मिली" : "No injury detected",
          description: lang === "hi" 
            ? "इस छवि में कोई शारीरिक चोट नहीं दिखाई दे रही। कृपया चोट की स्पष्ट तस्वीर लें।"
            : "This image doesn't appear to show a physical injury. Please capture a clear photo of the injury.",
          variant: "destructive",
        });
        setLocalAnalyzing(false);
        setIsAnalyzing(false);
        return;
      }

      const result: AssessmentResult = {
        injuryType: data.injuryType,
        injuryTypeHi: data.injuryTypeHi,
        severity: data.severity,
        confidence: data.confidence,
        nextAction: data.nextAction,
        nextActionHi: data.nextActionHi,
        remedySteps: data.remedySteps,
      };
      setResult(result);
      setIsAnalyzing(false);
      setLocalAnalyzing(false);
      navigate("/results");
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({
        title: lang === "hi" ? "विश्लेषण विफल" : "Analysis failed",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
      setLocalAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => navigate("/consent")} className="rounded-xl p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="font-bold text-foreground">{t("captureTitle")}</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="capture"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full max-w-sm flex-col items-center gap-4"
            >
              <div className="flex aspect-[3/4] w-full items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/50">
                <div className="text-center">
                  <Camera className="mx-auto mb-3 h-16 w-16 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("captureTitle")}</p>
                </div>
              </div>

              <div className="flex w-full gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCapture}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 font-bold text-primary-foreground"
                >
                  <Camera className="h-5 w-5" />
                  {t("captureBtn")}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFile(file);
                    };
                    input.click();
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-4 font-bold text-foreground"
                >
                  <Upload className="h-5 w-5" />
                  {t("uploadBtn")}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full max-w-sm flex-col items-center gap-4"
            >
              <div className="w-full overflow-hidden rounded-3xl card-shadow">
                <img src={preview} alt="Captured injury" className="w-full" />
              </div>

              {analyzing ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                  </div>
                  <p className="font-semibold text-foreground">{t("analyzing")}</p>
                </div>
              ) : (
                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setPreview(null)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-4 font-bold text-foreground"
                  >
                    <RotateCcw className="h-5 w-5" />
                    {t("retakeBtn")}
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAnalyze}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl saffron-gradient px-4 py-4 font-bold text-secondary-foreground shadow-lg"
                  >
                    <Zap className="h-5 w-5" />
                    {t("analyzeBtn")}
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CapturePage;
