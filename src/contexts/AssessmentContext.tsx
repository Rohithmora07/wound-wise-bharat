import React, { createContext, useContext, useState } from "react";

export type SeverityLevel = "critical" | "moderate" | "minor";

export interface AssessmentResult {
  injuryType: string;
  injuryTypeHi: string;
  severity: SeverityLevel;
  confidence: number;
  nextAction: string;
  nextActionHi: string;
}

interface AssessmentContextType {
  capturedImage: string | null;
  setCapturedImage: (img: string | null) => void;
  result: AssessmentResult | null;
  setResult: (r: AssessmentResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
}

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <AssessmentContext.Provider value={{ capturedImage, setCapturedImage, result, setResult, isAnalyzing, setIsAnalyzing }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within AssessmentProvider");
  return ctx;
};
