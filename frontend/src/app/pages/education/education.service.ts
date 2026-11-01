import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EducationDashboardData, EducationFilters } from './education.models';

/** Demo adapter. Replace getDashboard() with HttpClient.get() when API is ready. */
@Injectable({ providedIn: 'root' })
export class EducationService {
  private readonly regionNames = ['Arusha','Dar es Salaam','Dodoma','Geita','Iringa','Kagera','Katavi','Kigoma','Kilimanjaro','Lindi','Manyara','Mara','Mbeya','Morogoro','Mtwara','Mwanza','Njombe','Pwani','Rukwa','Ruvuma','Shinyanga','Simiyu','Singida','Songwe','Tabora','Tanga'];
  private readonly sample: EducationDashboardData = {
    year: '2026', enrolment: 16546267, schools: 15362, classrooms: 215736,
    teachers: null, pupilTeacherRatio: null, pupilClassroomRatio: null,
    pupilTableRatio: null, disabledPupils: null,
    gender: { female: 51, male: 49 },
    trend: [{year:'2022',enrolment:13980000},{year:'2023',enrolment:14560000},{year:'2024',enrolment:15140000},{year:'2025',enrolment:15810000},{year:'2026',enrolment:16546267}],
    regions: []
  };
  constructor() {
    this.sample.regions = this.regionNames.map((name,i) => ({name,total:Math.round(410000+((i*73471+27391)%390000))}));
  }
  getRegions(): string[] { return [...this.regionNames]; }
  getDashboard(filters: EducationFilters): Observable<EducationDashboardData> {
    // Demo supports region selection only. Year, level, district and class need real API data.
    const regions = filters.region === 'all' ? this.sample.regions : this.sample.regions.filter(r=>r.name===filters.region);
    const enrolment = filters.region === 'all' ? this.sample.enrolment : (regions[0]?.total ?? 0);
    return of({...this.sample, enrolment, regions});
  }
  // Backend example:
  // return this.http.get<EducationDashboardData>(`${environment.apiUrl}/education/dashboard`, {params: {...filters}});
}
