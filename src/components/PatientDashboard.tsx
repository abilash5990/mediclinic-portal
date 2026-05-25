import { useState } from "react";
import { Appointment, MedicalReport } from "../types";
import { Calendar, Clock, Video, FileText, CheckCircle, Trash, Ban, Camera, Mic, MicOff, CameraOff, Send, MessageSquare, Award, ArrowUpRight, TrendingUp, Sparkles, X, Heart, Shield, Plus, User } from "lucide-react";

interface PatientDashboardProps {
  appointments: Appointment[];
  reports: MedicalReport[];
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  onRemoveReport: (id: string) => void;
}

export default function PatientDashboard({
  appointments,
  reports,
  onCancelAppointment,
  onRescheduleAppointment,
  onRemoveReport
}: PatientDashboardProps) {
  // Telemedicine meeting modal mock
  const [activeCallAppointment, setActiveCallAppointment] = useState<Appointment | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "System", text: "Secure clinical connection established.", time: "11:12 AM" },
    { sender: "Clinician", text: "Hello! I am reviewing your recent symptom profile. Let me know when you are comfortable to begin.", time: "11:12 AM" }
  ]);

  // Reschedule state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("2026-05-27");
  const [newTime, setNewTime] = useState("10:00 AM");

  const triggerSendMessage = () => {
    if (!chatMessage.trim()) return;
    const msg = {
      sender: "You (Patient)",
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory([...chatHistory, msg]);
    setChatMessage("");

    // AI clinician answers instantly
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          sender: "Clinician",
          text: "Understood. The telemetry shows stable parameters. I recommend keeping a moderate movement routine and tracking daily blood hydration levels.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Vitals summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Rest Heart Rate</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block flex items-baseline gap-1">
              72 <span className="text-xs font-normal text-slate-400">BPM</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-2">
              <TrendingUp className="w-3 h-3" /> Optimal • -2% from last month
            </span>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed Scans & Labs</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">
              {reports.length + 3} <span className="text-xs font-normal text-slate-400">Documents</span>
            </span>
            <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 mt-2">
              <CheckCircle className="w-3 h-3" /> All analyzed successfully via safe AI
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Next Scheduled Check</span>
            <span className="text-xs font-bold text-slate-800 mt-2 block truncate max-w-[180px]">
              {appointments[0]
                ? `${appointments[0].doctor.name} (${appointments[0].timeSlot})`
                : "No active bookings"}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5 mt-1">
              {appointments[0] ? appointments[0].date : "Schedule a checkup any time"}
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main upcoming grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Appointments column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Your Scheduled Consultation Plans
              <span className="text-xs bg-blue-50 text-blue-700 font-normal px-2.5 py-0.5 rounded-full border border-blue-105">
                {appointments.length} Total
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3.5">
                    <img src={appt.doctor.avatar} alt={appt.doctor.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{appt.doctor.name}</h4>
                      <p className="text-xs text-slate-400">{appt.doctor.title} • {appt.doctor.specialty}</p>
                      
                      {/* Consultation formats badge */}
                      <span className="inline-flex items-center gap-1 mt-2 text-[10px] bg-slate-105 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
                        {appt.consultationType === "Video Telehealth" ? (
                          <>
                            <Video className="w-3 h-3 text-indigo-650" /> Telehealth remote
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 rotate-45 text-blue-650" /> In-person clinic
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1 justify-end">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {appt.date}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {appt.timeSlot}
                    </div>
                  </div>
                </div>

                {/* Reason context details */}
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 italic">
                  &ldquo;{appt.reason}&rdquo;
                </div>

                {/* Patient actions buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex gap-2">
                    {appt.consultationType === "Video Telehealth" ? (
                      <button
                        onClick={() => setActiveCallAppointment(appt)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Video className="w-3.5 h-3.5 animate-pulse" /> Join Remote Consultation
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        🗺️ Report to {appt.doctor.location} for admission
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setReschedulingId(appt.id)}
                      className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => onCancelAppointment(appt.id)}
                      className="text-xs text-red-500 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <Ban className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>

                {/* Reschedule micro-form */}
                {reschedulingId === appt.id && (
                  <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-150 flex flex-wrap items-end gap-3 justify-between animate-fadeIn">
                    <div className="flex-1 min-w-[200px] grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">New Date</span>
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">New Slot</span>
                        <select
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white text-slate-700 focus:outline-none"
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onRescheduleAppointment(appt.id, newDate, newTime);
                          setReschedulingId(null);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setReschedulingId(null)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3.5 py-1.5 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {appointments.length === 0 && (
              <div className="py-12 bg-slate-50/40 border border-dashed border-slate-200 rounded-2xl text-center">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-500">No active care plans booked</p>
                <p className="text-xs text-slate-400 mt-1">Book certified specialists at any time from the medical catalog.</p>
              </div>
            )}
          </div>
        </div>

        {/* Diagnostic files column */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Your Diagnostic Records</h2>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-slate-100 rounded-xl p-4.5 shadow-xs hover:border-blue-200 transition duration-150 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-2.5">
                    <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug truncate max-w-[170px]">
                        {report.filename}
                      </h4>
                      <p className="text-[10px] text-slate-400">{report.filetype} • {report.date}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onRemoveReport(report.id)}
                    className="text-xs text-slate-350 hover:text-red-500 cursor-pointer"
                    title="Remove record"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>

                {report.summary && (
                  <div className="p-3 bg-indigo-50/20 text-[11px] text-slate-600 rounded-lg border border-indigo-100/30">
                    <p className="font-semibold text-indigo-800 uppercase text-[9px] tracking-wider mb-1">
                      AI Plain-English Summary
                    </p>
                    <p className="leading-relaxed">{report.summary}</p>
                  </div>
                )}

                {/* Render condensed metrics */}
                {report.metrics && report.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {report.metrics.map((m, idx) => (
                      <span key={idx} className="text-[9px] bg-slate-50 border border-slate-150 text-slate-650 px-2 py-0.5 rounded">
                        <strong>{m.name}:</strong> {m.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {reports.length === 0 && (
              <div className="py-12 bg-slate-50/40 border border-dashed border-slate-200 rounded-xl text-center">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-500">No laboratory records loaded yet</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] mx-auto">
                  Drag and drop labs on our secure report manager panel.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* TELEMEDICINE VIRTUAL MEETS MODAL INTERACTIVE SCREEN */}
      {activeCallAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row h-[550px]">
            
            {/* Left: Video stage */}
            <div className="flex-1 bg-slate-900 relative p-4 flex flex-col justify-between">
              
              {/* Top Row: Info */}
              <div className="flex justify-between items-center z-15">
                <div className="bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-650 animate-pulse" />
                  <strong>SECURE MEET:</strong> {activeCallAppointment.doctor.name}
                </div>
                <button
                  onClick={() => setActiveCallAppointment(null)}
                  className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 hover:text-red-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Center: Dr photo / Simulated camera feeds */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  {cameraOn ? (
                    <img
                      src={activeCallAppointment.doctor.avatar}
                      alt={activeCallAppointment.doctor.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center">
                      <CameraOff className="w-12 h-12 text-slate-650" />
                    </div>
                  )}
                  <p className="text-base font-bold">{activeCallAppointment.doctor.name}</p>
                  <p className="text-xs text-blue-450">Active Call (HD Audio & Video Enabled)</p>
                </div>
              </div>

              {/* Self view bottom-right PIP */}
              <div className="absolute bottom-16 right-4 w-24 h-32 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex items-center justify-center text-slate-500">
                {cameraOn ? (
                  <div className="w-full h-full bg-slate-800 flex flex-col justify-center items-center text-center p-2">
                    <User className="w-8 h-8 text-blue-500" />
                    <span className="text-[9px] text-slate-400 mt-1">Self (You)</span>
                  </div>
                ) : (
                  <CameraOff className="w-6 h-6 text-slate-700" />
                )}
              </div>

              {/* Bottom controls */}
              <div className="flex justify-center gap-3 mt-auto z-15">
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`p-3 rounded-2xl flex items-center justify-center cursor-pointer transition ${
                    micOn ? "bg-slate-800 text-slate-200" : "bg-red-500 text-white"
                  }`}
                >
                  {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setCameraOn(!cameraOn)}
                  className={`p-3 rounded-2xl flex items-center justify-center cursor-pointer transition ${
                    cameraOn ? "bg-slate-800 text-slate-200" : "bg-red-500 text-white"
                  }`}
                >
                  {cameraOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setActiveCallAppointment(null)}
                  className="bg-red-650 hover:bg-red-700 text-white px-6 rounded-2xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  Disconnect Consultation
                </button>
              </div>
            </div>

            {/* Right: Transcription & Chats panel */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950 flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Live Chat & AI Transcription</span>
                <span className="text-[10px] bg-blue-900/50 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI Realtime
                </span>
              </div>

              {/* Message scroll list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none text-xs">
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className={`font-bold uppercase text-[9px] tracking-wider ${chat.sender === "Clinician" ? "text-blue-400" : "text-green-400"}`}>
                      {chat.sender} • {chat.time}
                    </p>
                    <p className="text-slate-200 bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                      {chat.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chat Input footer */}
              <div className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && triggerSendMessage()}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
                />
                <button
                  onClick={triggerSendMessage}
                  className="bg-blue-600 hover:bg-blue-500 p-2.5 rounded-lg text-white transition cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
