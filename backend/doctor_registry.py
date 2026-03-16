from typing import Any, List, Dict
import json
import os
from langchain_core.messages import SystemMessage  # type: ignore

# ── GLOBAL DOCTOR REGISTRY ──────────────────────────────────────────────────
# Master Registry synced from src/app/chatbot/doctorsData.ts
REGISTRY = [
    { "name": 'Dr. Jajati Sinha', "specialty": 'Internal Medicine', "hospital": 'Manipal (AMRI) Dhakuria / Remedy Garia', "city": 'Kolkata', "fees": '₹1200', "qualification": 'MD, MRCP' },
    { "name": 'Dr. Ramna Banerjee', "specialty": 'Gynecologist & Robotic Surgeon', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹1500', "qualification": 'MD, FRCOG' },
    { "name": 'Dr. Kunal Sarkar', "specialty": 'Cardiac Surgeon', "hospital": 'Medica Superspecialty', "city": 'Kolkata', "fees": '₹2000', "qualification": 'MCh, FIACS' },
    { "name": 'Dr. Tarun Jindal', "specialty": 'Uro-Oncologist', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹1800', "qualification": 'MS, MCh' },
    { "name": 'Dr. Sujoy Majumdar', "specialty": 'Endocrinologist', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹1200', "qualification": 'MD, DM' },
    { "name": 'Dr. Ravi Kant Saraogi', "specialty": 'Endocrinologist', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹1500', "qualification": 'MBBS, MD, DM, FICP' },
    { "name": 'Dr. Arjun Baidya', "specialty": 'Endocrinologist', "hospital": 'Sparsh Diagnostic Centre', "city": 'Kolkata', "fees": '₹1200', "qualification": 'MBBS, MD, DM' },
    { "name": 'Dr. Biswanath Roy', "specialty": 'ENT Specialist', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹1000', "qualification": 'MS (ENT)' },
    { "name": 'Dr. Gautam Dhar Choudhury', "specialty": 'Rheumatologist', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹1400', "qualification": 'MD, DM' },
    { "name": 'Dr. Vivek Goel', "specialty": 'Nephrologist', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹1400', "qualification": 'MD, DM' },
    { "name": 'Dr. Abhijit Taraphder', "specialty": 'Nephrologist', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹1600', "qualification": 'MD, DM (Nephrology)' },
    { "name": 'Dr. Pratim Sengupta', "specialty": 'Nephrologist', "hospital": 'ILS Hospital / Belle Vue', "city": 'Kolkata', "fees": '₹1500', "qualification": 'MD, DM Nephrology' },
    { "name": 'Dr. Vikash Kapoor', "specialty": 'Orthopedic Surgeon', "hospital": 'Medica Superspeciality', "city": 'Kolkata', "fees": '₹1500', "qualification": 'MS (Ortho)' },
    { "name": 'Dr. Ronen Roy', "specialty": 'Orthopedic Surgeon', "hospital": 'Fortis Anandapur', "city": 'Kolkata', "fees": '₹1600', "qualification": 'MS, FRCS' },
    { "name": 'Dr. Deep Das', "specialty": 'Neurologist', "hospital": 'CMRI / Woodlands', "city": 'Kolkata', "fees": '₹1500', "qualification": 'MD, DM' },
    { "name": 'Dr. Raja Dhar', "specialty": 'Pulmonologist', "hospital": 'CMRI', "city": 'Kolkata', "fees": '₹1400', "qualification": 'MD, MRCP' },
    { "name": 'Dr. Subhasish Ghosh', "specialty": 'Pulmonologist', "hospital": 'Apollo / Manipal Hospitals', "city": 'Kolkata', "fees": '₹1300', "qualification": 'MD, FCCP' },
    { "name": 'Dr. Sushmita Roychowdhury', "specialty": 'Pulmonologist', "hospital": 'Fortis Anandapur', "city": 'Kolkata', "fees": '₹1500', "qualification": 'MD, DNB (Pulmonary)' },
    { "name": 'Dr. Arindam Biswas', "specialty": 'Internal Medicine', "hospital": 'Rabindranath Tagore (RN Tagore)', "city": 'Kolkata', "fees": '₹1100', "qualification": 'MD' },
    { "name": 'Dr. Koushik Lahiri', "specialty": 'Dermatologist', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹1200', "qualification": 'MD, DDVL' },
    { "name": 'Dr. Mahesh Goenka', "specialty": 'Gastroenterologist', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹1500', "qualification": 'MD, DM (Gastro)' },
    { "name": 'Dr. Chanchal Goswami', "specialty": 'Oncologist', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹1800', "qualification": 'MD, DMRT' },
    { "name": 'Dr. Jai Ranjan Ram', "specialty": 'Psychiatrist', "hospital": 'Apollo / Manipal Apollo', "city": 'Kolkata', "fees": '₹1600', "qualification": 'MD, MRCPsych' },
    { "name": 'Dr. Apurba Ghosh', "specialty": 'Pediatrician', "hospital": 'Institute of Child Health', "city": 'Kolkata', "fees": '₹1200', "qualification": 'MD (Pediatrics)' },
    { "name": 'Dr. Abhijit Chattopadhyay', "specialty": 'Ophthalmologist', "hospital": 'Priyamvada Birla Aravind Eye', "city": 'Kolkata', "fees": '₹1000', "qualification": 'MS (Ophtha)' },
    { "name": 'Dr. Siddhartha Das', "specialty": 'Dentist', "hospital": 'Apollo Multispeciality', "city": 'Kolkata', "fees": '₹800', "qualification": 'BDS, MDS' },
    { "name": 'Dr. Ramakanta Panda', "specialty": 'Cardiologist', "hospital": 'Asian Heart Institute', "city": 'Mumbai', "fees": '₹3000', "qualification": 'MCh' },
    { "name": 'Dr. Nitin Sampat', "specialty": 'Neurologist', "hospital": 'Wockhardt Hospital', "city": 'Mumbai', "fees": '₹2500', "qualification": 'MD, DNB' },
    { "name": 'Dr. Dinshaw Pardiwala', "specialty": 'Orthopedic Surgeon', "hospital": 'Kokilaben Dhirubhai Ambani Hospital', "city": 'Mumbai', "fees": '₹3000', "qualification": 'MS, DNB' },
    { "name": 'Dr. Subhash Agal', "specialty": 'Gastroenterologist', "hospital": 'Kokilaben Hospital', "city": 'Mumbai', "fees": '₹2500', "qualification": 'MD, DM' },
    { "name": 'Dr. Suresh Advani', "specialty": 'Oncologist', "hospital": 'Nanavati Max Hospital', "city": 'Mumbai', "fees": '₹3500', "qualification": 'MD, FICP' },
    { "name": 'Dr. Pratit Samdani', "specialty": 'Internal Medicine', "hospital": 'Breach Candy / Jaslok', "city": 'Mumbai', "fees": '₹2800', "qualification": 'MD (Gold Medalist)' },
    { "name": 'Dr. Vishal Peshattiwar', "specialty": 'Orthopedic Surgeon', "hospital": 'Kokilaben Dhirubhai Ambani Hospital', "city": 'Mumbai', "fees": '₹3200', "qualification": 'MS (Spine Surgery)' },
    { "name": 'Dr. Alok Sharma', "specialty": 'Neurologist', "hospital": 'NeuroGen Institute', "city": 'Mumbai', "fees": '₹3000', "qualification": 'MS, MCh' },
    { "name": 'Dr. Santanu Sen', "specialty": 'Oncologist', "hospital": 'Kokilaben Dhirubhai Ambani Hospital', "city": 'Mumbai', "fees": '₹2800', "qualification": 'MD (Pediatric Oncology)' },
    { "name": 'Dr. Naresh Trehan', "specialty": 'Cardiologist', "hospital": 'Medanta - The Medicity', "city": 'Delhi NCR', "fees": '₹3500', "qualification": 'MCh' },
    { "name": 'Dr. Ashok Rajgopal', "specialty": 'Orthopedic Surgeon', "hospital": 'Medanta - The Medicity', "city": 'Delhi NCR', "fees": '₹3000', "qualification": 'MS, MCh' },
    { "name": 'Dr. Vinit Suri', "specialty": 'Neurologist', "hospital": 'Indraprastha Apollo', "city": 'Delhi NCR', "fees": '₹2800', "qualification": 'MD, DM' },
    { "name": 'Dr. Randhir Sud', "specialty": 'Gastroenterologist', "hospital": 'Medanta - The Medicity', "city": 'Delhi NCR', "fees": '₹3200', "qualification": 'MD, DM' },
    { "name": 'Dr. Sabhyata Gupta', "specialty": 'Gyneologist', "hospital": 'Medanta - The Medicity', "city": 'Delhi NCR', "fees": '₹2800', "qualification": 'MD, DNB' },
    { "name": 'Dr. Pradeep Chowbey', "specialty": 'Bariatric Surgeon', "hospital": 'Max Super Speciality, Saket', "city": 'Delhi NCR', "fees": '₹3500', "qualification": 'MS, FRCS' },
    { "name": 'Dr. Rommel Tickoo', "specialty": 'Internal Medicine', "hospital": 'Max Hospital', "city": 'Delhi NCR', "fees": '₹1800', "qualification": 'MD' },
    { "name": 'Dr. Devi Prasad Shetty', "specialty": 'Cardiologist', "hospital": 'Narayana Health', "city": 'Bangalore', "fees": '₹3000', "qualification": 'MS, FRCS' },
    { "name": 'Dr. Vivek Jawali', "specialty": 'Cardiologist', "hospital": 'Fortis Hospital', "city": 'Bangalore', "fees": '₹2800', "qualification": 'MS, MCh' },
    { "name": 'Dr. Deepak Haldipur', "specialty": 'ENT Specialist', "hospital": 'Sparsh Hospital', "city": 'Bangalore', "fees": '₹1500', "qualification": 'MS (ENT)' },
    { "name": 'Dr. Somashekhar S. P.', "specialty": 'Oncologist', "hospital": 'Aster DM Healthcare', "city": 'Bangalore', "fees": '₹3200', "qualification": 'MS, MCh' },
    { "name": 'Dr. Ravi Gopal Varma', "specialty": 'Neurologist', "hospital": 'Aster CMI', "city": 'Bangalore', "fees": '₹3000', "qualification": 'MS, MCh' },
    { "name": 'Dr. D. Nageshwar Reddy', "specialty": 'Gastroenterologist', "hospital": 'AIG Hospitals', "city": 'Hyderabad', "fees": '₹3000', "qualification": 'MD, DM' },
    { "name": 'Dr. P. Raghu Ram', "specialty": 'Oncologist', "hospital": 'KIMS Hospitals', "city": 'Hyderabad', "fees": '₹3000', "qualification": 'MS, FRCS' },
    { "name": 'Dr. K. M. Cherian', "specialty": 'Cardiac Surgeon', "hospital": 'Frontier Lifeline', "city": 'Chennai', "fees": '₹2500', "qualification": 'MS, FRCS' },
    { "name": 'Dr. Mohamed Rela', "specialty": 'Liver Transplant Surgeon', "hospital": 'Rela Institute', "city": 'Chennai', "fees": '₹3000', "qualification": 'MS, FRCS' },
    { "name": 'Dr. Sanjoy Sen', "specialty": 'Dermatologist', "hospital": 'MedVoice Online Clinic', "city": 'Online', "fees": '₹700', "qualification": 'MD (Skin)' },
    { "name": 'Dr. Pritam Das', "specialty": 'Psychiatrist', "hospital": 'MedVoice Online Clinic', "city": 'Online', "fees": '₹800', "qualification": 'MD, DPM' },
    { "name": 'Dr. Meera Iyer', "specialty": 'Pediatrician', "hospital": 'MedVoice Virtual Care', "city": 'Online', "fees": '₹600', "qualification": 'MD (Pediatrics)' },
    { "name": 'Dr. Rahul Verma', "specialty": 'Endocrinologist', "hospital": 'MedVoice Online Clinic', "city": 'Online', "fees": '₹900', "qualification": 'MD, DM' },
    { "name": 'Dr. S. K. Gupta', "specialty": 'Nephrologist', "hospital": 'MedVoice Virtual Care', "city": 'Online', "fees": '₹1000', "qualification": 'MD, DM' },
    { "name": 'Dr. Ananya Reddy', "specialty": 'Rheumatologist', "hospital": 'MedVoice Online Clinic', "city": 'Online', "fees": '₹950', "qualification": 'MD, DM' },
    { "name": 'Dr. Vikram Seth', "specialty": 'Pulmonologist', "hospital": 'MedVoice Virtual Care', "city": 'Online', "fees": '₹850', "qualification": 'MD, DTCD' },
    { "name": 'Dr. Sneha Kapoor', "specialty": 'Ophthalmologist', "hospital": 'MedVoice Online Clinic', "city": 'Online', "fees": '₹750', "qualification": 'MS (Ophtha)' },
    { "name": 'Dr. Amitava Das', "specialty": 'General Physician', "hospital": 'Belgharia Municipal Hospital', "city": 'Belgharia', "fees": '₹600', "qualification": 'MBBS' },
    { "name": 'Dr. Somnath Paul', "specialty": 'Cardiologist', "hospital": 'Kalyani JNM Hospital', "city": 'Kalyani', "fees": '₹1200', "qualification": 'MD, DM' },
    { "name": "Dr. Mousumi Ghosh", "specialty": "Dermatologist", "hospital": "Belgharia State General", "city": "Belgharia", "fees": "₹500", "qualification": "MD (Skin)" },
    { "name": "Dr. Pradip Kundu", "specialty": "Neurologist", "hospital": "Kalyani JNM Hospital", "city": "Kalyani", "fees": "₹1500", "qualification": "MD, DM" },
    { "name": "Dr. Buddhadeb Chatterjee", "specialty": "Orthopedic Surgeon", "hospital": "Woodlands / Apollo", "city": "Kolkata", "fees": "₹1500", "qualification": "MS (Ortho), 30+ yrs Exp" },
    { "name": "Dr. Mukund Agrawal", "specialty": "Orthopedic Surgeon", "hospital": "MedVoice Virtual Specialist", "city": "Online", "fees": "₹1200", "qualification": "MS, Fellowship in Joint Replacement" },
    { "name": "Dr. Gautam Gupta", "specialty": "Orthopedic Surgeon", "hospital": "Desun Hospital", "city": "Kolkata", "fees": "₹1400", "qualification": "MS (Ortho)" },
    { "name": "Dr. Sanjay Jain", "specialty": "Orthopedic Surgeon", "hospital": "Apollo multispeciality", "city": "Kolkata", "fees": "₹1600", "qualification": "MS, MCh" }
]

def get_docs(target_spec: str, city: str) -> List[Dict[str, Any]]:
    ts = (target_spec or "General Physician").lower().strip()
    tc = (city or "Kolkata").lower().strip()
    
    # Pre-filter for Dr. Arundhati Roy
    registry_filtered = [d for d in REGISTRY if "arundhati roy" not in str(d.get("name", "")).lower()]
    
    # Priority 1: Exact/Partial Specialty + City
    matches = [d for d in registry_filtered if ts in str(d.get("specialty", "")).lower() and str(d.get("city", "")).lower() == tc]
    
    # Priority 2: Specialty Match (Online preference if local city not found)
    if not matches:
        all_spec_matches = [d for d in registry_filtered if ts in str(d.get("specialty", "")).lower()]
        online = [d for d in all_spec_matches if str(d.get("city", "")).lower() == "online"]
        matches = online if online else all_spec_matches
        
    # Priority 3: City Match (General Specialists in City)
    if not matches:
        matches = [d for d in registry_filtered if str(d.get("city", "")).lower() == tc]
    
    return matches[:3]  # type: ignore[misc]

async def search_web_doctors(specialty: str, city: str, llm: Any) -> List[Dict[str, Any]]:
    """
    Uses the LLM to suggest well-known specialist doctors for a given specialty and city.
    NOTE: This uses LLM knowledge (training data) — not a live internet search.
    Results are clearly marked as 'AI-suggested' for transparency.
    """
    search_prompt = f"""List 3 well-known, real {specialty} specialists in {city}, India.
These must be actual doctors that exist (based on your training data).
Format as a JSON array ONLY — no other text. Use this exact structure:
[{{"name": "Dr. Full Name", "specialty": "{specialty}", "hospital": "Hospital Name", "city": "{city}", "fees": "₹XXXX", "qualification": "MD/MS etc."}}]
Do not include Dr. Arundhati Roy. Return ONLY valid JSON."""
    try:
        search_res = await llm.ainvoke([SystemMessage(content=search_prompt)])
        raw_text = str(search_res.content)
        import json
        import re
        match = re.search(r'(\[[\s\S]*?\])', raw_text)
        if match:
            web_docs = json.loads(match.group(1))
            filtered = []
            for d in web_docs:
                if not isinstance(d, dict):
                    continue
                name = str(d.get("name", "")).lower()
                if "arundhati roy" in name:
                    continue
                d['is_web_verified'] = True  # Marks as AI-suggested (not from local registry)
                d['source'] = 'AI-suggested'
                if 'fees' not in d or not d['fees']:
                    d['fees'] = "₹1500 (Est.)"
                if 'timing' not in d:
                    d['timing'] = "Contact hospital for timings"
                filtered.append(d)
            return filtered[:3]  # type: ignore[misc]
    except Exception as e:
        print(f"AI Doctor Suggestion Error: {e}")
    return []


