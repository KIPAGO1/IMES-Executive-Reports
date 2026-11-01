# IMES Executive Reports — Modular V3

Each page has its own folder under `frontend/src/app/pages/`.

- `education/`: `education.component.ts`, `.html`, `.css`, `education.service.ts`, `education.models.ts`.
- `revenue/`, `expenditures/`, `chw/`, `health/`, `planning_and_implementations/`, `loans/`: each has a component TS/HTML/CSS and a service TS.
- `dashboard/` and `login/`: separate TS/HTML/CSS.

The existing routes, PDF-inspired appearance and shared header remain. Education demo data is now served by `EducationService`, not hardcoded in the component. Other sectors are placeholders with API service stubs.

## Run

```cmd
cd frontend
npm install
npm start
```

Place your own `coat.png`, `elimu.png`, `afya.png`, `chw.png`, `mapato.png`, `matumizi.png`, `mikopo.png`, `mipango.png` in `frontend/src/assets/`.

## Backend integration

Replace `EducationService.getDashboard()` demo `of(...)` with `HttpClient.get<EducationDashboardData>(...)`. Configure HttpClient using `provideHttpClient()` in `main.ts` or your app config. Add a proper API URL in environment files. The current demo login is not production authentication.

## Caveat

Demo year, district, education level and class filters do not change data until connected to an API. Sample regional figures are synthetic. Full npm build has not been verified here.


## V4: Swahili / English across the application
- `src/app/core/translation.service.ts` contains the centralized dictionary and persisted language setting.
- `src/app/core/translate.pipe.ts` provides `{{'key' | tr}}` for templates.
- Use `TranslationService.t('key')` for TypeScript-generated chart labels and KPI names.
- The top language selector updates the application immediately; the selection persists in localStorage.
- Sector modules remain separate. Add new translation keys in both `sw` and `en` dictionaries.
- No additional npm translation dependency required.
- This patch has not been validated with a complete Angular build in this environment.
