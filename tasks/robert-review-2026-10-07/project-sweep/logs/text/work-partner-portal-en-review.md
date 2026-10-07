# en/work/partner-portal; narrative 389 words, raw DOM 710

Факты вне секций: WORK Commercial redesign shipped in full SHOWN Independent reconstruction on synthetic data ROLE Sole designer; frontend, backend, PM, QA and team lead PERIOD 2024–winter 2026; roughly six active months across a long pause

## section.case-opening.case-opening--proof.case-opening--editorial
DSSL · B2B PROCUREMENT Partner Portal A working specification, from intake to checkout. 38 “4 MP outdoor camera”, 8 units Row 38: the source text beside three matches

Alt: Actual buyer decision for row 38: original source text, eight units and three catalog candidates

## #audit-direction
AUDIT → DIRECTION Make space for the buyer The archived dashboard foregrounded promotions and left destinations behind icons. I made the specification the working object, with named navigation and separate responsibilities for matching and commercial terms. 1 2 1 Promotion first → procurement tasks first 2 Icons alone → named destinations The archived dashboard, with audit notes

Alt: Safe crop of the original DSSL dashboard: promotional banner and an icon-only navigation rail

## #shared-specification
ARCHITECTURE Two ways into one specification XLS import and Quick order feed the same resolution workspace. Cart, supply planning and checkout have distinct jobs. This hierarchy selects eight real screens from the reconstruction. Screen map Procurement workspace Dashboard 1 XLS import 2 Quick order 3 Resolution choose a match correct source 4 Cart 5 Supply plan 6 Checkout confirm terms 7 Order details 8 Dashboard opens file import, Quick order, Cart and Order details. Both intakes share Resolution Center. Cart contains supply planning and checkout. Eight selected screens, not the entire product. Dashboard → XLS import Dashboard → Quick order Dashboard → Cart Dashboard → Order details XLS import → Resolution Quick order → Resolution Cart → Supply plan Cart → Checkout Eight key screens of the procurement workspace

Alt: 

## #buyer-decision
PURCHASE LOGIC Choose a product, then check terms Matching does not promise compatibility. Buyers choose or correct the item; Cart separately reviews commercial changes. Each decision has a visible return path before order creation. User flow XLS → order Upload XLS Read lines Unresolved lines? Choose / correct Cart Commercial change? Accept / resolve Choose plan Confirm terms Order created yes no yes no Read imported lines. Unresolved identity requires buyer selection or correction and recheck. Cart separately reviews commercial change. Choose a supply plan, confirm terms, create an order. Source text after creation is not yet stored. Upload XLS → Read lines Read lines → Unresolved lines? Unresolved lines? → Choose / correct (yes) Choose / correct → Unresolved lines? Unresolved lines? → Cart (no) Cart → Commercial change? Commercial change? → Accept / resolve (yes) Accept / resolve → Cart Commercial change? → Choose plan (no) Choose plan → Confirm terms Confirm terms → Order created From the right product to commercial terms to an order

Alt: 

## #source-line
ONE SOURCE ROW 01 · CHOOSE Keep the request beside the candidates Row 38 of office_north_v8.xlsx asks for “камера 4мп уличная”, eight units. The buyer compares three matches and chooses the second. Three candidates, one choice

Alt: Source row 38 and eight original units above three candidate products | Confirmed row 38, original eight units, original ambiguous category and Undo action | Actual Cart product row with chosen SKU, source row 38, quantity eight, price and availability

## #domain-system
DOMAIN SYSTEM States make the next action explicit The accepted components cover unresolved matches, import errors, uncertain stock and supply choices. A missing warehouse response reads “not confirmed”, never zero. DSSL procurement system LINE AND IMPORT ResolutionRow Ambiguous · choose a match Missing · request an item Changed · confirm replacement Confirmed · original category retained FileUpload Empty · choose an XLS file Complete · seven decisions remain Error · fix the header AVAILABILITY AND SUPPLY Availability Verified stock Stale · timestamp retained Not confirmed · no WMS response FulfillmentPlan Default · compare shipment terms Selected · choice remains visible Unavailable · reason stated Typography and palette STYLE USE METRICS SAMPLE Page Page title 32/42 · 600 Orders Section Section title 24/36 · 600 Import Row Line title 18/27 · 600 Camera Body Main text 16/24 · 400 Source row Status State label 12/18 · 600 VERIFIED Data Tabular data 11/16 · 500 24 · 12 pcs #2563EB Action #FFFFFF White #FAFBFC Sheet #E7EAF0 Ground #0F172A Ink #475569 Muted #166534 Success #92400E Warning #B91C1C Error #0369A1 Info Four component families, thirteen states

Alt: Original source line, quantity, ambiguous identity, plausible match and Choose action | Unchanged source row and quantity, no catalog match, Request item action | Source line and quantity retained; superseded manufacturer code needs replacement confirmation | Confirmed former ambiguous row, source text remains and Undo action is available | Real XLS file upload dropzone with supported file description and Choose file action | office_north_v8.xlsx parsed, 48 lines read, 41 exact matches and 7 needing a decision | File cannot be read, row 1 has no header; reason and fix are stated | 24 pcs at Moscow DC, ships in 2 business days, verified commercial state | Last known stock 24 pcs at Moscow DC and WMS timestamp, explicitly stale | Not confirmed stock, WMS no response; absence is not drawn as zero | One shipment plan with stock, completion date, warehouse and delivery cost | Selected plan retains all shipment terms and selected action | Plan unavailable because seven lines have no stock at this warehouse

## #source-in-context
Components in context · the same row after buyer confirmation

Alt: Actual Resolution Center after choosing row 38: filter, resolved tab, reversible row and global progress

## #shipped-redesign
OUTCOME The commercial redesign shipped The DSSL redesign shipped in full. The frames here are my independent reconstruction on synthetic data: they show the decisions, not business impact. Price of the solution Ambiguity still requires a buyer’s manual choice. Matching data cannot guarantee compatibility. Evidence The shipment is my own account, with no public metrics. In the reconstruction, row 38 runs from matching to Cart. Next check Keep the source text on created orders, then measure time and errors. There is no business baseline yet.

Alt: 

## section.case-next
NEXT CASE Next case: TRASSIR Learn TRASSIR Learn TRASSIR Learn TRASSIR Learn Open the live demo (external link, opens in a new tab)

Alt: 

## #contact
Let's talk If the case above answered your question — or raised one. nikita.kanarev.dev@outlook.com CV (PDF) LinkedIn (external link, opens in a new tab)

Alt: 
