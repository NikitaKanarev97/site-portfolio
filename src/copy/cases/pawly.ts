/** Pawly · accepted Product Polish, September 2026.
 * Independent concept; synthetic QA only. Source: PETS-walking/audit/product-polish/reports/05-acceptance.md.
 * Composition and media provenance: ds/screens/case-pawly.md.
 */
export const pawly = {
  "slug": "pawly",
  "meta": {
    "title": "Pawly — trust as evidence in a dog-care marketplace",
    "description": "Independent dog-care concept: recorded compatibility, dated checks, confirmed handover photos and clear walker earnings. Interactive EN/RU demo; no human validation."
  },
  "header": {
    "title": "Pawly",
    "lead": "A dog-care marketplace designed so trust is something an owner can inspect — before a stranger takes the dog, while the walk is happening, and after the pet is home.",
    "meta": [
      {
        "term": "Client",
        "value": "Independent product concept"
      },
      {
        "term": "Product",
        "value": "Marketplace for dog walking and pet sitting"
      },
      {
        "term": "Year",
        "value": "2026"
      },
      {
        "term": "Role",
        "value": "Product Designer"
      },
      {
        "term": "Platform",
        "value": "Mobile web prototype · EN / RU"
      },
      {
        "term": "Evidence",
        "value": "Independent concept · no human validation"
      },
      {
        "term": "Prototype",
        "value": "Interactive demo · invented data",
        "href": "https://pawly-fawn.vercel.app/app"
      }
    ],
    "outcome": "A testable journey across both sides of a walk: the owner can inspect compatibility and return evidence; the walker sees the risks, confirms the handover and can trace the payout. The September polish makes those decisions easier to read and keeps their states consistent across seventeen routes.",
    "team": [
      {
        "term": "Team",
        "value": "Sole designer — product framing, research synthesis, IA, UX/UI, design system, prototype and QA"
      },
      {
        "term": "Research",
        "value": "Desk research, five competitors and one simulated interview; no human validation"
      },
      {
        "term": "Duration",
        "value": "Initial prototype: sixteen days in August 2026. Product polish: September 2026."
      }
    ],
    "rework": {
      "label": "A concept, not a live service",
      "text": "Independent concept · no human validation. The design and interactive demo are implemented; the marketplace is not operating. Names, checks, addresses, photos and money are demonstration data. There is no backend, real GPS, upload, chat or payment processing. Research used secondary sources and a simulated interview; QA used synthetic runs."
    }
  },
  "cover": {
    "screens": [
      "/media/case-pawly/walker-profile.webp",
      "/media/case-pawly/active-service.webp",
      "/media/case-pawly/handover-photo-review.webp"
    ],
    "alt": "Pawly: recorded handling limits, expected return and a selected return photo awaiting confirmation.",
    "caption": "Compatibility, return and proof in the accepted September demo. Invented data."
  },
  "context": {
    "heading": "The owner is not buying a walk. They are handing over a dog, and sometimes the keys.",
    "body": [
      "The starting brief was “Uber for dogs”: find somebody nearby, book and follow the route. The harder decision happens before booking. An owner at work has a short window to decide whether a stranger can handle their dog and receive access to the home.",
      "Desk research across five competitors suggested a gap between fast self-service booking and services whose reassurance depends on a manager assigning the walker. I used that gap as a design hypothesis: let the owner inspect the basis for a match without implying that an early marketplace can serve every address.",
      "The concept keeps its original Russian-market setting. English and Russian versions use the same rouble prices and Moscow demonstration address; translation does not imply a launch in another market."
    ]
  },
  "reframe": {
    "heading": "Trust could not be a badge. It had to be a chain of evidence.",
    "body": [
      "A verification badge cannot answer whether this person can handle this dog. Pawly puts the pet’s requirements beside the walker’s recorded handling limits and availability. The seven dated checks remain inspectable, while an unknown qualification stays unknown.",
      "During the walk, the first question is when the pet is expected home. The active screen gives that time and the received pickup photo priority over the map. The map is labelled as a sample route: the prototype has no live GPS or measured signal freshness.",
      "At the other boundary, choosing a photo is still a local draft. Only the demo’s successful send records the return. The owner’s report then shows the actual confirmation time and both dated photos. That distinction is the core of the interaction, not just a change of button label."
    ],
    "statement": "Show what is known, what is expected and what has actually been confirmed.",
    "range": {
      "src": "/media/case-pawly/range-evidence-chain.webp",
      "alt": "Three current Pawly screens: Marina’s recorded handling limits, Baikal expected home at 14:50, and the report with return confirmed at 14:52.",
      "caption": "A recorded match, an expected return, then a confirmed return. Three different claims, with different evidence. Demonstration data."
    }
  },
  "process": {
    "heading": "I designed the service boundary before I designed the screens.",
    "body": [
      "The first build started with secondary research, five competitors and one simulated interview. No participants were recruited. The interview suggested that pickup and return photos might matter more than watching a route; that remains a hypothesis to test with owners.",
      "The original planning map contained 95 nodes, including 81 core nodes and seven flows. “81 designed, 16 assembled” described that August scope, not 81 built screens. The current demo has seventeen routes across owner and walker roles. The initial build took sixteen days; September refinement is a separate phase.",
      "For the polish, I kept Inter, Lucide and the blue and warm-neutral system. I changed the information hierarchy: pet and return on Home, requirements before verification in the profile, a full photo before confirmation, and net earnings before transaction history. The owner and walker paths now share the same compatibility, handover and settlement state."
    ],
    "prototype": {
      "href": "https://pawly-fawn.vercel.app/app",
      "label": "Open the prototype",
      "note": "Seventeen routes in EN/RU on invented data. Open “All screens” to move between owner and walker roles; reset is available in the demo shell."
    },
    "clip": {
      "src": "/media/case-pawly/clip-return-proof-poster.webp",
      "video": "/media/case-pawly/clip-return-proof",
      "film": true,
      "alt": "Local recording: a selected return photo is sent, the demo confirms the return, and the owner’s report shows both dated handovers.",
      "caption": "Selected locally → sending → return confirmed → owner report. A real interaction in the local demo; no real upload or service takes place."
    },
    "artifacts": [
      {
        "src": "/media/case-pawly/owner-home.webp",
        "alt": "Owner Home puts Baikal, Marina, the expected return at 14:50 and the received pickup photo first.",
        "caption": "Home answers the immediate question: who is with my dog, and when should they be back?"
      },
      {
        "src": "/media/case-pawly/walker-active-order.webp",
        "alt": "The walker’s current booking with Baikal, the 779-rouble net payout, expected return, handover record and care instructions.",
        "caption": "The other role sees the same walk, with handover duties and care instructions close to the next action."
      }
    ]
  },
  "failure": {
    "heading": "The inventory was complete. The service logic was not.",
    "body": [
      "The August review found plausible screens describing inconsistent prices, and saved state that could confuse the next demo visit. Those were problems between screens. Its historical total of 73 reviewed findings — 71 resolved and two dismissed — belongs to that original build, not to a new user study.",
      "September checks found a more consequential contradiction: choosing another time could bypass the dog’s constraints, and a replacement did not always preserve the named reserve. Both now use one compatibility rule across weight, safety answers, recorded qualifications, all seven checks and the full booking slot. Changing the time never clears the risks.",
      "The final synthetic journeys also exposed an old review surviving the start of a new draft. A new booking ID now clears the review and private flags. On the walker side, a confirmed return records the payout once: re-entering or reloading the report does not earn another 779 ₽. These are verified demo behaviours, not evidence of safer real walks."
    ]
  },
  "decisions": {
    "heading": "Four decisions, and what each one cost.",
    "items": [
      {
        "decision": "A match must satisfy the dog’s requirements for the whole slot.",
        "why": "Coverage is checked against the pet’s address first. Then weight, safety answers, recorded skills and availability determine the list. An empty result explains the constraint. Another time can change availability; it cannot make a bite history disappear.",
        "cost": "The result can stay empty. The concept accepts fewer matches instead of relaxing requirements to make booking look easy. The rule is a demonstration model, not a professionally validated safety assessment.",
        "artifact": {
          "src": "/media/case-pawly/walker-list.webp",
          "alt": "Walker list for Baikal with duration, price and recorded compatibility for the selected slot.",
          "caption": "The same 45-minute, 950 ₽ booking carries its requirements into every candidate choice."
        }
      },
      {
        "decision": "Handling limits come before the seven dated checks.",
        "why": "Verification and suitability answer different questions. The profile first relates Baikal’s needs to Marina’s recorded limits, then lets the owner inspect the seven checks. General profile text is not treated as proof of a missing qualification.",
        "cost": "More evidence takes space and would require an operation to maintain it. The original service plan leaves interview, trial walk and references with a team; the demo only presents sample records.",
        "artifact": {
          "src": "/media/case-pawly/walker-profile.webp",
          "alt": "Marina’s profile: Baikal’s requirements, recorded handling limits, match explanation and an expandable record of seven checks.",
          "caption": "The reason for this match is visible before the verification history."
        }
      },
      {
        "decision": "Expected return and confirmed return are separate states.",
        "why": "An expected 14:50 return helps the owner plan. It does not prove the dog is home. The active screen keeps the received pickup photo visible; the walker reviews the full return photo before sending. Only confirmation produces the 14:52 event in the final report.",
        "cost": "The walker has an extra step. A local photo or failed send cannot finish the order. Received confirmations survive a warm offline session, but the prototype does not offer cold-start offline access or a real camera and upload service.",
        "artifact": {
          "src": "/media/case-pawly/active-service.webp",
          "alt": "Active walk: Baikal expected home by 14:50, Marina, received pickup photo at 14:05 and a labelled sample route.",
          "caption": "The expected time and received photo lead; the sample map supports the story without claiming live tracking."
        }
      },
      {
        "decision": "Both roles must be able to explain the same money.",
        "why": "For the shown walk, the owner pays 950 ₽, the platform fee is 171 ₽ at 18%, and the walker earns 779 ₽. That net amount is visible before acceptance. After return confirmation it becomes one recorded earning, distinct from the available balance and period history.",
        "cost": "Cancellation and replacement need equally explicit boundaries. The existing 60-second reserve assignment rechecks the named person; manual choice stops it, and no compatible reserve means no invented assignment. Insurance and guaranteed replacement remain outside the offer.",
        "artifact": {
          "src": "/media/case-pawly/walker-earnings.webp",
          "alt": "Earnings after one confirmed walk: 3895 ₽ available, 779 ₽ for the completed order, and separate period history.",
          "caption": "3116 + 779 = 3895 ₽ available. Reloading does not repeat the earning. All amounts are simulated."
        }
      }
    ]
  },
  "system": {
    "heading": "Thirty-three components, with states treated as product decisions.",
    "body": [
      "The August foundation defined 63 primitive tokens, 30 semantic tokens, fourteen text styles and 33 React components. Those are historical baseline counts. September work extended the existing system: stronger text semantics, wrapping controls, named questions and the pending, local and confirmed PhotoProof states.",
      "The matrices below come from the accepted component catalogue. The code, local specifications and stories record the polish. Figma reverse-sync is still pending; the current application is not claimed to match the older Figma screens pixel for pixel."
    ],
    "grid": [
      {
        "src": "/media/case-pawly/system-info-note.webp",
        "alt": "InfoNote catalogue with legacy, hint, warning and disclosure presentations.",
        "component": "InfoNote",
        "states": "legacy · hint · warning · disclosure"
      },
      {
        "src": "/media/case-pawly/system-empty-state.webp",
        "alt": "Empty state with secondary action, primary action and without an action",
        "component": "EmptyState",
        "states": "secondary action · primary action · no action"
      },
      {
        "src": "/media/case-pawly/system-bottom-sheet.webp",
        "alt": "Bottom sheet without actions, with one action and with two actions",
        "component": "BottomSheet",
        "states": "no action · single action · double action"
      },
      {
        "src": "/media/case-pawly/system-photo-proof.webp",
        "alt": "PhotoProof catalogue with tile and compact photos: received pickup and return, pending proof, local selection and unavailable image; EN/RU examples.",
        "component": "PhotoProof",
        "states": "tile · compact / pending · local · confirmed · unavailable"
      },
      {
        "src": "/media/case-pawly/system-timeline-row.webp",
        "alt": "Timeline row when done, current, pending and with a nested proof photo",
        "component": "TimelineRow",
        "states": "done · current · pending · nested photo"
      },
      {
        "src": "/media/case-pawly/system-icon-button.webp",
        "alt": "Icon button in default, pressed and disabled states across the icon set",
        "component": "IconButton",
        "states": "default · pressed · disabled × icon set"
      }
    ]
  },
  "result": {
    "heading": "What got solved, and what did not.",
    "statements": [
      {
        "term": "Implemented",
        "value": "A visible reason for the match, consistent replacement rules, expected and confirmed return states, a saved two-photo report and one settlement shared by both roles."
      },
      {
        "term": "Trade-off",
        "value": "A deliberately narrow demo: one active booking, a shared demonstration wallet and recorded handling limits. No insurance, guaranteed reserve, real payments, GPS or operational verification."
      },
      {
        "term": "Checked",
        "value": "Local acceptance on 13 September 2026 covered all seventeen routes in EN/RU, using earlier 360/390/430 px checks and focused cross-screen journeys. Keyboard access, long text, reduced motion and recovery states were checked within that scope. This was synthetic QA, not human validation or a full accessibility certification."
      },
      {
        "term": "What changed in how I work",
        "value": "I now review the boundary between a claim and its evidence: selected versus received, expected versus confirmed, pending versus earned. A clear screen is only useful when the next screen preserves its meaning."
      }
    ],
    "nda": "Independent concept · no human validation. There were no human interviews or usability sessions and no real orders, users, revenue, conversion or retention results. The next research question is whether owners understand and use these proofs when choosing and receiving care. PRD metrics remain targets. Figma reverse-sync and the blocked Storybook test adapter remain recorded limitations; the adapter did not run its tests."
  },
  "outro": {
    "heading": "Trust was the interface, not a layer of copy.",
    "lead": "The next step is to test whether owners and walkers understand these distinctions in real tasks. The prototype makes that question inspectable."
  }
};
