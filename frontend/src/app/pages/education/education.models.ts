export interface RegionEnrolment { name: string; total: number; }
export interface EducationDashboardData {
  year: string;
  enrolment: number;
  schools: number;
  classrooms: number;
  teachers: number | null;
  pupilTeacherRatio: number | null;
  pupilClassroomRatio: number | null;
  pupilTableRatio: number | null;
  disabledPupils: number | null;
  gender: { female: number; male: number };
  trend: { year: string; enrolment: number }[];
  regions: RegionEnrolment[];
}
export interface EducationFilters {
  year: string; region: string; district: string; level: string; classLevel: string;
}
