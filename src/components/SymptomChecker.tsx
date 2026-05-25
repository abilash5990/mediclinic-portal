import { useState } from "react";
import { Activity, ShieldCheck, HelpCircle, Loader2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

interface SymptomResult {
  specialty: string;
  assessment: string;
  possibleSuggestions: string[];
  suggestedQuestions: string[];
  warningLevel: "Low" | "Medium" | "High";
  tags: string[];
  isFallback?: boolean;
}

const PRESET_SYMPTOMS = [
  { label: "Chest pressure & fast heartbeat", desc: "For cardiovascular consultation testing" },
  { label: "Dry red rash on elbow joints", desc: "For dermal skin screening testing" },
  { label: "Sharp lower back joint discomfort", desc: "For orthopedics and bone testing" },
  { label: "Aching pressure behind the eyes", desc: "For neurology or optical screening" }
];

export default function SymptomChecker({ onFindDoctor }: { onFindDoctor: (specialty: string) => void }) {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("35");
  const [gender, setGender] = useState("Female");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (textToUse?: string) => {
    const symptomsToSubmit = textToUse || symptoms;
    if (!symptomsToSubmit.trim()) {
      setError("Please describe your general physical symptoms before analyzing.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: symptomsToSubmit,
          details,
          age: parseInt(age) || 35,
          gender
        })
      });

      if (!response.ok) {
        throw new Error("Unable to complete AI symptom screening.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "An unexpected issue occurred while processing your screening draft.");
    } finally {
      setLoading(false);
    }
  };

  const selectPreset = (label: string) => {
    setSymptoms(label);
    handleAnalyze(label);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            AI Triage & Symptom Checker
            <span className="text-xs bg-cyan-50 text-cyan-700 font-normal px-2.5 py-0.5 rounded-full border border-cyan-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-600" /> Secure Ai
            </span>
          </h2>
          <p className="text-sm text-slate-500">Provide description to sort possible medical pathways.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form panel */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase text-slate-400 tracking-wider mb-2">
              Select Patient Profiling
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-slate-400 mb-1 block">Age</span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                />
              </div>
              <div>
                <span className="text-xs text-slate-400 mb-1 block">Gender</span>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase text-slate-400 tracking-wider mb-2">
              Describe Your Symptoms
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Dull muscular pressure on the left ribs accompanied by mild shortness of breath."
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase text-slate-400 tracking-wider mb-1">
              Optional Context / History
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Began 4 hours ago, worsens with physical exercises."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
            />
          </div>

          <div>
            <button
              onClick={() => handleAnalyze()}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sorting Clinical Indicators...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run AI Symptom Sorting
                </>
              )}
            </button>
          </div>

          {/* Quick presets */}
          <div>
            <span className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Or Choose Common Training Presets
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_SYMPTOMS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => selectPreset(preset.label)}
                  className="p-2.5 text-left text-xs bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 border border-slate-150 rounded-lg transition duration-150 text-slate-700 font-medium group"
                >
                  <p className="font-semibold group-hover:text-blue-600">{preset.label}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output panel */}
        <div className="lg:col-span-7 flex flex-col justify-between min-h-[300px] border-l border-slate-100 lg:pl-8">
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-700">Medical AI is Analyzing Your Entry</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Scanning symptoms against diagnostic specialties, assessing safety alerts, and preparing clinic questions.
              </p>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/40 rounded-xl border border-dashed border-slate-200">
              <HelpCircle className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-600">No Screening Run Yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Describe your conditions or click one of our interactive clinical presets to triage recommended steps safely.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-xl flex items-start gap-2.5 border border-red-100 text-xs">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Sorting Unsuccessful</p>
                <p className="text-red-600/90 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-5 animate-fadeIn">
              {/* Top Banner Alert */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-blue-50/70 border border-blue-100/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-800 uppercase bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                    Symptom Match
                  </span>
                  {result.isFallback && (
                    <span className="text-xs text-slate-500 italic">Offline Engine</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> AI Diagnostic Assistant
                </div>
              </div>

              {/* Specialty Referral Box */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Primary Specialization Recommendation
                </p>
                <div className="flex items-center justify-between gap-3 p-4 bg-slate-900 text-white rounded-xl shadow-sm">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-blue-300 mb-0.5">
                      {result.specialty}
                    </h3>
                    <p className="text-xs text-slate-300">
                      We have board-certified {result.specialty} practitioners available for immediate telehealth booking.
                    </p>
                  </div>
                  <button
                    onClick={() => onFindDoctor(result.specialty)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition duration-150 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    Find Doctor <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Assessment Text */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Clinical Assessment Explanation
                </p>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                  &ldquo;{result.assessment}&rdquo;
                </p>
              </div>

              {/* Safety Alerts / Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Triage Urgency Warning
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      result.warningLevel === "High"
                        ? "bg-red-50 text-red-700 border border-red-150"
                        : result.warningLevel === "Medium"
                        ? "bg-amber-50 text-amber-700 border border-amber-150"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-150"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulseUI" />
                    {result.warningLevel} Urgency Priority
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Categorizations
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {result.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Doctor Questions */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                  Doctor Consultation Checklist
                </p>
                <p className="text-[11px] text-slate-400 mb-3 block">
                  Consider noting these AI-proposed queries for your direct consultation checklist:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {result.suggestedQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 font-semibold select-none">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Core Medical Disclaimer Disclaimer always visible */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 select-none">
            <p className="font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Disclaimer Notice</p>
            This AI assistant provides sorting assessments based purely on clinical language correlations. It does not replace professional diagnosis, treatment schedules, or clinical metrics from certified medical service providers. In case of cardiovascular issues, deep pressure, or immediate respiratory distress, please call emergency services immediately.
          </div>
        </div>
      </div>
    </div>
  );
}
