# CV Bundle

Canonical content lives in `resume-data.json`.

## Build

```powershell
npm run cv:build
```

The command generates:

- `cv.html` - branded HTML source.
- `ats.html` - ATS HTML source.
- `Nikita_Kanarev_Product_Designer_Master.md` - editable master copy.
- `../output/pdf/Nikita_Kanarev_Product_Designer_CV.pdf` - branded CV.
- `../output/pdf/Nikita_Kanarev_Product_Designer_ATS.pdf` - ATS resume.
- `../output/pdf/Nikita_Kanarev_Product_Designer_Resume.txt` - plain text.
- `../public/cv.pdf` - branded site download.

Supporting documents:

- `fact-sheet.md`
- `application-adaptation-guide.md`
- `change-log.md`
- `cross-document-consistency.md`
- `qa-report.md`

The portfolio now points at the custom domain `kanarev.com`. Before the first application, align the public LinkedIn profile with `cross-document-consistency.md` - it is the last open blocker. The incomplete phone number is intentionally omitted; add a phone only after a complete international number is available.
