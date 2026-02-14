import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, RotateCcw, ArrowLeft, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAssessment, type AssessmentResult } from "@/contexts/AssessmentContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";

const CapturePage = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { setCapturedImage, setResult, setIsAnalyzing } = useAssessment();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setLocalAnalyzing] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({
        title: "Sign in failed",
        description: "Please try again.",
        variant: "destructive",
      });
      setSigningIn(false);
    }
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
        doctorType: data.doctorType,
        doctorTypeHi: data.doctorTypeHi,
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

  // Show sign-in prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate("/consent")} className="rounded-xl p-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <span className="font-bold text-foreground">{t("captureTitle")}</span>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-4 gap-6">
          <div className="text-center max-w-sm">
            <Camera className="mx-auto mb-4 h-16 w-16 text-primary" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              {lang === "hi" ? "विश्लेषण के लिए साइन इन करें" : "Sign in to analyze"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {lang === "hi" 
                ? "AI चोट विश्लेषण का उपयोग करने के लिए कृपया Google से साइन इन करें।"
                : "Please sign in with Google to use the AI injury analysis."}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 font-semibold text-foreground shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {signingIn 
                ? (lang === "hi" ? "साइन इन हो रहा है..." : "Signing in...") 
                : (lang === "hi" ? "Google से साइन इन करें" : "Sign in with Google")}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

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
