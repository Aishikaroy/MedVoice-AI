"""
MedVoice AI - End-to-End Diagnostic Test Suite
Tests: rare disease, common disease, and eye condition
"""
import sys
import io
import asyncio
import json
import httpx  # type: ignore

# Force UTF-8 output on Windows (avoids UnicodeEncodeError with cp1252)
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    # Use 'replace' to safely handle any leftover non-encodable chars
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

BASE = "http://127.0.0.1:8001/chat"
CITY = "Kolkata"

TESTS = [
    {
        "label": "RARE DISEASE - Wilson's Disease (copper metabolism disorder)",
        "symptom": "I have tremors, jaundice, liver pain, and a brownish ring visible around my cornea. My speech is slurred and I keep dropping things.",
        # Keywords that MUST appear in diagnosis + pathophysiology to pass
        "keywords": ["wilson", "copper", "cornea", "kayser", "ceruloplasmin"],
    },
    {
        "label": "COMMON DISEASE - Migraine with Aura",
        "symptom": "I have a severe pounding headache on only the left side of my head, my vision has zigzag lines before the pain hits, and I feel nauseated with light sensitivity.",
        "keywords": ["migraine", "aura", "cortical", "serotonin", "trigeminal"],
    },
    {
        "label": "EYE CONDITION - Acute Angle-Closure Glaucoma",
        "symptom": "I have sudden blurred vision, severe eye pain, headache around the eye, and I see halos around lights. My eye feels hard to the touch.",
        "keywords": ["glaucoma", "halos", "intraocular", "angle", "aqueous"],
    },
]

# Using plain ASCII to avoid all Windows terminal encoding issues
PASS_S = "\033[92m[PASS]\033[0m"
FAIL_S = "\033[91m[FAIL]\033[0m"
BOLD = "\033[1m"
RST  = "\033[0m"
SEP1 = "=" * 70
SEP2 = "-" * 70
SEP3 = "*" * 70


def check(condition: bool, label: str, detail: str = "") -> bool:
    status = PASS_S if condition else FAIL_S
    print(f"  {status}  {label}")
    if detail:
        # Avoid slicing Unknown/Any by ensuring it is treated as a string
        safe_detail = str(detail)
        preview = safe_detail[:120].replace("\n", " ") + ("..." if len(safe_detail) > 120 else "") # type: ignore
        print(f"       {BOLD}->{RST} {preview}")
    return condition


