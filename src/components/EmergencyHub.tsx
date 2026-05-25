import { useState } from "react";
import { PhoneCall, AlertCircle, ShieldAlert, Heart, Siren, Server, CheckCircle2, ChevronRight, X } from "lucide-react";

interface EmergencyHubProps {
  onClose?: () => void;
}

const CLINICS_LOAD_POOL = [
  { name: "Downtown ER Trauma Center", distance: "2.4 miles", waitTime: "12 mins", status: "Moderate Load" },
  { name: "Metro General Pediatric Wing", distance: "4.1 miles", waitTime: "5 mins", status: "Low Load" },
  { name: "Northside Cardiology ER", distance: "7.8 miles", waitTime: "24 mins", status: "High Load" }
];

const BLOOD_BANK_POOL = [
  { group: "A Positive (A+)", ratio: 82, status: "Secure" },
  { group: "O Negative (O-)", ratio: 14, status: "Critical Shortage" },
  { group: "B Negative (B-)", ratio: 45, status: "Stable" },
  { group: "AB Positive (AB+)", ratio: 95, status: "Fully Serviced" }
];

export default function EmergencyHub({ onClose }: EmergencyHubProps) {
  const [dispatchStatus, setDispatchStatus] = useState<"IDLE" | "PENDING" | "DISPATCHED">("IDLE");
  const [patientLocation, setPatientLocation] = useState("My Current Device Location");

  const triggerAmbulance = () => {
    setDispatchStatus("PENDING");
    setTimeout(() => {
      setDispatchStatus("DISPATCHED");
    }, 1800);
  };

  return (
    <div className="bg-white rounded-3xl border border-red-100 p-6 md:p-8 shrink-0 shadow-lg relative max-w-3xl mx-auto w-full">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 hover:bg-slate-50 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Red Highlight Header Banner */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4.5 flex items-start gap-4 mb-6">
        <div className="p-3 bg-red-500 text-white rounded-xl">
          <Siren className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-red-950 flex items-center gap-2">
            Urgent Red Emergency Portal
            <span className="text-[10px] bg-red-100 text-red-750 font-bold px-2 py-0.5 rounded-full select-none">
              Live Dispatch Channel
            </span>
          </h3>
          <p className="text-xs text-red-800/80 mt-1">
            Immediate dispatch tools, regional ER wait registers, and emergency support channels are aggregated below for responsive clinical coverage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Ambulance Dispatch Block */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            1. GPS Ambulance Booking Simulator
          </h4>
          
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-3.5">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">Pick-up Location Address</span>
              <input
                type="text"
                value={patientLocation}
                onChange={(e) => setPatientLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 font-semibold focus:outline-none"
              />
            </div>

            {dispatchStatus === "IDLE" && (
              <button
                onClick={triggerAmbulance}
                className="w-full bg-red-650 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Siren className="w-4 h-4 animate-bounce" /> Dispatch Ambulance Instantly
              </button>
            )}

            {dispatchStatus === "PENDING" && (
              <div className="p-3 bg-amber-50 text-amber-800 border border-amber-100 rounded-xl text-xs flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <div>
                  <p className="font-bold">Locating Emergency Vehicles...</p>
                  <p className="text-[10px] text-amber-600/90 mt-0.5">Contacting closest transit squads</p>
                </div>
              </div>
            )}

            {dispatchStatus === "DISPATCHED" && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-bold">Ambulance Squad Dispatched</p>
                    <p className="text-[10px] text-emerald-600/90 mt-0.5">ETA: 4-6 Mins • Call ID: #AMB-3910</p>
                  </div>
                </div>
                <div className="text-[9px] bg-emerald-100 text-emerald-800 p-2 rounded block">
                  A representative will dial you immediately at your registered phone. Please keep communication networks open.
                </div>
              </div>
            )}
          </div>

          <div className="bg-red-100/50 p-4 rounded-xl border border-red-200/50 space-y-1.5 text-center">
            <p className="text-xs text-red-900 font-bold block">🚨 Urgent Direct Hotline Number</p>
            <p className="text-xl font-black text-red-750 font-mono tracking-tight leading-none">+1 (800) 555-9111</p>
            <p className="text-[9px] text-red-600 font-semibold">Toll-free 24/7 dedicated ER switchboard pipeline</p>
          </div>
        </div>

        {/* Regional Clinics Wait Time & Blood bank */}
        <div className="space-y-5">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              2. Hospital ER Live Wait Schedules
            </h4>
            <div className="space-y-2">
              {CLINICS_LOAD_POOL.map((cli, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <p className="font-bold text-slate-800">{cli.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{cli.distance} away</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-800 block leading-none">{cli.waitTime} wait</span>
                    <span className={`text-[9px] font-bold ${cli.status.includes("High") ? "text-red-500" : cli.status.includes("Low") ? "text-emerald-500" : "text-amber-500"}`}>
                      {cli.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              3. Blood Bank Real-time Stocks
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {BLOOD_BANK_POOL.map((b, i) => (
                <div key={i} className="p-2 border border-slate-100 rounded-xl space-y-1 bg-white">
                  <div className="flex justify-between items-center font-bold">
                    <span>{b.group}</span>
                    <span className={`text-[9px] ${b.status.includes("Crit") ? "text-red-500 font-black animate-pulse" : "text-slate-450"}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${b.status.includes("Crit") ? "bg-red-500" : "bg-blue-600"}`}
                      style={{ width: `${b.ratio}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
