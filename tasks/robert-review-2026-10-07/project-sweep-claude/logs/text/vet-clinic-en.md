<!-- http://127.0.0.1:4421/work/vet-clinic/ -->
{
 "title": "Vet Clinic OS — clinic operations for a veterinary practice",
 "desc": "One visit. Different responsibilities.",
 "og": "Vet Clinic OS — clinic operations for a veterinary practice",
 "ogd": "One visit. Different responsibilities.",
 "lang": "en",
 "h": 9400,
 "bodyFont": "Onest, system-ui, -apple-system, \"Segoe UI\", sans-serif"
}

Vet Clinic OS
One visit. Different responsibilities.
[alt] Marsik’s saved facts: 4.9 kg, Meloxicam, 1.00 ml, frequency, source and time.
[alt] Complete invoice: payer, selected services, total and payment action.
[alt] Phone details: Marsik, publication 09:13, Meloxicam 1.00 ml and complete discharge action; mobile shows the full owner view.
[cap] The vet saves prescriptions; reception bills services; owners receive the summary.
[cap] Role
[cap] Sole product designer
[cap] Input
[cap] Conversations with one practising vet
[cap] Delivery
[cap] Working prototype · 2026
[cap] Data
[cap] Real clinic under NDA; all demo data invented
[cap] Constraint
## A trace before the next patient
I separated a useful trace from the complete record. Thirty seconds between patients was the original constraint, not a measured speed of the new interface.
[alt] Today’s queue: all patients at the clinic and an emergency action; wide view includes expected visits.
[cap] Patients first; unfinished records stay visible.
[cap] Role flow
Each role receives its own part
User flow
Record → invoice / publication
The veterinarian enters and saves a quick trace, completes the owner-visible plan and selects services. Reception gets only services and totals. A saved plan with new changes enables publication; otherwise publication is blocked. The owner reads only the published snapshot. Browser-local prototype, not device synchronization.
Vet · open Marsik → Weight / drug / dose
Weight / drug / dose → Save quick trace
Save quick trace → Plan + services
Plan + services → Save record
Save record → Plan + new changes?
Plan + new changes? → Review → publish (yes)
Plan + new changes? → Nothing new to publish (no)
Nothing new to publish → Plan + services
Save record → Reception · invoice
Review → publish → Owner · snapshot
[cap] Each role gets only its part of the visit.
[cap] One visit · three views
[cap] 01 · Veterinarian · tablet
### Save the useful facts
Weight, medication and dose become sourced facts. The full note can follow later. Here: Marsik, 4.9 kg, Meloxicam, 1.00 ml. Saved at 09:12.
[alt] Marsik’s saved facts: 4.9 kg, Meloxicam, 1.00 ml, frequency, source and time.
[cap] 02 · Reception · desktop
### Bill the work, keep the note private
Selected services create the invoice. Reception sees payer, items and total. Diagnosis and private notes stay in the clinic; payment happens outside the prototype. Two services for Marsik.
[alt] Complete invoice: payer, selected services, total and payment action.
[cap] 03 · Owner · phone
### The family gets a stable plan
The owner receives the same prescription in a published snapshot. A later saved edit does not silently rewrite it. Publishing a new version is explicit. Published at 09:13.
[alt] Phone details: Marsik, publication 09:13, Meloxicam 1.00 ml and complete discharge action; mobile shows the full owner view.
[cap] State boundaries
## Saved does not mean published
Unsaved form, saved record and published document are independent states. The owner can still read an older publication while the doctor edits the record.
[cap] / 3
[cap] 1
[link] ←
[link] →
[alt] Unsaved changes, weight 4.9 and complete Save actions.
[cap] Unsaved edits live only in this form.
[alt] Saved at 09:12; weight persists after reload.
[cap] Save survives reload; it does not publish.
[alt] Published version 1, Changes are not published, Publish new version.
[cap] The owner still reads the published snapshot.
[cap] Result
## A working path, with clear limits
[cap] Cost
[cap] Save and Publish are two actions, not one. The prototype keeps data in one browser and does not store past versions.
[cap] Evidence
[cap] The trace, invoice and summary connect end to end in the prototype. Conversations with one practising vet informed the role flows and recording decisions.
[cap] Next evidence
[cap] Observe real handoffs, interrupted work and record recovery in a practice.
[cap] Next case
[link] Next case: Pawly
[link] Pawly
[link] Pawly
[link] Pawly
[cap] Open the demo
[link] (external link, opens in a new tab)
## Let's talk
If the case above answered your question — or raised one.
[link] nikita.kanarev.dev@outlook.com
[cap] CV (PDF)
[cap] LinkedIn
[link] (external link, opens in a new tab)