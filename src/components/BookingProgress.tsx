import { useState } from "react";
import { Doctor, Appointment } from "../types";
import { Calendar, Clock, User, CreditCard, CheckCircle, Video, MapPin, Loader2, Sparkles, AlertCircle, PhoneCall, ChevronRight, ChevronLeft } from "lucide-react";

interface BookingProgressProps {
  doctor: Doctor;
  onCancel: () => void;
  onSuccess: (appointment: Appointment) => void;
}

const TIME_SLOTS_POOL = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM"
];

export default function BookingProgress({ doctor, onCancel, onSuccess }: BookingProgressProps) {
  const [step, setStep] = useState<number>(1); // Step 1: Date & Time, Step 2: Patient Details, Step 3: Fast Payment, Step 4: Success Confirmation
  const [selectedDate, setSelectedDate] = useState<string>("2026-05-26");
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM");
  const [consultationType, setConsultationType] = useState<"In-Person" | "Video Telehealth">("In-Person");
  
  // Patient details state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [insuranceId, setInsuranceId] = useState("");
  
  // Payment states
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("09/29");
  const [cardCvv, setCardCvv] = useState("123");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [comfirmSMS, setComfirmSMS] = useState(true);

  // Quick helper to generate a list of upcoming 7 days for the date selector
  const getUpcomingDays = () => {
    const days = [];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split("T")[0];
      days.push({
        dayName: weekdays[d.getDay()],
        dayNum: d.getDate(),
        month: d.toLocaleString("en-US", { month: "short" }),
        dateString
      });
    }
    return days;
  };

  const handleNextStep = () => {
    if (step === 1 && (!selectedDate || !selectedTime)) return;
    if (step === 2) {
      if (!name.trim()) {
        alert("Patient Name is required.");
        return;
      }
      if (!phone.trim()) {
        alert("Patient Contact Phone is required.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmitBooking = () => {
    setBookingLoading(true);

    setTimeout(() => {
      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        doctor,
        date: selectedDate,
        timeSlot: selectedTime,
        patientName: name,
        patientPhone: phone,
        patientEmail: email,
        reason: reason || "Routine Consultation",
        status: "Scheduled",
        consultationType,
        createdDate: new Date().toLocaleDateString("en-US")
      };

      setBookingLoading(false);
      onSuccess(newAppointment);
    }, 1500);
  };

  const totalFee = consultationType === "Video Telehealth" ? doctor.fee * 0.9 : doctor.fee; // 10% Telehealth discount
  const insuranceApplied = insuranceId.trim().length > 3;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shrink-0 shadow-lg max-w-2xl mx-auto w-full">
      {/* Back button */}
      {step < 4 && (
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1.5 font-medium cursor-pointer"
        >
          <ChevronLeft className="w-3 h-3" /> Back to Doctor Directory
        </button>
      )}

      {/* Interactive progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {[
            { id: 1, label: "Day & Slot" },
            { id: 2, label: "Patient" },
            { id: 3, label: "Checkout" },
            { id: 4, label: "Complete" }
          ].map((item) => (
            <div key={item.id} className="flex-1 flex flex-col items-center relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-200 ${
                  step === item.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : step > item.id
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                {step > item.id ? "✓" : item.id}
              </div>
              <span
                className={`text-[10px] font-semibold mt-1.5 transition-all duration-200 ${
                  step === item.id ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: DATE, TIME, & TYPE SELECTOR */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">{doctor.name}</h3>
              <p className="text-xs text-slate-500">{doctor.title} • {doctor.specialty}</p>
              <p className="text-[10px] text-blue-600 font-medium mt-0.5">{doctor.location}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              1. Choose Consultation Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultationType("In-Person")}
                className={`p-3.5 rounded-xl border text-left transition duration-150 cursor-pointer flex gap-3 ${
                  consultationType === "In-Person"
                    ? "border-blue-600 bg-blue-50/50 text-slate-800 ring-1 ring-blue-500"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <MapPin className={`w-5 h-5 shrink-0 ${consultationType === "In-Person" ? "text-blue-600" : "text-slate-400"}`} />
                <div>
                  <p className="text-xs font-bold">Physical Clinic Visit</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Meet at the center wings</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setConsultationType("Video Telehealth")}
                className={`p-3.5 rounded-xl border text-left transition duration-150 cursor-pointer flex gap-3 ${
                  consultationType === "Video Telehealth"
                    ? "border-blue-600 bg-blue-50/50 text-slate-800 ring-1 ring-blue-500"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <Video className={`w-5 h-5 shrink-0 ${consultationType === "Video Telehealth" ? "text-blue-600" : "text-slate-400"}`} />
                <div>
                  <p className="text-xs font-bold">Video Telehealth (-10%)</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">High definition remote meet</p>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
              <span>2. Choose Appointment Date</span>
              <span className="text-[10px] font-normal text-slate-500 italic">Available upcoming week</span>
            </label>
            <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-none">
              {getUpcomingDays().map((day) => (
                <button
                  type="button"
                  key={day.dateString}
                  onClick={() => setSelectedDate(day.dateString)}
                  className={`flex-shrink-0 w-16 p-3 rounded-xl border text-center transition duration-150 cursor-pointer ${
                    selectedDate === day.dateString
                      ? "border-blue-600 bg-blue-600 text-white shadow"
                      : "border-slate-150 bg-white text-slate-705 hover:bg-slate-50"
                  }`}
                >
                  <p className={`text-[10px] ${selectedDate === day.dateString ? "text-blue-100" : "text-slate-400"}`}>{day.dayName}</p>
                  <p className="text-base font-bold mt-0.5 leading-none">{day.dayNum}</p>
                  <p className={`text-[9px] ${selectedDate === day.dateString ? "text-blue-200" : "text-slate-500"}`}>{day.month}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              3. Choose Time Slot
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS_POOL.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition duration-150 cursor-pointer ${
                    selectedTime === slot
                      ? "border-blue-600 bg-blue-100 text-blue-800"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleNextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer"
            >
              Continue to Details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PATIENT INFORMATION */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-4">Provide Patient Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Abilash Avms"
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:ring-1 focus:ring-blue-500 text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  Contact Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">+1</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder=" (555) 000-0000"
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-1 focus:ring-blue-500 text-slate-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@gmail.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-1 focus:ring-blue-500 text-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                Optional Insurance Policy ID
              </label>
              <input
                type="text"
                value={insuranceId}
                onChange={(e) => setInsuranceId(e.target.value)}
                placeholder="e.g. BCBS-92104-MED"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-1 focus:ring-blue-500 text-slate-700 focus:outline-none"
              />
              <span className="text-[9px] text-slate-400 mt-0.5 block">Standard insurance copay can apply directly</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
              Reason for Consultation / Symptoms overview
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly state your focal clinical concerns, recurring aches, or general physical inquiries..."
              className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-1 focus:ring-blue-500 text-slate-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50/40 border border-blue-100 rounded-xl">
            <input
              type="checkbox"
              id="confirmSMS"
              checked={comfirmSMS}
              onChange={(e) => setComfirmSMS(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <label htmlFor="confirmSMS" className="text-xs text-slate-600 cursor-pointer select-none">
              Receive smart instant booking updates via <strong>WhatsApp & SMS</strong>.
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              onClick={handlePrevStep}
              className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Go Back
            </button>
            <button
              onClick={handleNextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer"
            >
              Proceed to checkout <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BILLING & PAYMENT CHECKOUT */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Invoice Summary</h4>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Doctor Fee:</span>
              <span className="font-semibold">${doctor.fee}</span>
            </div>
            {consultationType === "Video Telehealth" && (
              <div className="flex justify-between text-xs text-indigo-700">
                <span>Video Telehealth Discount (10%):</span>
                <span className="font-medium">-${(doctor.fee * 0.1).toFixed(0)}</span>
              </div>
            )}
            {insuranceApplied && (
              <div className="flex justify-between text-xs text-emerald-700 font-medium">
                <span>Approved Copay Coverage:</span>
                <span>-60% Applied</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200/50 flex justify-between text-sm text-slate-800 font-bold">
              <span>Grand Total:</span>
              <span className="text-blue-600">
                ${insuranceApplied ? (totalFee * 0.4).toFixed(0) : totalFee.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Core Credit Card form */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Secure Payment Information</h4>
            <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-xl">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Credit Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-1 focus:ring-blue-500 text-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-1 focus:ring-blue-500 text-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    CVV/Code
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:ring-1 focus:ring-blue-500 text-slate-700 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 select-none justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Secure 256-Bit SSL Encrypted Healthcare Integration
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              onClick={handlePrevStep}
              disabled={bookingLoading}
              className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Go Back
            </button>
            <button
              onClick={handleSubmitBooking}
              disabled={bookingLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              {bookingLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Securing Appointment...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Complete Secure Booking
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
