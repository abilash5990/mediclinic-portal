import { useState, useRef, DragEvent } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, MessageSquare, Loader2, Sparkles, Plus } from "lucide-react";
import { MedicalReport } from "../types";

const MOCK_LABS_PRESETS = [
  {
    title: "Complete Lipid Panel (Cardiology Profile)",
    filename: "lipid_panel_may2026.txt",
    filetype: "Clinical Text Log",
    text: "Patient Lab ID: 2901-C. Total Cholesterol: 248 mg/dL (High). Triglycerides: 185 mg/dL (Borderline High). HDL (Good) Cholesterol: 38 mg/dL (Low, optimal is > 40). LDL (Bad) Cholesterol: 154 mg/dL (Elevated, target is < 100). Thyroid TSH: 1.8 uIU/mL (Optimal range)."
  },
  {
    title: "Comprehensive Metabolic & Glucose (Pre-Diabetic Screening)",
    filename: "metabolic_screening_v4.txt",
    filetype: "Laboratory Transcript",
    text: "Serum Glucose (Fasting): 108 mg/dL (Optimal < 100). Hemoglobin A1c: 5.9% (Consistent with pre-diabetes indicators, standard range is < 5.7%). Sodium Blood: 139 mEq/L (Normal). Blood Urea Nitrogen (BUN): 14 mg/dL (Normal). Glomerular Filtration Rate (eGFR): 94 mL/min (Optimal kidney filters)."
  },
  {
    title: "Healthy Basic Well-woman CBC Profile",
    filename: "cbc_wellness_assessment.txt",
    filetype: "Wellness Report Scan",
    text: "White Blood Cells: 6.4 x10^3 / uL (Normal). Red Blood Cells: 4.5 x10^6 / uL (Normal). Hemoglobin: 13.8 g/dL (Sufficient). Platelets Blood count: 245,000 (Optimal). C-Reactive Protein (Cardiac Inflammatory Screening): 0.8 mg/dL (Excellent Low risk)."
  }
];

