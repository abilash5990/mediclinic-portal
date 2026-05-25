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
  FileText
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
    <div className={`min-h-screen ${primaryDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} font-sans transition-all duration-300 pb-16`}>
      
      {/* ⚠️ PATIENT SAFETY HEALTH BAR NOTIFICATION HEADER */}
      <div className="bg-red-50 text-red-700 text-xs py-3 px-6 border-b border-red-100 select-none relative">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-pulse" />
            Immediate Medical Assistance
          </div>
          <p className="text-[11px] font-medium leading-relaxed max-w-2xl text-red-800/90">
            For critical respiratory distress, chest pains, or sudden motor dysfunction, please bypass virtual checking and call our 24/7 Priority Emergency response squad at <strong className="font-bold text-red-750">+1 (800) 555-9111</strong> immediately.
          </p>
          <button
            onClick={() => setActiveTab("emergency")}
            className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold px-4 py-1.5 rounded-full transition duration-150 cursor-pointer shadow-sm shadow-red-100"
          >
            Access Dispatch Hub
          </button>
        </div>
      </div>

      {/* CORE TOP STICKY NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm shadow-slate-150/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          
          {/* Logo Brand Branding */}
          <button onClick={() => setActiveTab("home")} className="flex items-center gap-2 group cursor-pointer text-left">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white transition duration-200 shadow-sm shadow-blue-150">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-850 block leading-none">
                NovaHealth
              </span>
              <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5 block">MediClinic</span>
            </div>
          </button>

          {/* Desktop Links Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
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
                className={`text-sm font-semibold transition duration-150 cursor-pointer py-1 ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-500 hover:text-blue-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Practical action utility controls */}
          <div className="flex items-center gap-4">
            
            {/* Language Selection */}
            <div className="hidden sm:block text-xs font-medium text-slate-450 border-r border-slate-200 pr-4">
              <span className="text-slate-400">Language: </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent font-bold text-slate-705 outline-none cursor-pointer hover:text-slate-900"
              >
                <option value="English">EN</option>
                <option value="Español">ES</option>
                <option value="Français">FR</option>
              </select>
            </div>

            {/* Notification triggers */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 bg-slate-50 text-slate-550 border border-slate-200 rounded-xl hover:text-slate-800 transition relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 text-xs animate-fadeIn text-slate-700">
                  <div className="p-3 bg-slate-50 border-b border-slate-150 flex justify-between font-bold text-slate-650">
                    <span>Clinical Notifications</span>
                    <button
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                      className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Clear alerts
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map((not) => (
                      <div
                        key={not.id}
                        className={`p-3 border-b border-slate-100 flex gap-2 last:border-0 ${not.unread ? "bg-blue-50/20" : ""}`}
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

            {/* Primary Action Hero Trigger - Patient Portal */}
            <button
              onClick={() => {
                setInitialSpecialtyFilter("");
                setActiveTab("dashboard");
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-5 py-2.5 rounded-full transition duration-150 cursor-pointer shadow-sm shadow-slate-250"
            >
              Patient Portal
            </button>
          </div>

        </div>
      </header>

      {/* RENDER ACTIVE TAB / PORTAL VIEW */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        
        {/* TAB 1: LANDING OVERVIEW HOME PAGE */}
        {activeTab === "home" && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* HERO SECTION (First Screen Title) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="lg:col-span-7 space-y-6">
                
                {/* Visual badge highlight */}
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-md">
                  Next-Gen Healthcare
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                  Expert care, <br /><span className="text-blue-600">simplified.</span>
                </h1>
                
                <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-lg">
                  Book top-rated specialists, access diagnostic records, and consult with certified hospital clinicians online — all in one unified, professional platform.
                </p>

                {/* Practical Hero Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      setInitialSpecialtyFilter("");
                      setActiveTab("doctors");
                    }}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition duration-150 cursor-pointer shadow-lg shadow-blue-200/50 flex items-center gap-2"
                  >
                    Book In-Person Appointment <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setInitialSpecialtyFilter("");
                      setActiveTab("doctors");
                    }}
                    className="px-6 py-4 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-sm rounded-xl transition duration-150 cursor-pointer flex items-center gap-2"
                  >
                    <Video className="w-4 h-4 text-blue-600" /> Video Telemedicine Consult
                  </button>
                  <button
                    onClick={() => setActiveTab("emergency")}
                    className="px-6 py-4 bg-red-50 border border-red-200 text-red-650 hover:bg-red-100/50 font-bold text-sm rounded-xl transition duration-150 cursor-pointer flex items-center gap-1.5"
                  >
                    Emergency Help Center
                  </button>
                </div>

                {/* Trust stats highlights */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-150/60 max-w-md">
                  <div>
                    <span className="text-2xl font-bold text-slate-900 block">45,000+</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Patients Treated</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-slate-900 block">4.92 / 5</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Patient Rating</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-slate-900 block">18 mins</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Response Time</span>
                  </div>
                </div>

              </div>

              {/* Banner Clinic illustration representation placeholder with doctor images */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-[340px] aspect-square rounded-[2rem] overflow-hidden border-4 border-slate-200 shadow-xl bg-slate-100 grayscale-[20%] contrast-110">
                  <img
                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=400"
                    alt="Modern Medical Clinic"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-4 text-center text-white backdrop-blur-xs select-none">
                    <p className="font-bold text-xs leading-tight text-slate-100">Medicare Premium Outposts Wing 3</p>
                  </div>
                </div>
              </div>
            </section>

            {/* AI SERVICES HIGHLIGHT MODULES CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-905">AI-Triage Symptom Checking</h3>
                    <p className="text-xs text-slate-400">Describe physical state to see recommended medical pipelines.</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Understand your health trends with non-diagnostic sorting checklists. Find out which medical board fits your conditions and construct custom questions to ask your healthcare advisor.
                </p>
                <button
                  onClick={() => setActiveTab("symptoms")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Load Symptom Checker <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-905">Plain-English Laboratory Reader</h3>
                    <p className="text-xs text-slate-400">Simplify complex endocrine, metabolic & lipid files instantly.</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Confused by chemical abbreviation lists or high blood count printouts? Upload or drag PDF logs of your metrics to trigger a clear list of indicators and proactive health rules.
                </p>
                <button
                  onClick={() => setActiveTab("labs")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-650 hover:underline cursor-pointer"
                >
                  Load Lab Explainer <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </section>


            {/* SPECIALIZATIONS DEPARTMENTS GRID (Section 3) */}
            <section className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Our Clinical Departments</h2>
                <p className="text-sm text-slate-500">
                  Select key physical sections below to trigger direct medical matching algorithms or explore practitioners ready in those fields.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => jumpToDepartmentDoctors(dept.name)}
                    className="p-5 bg-white hover:bg-blue-50/50 border border-slate-150 hover:border-blue-300 rounded-2xl transition duration-150 text-center select-none cursor-pointer flex flex-col justify-center items-center group"
                  >
                    <div className="p-2.5 bg-slate-50 group-hover:bg-blue-100 text-blue-600 rounded-xl mb-3.5 transition">
                      {dept.name === "Cardiology" && <Heart className="w-5 h-5" />}
                      {dept.name === "Pediatrics" && <Baby className="w-5 h-5" />}
                      {dept.name === "Dermatology" && <Sparkles className="w-5 h-5" />}
                      {dept.name === "Neurology" && <BrainCircuit className="w-5 h-5" />}
                      {dept.name === "Orthopedics" && <Bone className="w-5 h-5" />}
                      {dept.name === "Ophthalmology" && <Eye className="w-5 h-5" />}
                    </div>
                    <span className="text-xs font-bold text-slate-800 block">{dept.name}</span>
                    <span className="text-[9px] text-slate-400 mt-1 block group-hover:text-blue-600 font-medium font-mono">
                      Schedule Check
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* TOP FEATURED DOCTORS SUMMARY LIST (Section 5) */}
            <section className="space-y-6 bg-slate-50 py-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Featured On-Call Medical Board</h2>
                  <p className="text-xs text-slate-500">Board-certified specialists with high response metrics.</p>
                </div>
                <button
                  onClick={() => {
                    setInitialSpecialtyFilter("");
                    setActiveTab("doctors");
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View Directory <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {DOCTORS.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3.5 mb-3.5">
                        <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase">
                            {doc.specialty}
                          </span>
                          <h4 className="font-bold text-sm text-slate-800 mt-1">{doc.name}</h4>
                          <p className="text-xs text-slate-400">{doc.title}</p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {doc.about}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">${doc.fee} base fee</span>
                      <button
                        onClick={() => {
                          setInitialSpecialtyFilter(doc.specialty);
                          setActiveTab("doctors");
                        }}
                        className="text-blue-605 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Book Slot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TESTIMONIALS & CLINIC INDICATORS (Section 10) */}
            <section className="bg-slate-50 border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-12 lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-blue-100">
                  <Star className="w-3.5 h-3.5 fill-current" /> Patient Satisfaction
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-slate-900">
                  What our patients say about NovaHealth
                </h3>
                <p className="text-xs text-slate-550 leading-relaxed">
                  Hear from thousands of patients who secured proactive consultations, simplified lab results, and scheduled treatments.
                </p>
                <div className="pt-4 border-t border-slate-200 flex gap-6">
                  <div>
                    <span className="text-2xl font-bold text-slate-900 block leading-none">4.92 / 5</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 mt-1 block tracking-wider">Google Rating</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-slate-900 block leading-none">99.2%</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 mt-1 block tracking-wider">Resolution Rate</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 border-r border-slate-200 h-full hidden lg:block"></div>

              {/* Quotes loop */}
              <div className="md:col-span-12 lg:col-span-6 space-y-4 text-xs">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 italic shadow-xs text-slate-650">
                  &ldquo;This portal completely changed how I track child development records. Uploading local pediatrician records translates them into clear outlines in 15 seconds. Incredible accessibility.&rdquo;
                  <span className="block not-italic font-bold text-[11px] text-slate-900 mt-2">— Sarah K., Mother of 2</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 italic shadow-xs text-slate-650">
                  &ldquo;Booking cardiac screens previously meant waiting on administrative switchboard holdups. Now I select Dr Vance, secure a telehealth slot, and log my lipids automatically.&rdquo;
                  <span className="block not-italic font-bold text-[11px] text-slate-900 mt-2">— Thomas M., Cardiology Patient</span>
                </div>
              </div>
            </section>


            {/* HEALTH BLOG & WELLNESS ADVISOR (Section 9) */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">SEO Health Guide & Doctor Guidelines</h2>
                  <p className="text-xs text-slate-500">Everyday physical insights from board-certified clinicians.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BLOG_ARTICLES.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <img src={art.image} alt={art.title} className="w-full h-44 object-cover" />
                      <div className="p-4.5 space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                          <span>{art.category}</span>
                          <span className="text-slate-400 font-mono">{art.readTime}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-850 line-clamp-2">{art.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{art.summary}</p>
                      </div>
                    </div>

                    <div className="p-4.5 border-t border-slate-100 flex items-center gap-3">
                      <img src={art.author.avatar} alt={art.author.name} className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{art.author.name}</p>
                        <p className="text-[10px] text-slate-400">{art.author.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FREQUENT CLINIC INQUIRIES FAQS (Section 9) */}
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="max-w-xl mx-auto text-center space-y-2">
                <h3 className="text-xl font-bold text-slate-800">Frequently Asked Clinical Inquiries</h3>
                <p className="text-xs text-slate-500">Find answers explaining virtual admission schedules, copay support, and diagnostic PDF logs.</p>
              </div>

              <div className="max-w-3xl mx-auto space-y-2">
                {GENERAL_FAQS.map((faq, i) => (
                  <div key={i} className="border-b border-slate-100 last:border-0 pb-3">
                    <button
                      onClick={() => setExpandedFaqIndex(expandedFaqIndex === i ? null : i)}
                      className="w-full py-2.5 text-left text-xs font-bold text-slate-800 hover:text-blue-600 flex items-center justify-between cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-450 transition-transform ${expandedFaqIndex === i ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFaqIndex === i && (
                      <p className="text-xs text-slate-500 pl-1 leading-relaxed mt-1 animate-fadeIn">
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
          <div className="animate-fadeIn">
            <DoctorSearch
              onSuccessBooking={handleCreateAppointment}
              initialSpecialtyFilter={initialSpecialtyFilter}
            />
          </div>
        )}

        {/* TAB 3: TRiAGE SYMPTOMS CHECKER */}
        {activeTab === "symptoms" && (
          <div className="animate-fadeIn">
            <SymptomChecker
              onFindDoctor={(spec) => {
                setInitialSpecialtyFilter(spec);
                setActiveTab("doctors");
              }}
            />
          </div>
        )}

        {/* TAB 4: LABORATORY DISPATCH EXPLORER */}
        {activeTab === "labs" && (
          <div className="animate-fadeIn">
            <ReportAnalyzer onAddReport={handleAddReport} />
          </div>
        )}

        {/* TAB 5: PATIET PERSONAL CARE DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-fadeIn">
            <PatientDashboard
              appointments={appointments}
              reports={reports}
              onCancelAppointment={handleCancelAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
              onRemoveReport={handleRemoveReport}
            />
          </div>
        )}

        {/* TAB 6: RED EMERGENCY CHANNELS */}
        {activeTab === "emergency" && (
          <div className="animate-fadeIn">
            <EmergencyHub />
          </div>
        )}

      </main>

      {/* FLOAT RED EMERGENCY PORTAL BUTTON (Section 7) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowEmergencyFloating(!showEmergencyFloating)}
          className="bg-red-500 hover:bg-red-650 text-white rounded-full p-4 shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center relative cursor-pointer group"
          title="Urgent Emergency Assistance"
        >
          {/* Ringing effect overlay */}
          <span className="absolute inset-0 rounded-full bg-red-400 opacity-75 animate-ping" />
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
      <footer className="w-full bg-slate-900 text-slate-400 text-xs py-8 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-bold text-slate-200">MediClinic Administrative Outposts</p>
              <p className="text-[10px] text-slate-500">Board registered clinics in compliance with HIPAA guidelines.</p>
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => setActiveTab("home")} className="hover:text-slate-200">Home</button>
              <button onClick={() => setActiveTab("doctors")} className="hover:text-slate-200">Specialists</button>
              <button onClick={() => setActiveTab("symptoms")} className="hover:text-slate-200">Symptom Checker</button>
              <button onClick={() => setActiveTab("dashboard")} className="hover:text-slate-200">Dashboard</button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between text-[11px] text-slate-650">
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
