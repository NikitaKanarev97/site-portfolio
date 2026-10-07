# en/work/vet-clinic; редакционных слов: 487

## section.case-opening.case-opening--proof.case-opening--editorial
Vet Clinic OS

One visit. Different responsibilities.

The vet saves prescriptions; reception bills services; owners receive the summary.

Alt: Marsik’s saved facts: 4.9 kg, Meloxicam, 1.00 ml, frequency, source and time. | Complete invoice: payer, selected services, total and payment action. | Phone details: Marsik, publication 09:13, Meloxicam 1.00 ml and complete discharge action; mobile shows the full owner view.

## #room-window
CONSTRAINT

A trace before the next patient

I separated a useful trace from the complete record. Thirty seconds between patients was the original constraint, not a measured speed of the new interface.

Patients first; unfinished records stay visible.

Alt: Today’s queue: all patients at the clinic and an emergency action; wide view includes expected visits.

## #role-boundaries
ROLE FLOW

Each role receives its own part
User flow Record → invoice / publication
Veterinarian
Reception · services only
Owner · published only
Vet · open Marsik
Weight / drug / dose
Save quick trace
Plan + services
Save record
Plan + new
changes?
Nothing new to publish
Review → publish
Reception · invoice
Owner · snapshot
yes
no

The veterinarian enters and saves a quick trace, completes the owner-visible plan and selects services. Reception gets only services and totals. A saved plan with new changes enables publication; otherwise publication is blocked. The owner reads only the published snapshot. Browser-local prototype, not device synchronization.

Vet · open Marsik → Weight / drug / dose
Weight / drug / dose → Save quick trace
Save quick trace → Plan + services
Plan + services → Save record
Save record → Plan + new changes?
Plan + new changes? → Review → publish (yes)
Plan + new changes? → Nothing new to publish (no)
Nothing new to publish → Plan + services
Save record → Reception · invoice
Review → publish → Owner · snapshot
Each role gets only its part of the visit.

Alt: 

## #one-visit
ONE VISIT · THREE VIEWS

01 · VETERINARIAN · TABLET

Save the useful facts

Weight, medication and dose become sourced facts. The full note can follow later. Here: Marsik, 4.9 kg, Meloxicam, 1.00 ml. Saved at 09:12.

02 · RECEPTION · DESKTOP

Bill the work, keep the note private

Selected services create the invoice. Reception sees payer, items and total. Diagnosis and private notes stay in the clinic; payment happens outside the prototype. Two services for Marsik.

03 · OWNER · PHONE

The family gets a stable plan

The owner receives the same prescription in a published snapshot. A later saved edit does not silently rewrite it. Publishing a new version is explicit. Published at 09:13.

Alt: Marsik’s saved facts: 4.9 kg, Meloxicam, 1.00 ml, frequency, source and time. | Complete invoice: payer, selected services, total and payment action. | Phone details: Marsik, publication 09:13, Meloxicam 1.00 ml and complete discharge action; mobile shows the full owner view.

## #save-is-not-publish
STATE BOUNDARIES

Saved does not mean published

Unsaved form, saved record and published document are independent states. The owner can still read an older publication while the doctor edits the record.

1 / 3
←
→
Unsaved edits live only in this form.
Save survives reload; it does not publish.
The owner still reads the published snapshot.

Alt: Unsaved changes, weight 4.9 and complete Save actions. | Saved at 09:12; weight persists after reload. | Published version 1, Changes are not published, Publish new version.

## #prototype-boundary
RESULT

A working path, with clear limits
Cost
Save and Publish are two actions, not one. The prototype keeps data in one browser and does not store past versions.
Evidence
The trace, invoice and summary connect end to end in the prototype. Conversations with one practising vet informed the role flows and recording decisions.
Next evidence
Observe real handoffs, interrupted work and record recovery in a practice.

Alt: 

## section.case-next
NEXT CASE
Next case: Pawly
Pawly
Pawly
Pawly

Open the demo
(external link, opens in a new tab)

Alt: 

## #contact
Let's talk

If the case above answered your question — or raised one.

nikita.kanarev.dev@outlook.com
CV (PDF)
LinkedIn
(external link, opens in a new tab)

Alt: 
