<!-- http://127.0.0.1:4421/work/partner-portal/ -->
{
 "title": "B2B Partner Portal — DSSL",
 "desc": "A working specification, from intake to checkout.",
 "og": "B2B Partner Portal — DSSL",
 "ogd": "A working specification, from intake to checkout.",
 "lang": "en",
 "h": 13735,
 "bodyFont": "Onest, system-ui, -apple-system, \"Segoe UI\", sans-serif"
}

[cap] DSSL · B2B procurement
Partner Portal
A working specification, from intake to checkout.
38
“4 MP outdoor camera”, 8 units
[alt] Actual buyer decision for row 38: original source text, eight units and three catalog candidates
[cap] Row 38: the source text beside three matches
[cap] Work
[cap] Commercial redesign shipped in full
[cap] Shown
[cap] Independent reconstruction on synthetic data
[cap] Role
[cap] Sole designer; frontend, backend, PM, QA and team lead
[cap] Period
[cap] 2024–winter 2026; roughly six active months across a long pause
[cap] Audit → direction
Make space for the buyer
The archived dashboard foregrounded promotions and left destinations behind icons. I made the specification the working object, with named navigation and separate responsibilities for matching and commercial terms.
[alt] Safe crop of the original DSSL dashboard: promotional banner and an icon-only navigation rail
[cap] 1
[cap] 2
[cap] 1
Promotion first → procurement tasks first
[cap] 2
Icons alone → named destinations
[cap] The archived dashboard, with audit notes
[cap] Architecture
Two ways into one specification
XLS import and Quick order feed the same resolution workspace. Cart, supply planning and checkout have distinct jobs. This hierarchy selects eight real screens from the reconstruction.
Screen map
Procurement workspace
Dashboard opens file import, Quick order, Cart and Order details. Both intakes share Resolution Center. Cart contains supply planning and checkout. Eight selected screens, not the entire product.
Dashboard → XLS import
Dashboard → Quick order
Dashboard → Cart
Dashboard → Order details
XLS import → Resolution
Quick order → Resolution
Cart → Supply plan
Cart → Checkout
[cap] Eight key screens of the procurement workspace
[cap] Purchase logic
Choose a product,
then check terms
Matching does not promise compatibility. Buyers choose or correct the item; Cart separately reviews commercial changes. Each decision has a visible return path before order creation.
User flow
XLS → order
Read imported lines. Unresolved identity requires buyer selection or correction and recheck. Cart separately reviews commercial change. Choose a supply plan, confirm terms, create an order. Source text after creation is not yet stored.
Upload XLS → Read lines
Read lines → Unresolved lines?
Unresolved lines? → Choose / correct (yes)
Choose / correct → Unresolved lines?
Unresolved lines? → Cart (no)
Cart → Commercial change?
Commercial change? → Accept / resolve (yes)
Accept / resolve → Cart
Commercial change? → Choose plan (no)
Choose plan → Confirm terms
Confirm terms → Order created
[cap] From the right product to commercial terms to an order
[cap] One source row
[cap] 01 · Choose
### Keep the request beside the candidates
Row 38 of office_north_v8.xlsx asks for “камера 4мп уличная”, eight units. The buyer compares three matches and chooses the second.
[alt] Source row 38 and eight original units above three candidate products
[cap] Three candidates, one choice
[alt] Confirmed row 38, original eight units, original ambiguous category and Undo action
[alt] Actual Cart product row with chosen SKU, source row 38, quantity eight, price and availability
[cap] Domain system
## States make the next action explicit
The accepted components cover unresolved matches, import errors, uncertain stock and supply choices. A missing warehouse response reads “not confirmed”, never zero.
### DSSL procurement system
#### Line and import
ResolutionRow
[cap] Ambiguous · choose a match
[alt] Original source line, quantity, ambiguous identity, plausible match and Choose action
[cap] Missing · request an item
[alt] Unchanged source row and quantity, no catalog match, Request item action
[cap] Changed · confirm replacement
[alt] Source line and quantity retained; superseded manufacturer code needs replacement confirmation
[cap] Confirmed · original category retained
[alt] Confirmed former ambiguous row, source text remains and Undo action is available
FileUpload
[cap] Empty · choose an XLS file
[alt] Real XLS file upload dropzone with supported file description and Choose file action
[cap] Complete · seven decisions remain
[alt] office_north_v8.xlsx parsed, 48 lines read, 41 exact matches and 7 needing a decision
[cap] Error · fix the header
[alt] File cannot be read, row 1 has no header; reason and fix are stated
#### Availability and supply
Availability
[cap] Verified stock
[alt] 24 pcs at Moscow DC, ships in 2 business days, verified commercial state
[cap] Stale · timestamp retained
[alt] Last known stock 24 pcs at Moscow DC and WMS timestamp, explicitly stale
[cap] Not confirmed · no WMS response
[alt] Not confirmed stock, WMS no response; absence is not drawn as zero
FulfillmentPlan
[cap] Default · compare shipment terms
[alt] One shipment plan with stock, completion date, warehouse and delivery cost
[cap] Selected · choice remains visible
[alt] Selected plan retains all shipment terms and selected action
[cap] Unavailable · reason stated
[alt] Plan unavailable because seven lines have no stock at this warehouse
#### Typography and palette
[cap] Style
[cap] Use
[cap] Metrics
[cap] Sample
Page
Page title
[cap] 32/42 · 600
Orders
Section
Section title
[cap] 24/36 · 600
Import
Row
Line title
[cap] 18/27 · 600
Camera
Body
Main text
[cap] 16/24 · 400
Source row
Status
State label
[cap] 12/18 · 600
VERIFIED
Data
Tabular data
[cap] 11/16 · 500
24 · 12 pcs
[cap] #2563eb
Action
[cap] #ffffff
White
[cap] #fafbfc
Sheet
[cap] #e7eaf0
Ground
[cap] #0f172a
Ink
[cap] #475569
Muted
[cap] #166534
Success
[cap] #92400e
Warning
[cap] #b91c1c
Error
[cap] #0369a1
Info
[cap] Four component families, thirteen states
[alt] Actual Resolution Center after choosing row 38: filter, resolved tab, reversible row and global progress
[cap] Components in context · the same row after buyer confirmation
[cap] Outcome
## The commercial redesign shipped
The DSSL redesign shipped in full. The frames here are my independent reconstruction on synthetic data: they show the decisions, not business impact.
[cap] Price of the solution
[cap] Ambiguity still requires a buyer’s manual choice. Matching data cannot guarantee compatibility.
[cap] Evidence
[cap] The shipment is my own account, with no public metrics. In the reconstruction, row 38 runs from matching to Cart.
[cap] Next check
[cap] Keep the source text on created orders, then measure time and errors. There is no business baseline yet.
[cap] Next case
[link] Next case: TRASSIR Learn
[link] TRASSIR Learn
[link] TRASSIR Learn
[link] TRASSIR Learn
[cap] Open the live demo
[link] (external link, opens in a new tab)
## Let's talk
If the case above answered your question — or raised one.
[link] nikita.kanarev.dev@outlook.com
[cap] CV (PDF)
[cap] LinkedIn
[link] (external link, opens in a new tab)