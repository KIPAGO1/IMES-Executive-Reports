IMES EDUCATION DASHBOARD — PDF-STYLE PATCH

This patch builds on the previous landing-page patch.
1. Back up frontend/src/app/app.component.html and app.component.css.
2. Copy these two files to frontend/src/app/.
3. Keep app.component.ts unchanged (uses existing ECharts chart logic).
4. Ensure src/assets/elimu.png exists. No new icons are included.
5. Run npm start.

The 8 KPI positions and 3 chart positions match pag3.pdf. The repeated 215,736 values for teachers/ratios in the reference PDF are placeholders; unknown metrics show an em dash instead. The region and trend chart values are demo data.

This is a patch based on the previously supplied source, not a fully tested build.
