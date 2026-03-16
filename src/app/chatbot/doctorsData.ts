import { 
    LucideIcon, Sparkles, Heart, Brain, Bone, Ear, Stethoscope, 
    Activity, Droplets, Wind, ShieldAlert, Baby, Flower2, 
    HeartHandshake, Thermometer, Eye, BrainCircuit, Smile, 
    Zap, Scissors, Scan, Syringe, Microscope, Waves, 
    UserCheck, Pill, ShieldCheck, Siren, Footprints, 
    UserPlus, Trees, TestTube, Languages, Utensils, 
    EarOff, Fingerprint, ScissorsLineDashed, 
    Timer, Glasses, Sun, Moon, Database, 
    Dna, CloudRain, Flame, Scale, BookOpen, 
    Dumbbell, PersonStanding, Lightbulb, 
    Coffee, Briefcase, ZapOff, Anchor, Camera
} from 'lucide-react';

export const GLOBAL_DOCTOR_REGISTRY = [
    { name: 'Dr. Jajati Sinha', specialty: 'Internal Medicine', hospital: 'Manipal (AMRI) Dhakuria / Remedy Garia', city: 'Kolkata', fees: '₹1200', qualification: 'MD, MRCP' },
    { name: 'Dr. Ramna Banerjee', specialty: 'Gynecologist & Robotic Surgeon', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹1500', qualification: 'MD, FRCOG' },
    { name: 'Dr. Kunal Sarkar', specialty: 'Cardiac Surgeon', hospital: 'Medica Superspecialty', city: 'Kolkata', fees: '₹2000', qualification: 'MCh, FIACS' },
    { name: 'Dr. Tarun Jindal', specialty: 'Uro-Oncologist', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹1800', qualification: 'MS, MCh' },
    { name: 'Dr. Sujoy Majumdar', specialty: 'Endocrinologist', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹1200', qualification: 'MD, DM' },
    { name: 'Dr. Ravi Kant Saraogi', specialty: 'Endocrinologist', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹1500', qualification: 'MBBS, MD, DM, FICP' },
    { name: 'Dr. Arjun Baidya', specialty: 'Endocrinologist', hospital: 'Sparsh Diagnostic Centre', city: 'Kolkata', fees: '₹1200', qualification: 'MBBS, MD, DM' },
    { name: 'Dr. Biswanath Roy', specialty: 'ENT Specialist', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹1000', qualification: 'MS (ENT)' },
    { name: 'Dr. Gautam Dhar Choudhury', specialty: 'Rheumatologist', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹1400', qualification: 'MD, DM' },
    { name: 'Dr. Vivek Goel', specialty: 'Nephrologist', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹1400', qualification: 'MD, DM' },
    { name: 'Dr. Abhijit Taraphder', specialty: 'Nephrologist', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹1600', qualification: 'MD, DM (Nephrology)' },
    { name: 'Dr. Pratim Sengupta', specialty: 'Nephrologist', hospital: 'ILS Hospital / Belle Vue', city: 'Kolkata', fees: '₹1500', qualification: 'MD, DM Nephrology' },
    { name: 'Dr. Vikash Kapoor', specialty: 'Orthopedic Surgeon', hospital: 'Medica Superspeciality', city: 'Kolkata', fees: '₹1500', qualification: 'MS (Ortho)' },
    { name: 'Dr. Ronen Roy', specialty: 'Orthopedic Surgeon', hospital: 'Fortis Anandapur', city: 'Kolkata', fees: '₹1600', qualification: 'MS, FRCS' },
    { name: 'Dr. Deep Das', specialty: 'Neurologist', hospital: 'CMRI / Woodlands', city: 'Kolkata', fees: '₹1500', qualification: 'MD, DM' },
    { name: 'Dr. Raja Dhar', specialty: 'Pulmonologist', hospital: 'CMRI', city: 'Kolkata', fees: '₹1400', qualification: 'MD, MRCP' },
    { name: 'Dr. Subhasish Ghosh', specialty: 'Pulmonologist', hospital: 'Apollo / Manipal Hospitals', city: 'Kolkata', fees: '₹1300', qualification: 'MD, FCCP' },
    { name: 'Dr. Sushmita Roychowdhury', specialty: 'Pulmonologist', hospital: 'Fortis Anandapur', city: 'Kolkata', fees: '₹1500', qualification: 'MD, DNB (Pulmonary)' },
    { name: 'Dr. Arindam Biswas', specialty: 'Internal Medicine', hospital: 'Rabindranath Tagore (RN Tagore)', city: 'Kolkata', fees: '₹1100', qualification: 'MD' },
    { name: 'Dr. Koushik Lahiri', specialty: 'Dermatologist', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹1200', qualification: 'MD, DDVL' },
    { name: 'Dr. Mahesh Goenka', specialty: 'Gastroenterologist', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹1500', qualification: 'MD, DM (Gastro)' },
    { name: 'Dr. Chanchal Goswami', specialty: 'Oncologist', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹1800', qualification: 'MD, DMRT' },
    { name: 'Dr. Jai Ranjan Ram', specialty: 'Psychiatrist', hospital: 'Apollo / Manipal Apollo', city: 'Kolkata', fees: '₹1600', qualification: 'MD, MRCPsych' },
    { name: 'Dr. Apurba Ghosh', specialty: 'Pediatrician', hospital: 'Institute of Child Health', city: 'Kolkata', fees: '₹1200', qualification: 'MD (Pediatrics)' },
    { name: 'Dr. Abhijit Chattopadhyay', specialty: 'Ophthalmologist', hospital: 'Priyamvada Birla Aravind Eye', city: 'Kolkata', fees: '₹1000', qualification: 'MS (Ophtha)' },
    { name: 'Dr. Siddhartha Das', specialty: 'Dentist', hospital: 'Apollo Multispeciality', city: 'Kolkata', fees: '₹800', qualification: 'BDS, MDS' },
    { name: 'Dr. Ramakanta Panda', specialty: 'Cardiologist', hospital: 'Asian Heart Institute', city: 'Mumbai', fees: '₹3000', qualification: 'MCh' },
    { name: 'Dr. Nitin Sampat', specialty: 'Neurologist', hospital: 'Wockhardt Hospital', city: 'Mumbai', fees: '₹2500', qualification: 'MD, DNB' },
    { name: 'Dr. Dinshaw Pardiwala', specialty: 'Orthopedic Surgeon', hospital: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', fees: '₹3000', qualification: 'MS, DNB' },
    { name: 'Dr. Subhash Agal', specialty: 'Gastroenterologist', hospital: 'Kokilaben Hospital', city: 'Mumbai', fees: '₹2500', qualification: 'MD, DM' },
    { name: 'Dr. Suresh Advani', specialty: 'Oncologist', hospital: 'Nanavati Max Hospital', city: 'Mumbai', fees: '₹3500', qualification: 'MD, FICP' },
    { name: 'Dr. Pratit Samdani', specialty: 'Internal Medicine', hospital: 'Breach Candy / Jaslok', city: 'Mumbai', fees: '₹2800', qualification: 'MD (Gold Medalist)' },
    { name: 'Dr. Vishal Peshattiwar', specialty: 'Orthopedic Surgeon', hospital: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', fees: '₹3200', qualification: 'MS (Spine Surgery)' },
    { name: 'Dr. Alok Sharma', specialty: 'Neurologist', hospital: 'NeuroGen Institute', city: 'Mumbai', fees: '₹3000', qualification: 'MS, MCh' },
    { name: 'Dr. Santanu Sen', specialty: 'Oncologist', hospital: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', fees: '₹2800', qualification: 'MD (Pediatric Oncology)' },
    { name: 'Dr. Naresh Trehan', specialty: 'Cardiologist', hospital: 'Medanta - The Medicity', city: 'Delhi NCR', fees: '₹3500', qualification: 'MCh' },
    { name: 'Dr. Ashok Rajgopal', specialty: 'Orthopedic Surgeon', hospital: 'Medanta - The Medicity', city: 'Delhi NCR', fees: '₹3000', qualification: 'MS, MCh' },
    { name: 'Dr. Vinit Suri', specialty: 'Neurologist', hospital: 'Indraprastha Apollo', city: 'Delhi NCR', fees: '₹2800', qualification: 'MD, DM' },
    { name: 'Dr. Randhir Sud', specialty: 'Gastroenterologist', hospital: 'Medanta - The Medicity', city: 'Delhi NCR', fees: '₹3200', qualification: 'MD, DM' },
    { name: 'Dr. Sabhyata Gupta', specialty: 'Gyneologist', hospital: 'Medanta - The Medicity', city: 'Delhi NCR', fees: '₹2800', qualification: 'MD, DNB' },
    { name: 'Dr. Pradeep Chowbey', specialty: 'Bariatric Surgeon', hospital: 'Max Super Speciality, Saket', city: 'Delhi NCR', fees: '₹3500', qualification: 'MS, FRCS' },
    { name: 'Dr. Rommel Tickoo', specialty: 'Internal Medicine', hospital: 'Max Hospital', city: 'Delhi NCR', fees: '₹1800', qualification: 'MD' },
    { name: 'Dr. Devi Prasad Shetty', specialty: 'Cardiologist', hospital: 'Narayana Health', city: 'Bangalore', fees: '₹3000', qualification: 'MS, FRCS' },
    { name: 'Dr. Vivek Jawali', specialty: 'Cardiologist', hospital: 'Fortis Hospital', city: 'Bangalore', fees: '₹2800', qualification: 'MS, MCh' },
    { name: 'Dr. Deepak Haldipur', specialty: 'ENT Specialist', hospital: 'Sparsh Hospital', city: 'Bangalore', fees: '₹1500', qualification: 'MS (ENT)' },
    { name: 'Dr. Somashekhar S. P.', specialty: 'Oncologist', hospital: 'Aster DM Healthcare', city: 'Bangalore', fees: '₹3200', qualification: 'MS, MCh' },
    { name: 'Dr. Ravi Gopal Varma', specialty: 'Neurologist', hospital: 'Aster CMI', city: 'Bangalore', fees: '₹3000', qualification: 'MS, MCh' },
    { name: 'Dr. D. Nageshwar Reddy', specialty: 'Gastroenterologist', hospital: 'AIG Hospitals', city: 'Hyderabad', fees: '₹3000', qualification: 'MD, DM' },
    { name: 'Dr. P. Raghu Ram', specialty: 'Oncologist', hospital: 'KIMS Hospitals', city: 'Hyderabad', fees: '₹3000', qualification: 'MS, FRCS' },
    { name: 'Dr. K. M. Cherian', specialty: 'Cardiac Surgeon', hospital: 'Frontier Lifeline', city: 'Chennai', fees: '₹2500', qualification: 'MS, FRCS' },
    { name: 'Dr. Mohamed Rela', specialty: 'Liver Transplant Surgeon', hospital: 'Rela Institute', city: 'Chennai', fees: '₹3000', qualification: 'MS, FRCS' },
    { name: 'Dr. Sanjoy Sen', specialty: 'Dermatologist', hospital: 'MedVoice Online Clinic', city: 'Online', fees: '₹700', qualification: 'MD (Skin)' },
    { name: 'Dr. Pritam Das', specialty: 'Psychiatrist', hospital: 'MedVoice Online Clinic', city: 'Online', fees: '₹800', qualification: 'MD, DPM' },
    { name: 'Dr. Meera Iyer', specialty: 'Pediatrician', hospital: 'MedVoice Virtual Care', city: 'Online', fees: '₹600', qualification: 'MD (Pediatrics)' },
    { name: 'Dr. Rahul Verma', specialty: 'Endocrinologist', hospital: 'MedVoice Online Clinic', city: 'Online', fees: '₹900', qualification: 'MD, DM' },
    { name: 'Dr. S. K. Gupta', specialty: 'Nephrologist', hospital: 'MedVoice Virtual Care', city: 'Online', fees: '₹1000', qualification: 'MD, DM' },
    { name: 'Dr. Ananya Reddy', specialty: 'Rheumatologist', hospital: 'MedVoice Online Clinic', city: 'Online', fees: '₹950', qualification: 'MD, DM' },
    { name: 'Dr. Vikram Seth', specialty: 'Pulmonologist', hospital: 'MedVoice Virtual Care', city: 'Online', fees: '₹850', qualification: 'MD, DTCD' },
    { name: 'Dr. Sneha Kapoor', specialty: 'Ophthalmologist', hospital: 'MedVoice Online Clinic', city: 'Online', fees: '₹750', qualification: 'MS (Ophtha)' },
    { name: 'Dr. Amitava Das', specialty: 'General Physician', hospital: 'Belgharia Municipal Hospital', city: 'Belgharia', fees: '₹600', qualification: 'MBBS' },
    { name: 'Dr. Somnath Paul', specialty: 'Cardiologist', hospital: 'Kalyani JNM Hospital', city: 'Kalyani', fees: '₹1200', qualification: 'MD, DM' },
    { name: "Dr. Mousumi Ghosh", specialty: "Dermatologist", hospital: "Belgharia State General", city: "Belgharia", fees: "₹500", qualification: "MD (Skin)", timing: "Mon-Fri 4PM-7PM" },
    { name: "Dr. Pradip Kundu", specialty: "Neurologist", hospital: "Kalyani JNM Hospital", city: "Kalyani", fees: "₹1500", qualification: "MD, DM", timing: "Tue/Thu 11AM-3PM" },
    { name: "Dr. Buddhadeb Chatterjee", specialty: "Orthopedic Surgeon", hospital: "Woodlands / Apollo", city: "Kolkata", fees: "₹1500", qualification: "MS (Ortho), 30+ yrs Exp", timing: "Mon-Sat 10AM-1PM" },
    { name: "Dr. Mukund Agrawal", specialty: "Orthopedic Surgeon", hospital: "MedVoice Virtual Specialist", city: "Online", fees: "₹1200", qualification: "MS, Fellowship in Joint Replacement", timing: "Daily 8AM-10PM (Online)" },
    { name: "Dr. Gautam Gupta", specialty: "Orthopedic Surgeon", hospital: "Desun Hospital", city: "Kolkata", fees: "₹1400", qualification: "MS (Ortho)", timing: "Mon/Wed/Fri 2PM-6PM" },
    { name: "Dr. Sanjay Jain", specialty: "Orthopedic Surgeon", hospital: "Apollo multispeciality", city: "Kolkata", fees: "₹1600", qualification: "MS, MCh", timing: "Mon-Sat 12PM-5PM" }
];

export function normalizeSpecialtyName(name: string): string {
    const s = name.toLowerCase();
    if (s.includes('ortho')) return 'Orthopedic Surgeon';
    if (s.includes('cardio')) return 'Cardiologist';
    if (s.includes('derm') || s.includes('skin')) return 'Dermatologist';
    if (s.includes('neuro')) return 'Neurologist';
    if (s.includes('gastro')) return 'Gastroenterologist';
    if (s.includes('pulmon') || s.includes('lung') || s.includes('chest')) return 'Pulmonologist';
    if (s.includes('nephro') || s.includes('kidney')) return 'Nephrologist';
    if (s.includes('endo') || s.includes('diabet')) return 'Endocrinologist';
    if (s.includes('physician') || s.includes('medicine') || s.includes('gp')) return 'General Physician';
    if (s.includes('gynea') || s.includes('gyneo') || s.includes('gynec') || s.includes('obg')) return 'Gynecologist';
    if (s.includes('ent') || s.includes('ear') || s.includes('nose') || s.includes('throat')) return 'ENT Specialist';
    if (s.includes('psychi') || s.includes('mental')) return 'Psychiatrist';
    if (s.includes('pediat') || s.includes('child')) return 'Pediatrician';
    if (s.includes('ophtha') || s.includes('eye')) return 'Ophthalmologist';
    if (s.includes('onco') || s.includes('cancer')) return 'Oncologist';
    if (s.includes('urol') || s.includes('bladder')) return 'Urologist';
    if (s.includes('rheuma') || s.includes('joint')) return 'Rheumatologist';
    if (s.includes('hemat') || s.includes('blood')) return 'Hematologist';
    if (s.includes('immuno') || s.includes('allergy')) return 'Allergist & Immunologist';
    if (s.includes('hepat') || s.includes('liver')) return 'Hepatologist';
    if (s.includes('vascul')) return 'Vascular Surgeon';
    if (s.includes('plastic') || s.includes('cosmetic')) return 'Plastic Surgeon';
    if (s.includes('podia') || s.includes('foot')) return 'Podiatrist';
    if (s.includes('geriat') || s.includes('elder')) return 'Geriatrician';
    if (s.includes('infect') || s.includes('virus')) return 'Infectious Disease Specialist';
    if (s.includes('anesthes')) return 'Anesthesiologist';
    if (s.includes('radio') || s.includes('xray') || s.includes('scan')) return 'Radiologist';
    if (s.includes('patho') || s.includes('lab')) return 'Pathologist';
    if (s.includes('emerg') || s.includes('er ')) return 'Emergency Medicine Specialist';
    if (s.includes('sport')) return 'Sports Medicine Specialist';
    if (s.includes('pain')) return 'Pain Management Specialist';
    if (s.includes('neo') && s.includes('nat')) return 'Neonatologist';
    if (s.includes('dent') || s.includes('teeth') || s.includes('oral')) return 'Dentist';
    if (s.includes('sleep') || s.includes('apnea')) return 'Sleep Medicine Specialist';
    if (s.includes('genet')) return 'Geneticist';
    if (s.includes('nutrition') || s.includes('diet')) return 'Nutritionist';
    if (s.includes('palliat') || s.includes('hospice')) return 'Palliative Care Specialist';
    if (s.includes('addict')) return 'Addiction Specialist';
    if (s.includes('sex') || s.includes('reproductive')) return 'Sexologist';
    if (s.includes('tricho') || s.includes('hair')) return 'Trichologist';
    if (s.includes('cosmeto')) return 'Cosmetologist';
    if (s.includes('psychol')) return 'Psychologist';
    if (s.includes('rehab')) return 'Rehabilitation Specialist';
    if (s.includes('toxic')) return 'Toxicologist';
    if (s.includes('forensic')) return 'Forensic Pathologist';
    if (s.includes('audio') || s.includes('hearing')) return 'Audiologist';
    if (s.includes('speech')) return 'Speech Therapist';
    if (s.includes('bariatric')) return 'Bariatric Surgeon';
    if (s.includes('ivf') || s.includes('fertility')) return 'Fertility Specialist';
    return name;
}

export function getSpecialtyIcon(specialty: string): LucideIcon {
    const s = specialty.toLowerCase();
    if (s.includes('dermatologist') || s.includes('skin') || s.includes('trichologist') || s.includes('hair') || s.includes('cosmeto')) return Sparkles;
    if (s.includes('cardiologist') || s.includes('heart') || s.includes('vascular')) return Heart;
    if (s.includes('neurologist') || s.includes('brain') || s.includes('sleep')) return Brain;
    if (s.includes('orthopedic') || s.includes('bone') || s.includes('joint') || s.includes('rheuma') || s.includes('rehab')) return Bone;
    if (s.includes('pulmonologist') || s.includes('lung') || s.includes('chest')) return Wind;
    if (s.includes('nephrologist') || s.includes('kidney') || s.includes('urol')) return Droplets;
    if (s.includes('gastroenterologist') || s.includes('stomach') || s.includes('liver') || s.includes('hepat')) return Stethoscope;
    if (s.includes('oncologist') || s.includes('cancer')) return ShieldAlert;
    if (s.includes('pediatrician') || s.includes('child') || s.includes('neo')) return Baby;
    if (s.includes('gynecologist') || s.includes('female') || s.includes('reproductive') || s.includes('fertility') || s.includes('ivf')) return Flower2;
    if (s.includes('ophthalmologist') || s.includes('eye')) return Eye;
    if (s.includes('psychiatrist') || s.includes('mental') || s.includes('psychol')) return BrainCircuit;
    if (s.includes('dentist') || s.includes('teeth')) return Zap;
    if (s.includes('ent') || s.includes('ear') || s.includes('hearing') || s.includes('audio')) return Ear;
    if (s.includes('patho') || s.includes('lab') || s.includes('hemat') || s.includes('blood') || s.includes('micro')) return Microscope;
    if (s.includes('emerg') || s.includes('er') || s.includes('toxic')) return Siren;
    if (s.includes('surge') || s.includes('sciss')) return Scissors;
    if (s.includes('radio') || s.includes('scan')) return Scan;
    if (s.includes('anesthes') || s.includes('syringe')) return Syringe;
    if (s.includes('physician') || s.includes('general')) return Stethoscope;
    if (s.includes('podia') || s.includes('foot')) return Footprints;
    if (s.includes('geriat') || s.includes('elder')) return UserCheck;
    if (s.includes('infect') || s.includes('virus')) return ShieldCheck;
    if (s.includes('sport')) return Dumbbell;
    if (s.includes('pain')) return Thermometer;
    if (s.includes('nutrition') || s.includes('diet')) return Utensils;
    if (s.includes('genet') || s.includes('dna')) return Dna;
    if (s.includes('speech')) return Languages;
    if (s.includes('sex')) return HeartHandshake;
    return Activity;
}
