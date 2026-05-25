import { useState } from "react";
import { Doctor, Appointment } from "../types";
import { DOCTORS } from "../data";
import { Search, SlidersHorizontal, Star, Shield, ArrowRight, Video, CheckCircle, Activity } from "lucide-react";
import BookingProgress from "./BookingProgress";

interface DoctorSearchProps {
  onSuccessBooking: (appointment: Appointment) => void;
  initialSpecialtyFilter?: string;
}

export default function DoctorSearch({ onSuccessBooking, initialSpecialtyFilter = "" }: DoctorSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState(initialSpecialtyFilter);
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [feeRange, setFeeRange] = useState<number>(250);
  const [minExperience, setMinExperience] = useState<number>(5);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Filter logic
  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === "" || doc.specialty === specialtyFilter;
    const matchesOnline = !onlyOnline || doc.isOnline;
    const matchesFee = doc.fee <= feeRange;
    const matchesExperience = doc.experience >= minExperience;

    return matchesSearch && matchesSpecialty && matchesOnline && matchesFee && matchesExperience;
  });

  const uniqueSpecialties = Array.from(new Set(DOCTORS.map(d => d.specialty)));

  return (
    <div className="space-y-6">
      {selectedDoctor ? (
        <BookingProgress
          doctor={selectedDoctor}
          onCancel={() => setSelectedDoctor(null)}
          onSuccess={(newAppt) => {
            onSuccessBooking(newAppt);
            setSelectedDoctor(null);
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Header & Sub-text */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Find Board-Certified Healthcare Professionals</h2>
              <p className="text-sm text-slate-500">Filter through real-time medical schedules, clinic locations, and fee options.</p>
            </div>
            
            {/* Online doctors status badge indicators */}
            <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {DOCTORS.filter(d => d.isOnline).length} Specialists Online Now
            </div>
          </div>

          {/* Core Search & Filters Bar */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Text Input */}
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctor names, clinical specialties, or experience levels..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Specialty filter dropdown */}
              <div className="md:col-span-3">
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                >
                  <option value="">All Specializations</option>
                  {uniqueSpecialties.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3 flex items-center gap-2 px-1">
                <input
                  type="checkbox"
                  id="onlyOnline"
                  checked={onlyOnline}
                  onChange={(e) => setOnlyOnline(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="onlyOnline" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                  Available Online Now
                </label>
              </div>

            </div>

            {/* Slider parameters sliders */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Max Consultation Fee:</span>
                  <span className="text-xs font-bold text-slate-700">${feeRange}</span>
                  <input
                    type="range"
                    min="100"
                    max="250"
                    step="10"
                    value={feeRange}
                    onChange={(e) => setFeeRange(parseInt(e.target.value))}
                    className="w-24 h-1 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Min Experience:</span>
                  <span className="text-xs font-bold text-slate-700">{minExperience}+ Years</span>
                  <input
                    type="range"
                    min="5"
                    max="18"
                    step="1"
                    value={minExperience}
                    onChange={(e) => setMinExperience(parseInt(e.target.value))}
                    className="w-24 h-1 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              {/* Reset filter trigger */}
              {(searchQuery || specialtyFilter || onlyOnline || feeRange < 250 || minExperience > 5) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSpecialtyFilter("");
                    setOnlyOnline(false);
                    setFeeRange(250);
                    setMinExperience(5);
                  }}
                  className="text-xs font-semibold text-red-500 hover:underline cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Doctor Matrix Result */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/90 backdrop-blur border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Avatar + Basic details */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img src={doc.avatar} alt={doc.name} className="w-14 h-14 rounded-xl object-cover border border-slate-200" />
                      {doc.isOnline ? (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      ) : (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-350 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {doc.specialty}
                      </span>
                      <h3 className="text-base font-bold text-slate-800 mt-1">{doc.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">{doc.title}</p>
                    </div>
                  </div>

                  {/* Highlights section list */}
                  <div className="space-y-2.5 my-4 text-xs border-y border-slate-100 py-3 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Experience Background:</span>
                      <span className="font-semibold text-slate-700">{doc.experience} Solid Practice Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Availability:</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[150px]">{doc.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base Consultation Fee:</span>
                      <span className="font-bold text-slate-800">${doc.fee}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" /> {doc.rating}
                      </div>
                      <span className="text-[10px]">({doc.reviewsCount} patient reviews)</span>
                    </div>
                  </div>

                  {/* Doctor Bios About */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {doc.about}
                  </p>
                </div>

                {/* Booking call-to-actions */}
                <div>
                  <button
                    onClick={() => setSelectedDoctor(doc)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
                  >
                    Select & Book Appointment <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {doc.isOnline && (
                    <div className="mt-2.5 text-center flex items-center justify-center gap-1 text-[10px] text-indigo-600 font-medium bg-indigo-50/50 py-1 rounded-md border border-indigo-100/30">
                      <Video className="w-3 h-3" /> Fully compatible with Video Consultations
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredDoctors.length === 0 && (
              <div className="col-span-full py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                <p className="text-sm font-semibold text-slate-500">No Specialists Match Your Filters</p>
                <p className="text-xs text-slate-400 mt-1">Try broadening your selected specialties or pricing bounds to expand findings.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
