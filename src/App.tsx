import { useState, useEffect } from "react";
import {
  Activity,
  Baby,
  Sparkles,
  BrainCircuit,
  Bone,
  Eye,
  Search,
  AlertCircle,
  Heart,
  Star,
  Phone,
  MapPin,
  Video,
  Calendar,
  Bell,
  ChevronDown,
  CheckCheck,
  Menu,
  HelpCircle,
  Shield,
  Clock,
  ArrowRight,
  Info,
  FileText,
  Sun,
  Moon
} from "lucide-react";

import { Appointment, MedicalReport, Doctor } from "./types";
import { DOCTORS, BLOG_ARTICLES, GENERAL_FAQS, DEPARTMENTS } from "./data";

import SymptomChecker from "./components/SymptomChecker";
import ReportAnalyzer from "./components/ReportAnalyzer";
import DoctorSearch from "./components/DoctorSearch";
import PatientDashboard from "./components/PatientDashboard";
import EmergencyHub from "./components/EmergencyHub";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "doctors" | "symptoms" | "labs" | "dashboard" | "emergency">("home");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState([
    { id: "not-1", text: "Report Summary of Lipid Panel available", unread: true },
    { id: "not-2", text: "Dr. Evelyn Vance confirmed your video telehealth appointment.", unread: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmergencyFloating, setShowEmergencyFloating] = useState(false);
  const [initialSpecialtyFilter, setInitialSpecialtyFilter] = useState("");

  // Booking states
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "apt-1",
      doctor: DOCTORS[0], // Dr Evelyn Vance
      date: "2026-05-26",
      timeSlot: "09:00 AM",
      patientName: "Abilash Avms",
      patientPhone: "555-019-3901",
      patientEmail: "abilash.avms@gmail.com",
      reason: "Cardiology follow up mapping.",
      status: "Scheduled",
      consultationType: "Video Telehealth",
      createdDate: "2026-05-24"
    },
    {
      id: "apt-2",
      doctor: DOCTORS[1], // Dr Marcus Chen
      date: "2026-05-28",
      timeSlot: "11:00 AM",
      patientName: "Oliver Avms (Son)",
      patientPhone: "555-019-3901",
      patientEmail: "abilash.avms@gmail.com",
      reason: "Pediatric growth checkup session.",
      status: "Scheduled",
      consultationType: "In-Person",
      createdDate: "2026-05-24"
    }
  ]);

  // Report database states
  const [reports, setReports] = useState<MedicalReport[]>([
    {
      id: "rep-1",
      filename: "lipid_panel_may2026.txt",
      date: "May 22, 2026",
      filetype: "Clinical Text Log",
      summary: "The panel indicates elevated total cholesterol (248 mg/dL) and LDL (154 mg/dL), alongside low protective HDL cholesterol. Blood sugar and basic thyroid hormone levels register within optimal parameters. Cardiovascular follow-up is suggested.",
      metrics: [
        { name: "Total Cholesterol", value: "248 mg/dL", status: "Attention Needed" },
        { name: "LDL Cholesterol", value: "154 mg/dL", status: "Attention Needed" },
        { name: "HDL Cholesterol", value: "38 mg/dL", status: "Review Suggested" },
        { name: "Thyroid TSH Level", value: "1.8 uIU/mL", status: "Optimal" }
      ],
      recommendations: [
        "Incorporate soluble dietary fiber (e.g. oats, pulses) daily.",
        "Include 30 minutes of moderate aerobic pacing 4 times weekly.",
        "Follow up with Dr. Evelyn Vance regarding cardiovascular monitoring."
      ]
    }
  ]);

  // FAQ interactive state
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const handleCreateAppointment = (newAppt: Appointment) => {
    // Add to list
    setAppointments([newAppt, ...appointments]);
    // Notify
    setNotifications([
      { id: `not-${Date.now()}`, text: `Confirmed appointment with ${newAppt.doctor.name} on ${newAppt.date}`, unread: true },
      ...notifications
    ]);
    // Redirect to patient dashboard
    setActiveTab("dashboard");
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const handleRescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments(appointments.map(a => {
      if (a.id === id) {
        return { ...a, date: newDate, timeSlot: newTime };
      }
      return a;
    }));
  };

  const handleAddReport = (newRep: MedicalReport) => {
    setReports([newRep, ...reports]);
  };

  const handleRemoveReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const jumpToDepartmentDoctors = (departmentName: string) => {
    setInitialSpecialtyFilter(departmentName);
    setActiveTab("doctors");
  };

  // Toggle dark/light indicator mock
  const [primaryDark, setPrimaryDark] = useState(false);

  // Auto scroll to top on tab modifications
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 pb-16 ${primaryDark ? "bg-slate-950 text-slate-100" : "bg-gradient-to-b from-slate-50 to-white text-slate-900"}`}>
      
      {/* PATIENT SAFETY HEALTH BAR */}
      <div className={`text-xs py-2.5 px-6 border-b select-none ${
        primaryDark ? "bg-red-950/40 text-red-300 border-red-900/30" : "bg-red-50/80 text-red-700 border-red-100"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Immediate Medical Assistance
          </div>
          <p className={`text-[11px] font-medium leading-relaxed max-w-2xl ${primaryDark ? "text-red-300/80" : "text-red-800/90"}`}>
            For critical emergencies, call our 24/7 Priority Emergency squad at <strong className="font-bold">+1 (800) 555-9111</strong>
          </p>
          <button
            onClick={() => setActiveTab("emergency")}
            className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold px-4 py-1.5 rounded-full transition duration-150 cursor-pointer shadow-sm"
          >
            Access Dispatch Hub
          </button>
        </div>
      </div>

      {/* CORE TOP STICKY NAVIGATION HEADER */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300 ${
        primaryDark 
          ? "bg-slate-900/90 border-slate-700/50 shadow-lg shadow-slate-950/20" 
          : "bg-white/80 border-slate-200/60 shadow-sm shadow-blue-100/10"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          
          {/* Logo Brand */}
          <button onClick={() => setActiveTab("home")} className="flex items-center gap-2.5 group cursor-pointer text-left">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white transition duration-200 shadow-md shadow-blue-200/50 group-hover:shadow-lg group-hover:scale-105">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <div>
              <span className={`text-xl font-bold tracking-tight block leading-none ${primaryDark ? "text-white" : "text-slate-900"}`}>
                NovaHealth
              </span>
              <span className={`text-[9px] font-bold tracking-widest uppercase mt-0.5 block ${primaryDark ? "text-blue-400" : "text-blue-600"}`}>MediClinic</span>
            </div>
          </button>

          {/* Desktop Links Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: "home", label: "Home" },
              { id: "doctors", label: "Doctors" },
              { id: "symptoms", label: "Symptom Checker" },
              { id: "labs", label: "Report Explainer" },
              { id: "dashboard", label: "Dashboard" },
              { id: "emergency", label: "Emergency Portal" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setInitialSpecialtyFilter("");
                  setActiveTab(tab.id as any);
                }}
                className={`text-sm font-semibold transition duration-200 cursor-pointer px-3.5 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? primaryDark 
                      ? "text-blue-400 bg-blue-500/10" 
                      : "text-blue-700 bg-blue-50"
                    : primaryDark
                      ? "text-slate-400 hover:text-blue-300 hover:bg-slate-800"
                      : "text-slate-500 hover:text-blue-700 hover:bg-blue-50/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Action utility controls */}
          <div className="flex items-center gap-3">
            
            {/* Language Selection */}
            <div className={`hidden sm:block text-xs font-medium border-r pr-3 ${primaryDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-450"}`}>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`bg-transparent font-bold outline-none cursor-pointer ${primaryDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                <option value="English">EN</option>
                <option value="Español">ES</option>
                <option value="Français">FR</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setPrimaryDark(!primaryDark)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer ${
                primaryDark ? "bg-slate-700" : "bg-gradient-to-r from-blue-100 to-indigo-100"
              }`}
              title={primaryDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-sm ${
                primaryDark ? "translate-x-7 bg-slate-800 shadow-slate-900" : "translate-x-0.5 bg-white shadow-blue-200"
              }`}>
                {primaryDark ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              </span>
            </button>

            {/* Notification triggers */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 border rounded-xl transition relative cursor-pointer ${
                  primaryDark 
                    ? "bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700" 
                    : "bg-white text-slate-500 border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50"
                }`}
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2.5 w-72 rounded-2xl border shadow-xl overflow-hidden z-50 text-xs animate-fadeIn ${
                  primaryDark ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-slate-200 text-slate-700"
                }`}>
                  <div className={`p-3 border-b flex justify-between font-bold ${primaryDark ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-150 text-slate-650"}`}>
                    <span>Clinical Notifications</span>
                    <button
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                      className="text-[10px] text-blue-500 hover:underline cursor-pointer"
                    >
                      Clear alerts
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map((not) => (
                      <div
                        key={not.id}
                        className={`p-3 border-b flex gap-2 last:border-0 ${
                          primaryDark 
                            ? `border-slate-700 ${not.unread ? "bg-blue-500/5" : ""}` 
                            : `border-slate-100 ${not.unread ? "bg-blue-50/30" : ""}`
                        }`}
                      >
                        <span className="text-blue-500 font-bold">•</span>
                        <p className="leading-snug">{not.text}</p>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="text-center p-4 text-slate-400">No recent notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Patient Portal Button */}
            <button
              onClick={() => {
                setInitialSpecialtyFilter("");
                setActiveTab("dashboard");
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-full transition duration-200 cursor-pointer shadow-md shadow-blue-200/40 hover:shadow-lg hover:shadow-blue-300/40"
            >
              Patient Portal
            </button>
          </div>

        </div>
      </header>

      {/* RENDER ACTIVE TAB / PORTAL VIEW */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        
        {/* TAB 1: LANDING OVERVIEW HOME PAGE */}
        {activeTab === "home" && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* HERO SECTION */}
            <section className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 md:p-12 rounded-[2.5rem] border relative overflow-hidden ${
              primaryDark 
                ? "bg-slate-900 border-slate-700/50 shadow-lg shadow-slate-950/30" 
                : "bg-gradient-to-br from-white via-white to-blue-50/40 border-blue-100/60 shadow-sm shadow-blue-50"
            }`}>
              {/* Decorative gradient orb */}
              {!primaryDark && <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl pointer-events-none" />}
              
              <div className="lg:col-span-7 space-y-6 relative">
                
                {/* Visual badge */}
                <div className={`inline-block px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full ${
                  primaryDark ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100"
                }`}>
                  Next-Gen Healthcare
                </div>

                <h1 className={`text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight ${primaryDark ? "text-white" : ""}`}>
                  {primaryDark ? (
                    <>Expert care, <br /><span className="text-blue-400">simplified.</span></>
                  ) : (
                    <>Expert care, <br /><span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">simplified.</span></>
                  )}
                </h1>
                
                <p className={`text-base md:text-lg leading-relaxed max-w-lg ${primaryDark ? "text-slate-400" : "text-slate-500"}`}>
                  Book top-rated specialists, access diagnostic records, and consult with certified hospital clinicians online — all in one unified platform.
                </p>

                {/* Hero Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      setInitialSpecialtyFilter("");
                      setActiveTab("doctors");
                    }}
                    className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl transition duration-200 cursor-pointer shadow-lg shadow-blue-200/50 flex items-center gap-2 hover:shadow-xl hover:scale-[1.02]"
                  >
                    Book Appointment <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setInitialSpecialtyFilter("");
                      setActiveTab("doctors");
                    }}
                    className={`px-6 py-3.5 border font-bold text-sm rounded-xl transition duration-200 cursor-pointer flex items-center gap-2 hover:scale-[1.02] ${
                      primaryDark 
                        ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200"
                    }`}
                  >
                    <Video className="w-4 h-4 text-blue-500" /> Video Consult
                  </button>
                  <button
                    onClick={() => setActiveTab("emergency")}
                    className={`px-6 py-3.5 border font-bold text-sm rounded-xl transition duration-200 cursor-pointer flex items-center gap-1.5 ${
                      primaryDark ? "bg-red-950/30 border-red-800/40 text-red-400 hover:bg-red-900/30" : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100/50"
                    }`}
                  >
                    Emergency Help
                  </button>
                </div>

                {/* Trust stats */}
                <div className={`grid grid-cols-3 gap-4 pt-6 border-t max-w-md ${primaryDark ? "border-slate-700/50" : "border-blue-100/60"}`}>
                  <div>
                    <span className={`text-2xl font-bold block ${primaryDark ? "text-white" : "text-slate-900"}`}>45,000+</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${primaryDark ? "text-slate-500" : "text-blue-400"}`}>Patients Treated</span>
                  </div>
                  <div>
                    <span className={`text-2xl font-bold block ${primaryDark ? "text-white" : "text-slate-900"}`}>4.92 / 5</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${primaryDark ? "text-slate-500" : "text-indigo-400"}`}>Patient Rating</span>
                  </div>
                  <div>
                    <span className={`text-2xl font-bold block ${primaryDark ? "text-white" : "text-slate-900"}`}>18 mins</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${primaryDark ? "text-slate-500" : "text-purple-400"}`}>Avg Response</span>
                  </div>
                </div>

              </div>

              {/* Banner image */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className={`relative w-full max-w-[340px] aspect-square rounded-[2rem] overflow-hidden border-4 shadow-xl ${
                  primaryDark ? "border-slate-700 bg-slate-800" : "border-blue-100 bg-slate-100"
                }`}>
                  <img
                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=400"
                    alt="Modern Medical Clinic"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-5 text-center text-white select-none">
                    <p className="font-bold text-xs leading-tight text-white/90">Medicare Premium Outposts Wing 3</p>
                  </div>
                </div>
              </div>
            </section>

            {/* AI SERVICES CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className={`p-8 rounded-[2rem] border space-y-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${
                primaryDark 
                  ? "bg-slate-900 border-slate-700/50 hover:shadow-slate-950/30" 
                  : "bg-gradient-to-br from-white to-blue-50/20 border-blue-100/60 hover:shadow-blue-100/40"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${primaryDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100/60 text-blue-600"}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${primaryDark ? "text-white" : "text-blue-800"}`}>AI-Triage Symptom Checking</h3>
                    <p className={`text-xs ${primaryDark ? "text-slate-500" : "text-slate-400"}`}>Describe symptoms to get specialist recommendations.</p>
                  </div>
                </div>
                <p className={`text-xs leading-relaxed ${primaryDark ? "text-slate-400" : "text-slate-500"}`}>
                  Understand your health trends with non-diagnostic sorting checklists. Find out which medical board fits your conditions and construct custom questions for your advisor.
                </p>
                <button
                  onClick={() => setActiveTab("symptoms")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-600 hover:underline cursor-pointer transition"
                >
                  Load Symptom Checker <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className={`p-8 rounded-[2rem] border space-y-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${
                primaryDark 
                  ? "bg-slate-900 border-slate-700/50 hover:shadow-slate-950/30" 
                  : "bg-gradient-to-br from-white to-indigo-50/20 border-indigo-100/60 hover:shadow-indigo-100/40"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${primaryDark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-100/60 text-indigo-600"}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold ${primaryDark ? "text-white" : "text-indigo-800"}`}>Plain-English Lab Reader</h3>
                    <p className={`text-xs ${primaryDark ? "text-slate-500" : "text-slate-400"}`}>Simplify complex medical reports instantly.</p>
                  </div>
                </div>
                <p className={`text-xs leading-relaxed ${primaryDark ? "text-slate-400" : "text-slate-500"}`}>
                  Confused by chemical abbreviation lists or blood count printouts? Upload PDF logs to trigger a clear list of indicators and proactive health rules.
                </p>
                <button
                  onClick={() => setActiveTab("labs")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-600 hover:underline cursor-pointer transition"
                >
                  Load Lab Explainer <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </section>


            {/* SPECIALIZATIONS DEPARTMENTS GRID */}
            <section className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className={`text-2xl font-bold ${primaryDark ? "text-white" : "text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700"}`}>Our Clinical Departments</h2>
                <p className={`text-sm ${primaryDark ? "text-slate-400" : "text-slate-500"}`}>
                  Select a department to find specialists or explore practitioners in those fields.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => jumpToDepartmentDoctors(dept.name)}
                    className={`p-5 border rounded-2xl transition-all duration-200 text-center select-none cursor-pointer flex flex-col justify-center items-center group hover:scale-[1.04] hover:shadow-md ${
                      primaryDark 
                        ? "bg-slate-900 border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800 hover:shadow-blue-500/5" 
                        : "bg-white border-blue-100/60 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-blue-100/40"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl mb-3.5 transition ${
                      primaryDark ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20" : "bg-blue-50 group-hover:bg-blue-100 text-blue-600"
                    }`}>
                      {dept.name === "Cardiology" && <Heart className="w-5 h-5" />}
                      {dept.name === "Pediatrics" && <Baby className="w-5 h-5" />}
                      {dept.name === "Dermatology" && <Sparkles className="w-5 h-5" />}
                      {dept.name === "Neurology" && <BrainCircuit className="w-5 h-5" />}
                      {dept.name === "Orthopedics" && <Bone className="w-5 h-5" />}
                      {dept.name === "Ophthalmology" && <Eye className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-bold block ${primaryDark ? "text-slate-200" : "text-slate-800"}`}>{dept.name}</span>
                    <span className={`text-[9px] mt-1 block font-medium transition ${
                      primaryDark ? "text-slate-500 group-hover:text-blue-400" : "text-slate-400 group-hover:text-blue-600"
                    }`}>
                      Schedule Check
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* FEATURED DOCTORS */}
            <section className={`space-y-6 py-8 px-6 rounded-3xl ${primaryDark ? "bg-slate-900/50" : "bg-gradient-to-br from-slate-50 to-blue-50/30"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-bold ${primaryDark ? "text-white" : "text-indigo-700"}`}>Featured On-Call Medical Board</h2>
                  <p className={`text-xs ${primaryDark ? "text-slate-400" : "text-slate-500"}`}>Board-certified specialists with high response metrics.</p>
                </div>
                <button
                  onClick={() => {
                    setInitialSpecialtyFilter("");
                    setActiveTab("doctors");
                  }}
                  className="text-xs font-bold text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 cursor-pointer transition"
                >
                  View Directory <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {DOCTORS.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    className={`border p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
                      primaryDark 
                        ? "bg-slate-800 border-slate-700/50 hover:shadow-slate-950/20" 
                        : "bg-white border-blue-100/60 hover:shadow-blue-100/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3.5 mb-3.5">
                        <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                        <div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            primaryDark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-700"
                          }`}>
                            {doc.specialty}
                          </span>
                          <h4 className={`font-bold text-sm mt-1 ${primaryDark ? "text-white" : "text-slate-800"}`}>{doc.name}</h4>
                          <p className={`text-xs ${primaryDark ? "text-slate-500" : "text-slate-400"}`}>{doc.title}</p>
                        </div>
                      </div>
                      
                      <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${primaryDark ? "text-slate-400" : "text-slate-500"}`}>
                        {doc.about}
                      </p>
                    </div>

                    <div className={`pt-3.5 border-t flex items-center justify-between text-xs ${primaryDark ? "border-slate-700" : "border-blue-50"}`}>
                      <span className={`font-bold ${primaryDark ? "text-slate-200" : "text-slate-800"}`}>${doc.fee} base fee</span>
                      <button
                        onClick={() => {
                          setInitialSpecialtyFilter(doc.specialty);
                          setActiveTab("doctors");
                        }}
                        className="text-blue-500 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Book Slot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TESTIMONIALS */}
            <section className={`rounded-[2.5rem] p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border ${
              primaryDark 
                ? "bg-slate-900 border-slate-700/50 shadow-lg shadow-slate-950/20" 
                : "bg-gradient-to-br from-slate-50 to-indigo-50/30 border-indigo-100/40 shadow-sm"
            }`}>
              <div className="md:col-span-12 lg:col-span-5 space-y-4">
                <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border ${
                  primaryDark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-700 border-blue-100"
                }`}>
                  <Star className="w-3.5 h-3.5 fill-current" /> Patient Satisfaction
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold tracking-tight leading-tight ${
                  primaryDark ? "text-white" : "text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-800"
                }`}>
                  What our patients say about NovaHealth
                </h3>
                <p className={`text-xs leading-relaxed ${primaryDark ? "text-slate-400" : "text-slate-500"}`}>
                  Hear from thousands of patients who secured proactive consultations, simplified lab results, and scheduled treatments.
                </p>
                <div className={`pt-4 border-t flex gap-6 ${primaryDark ? "border-slate-700" : "border-indigo-100/60"}`}>
                  <div>
                    <span className={`text-2xl font-bold block leading-none ${primaryDark ? "text-white" : "text-slate-900"}`}>4.92 / 5</span>
                    <span className={`text-[9px] uppercase font-bold mt-1 block tracking-wider ${primaryDark ? "text-slate-500" : "text-blue-400"}`}>Google Rating</span>
                  </div>
                  <div>
                    <span className={`text-2xl font-bold block leading-none ${primaryDark ? "text-white" : "text-slate-900"}`}>99.2%</span>
                    <span className={`text-[9px] uppercase font-bold mt-1 block tracking-wider ${primaryDark ? "text-slate-500" : "text-indigo-400"}`}>Resolution Rate</span>
                  </div>
                </div>
              </div>

              <div className={`lg:col-span-1 border-r h-full hidden lg:block ${primaryDark ? "border-slate-700" : "border-indigo-100/60"}`}></div>

              <div className="md:col-span-12 lg:col-span-6 space-y-4 text-xs">
                <div className={`p-5 rounded-2xl border italic ${
                  primaryDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-blue-100/60 text-slate-600 shadow-sm shadow-blue-50"
                }`}>
                  &ldquo;This portal completely changed how I track child development records. Uploading local pediatrician records translates them into clear outlines in 15 seconds. Incredible accessibility.&rdquo;
                  <span className={`block not-italic font-bold text-[11px] mt-2 ${primaryDark ? "text-white" : "text-slate-900"}`}>— Sarah K., Mother of 2</span>
                </div>
                <div className={`p-5 rounded-2xl border italic ${
                  primaryDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-blue-100/60 text-slate-600 shadow-sm shadow-blue-50"
                }`}>
                  &ldquo;Booking cardiac screens previously meant waiting on administrative switchboard holdups. Now I select Dr Vance, secure a telehealth slot, and log my lipids automatically.&rdquo;
                  <span className={`block not-italic font-bold text-[11px] mt-2 ${primaryDark ? "text-white" : "text-slate-900"}`}>— Thomas M., Cardiology Patient</span>
                </div>
              </div>
            </section>


            {/* HEALTH BLOG */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-bold ${primaryDark ? "text-white" : "text-purple-700"}`}>Health Guide & Doctor Guidelines</h2>
                  <p className={`text-xs ${primaryDark ? "text-slate-400" : "text-slate-500"}`}>Everyday physical insights from board-certified clinicians.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BLOG_ARTICLES.map((art) => (
                  <div
                    key={art.id}
                    className={`border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                      primaryDark 
                        ? "bg-slate-900 border-slate-700/50 hover:shadow-slate-950/20" 
                        : "bg-white border-blue-100/40 hover:shadow-blue-100/30"
                    }`}
                  >
                    <div>
                      <img src={art.image} alt={art.title} className="w-full h-44 object-cover" />
                      <div className="p-4.5 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-blue-500">{art.category}</span>
                          <span className={`font-mono ${primaryDark ? "text-slate-500" : "text-slate-400"}`}>{art.readTime}</span>
                        </div>
                        <h4 className={`font-bold text-sm line-clamp-2 ${primaryDark ? "text-white" : "text-slate-800"}`}>{art.title}</h4>
                        <p className={`text-xs line-clamp-3 leading-relaxed ${primaryDark ? "text-slate-400" : "text-slate-500"}`}>{art.summary}</p>
                      </div>
                    </div>

                    <div className={`p-4.5 border-t flex items-center gap-3 ${primaryDark ? "border-slate-700" : "border-blue-50"}`}>
                      <img src={art.author.avatar} alt={art.author.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <p className={`text-xs font-bold ${primaryDark ? "text-slate-200" : "text-slate-800"}`}>{art.author.name}</p>
                        <p className={`text-[10px] ${primaryDark ? "text-slate-500" : "text-slate-400"}`}>{art.author.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ SECTION */}
            <section className={`p-6 md:p-8 rounded-3xl border space-y-6 ${
              primaryDark ? "bg-slate-900 border-slate-700/50" : "bg-white border-blue-100/40 shadow-sm shadow-blue-50/50"
            }`}>
              <div className="max-w-xl mx-auto text-center space-y-2">
                <h3 className={`text-xl font-bold ${primaryDark ? "text-white" : "text-blue-700"}`}>Frequently Asked Questions</h3>
                <p className={`text-xs ${primaryDark ? "text-slate-400" : "text-slate-500"}`}>Find answers about virtual admissions, copay support, and diagnostic reports.</p>
              </div>

              <div className="max-w-3xl mx-auto space-y-2">
                {GENERAL_FAQS.map((faq, i) => (
                  <div key={i} className={`border-b last:border-0 pb-3 ${primaryDark ? "border-slate-700/50" : "border-blue-50"}`}>
                    <button
                      onClick={() => setExpandedFaqIndex(expandedFaqIndex === i ? null : i)}
                      className={`w-full py-2.5 text-left text-xs font-bold flex items-center justify-between cursor-pointer transition ${
                        primaryDark ? "text-slate-200 hover:text-blue-400" : "text-slate-800 hover:text-blue-600"
                      }`}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${primaryDark ? "text-slate-500" : "text-slate-400"} ${expandedFaqIndex === i ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFaqIndex === i && (
                      <p className={`text-xs pl-1 leading-relaxed mt-1 animate-fadeIn ${primaryDark ? "text-slate-400" : "text-slate-500"}`}>
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: SPECIALISTS SEARCH DIRECTORY */}
        {activeTab === "doctors" && (
          <div className={`animate-fadeIn ${primaryDark ? "dark-components" : ""}`}>
            <DoctorSearch
              onSuccessBooking={handleCreateAppointment}
              initialSpecialtyFilter={initialSpecialtyFilter}
            />
          </div>
        )}

        {/* TAB 3: SYMPTOMS CHECKER */}
        {activeTab === "symptoms" && (
          <div className={`animate-fadeIn ${primaryDark ? "dark-components" : ""}`}>
            <SymptomChecker
              onFindDoctor={(spec) => {
                setInitialSpecialtyFilter(spec);
                setActiveTab("doctors");
              }}
            />
          </div>
        )}

        {/* TAB 4: REPORT ANALYZER */}
        {activeTab === "labs" && (
          <div className={`animate-fadeIn ${primaryDark ? "dark-components" : ""}`}>
            <ReportAnalyzer onAddReport={handleAddReport} />
          </div>
        )}

        {/* TAB 5: PATIENT DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className={`animate-fadeIn ${primaryDark ? "dark-components" : ""}`}>
            <PatientDashboard
              appointments={appointments}
              reports={reports}
              onCancelAppointment={handleCancelAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
              onRemoveReport={handleRemoveReport}
            />
          </div>
        )}

        {/* TAB 6: EMERGENCY */}
        {activeTab === "emergency" && (
          <div className={`animate-fadeIn ${primaryDark ? "dark-components" : ""}`}>
            <EmergencyHub />
          </div>
        )}

      </main>

      {/* FLOATING EMERGENCY BUTTON */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowEmergencyFloating(!showEmergencyFloating)}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center relative cursor-pointer group"
          title="Urgent Emergency Assistance"
        >
          <span className="absolute inset-0 rounded-full bg-red-400 opacity-60 animate-ping" />
          <AlertCircle className="w-6 h-6 shrink-0 relative z-10" />
          <span className="absolute right-full mr-2.5 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-md select-none border border-slate-800">
            Emergency Dispatch Hub
          </span>
        </button>
      </div>

      {/* FLOATING EMERGENCY OVERLAY PANEL */}
      {showEmergencyFloating && (
        <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4">
          <EmergencyHub onClose={() => setShowEmergencyFloating(false)} />
        </div>
      )}

      {/* FOOTER */}
      <footer className={`w-full text-xs py-8 mt-12 border-t ${
        primaryDark ? "bg-slate-950 text-slate-400 border-slate-800" : "bg-slate-900 text-slate-400 border-slate-800"
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-bold text-slate-200">MediClinic Administrative Outposts</p>
              <p className="text-[10px] text-slate-500">Board registered clinics in compliance with HIPAA guidelines.</p>
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => setActiveTab("home")} className="hover:text-blue-400 transition">Home</button>
              <button onClick={() => setActiveTab("doctors")} className="hover:text-blue-400 transition">Specialists</button>
              <button onClick={() => setActiveTab("symptoms")} className="hover:text-blue-400 transition">Symptom Checker</button>
              <button onClick={() => setActiveTab("dashboard")} className="hover:text-blue-400 transition">Dashboard</button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between text-[11px] text-slate-500">
            <p>© 2026 MediClinic Portal Inc. All rights reserved.</p>
            <p className="flex items-center gap-1.5 shrink-0 select-none">
              <Shield className="w-3.5 h-3.5 text-blue-500" /> Secure SSL Electronic Health Record Management
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
