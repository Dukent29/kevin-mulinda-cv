# CV print and download measurements

The benchmark below was measured before the Buildflow/project-link content update. Current exports remain below 50,000 bytes; see artifacts/pdf-validation.json for the latest sizes.

Measured locally on 17 October 2026. Both the **Imprimer / Print** link and the
download link use these prebuilt PDFs; no PDF generation happens in the visitor's browser.

| Export | Before | After | Cold transfer before | Cold transfer after | Open/render before | Open/render after |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| French light | 522,894 B | 48,506 B | 2,891 ms | 419 ms | 8,466 ms | 24 ms |
| French dark | 550,716 B | 42,788 B | 2,996 ms | 383 ms | 9,624 ms | 29 ms |
| English light | 503,565 B | 47,433 B | 2,774 ms | 407 ms | 9,694 ms | 26 ms |
| English dark | 552,025 B | 41,686 B | 3,060 ms | 377 ms | 8,888 ms | 26 ms |

All files, including the default French alias, are strictly below **50,000 bytes**.
The main exports are 90.6–92.4% smaller. Text stays selectable and searchable,
all four contact links are retained, and every CV fits on one A4 page.

## Measurement scope

- Transfer: median of three full HTTP fetches in Chromium with cache disabled,
  simulated 200,000 bytes/s throughput (1.6 Mbps) and 150 ms latency.
- Open/render: median of five PDFium document-open and page-render runs at 1.5×
  scale on the same machine. This measures PDF processing, **not** the operating
  system's print dialog or printer driver. Timings vary by device and hosting.
- Raw results: `artifacts/downloads-before.json`, `downloads-after.json`,
  `exports-before.json`, and `exports-after.json`.
- Validation: four rendered pages inspected; A4 size, one page, selectable text,
  TypeScript since 2023, five employers, and contact links checked automatically.

## Changes

Export-only CSS removes gradients, shadows, blur/masks, decorative music icons,
and costly dotted/rounded outlines. It keeps the website's two-column layout,
Inter/Oswald fonts, portrait and light/dark colours. Font weights and letter
spacing are simplified for compact vector output. The website styling is unchanged.

The build compresses PDF object streams, reduces excessive coordinate precision,
optimizes font data without changing glyph indices, and compresses the portrait
at about 200 dpi at its printed size. It rejects any export at or above 50,000
bytes and publishes files only after all variants pass. Text is never rasterized.

## Reproduce

Install development-only Python dependencies from `scripts/requirements-pdf.txt`.
The optimizer also recognizes the project's ignored `.pdf-tools/` and
`.font-tools/` directories. Set `PYTHON_PATH`, `PLAYWRIGHT_PATH`, and optionally
`BROWSER_PATH` to installed runtimes where needed.

```text
node scripts/build.cjs
node scripts/pdf.cjs
python scripts/verify_pdf.py
node scripts/measure-downloads.cjs after
python scripts/measure-exports.py after
node scripts/verify.cjs
```

`PDF_OUTPUT_DIR` optionally generates a review copy instead of publishing to the
site root. None of these development dependencies are sent to visitors.
