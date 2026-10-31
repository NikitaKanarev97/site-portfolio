# B2B Partner Portal case V2 — reference library

Captured 31.10.2026 with Chromium at 1440×900, before implementation (`scripts/b2b-v2/capture-references.mjs`).
Private research material: none of these captures, brands or artworks appear in the public case. Only the composition principles are adopted.
Mobbin was not used.

| # | Source | Capture | Principle adopted | How it shapes our case |
|---|---|---|---|---|
| 1 | [linear.app](https://linear.app/) | `linear-hero-0.png`, `linear-hero-900.png` | The headline sits on a clean field, and one real product surface becomes the hero object directly below it. A secondary real panel adds the "decision" moment without becoming a fake stack of windows. | The cover keeps the title and promise on clean surface, never over UI. The dominant plate is the real Resolution Center workspace, with one secondary real component (the Cart price-change panel) in its own column. |
| 2 | [ramp.com/procurement](https://ramp.com/procurement) | `ramp-procurement-0.png`, `-1000.png`, `-2000.png` | An asymmetric split: a short claim in a narrow text column, then a tinted plate that isolates a single procurement object at readable scale. | Narrative modules use a narrow thesis column plus a wide tinted plate. Procurement complexity is shown by one well-framed object per module, not a gallery. |
| 3 | [stripe.com/billing](https://stripe.com/billing) | `stripe-billing-1100.png`, `-2200.png` | Feature cards pair short text with a UI excerpt inset into a tinted panel. The excerpt has margins on every side and ends at a component boundary. Large editorial headings are split into a statement and a quieter continuation. | Each detail crop is a whole component (a change panel, a plan comparison, a candidate panel) on a plate with equal padding. Section headings follow the statement-then-support pattern. |
| 4 | [attio.com](https://attio.com/) | `attio-hero-0.png`, `attio-hero-1000.png` | A full product window as context on a soft field, with generous, consistent outer margins. The window is never cropped mid-component. | Context shots (Dashboard and Product Details) appear as complete workspace frames with app chrome, cut at a semantic boundary and given the same outer margin as every other plate. |
| — | [mercury.com](https://mercury.com/) | `mercury-hero-0.png` | Rejected: a photographic brand hero with no product evidence. | Not used. |
| — | SCRN, [Arbuz.kz → B2B clients](https://scrn.gallery/app/arbuz?tab=flows&flow=6a2465b70c4ca5ed0096bd28) | not saved | Rejected. SCRN is a mobile consumer catalog; its only B2B flow is a static text page about business clients, with no procurement UI, comparison or decision pattern. | The SCRN pass was recorded once. The mobile composition is derived from the product's own 390 px captures instead. |

Cookie banners visible in some captures are part of the live pages and irrelevant to the principles above.

## Principles carried into implementation

1. **One hero object, one decision.** Use one dominant real surface plus one real focused component, each with its own frame. Never place three interchangeable products side by side.
2. **Text never on UI.** Title, promise and captions stay on clean paper. The screenshots sit on tinted plates.
3. **Component-bounded crops.** Every crop is an element capture (a DOM box plus padding), not a fixed rectangle. Nothing can end inside a heading, card or table.
4. **Native scale.** Each source is captured at the viewport where its component's native width is close to its display width, at DPR 2, so UI text stays legible.
5. **Mobile is its own composition.** Mobile uses authentic 390 px captures, not a shrunken desktop plate.
