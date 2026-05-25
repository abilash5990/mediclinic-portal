export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: number; // in years
  location: string;
  availability: string; // e.g. "Mon-Fri, 9:00 AM - 5:00 PM"
  fee: number;
  rating: number;
  reviewsCount: number;
  avatar: string;
  department: string;
  isOnline: boolean;
  about: string;
  education: string[];
}

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  reason: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  consultationType: "In-Person" | "Video Telehealth";
  createdDate: string;
  notes?: string;
  pdfAttached?: boolean;
}

export interface MedicalReport {
  id: string;
  filename: string;
  date: string;
  filetype: string;
  summary?: string;
  metrics?: Array<{ name: string; value: string; status: string }>;
  recommendations?: string[];
}

export interface BlogArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  image: string;
}
