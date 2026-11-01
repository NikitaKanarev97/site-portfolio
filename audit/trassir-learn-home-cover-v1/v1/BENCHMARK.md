# Learn Home cover V1 — visual benchmark

02 November 2026. Author's comparison for independent review, **not acceptance**.

## Evidence actually inspected

- R1: [Practicum / Active Course](https://scrn.gallery/app/practicum?screen=6a27f1eb742fff99d5f2c2c8).
- R2: [Brilliant / Unit Description](https://scrn.gallery/app/brilliant?screen=6a60097c1988545753a7b29d).
- R3: [Ozon Job / My Learning](https://scrn.gallery/app/ozon-job?screen=6aa00ba21ee39bc45c24ab03).

All three exact screen IDs were retrieved with SCRN get_screens and their actual
pixels inspected in this session. Unmodified returned images are saved in
[comparisons/references/](comparisons/references/). This comparison does not use
their app names or metadata as substitutes for seeing their interfaces.

[Mobile comparison board](comparisons/premium-mobile.jpg): the three genuine
screens and the final RU 390 portfolio card, each presented at a labelled 342px
comparison width. This is a comparison board, not a single browser screenshot.
Native files retain their original dimensions. A complete portfolio card has
more editorial work to do than a native app viewport; height comparisons are
therefore a scan-cost observation, not an equivalent-task usability test.

P0: the whole existing localized ONVIF reference, mobile article header and
commissioning programme continuation were opened and inspected. The full path
and mobile path were also inspected to verify context. [P0 versus final](comparisons/product-source-v-final.jpg)
shows the source article, original continuation fragment and final desktop stage
at labelled comparison widths. [Source manifest](logs/source-provenance.json)
preserves exact routes, product SHA, original capture selectors/bounds and hashes.

Microsoft Learn Documentation/Training informed the supplied research's
two-mode architecture. No fixed Microsoft screenshot was inspected here; no
claim of visual parity with Microsoft is made.

## What the comparisons support

| Criterion | Observed reference evidence | Final Learn result / remaining weakness |
| --- | --- | --- |
| Immediate hierarchy | R1 centers one active course and gives Continue a broad, clear target. | The separate programme shows genuine 3/11, step 04 and a blue Continue action. The outer portfolio action remains Read the case. The pictured action is evidence, not an interactive programme control. |
| Learning scope | R2 names the unit, gives a short outcome, shows 81 lessons / 895 exercises and a clear entry. | Programme identity is in the editorial caption; continuation is concrete. This compact fragment intentionally omits the full workload, assessment and curriculum. The case contains them. |
| Professional context | R3 groups job training, with course imagery and ratings within a catalogue. | The ONVIF title and commissioning context are more specific to a technical task. No course mosaic, ratings or invented success indicators were added. |
| Two different journeys | None of these three screens alone demonstrates independent reference and programme-completion semantics. | A shows a real reference with version/diagnostic summary and a separate real continuation state. Copy explains the reuse and completion boundary. It cannot claim a one-to-one architectural comparison with those apps. |
| Readability | R1/R2 devote native mobile screen width to a small number of strong labels and actions. | Learn's 360px portfolio gutter and stage inset leave 280px per image. Article title and Continue stay readable; source dates, reading note and desktop article sidebar remain small. At 1440 the 768px primary image renders ordinary 16px source body text at about 10.8px; small metadata is smaller. |
| Editorial confidence | R1/R2 focus the eye on a single learning object. | Navy, stable panel baselines and a roughly 2:1 desktop allocation establish a technical documentation identity. There are only two non-overlapping UI surfaces. Mobile's second panel adds scroll cost and competes with one-object simplicity. |
| Compactness | The inspected native screens communicate their main learning action within one phone viewport. | The entire final Home card is 1153px EN / 1203px RU at 390, versus 923px / 955px BEFORE. A is about 281–296px taller than B. The extra height purchases evidence of the actual architecture. |

## A/B decision

Both candidates were rendered in the real Home component in EN/RU at 1440 and
390 using the same final short story. Raw full-page, stage and isolated-card PNGs
are in [comparisons/candidates/](comparisons/candidates/). See the four labelled
[EN desktop](comparisons/en-1440-A-B.jpg), [RU desktop](comparisons/ru-1440-A-B.jpg),
[EN mobile](comparisons/en-390-A-B.jpg), [RU mobile](comparisons/ru-390-A-B.jpg) boards.

B retains the genuine task-led Home image, two journey labels and a refined
navy/copy treatment. At 1440 its card is 638px; at 390 it is 872px EN / 907px RU.
It is the better compact option. It still shows task selection rather than
independent reading, counted programme progress or the source-to-programme link.
Those distinctions depend on the author's explanation around the image.

A is selected for handoff because the primary evaluation asks viewers to
recognize the architecture. At desktop it shows the article's own programme
links and the separate continuation state; on mobile the shared-resource link
is editorial, since the complete header excerpt omits the programme sidebar.
The existing progress state refers to step 04 after three completed units,
including ONVIF as unit 03. It is not a claim that reading the displayed article
just caused those three completions. No completion state was created or changed.

## Direct answer for the reviewer

**It still falls short of the strongest inspected references in mobile scan
speed and fine-text readability.** Its technical specificity, real source
evidence, clear separation of journeys and restrained desktop composition make
it a credible candidate for a premium portfolio. They do not establish equal
native-app craft at the portfolio's reduced display scale. The 390px scroll
cost, small source annotations and editorial rather than on-image shared-resource
link on mobile are concrete weaknesses. This is a reasoned selection for
independent ChatGPT review, not a self-approved design or a measured recruiter result.