export default function ReportAnalyzer({ onAddReport }: { onAddReport: (report: MedicalReport) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [customText, setCustomText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleManualSelection = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setFileSelected(file);
    setError(null);

    // Read clinical mock text from file name or simulation text to trigger processing
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const text = fileReader.result as string;
      setCustomText(text || `Clinical markers extracted from file: ${file.name}`);
    };
    fileReader.onerror = () => {
      setError("Unable to parse the uploaded file asset. Select a standard printout or type metrics manually.");
    };
    fileReader.readAsText(file.slice(0, 5000)); // Read first 5KB
  };

  const runAnalysis = async (inputText?: string, name?: string, type?: string) => {
    const textToAnalyze = inputText || customText || (fileSelected ? fileSelected.name : "");
    if (!textToAnalyze.trim()) {
      setError("Please input chemical parameters, lab indexes, or load a preset sheet.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    const activeFilename = name || (fileSelected ? fileSelected.name : "Custom_Report.txt");
    const activeFiletype = type || (fileSelected ? fileSelected.type : "TXT Report Text");

    try {
      const response = await fetch("/api/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: textToAnalyze,
          filename: activeFilename,
          filetype: activeFiletype
        })
      });

      if (!response.ok) {
        throw new Error("Unable to trigger report scanner.");
      }

      const parsed = await response.json();
      setAnalysisResult(parsed);

      // Save report globally as structured patient file history
      const savedReport: MedicalReport = {
        id: `rep-${Date.now()}`,
        filename: activeFilename,
        date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
        filetype: activeFiletype,
        summary: parsed.summary,
        metrics: parsed.metrics,
        recommendations: parsed.recommendations
      };
      
      onAddReport(savedReport);

    } catch (err: any) {
      setError(err?.message || "Something went wrong in the AI scanner pipeline.");
    } finally {
      setLoading(false);
    }
  };

  const selectPreset = (preset: typeof MOCK_LABS_PRESETS[0]) => {
    setFileSelected(null);
    setCustomText(preset.text);
    runAnalysis(preset.text, preset.filename, preset.filetype);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            AI Lab Report Reader & Explainer
            <span className="text-xs bg-cyan-50 text-cyan-700 font-normal px-2.5 py-0.5 rounded-full border border-cyan-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-600" /> Secure Explainer
            </span>
          </h2>
          <p className="text-sm text-slate-500">Simplify complex blood panels and laboratory terms into plain, everyday English.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input & Drag/Drop */}
        <div className="lg:col-span-5 space-y-5">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleManualSelection}
            className={`cursor-pointer transition-all duration-200 border-2 border-dashed rounded-xl p-6 text-center select-none flex flex-col items-center justify-center min-h-[140px] ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : fileSelected
                ? "border-emerald-500 bg-emerald-50/20"
                : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
              accept=".txt,.pdf,.png,.jpg,.jpeg"
            />
            
            {fileSelected ? (
              <div className="text-emerald-700">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-600 animate-bounce" />
                <p className="text-xs font-semibold">{fileSelected.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{(fileSelected.size / 1024).toFixed(1)} KB • Text Loaded</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Drag & Drop Laboratory File</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports PDF, JPG/PNG, or TXT printouts</p>
                <p className="text-[11px] text-blue-600 font-medium mt-2 underline">click to select file manually</p>
              </>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium uppercase text-slate-400 tracking-wider">
                Or Paste Laboratory Text Logs
              </label>
              {fileSelected && (
                <button
                  onClick={() => {
                    setFileSelected(null);
                    setCustomText("");
                  }}
                  className="text-xs text-red-500 hover:underline cursor-pointer"
                >
                  Clear File Selection
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Sodium: 140 mEq/L, Plasma Hemoglobin: 14 g/dL..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder-slate-400 font-mono"
            />
          </div>

          <div>
            <button
              onClick={() => runAnalysis()}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Plain-English Explanations...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Lab Data Now
                </>
              )}
            </button>
          </div>

          {/* Quick clinical presets */}
          <div>
            <span className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              No medical reports handy? Try Demo Presets
            </span>
            <div className="space-y-1.5">
              {MOCK_LABS_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => selectPreset(preset)}
                  className="w-full p-2.5 text-left text-xs bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 border border-slate-150 rounded-lg transition duration-150 text-slate-700 font-medium flex items-center justify-between group"
                >
                  <div>
                    <p className="font-semibold text-slate-800 group-hover:text-blue-600">{preset.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">{preset.text}</p>
                  </div>
                  <span className="text-[10px] bg-blue-100/50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                    Load Demo
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output & Analysis Explanation */}
        <div className="lg:col-span-7 flex flex-col justify-between min-h-[350px] border-l border-slate-100 lg:pl-8">
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-700">AI Medical Report Simplifier is Running</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Parsing clinical markers, cross-referencing thresholds, and translating advanced diagnostic parameters into soft, accessible language.
              </p>
            </div>
          )}

          {!loading && !analysisResult && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/40 rounded-xl border border-dashed border-slate-200">
              <Upload className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-600">No Document Explained Yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Upload your laboratory PDF, paste chemical logs directly, or select standard presets above for immediate plain-English visual translations.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-xl flex items-start gap-2.5 border border-red-100 text-xs">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Analysis Encountered an Error</p>
                <p className="text-red-600/90 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Top Summary Block */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100/50">
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Plain English Executive Summary
                </p>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Detected Metrics Details */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Extracted Lab Indicators & Safe Explanations
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysisResult.metrics?.map((metric: any, idx: number) => {
                    const statusLower = metric.status?.toLowerCase();
                    const isOptimal = statusLower?.includes("optimal") || statusLower?.includes("normal") || statusLower?.includes("excel");
                    const isAttention = statusLower?.includes("attention") || statusLower?.includes("alert") || statusLower?.includes("high");
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          isOptimal
                            ? "bg-emerald-50/40 border-emerald-100 text-slate-700"
                            : isAttention
                            ? "bg-red-50/40 border-red-150 text-slate-700"
                            : "bg-amber-50/40 border-amber-100 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-800 truncate pr-1">
                            {metric.name}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              isOptimal
                                ? "bg-emerald-100 text-emerald-800"
                                : isAttention
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {metric.status || "Check"}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-semibold text-slate-700">Value:</span>
                          <span className="text-xs font-medium text-slate-600">{metric.value || "Not recorded"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Proactive Action Steps Recommendations */}
              <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Proactive Everyday Guidelines
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  {analysisResult.recommendations?.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-indigo-500 font-bold flex shrink-0 justify-center items-center bg-indigo-50 border border-indigo-100 rounded-full w-4 h-4 text-[9px] mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Patient Note */}
              <div className="bg-cyan-50/40 p-3.5 rounded-lg border border-cyan-100/50 text-[10px] text-cyan-800 flex gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Clinical Note:</strong> AI summarizers support proactive learning. Always supply our reports, charts, and recommendations directly within your dashboard or during appointment checks. Let your healthcare team calibrate treatment programs.
                </p>
              </div>

            </div>
          )}

          {/* Secure disclaimer in footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 select-none">
            <p className="font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Automated Report Analyzer Notice</p>
            Report reading tools simplify complex biochemical parameters into plain-English analogies. Summaries do not constitute diagnostic reports, physiological interventions, or final medical conclusions. Please consult board-certified physicians for authoritative clinical examinations.
          </div>

        </div>
      </div>
    </div>
  );
}
