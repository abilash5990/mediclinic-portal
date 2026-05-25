import { Doctor, BlogArticle } from "./types";

export const DEPARTMENTS = [
  { id: "cardiology", name: "Cardiology", icon: "Activity", desc: "Heart, vascular, and coronary circulatory health care." },
  { id: "pediatrics", name: "Pediatrics", icon: "Baby", desc: "Specialized diagnostics and physical checkups for toddlers & children." },
  { id: "dermatology", name: "Dermatology", icon: "Sparkles", desc: "Comprehensive skin screening, rash care, and aesthetic therapy." },
  { id: "neurology", name: "Neurology", icon: "BrainCircuit", desc: "Spinal cord, cranial system sensitivity, and neural wellness." },
  { id: "orthopedics", name: "Orthopedics", icon: "Bone", desc: "Skeletal system rehabilitation, bone repairs, and joint therapy." },
  { id: "ophthalmology", name: "Ophthalmology", icon: "Eye", desc: "Vision tests, optical checkups, and corrective vision procedures." }
];

export const DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Evelyn Vance",
    title: "Senior Cardiologist",
    specialty: "Cardiology",
    experience: 14,
    location: "Metro Core Health Wing A",
    availability: "Mon, Wed, Fri 09:00 AM - 02:00 PM",
    fee: 150,
    rating: 4.9,
    reviewsCount: 184,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    department: "cardiology",
    isOnline: true,
    about: "Dr. Evelyn Vance is an accomplished specialist in clinical cardiovascular diagnosis, vascular monitoring, and non-invasive coronary mapping.",
    education: ["M.D. - Johns Hopkins University School of Medicine", "Fellowship in Advanced Cardiology - Cleveland Clinic"]
  },
  {
    id: "doc-2",
    name: "Dr. Marcus Chen",
    title: "Consultant Pediatrician",
    specialty: "Pediatrics",
    experience: 9,
    location: "Family Care Outposts Center B",
    availability: "Tue, Thu, Sat 10:00 AM - 04:00 PM",
    fee: 100,
    rating: 4.8,
    reviewsCount: 112,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
    department: "pediatrics",
    isOnline: true,
    about: "Dr. Marcus Chen specializes in comprehensive child developmental tracking, pediatric vaccine schedules, and proactive nutrition counseling.",
    education: ["M.D. - Stanford University", "Residency - Seattle Children's Hospital"]
  },
  {
    id: "doc-3",
    name: "Dr. Sarah Rodriguez",
    title: "Consultant Dermatologist",
    specialty: "Dermatology",
    experience: 11,
    location: "Dermal Care Aesthetics Wing C",
    availability: "Mon, Tue, Thu 01:00 PM - 06:00 PM",
    fee: 120,
    rating: 4.9,
    reviewsCount: 220,
    avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200",
    department: "dermatology",
    isOnline: false,
    about: "Dr. Sarah Rodriguez provides treatment protocols for inflammatory skin ailments, acute dermal reactions, and micrographic mole assessment.",
    education: ["M.D. - Yale School of Medicine", "Board Certification in Dermatology - AAD"]
  },
  {
    id: "doc-4",
    name: "Dr. Alistair Sterling",
    title: "Lead Neurosurgeon",
    specialty: "Neurology",
    experience: 18,
    location: "Neuroscience Precinct Wing G",
    availability: "Wed, Thu 08:30 AM - 01:00 PM",
    fee: 200,
    rating: 4.9,
    reviewsCount: 95,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200",
    department: "neurology",
    isOnline: true,
    about: "Dr. Alistair Sterling advises on central nervous system therapy, vestibular balances, spinal alignment diagnostics, and severe nerve pain solutions.",
    education: ["M.D. - Harvard University Medical School", "Director at Neuro-Spinal Rehabilitation Society"]
  },
  {
    id: "doc-5",
    name: "Dr. Priya Patel",
    title: "Orthopedic Specialist",
    specialty: "Orthopedics",
    experience: 8,
    location: "Joint & Spine Annex Building A",
    availability: "Tue, Fri 09:00 AM - 03:30 PM",
    fee: 110,
    rating: 4.7,
    reviewsCount: 148,
    avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=200",
    department: "orthopedics",
    isOnline: false,
    about: "Dr. Priya Patel works extensively on joint corrective therapy, sports physical diagnostics, bone structure support, and general osteo-care.",
    education: ["M.D. - Columbia University", "Residency in Bone Surgery - NYU Langone Health"]
  },
  {
    id: "doc-6",
    name: "Dr. Thomas Mercer",
    title: "Chief Ophthalmologist",
    specialty: "Ophthalmology",
    experience: 15,
    location: "Vision Excellence Center Tower 2",
    availability: "Mon, Wed 10:00 AM - 05:00 PM",
    fee: 115,
    rating: 4.8,
    reviewsCount: 130,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
    department: "ophthalmology",
    isOnline: true,
    about: "Dr. Thomas Mercer focuses on state-of-the-art diagnostic vision modeling, laser sight therapies, and proactive retinal healthcare.",
    education: ["M.D. - Boston University School of Medicine", "Chief Fellow - Massachusetts Eye and Ear Institute"]
  }
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "blog-1",
    title: "Preventative Cardiology: 5 Actions to Boost Heart Longevity",
    category: "Heart Health",
    readTime: "4 min read",
    summary: "Simple dietary adjustments, dynamic movement baselines, and sleep routines can significantly lower your risk of long-term cardiac stress.",
    content: "Heart health doesn't start in the surgery suite; it begins at your dining table and through daily lifestyle pacing. Cardiovascular diseases remain the leading global mortality contributor, yet nearly 80% are preventable via minor cumulative routines. Specialists recommend focused fiber ingestion, limiting hydrogenated lipids, scheduling 150 minutes of weekly light cardio, and getting at least 7 hours of undisturbed sleep daily to allow blood vessel reconstruction.",
    author: {
      name: "Dr. Evelyn Vance",
      role: "Chief Cardiologist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
    },
    date: "2026-05-18",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "blog-2",
    title: "Scented Products & Skin Rashes: Derm-advised Preventative Tips",
    category: "Dermatology",
    readTime: "3 min read",
    summary: "Understanding the difference between allergic reactions and dry skin irritation from fragrances, soaps, and local detergents.",
    content: "Dermal irritation has seen a steep rise as cosmetic fragrances grow complex. If you experience persistent red outbreaks or intense irritation, your everyday soap, concentrated detergent, or scented moisturizer could be the main culprit. Always select dermatologist-tested hypoallergenic products that explicitly omit artificial scents. Emollients should be applied immediately post-showering to lock in barrier hydration.",
    author: {
      name: "Dr. Sarah Rodriguez",
      role: "Skin Expert",
      avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=100"
    },
    date: "2026-05-12",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "blog-3",
    title: "Demystifying Pediatrics: Deciphering Toddler Sleep Regression Cycles",
    category: "Pediatrics",
    readTime: "5 min read",
    summary: "A medically grounded guide to navigating natural sleep intervals, developmental milestones, and baby calming patterns.",
    content: "Sleep regressions are normal developmental markers in infant neural growth. During months 4, 8, and 18, rapid motor skill acquisition and language processing cause brief shifts in nighttime slumber behaviors. Pediatric clinicians urge parents to stick to soothing, repeatable sleep rituals, establish dark and tranquil environments, avoid late afternoon over-stimulation, and maintain consistent napping times.",
    author: {
      name: "Dr. Marcus Chen",
      role: "Consultant Pediatrician",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100"
    },
    date: "2026-05-02",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600"
  }
];

export const GENERAL_FAQS = [
  {
    question: "How do I secure a virtual telemedicine consultation?",
    answer: "Choose your practitioner, select 'Video Telehealth' as the consultation type during appointment scheduling, input user specs, and confirm. Virtual meet links will reflect on your Patient Dashboard."
  },
  {
    question: "Can the portal parse my laboratory PDFs and printouts recursively?",
    answer: "Absolutely. Under the Report Hub, you can drag and drop scans or reports. Our integrated secure processor immediately simplifies technical values into highly readable outlines."
  },
  {
    question: "What is your clinic's emergency dispatch procedure?",
    answer: "For urgent concerns, click our Red Emergency CTA to trigger direct emergency line routing or locate oncoming ambulances near your immediate community georouting."
  },
  {
    question: "Do you offer direct billing with major healthcare insurances?",
    answer: "Yes, Medicare Premium validates digital cards directly. You can register your insurance ID on the billing form or from your secure dashboard profile page."
  }
];