async def run_test(test: dict, index: int) -> dict:
    print(f"\n{SEP1}")
    print(f"{BOLD}TEST {index}: {test['label']}{RST}")
    print(f"{SEP2}")

    payload = {
        "messages": [{"role": "user", "content": test["symptom"]}],
        "user_id": "test_suite_user",   # Required by backend Pydantic model
        "user_city": CITY,
    }

    results = {"passed": 0, "failed": 0}

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(BASE, json=payload)

        if resp.status_code != 200:
            print(f"  {FAIL_S}  HTTP {resp.status_code} - Backend returned an error")
            err_text = str(resp.text)
            print(f"       {BOLD}->{RST} {err_text[:200]}") # type: ignore
            results["failed"] += 1
            return results

        body = resp.json()
        # Navigate the response data structure properly
        # The backend returns { "status": "success", "data": { "messages": [...] } }
        data_wrapper = body.get("data", {}) if isinstance(body, dict) else {}
        msgs = data_wrapper.get("messages", []) if isinstance(data_wrapper, dict) else []
        last = next((m for m in reversed(msgs) if isinstance(m, dict) and m.get("role") == "assistant"), None)

        if not last:
            print(f"  {FAIL_S}  No assistant message in response")
            results["failed"] += 1
            return results

        raw = last.get("content", "")

        # Multi-stage JSON extraction (handles markdown fences and trailing text)
        data = {}
        parsed = False

        # Stage 1: Direct parse
        try:
            data = json.loads(raw)
            parsed = True
        except json.JSONDecodeError:
            pass

        # Stage 2: Strip ```json ... ``` fences
        if not parsed:
            import re
            fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", raw)
            if fence:
                try:
                    data = json.loads(fence.group(1).strip())
                    parsed = True
                except json.JSONDecodeError:
                    pass

        # Stage 3: Extract outermost {...}
        if not parsed:
            import re
            brace = re.search(r"(\{[\s\S]*\})", raw)
            if brace:
                try:
                    data = json.loads(brace.group(1))
                    parsed = True
                except json.JSONDecodeError:
                    pass

        if not parsed:
            print(f"  {FAIL_S}  Could not parse JSON from response")
            raw_preview = str(raw)
            print(f"       {BOLD}->{RST} Raw (first 200 chars): {raw_preview[:200]}") # type: ignore
            results["failed"] += 1
            return results

        # -- CHECK 1: Specialty -----------------------------------------------
        specialty = data.get("specialty", "")
        ok = bool(specialty) and str(specialty).lower() != "general physician"
        results["passed" if ok else "failed"] += 1
        check(ok, f"Specialty identified: {BOLD}{specialty}{RST}")

        # -- CHECK 2: Pathophysiology depth -----------------------------------
        path = data.get("pathophysiology", "")
        ok = len(path) >= 150
        results["passed" if ok else "failed"] += 1
        check(ok, f"Pathophysiology length: {len(path)} chars (need >=150)", path)

        # -- CHECK 3: No generic/template language ----------------------------
        generic_phrases = ["inflammatory pathways are activated", "generic", "standard analysis", "mechanism analysis pending"]
        has_generic = any(p in str(path).lower() for p in generic_phrases)
        ok = not has_generic
        results["passed" if ok else "failed"] += 1
        check(ok, "Pathophysiology is NOT generic/template text")

        # -- CHECK 4: Condition-specific terminology --------------------------
        keywords = test.get("keywords", [])
        diag_text = (str(data.get("diagnosis", "")) + " " + str(path)).lower()
        matched_kw = [kw for kw in keywords if kw in diag_text]
        ok = len(matched_kw) >= 1
        results["passed" if ok else "failed"] += 1
        matched_str = ", ".join(matched_kw) if matched_kw else "NONE"
        check(ok, f"Condition-specific terms found ({matched_str})", data.get("diagnosis", ""))

        # -- CHECK 8: urgency_triage (done BEFORE remedies so we can adapt count)
        urg = data.get("urgency_triage", "")
        ok = any(w in str(urg).upper() for w in ["ROUTINE", "URGENT", "EMERGENCY"])
        results["passed" if ok else "failed"] += 1
        urg_preview = str(urg)
        check(ok, f"Urgency triage present: {urg_preview[:80]}") # type: ignore
        is_emergency = "EMERGENCY" in str(urg).upper()

        # -- CHECK 5: home_remedies (EMERGENCY = min 1, else min 2) ----------
        remedies_raw = data.get("home_remedies", [])
        remedies = remedies_raw if isinstance(remedies_raw, list) else []
        min_rem = 1 if is_emergency else 2
        ok = len(remedies) >= min_rem
        results["passed" if ok else "failed"] += 1
        # Prevent indexing errors and satisfy analyzer with explicit dict check
        titles = ", ".join(str(r.get("title", "?") if isinstance(r, dict) else "?") for r in remedies[:3]) # type: ignore
        em_note = " [EMERGENCY/URGENT min=1]" if is_emergency else ""
        check(ok, f"Home remedies present ({len(remedies)} items){em_note}: {titles}")

        # -- CHECK 6: medical_treatments (EMERGENCY = min 1, else min 2) -----
        treatments_raw = data.get("medical_treatments", [])
        treatments = treatments_raw if isinstance(treatments_raw, list) else []
        min_tre = 1 if is_emergency else 2
        ok = len(treatments) >= min_tre
        results["passed" if ok else "failed"] += 1
        # Prevent indexing errors and satisfy analyzer with explicit dict check
        t_titles = ", ".join(str(t.get("title", "?") if isinstance(t, dict) else "?") for t in treatments[:3]) # type: ignore
        check(ok, f"Medical treatments present ({len(treatments)} items){em_note}: {t_titles}")

        # -- CHECK 7: pharmacist_notes ----------------------------------------
        ph = data.get("pharmacist_notes", "")
        ok = len(ph) >= 50
        results["passed" if ok else "failed"] += 1
        check(ok, f"Pharmacist notes length: {len(ph)} chars (need >=50)", ph)

        # -- CHECK 9: Doctor list (retrieved from clinical_evaluation) --------
        # The backend adds dynamic doctor referrals to the clinical_evaluation object
        ce_raw = data.get("clinical_evaluation", {})
        ce = ce_raw if isinstance(ce_raw, dict) else {}
        
        # Explicit type narrowing to resolve 'Cannot index into list[Unknown]'
        doctors_raw = ce.get("doctor_referrals") or data.get("doctor_list") or []
        doctors = doctors_raw if isinstance(doctors_raw, list) else []
        
        ok = len(doctors) >= 1
        results["passed" if ok else "failed"] += 1
        if doctors:
            # The analyzer now knows 'doctors' is a list, but may still struggle with slicing if element types are unknown
            doc_names = ", ".join(str(d.get("name", "?") if isinstance(d, dict) else "?") for d in doctors[:3]) # type: ignore
            check(ok, f"Doctors returned ({len(doctors)}): {BOLD}{doc_names}{RST}")
            for d in doctors[:3]: # type: ignore
                if isinstance(d, dict):
                    print(f"       - {d.get('name','?')} | {d.get('specialty','?')} | {d.get('hospital','?')} | {d.get('city','?')}")
        else:
            check(ok, "Doctors returned (NONE FOUND - check registry/web search)")

        # -- CHECK 10: Clinical evaluation sub-object -------------------------
        ok = isinstance(ce, dict) and (bool(ce.get("symptom_pathophysiology", "")) or bool(ce.get("final_diagnosis", "")))
        results["passed" if ok else "failed"] += 1
        check(ok, "clinical_evaluation sub-object present and populated")

    except Exception as e:
        print(f"  {FAIL_S}  Exception: {e}")
        results["failed"] += 1

    return results


async def main():
    print(f"\n{BOLD}{SEP3}")
    print(f"  MedVoice AI - Diagnostic Pipeline Test Suite")
    print(f"  Backend: {BASE}  |  City: {CITY}")
    print(f"{SEP3}{RST}")

    total_pass = total_fail = 0
    for i, t in enumerate(TESTS, 1):
        r = await run_test(t, i)
        total_pass += r["passed"]
        total_fail += r["failed"]

    print(f"\n{SEP1}")
    colour = "\033[92m" if total_fail == 0 else "\033[93m" if total_fail <= 3 else "\033[91m"
    print(f"{BOLD}FINAL: {colour}{total_pass} PASSED  /  {total_fail} FAILED{RST}{BOLD}  (out of {total_pass + total_fail} checks){RST}")
    print(f"{SEP1}\n")

if __name__ == "__main__":
    asyncio.run(main())
