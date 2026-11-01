import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HealthService} from './health.service';
import {HealthData,HealthRecord,HealthInventory,HealthFilters,HealthKpi,HealthFacilitySlice,HealthRegionStat,HealthItemStat} from './health.model';
import { TranslatePipe } from '../../core/translate.pipe';
 
@Component({standalone:true,selector:'app-health',imports:[CommonModule,FormsModule,TranslatePipe],templateUrl:'./health.component.html',styleUrl:'./health.component.css'})
export class HealthComponent implements OnInit {
  data:HealthData={records:[],inventory:[]};filtered:HealthRecord[]=[];filteredInventory:HealthInventory[]=[];
  loading=true;error='';filters:HealthFilters={year:'2026',region:'All',district:'All'};
  years:string[]=[];regions:string[]=[];districts:string[]=[];
  kpis:HealthKpi[]=[];facilitySlices:HealthFacilitySlice[]=[];regionMembers:HealthRegionStat[]=[];items:HealthItemStat[]=[];
  facilityTotal=0;donutStyle='conic-gradient(#e5edf7 0% 100%)';maxRegionMembers=1;
  private readonly facilityDefs:[keyof HealthRecord,string,string][]=[
    ['dispensaries','Dispensaries','#0b79ce'],['healthCentres','Health Centres','#06a96c'],
    ['districtHospitals','District Hospitals','#f39c12'],['otherDistrictLevelHospitals','Other District-Level Hospitals','#8452ce'],
    ['regionalHospitals','Regional Hospitals','#14a6b5'],['referralHospitals','Referral Hospitals','#db517d'],['nationalHospitals','National Hospitals','#64748b']
  ];
  constructor(private service:HealthService){}
  async ngOnInit():Promise<void>{try{this.data=await this.service.load();this.years=[...new Set(this.data.records.map(r=>String(r.year)))].sort().reverse();if(!this.years.includes(this.filters.year))this.filters.year=this.years[0]||'All';this.regions=this.unique(this.data.records.map(r=>r.region));this.updateDistricts();}catch(e){this.error=e instanceof Error?e.message:'Unable to load health data';}finally{this.loading=false;}}
  unique(v:string[]):string[]{return [...new Set(v)].sort((a,b)=>a.localeCompare(b));}
  updateDistricts():void{this.districts=this.unique(this.data.records.filter(r=>this.filters.region==='All'||r.region===this.filters.region).map(r=>r.district));if(!this.districts.includes(this.filters.district))this.filters.district='All';this.apply();}
  sum(key:keyof HealthRecord,rows:HealthRecord[]=this.filtered):number{return rows.reduce((n,r)=>n+(typeof r[key]==='number'?Number(r[key]):0),0);}
  apply():void{
    this.filtered=this.service.filterRecords(this.data.records,this.filters);
    this.filteredInventory=this.service.filterInventory(this.data.inventory,this.filters);
    const n=(key:keyof HealthRecord)=>this.sum(key);const total=n('governmentFacilities')+n('nonGovernmentFacilities');
    const rate=(numerator:number,denominator:number,scale:number)=>denominator>0?numerator/denominator*scale:0;
    this.kpis=[
      {label:'HEALTH FACILITIES',value:total,icon:'facilities',color:'blue'},
      {label:'GOVERNMENT OWNED FACILITIES',value:n('governmentFacilities'),icon:'government',color:'green'},
      {label:'NON-GOVERNMENT FACILITIES',value:n('nonGovernmentFacilities'),icon:'nongovernment',color:'orange'},
      {label:'DISPENSARIES',value:n('dispensaries'),icon:'dispensaries',color:'purple'},
      {label:'HEALTH CENTRES',value:n('healthCentres'),icon:'health-centres',color:'blue'},
      {label:'DISTRICT HOSPITALS',value:n('districtHospitals'),icon:'district-hospitals',color:'green'},
      {label:'OTHER DISTRICT-LEVEL HOSPITALS',value:n('otherDistrictLevelHospitals'),icon:'district-level',color:'orange'},
      {label:'REGIONAL HOSPITALS',value:n('regionalHospitals'),icon:'regional-hospitals',color:'purple'},
      {label:'REFERRAL HOSPITALS',value:n('referralHospitals'),icon:'referral',color:'blue'},
      {label:'NATIONAL HOSPITALS',value:n('nationalHospitals'),icon:'national',color:'green'},
      {label:'INSURANCE SERVICE FACILITIES',value:n('insuredFacilities'),icon:'insurance',color:'orange'},
      {label:'GoT-HoMIS COLLECTION',value:n('gothomisCollectionTzs'),icon:'homis-collection',color:'purple',format:'money'},
      {label:'FACILITIES WITH GoT-HoMIS',value:n('gothomisFacilities'),icon:'homis-facilities',color:'blue'},
      {label:'iCHF MEMBERS',value:n('ichfMembers'),icon:'ichf-members',color:'green'},
      {label:'iCHF COLLECTION',value:n('ichfCollectionTzs'),icon:'ichf-collection',color:'orange',format:'money'},
      {label:'NHIF MEMBERS',value:n('nhifMembers'),icon:'nhif-members',color:'purple'},
      {label:'NHIF COLLECTION',value:n('nhifCollectionTzs'),icon:'nhif-collection',color:'blue',format:'money'},
      {label:'BIMA KWA WOTE MEMBERS',value:n('bimaKwaWoteMembers'),icon:'bima',color:'green'},
      {label:'TOTAL GePG FACILITIES',value:n('gepgFacilities'),icon:'gepg',color:'orange'},
      {label:'MATERNAL MORTALITY RATIO',value:rate(n('maternalDeaths'),n('liveBirths'),100000),icon:'maternal',color:'purple',format:'rate',suffix:'per 100k live births'},
      {label:'NEONATAL MORTALITY RATE',value:rate(n('neonatalDeaths'),n('liveBirths'),1000),icon:'neonatal',color:'blue',format:'rate',suffix:'per 1k live births'}
    ];
    this.facilitySlices=this.facilityDefs.map(([key,label,color])=>({label,value:n(key),color}));
    this.facilityTotal=this.facilitySlices.reduce((a,b)=>a+b.value,0);
    let acc=0;this.donutStyle='conic-gradient('+this.facilitySlices.map(s=>{const start=acc;acc+=this.facilityTotal?s.value/this.facilityTotal*100:0;return `${s.color} ${start}% ${acc}%`;}).join(',')+')';
    if(!this.facilityTotal)this.donutStyle='conic-gradient(#e5edf7 0% 100%)';
    const byRegion=new Map<string,number>();this.filtered.forEach(r=>byRegion.set(r.region,(byRegion.get(r.region)||0)+r.bimaKwaWoteMembers));
    this.regionMembers=[...byRegion].map(([region,members])=>({region,members})).sort((a,b)=>b.members-a.members);this.maxRegionMembers=Math.max(1,...this.regionMembers.map(r=>r.members));
    const byItem=new Map<string,{required:number;available:number}>();this.filteredInventory.forEach(r=>{const x=byItem.get(r.item)||{required:0,available:0};x.required+=r.required;x.available+=r.available;byItem.set(r.item,x);});
    this.items=[...byItem].map(([item,x])=>({item,...x,percent:x.required?x.available/x.required*100:0})).sort((a,b)=>a.item.localeCompare(b.item));
  }
  format(value:number,format?:string):string{if(format==='rate')return value.toFixed(1);if(format==='money')return 'TSH '+this.compact(value);return new Intl.NumberFormat('en-TZ',{maximumFractionDigits:0}).format(value);}
  compact(n:number):string{return n>=1e12?(n/1e12).toFixed(2)+'T':n>=1e9?(n/1e9).toFixed(2)+'B':n>=1e6?(n/1e6).toFixed(1)+'M':new Intl.NumberFormat('en-TZ').format(n);}
  width(value:number,max:number):number{return max?Math.min(100,Math.max(0,value/max*100)):0;}
  trackKpi(_:number,k:HealthKpi):string{return k.label;}
}
