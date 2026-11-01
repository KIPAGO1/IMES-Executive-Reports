export interface HealthRecord {
  year:number; region:string; district:string;
  governmentFacilities:number; nonGovernmentFacilities:number;
  dispensaries:number; healthCentres:number; districtHospitals:number; otherDistrictLevelHospitals:number;
  regionalHospitals:number; referralHospitals:number; nationalHospitals:number;
  insuredFacilities:number; gothomisFacilities:number; gothomisCollectionTzs:number;
  ichfMembers:number; ichfCollectionTzs:number; nhifMembers:number; nhifCollectionTzs:number;
  bimaKwaWoteMembers:number; gepgFacilities:number;
  births:number; maternalDeaths:number; liveBirths:number; neonatalDeaths:number;
}
export interface HealthInventory {year:number;region:string;district:string;item:string;required:number;available:number}
export interface HealthData {records:HealthRecord[];inventory:HealthInventory[]}
export interface HealthFilters {year:string;region:string;district:string}
export interface HealthKpi {label:string;value:number;icon:string;color:string;format?:'money'|'rate'|'count';suffix?:string}
export interface HealthFacilitySlice {label:string;value:number;color:string}
export interface HealthRegionStat {region:string;members:number;}
export interface HealthItemStat {item:string;required:number;available:number;percent:number}
