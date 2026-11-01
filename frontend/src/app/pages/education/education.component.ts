import { AfterViewInit, Component, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';
import { TranslatePipe } from '../../core/translate.pipe';
import { TranslationService } from '../../core/translation.service';
import { EducationService } from './education.service';
import { EducationDashboardData, EducationFilters } from './education.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent implements AfterViewInit, OnDestroy {
  year = '2026'; region = 'all'; district = 'all'; level = 'all'; classLevel = 'all';
  regionNames: string[];
  data: EducationDashboardData | null = null;
  charts: echarts.ECharts[] = [];
  private viewReady = false;
  private onResize = () => this.charts.forEach(chart => chart.resize());

  constructor(private readonly educationService: EducationService, public readonly i18n: TranslationService) {
    effect(() => { this.i18n.language(); if (this.viewReady) queueMicrotask(() => this.draw()); });
    this.regionNames = this.educationService.getRegions();
    this.apply();
  }
  ngAfterViewInit(): void {
    this.viewReady = true;
    this.draw();
    window.addEventListener('resize', this.onResize);
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    this.charts.forEach(chart => chart.dispose());
  }
  get fmtTotal(): string { return (this.data?.enrolment ?? 0).toLocaleString('en-US'); }
  get kpis(): {name:string;value:string}[] {
    const fmt = (value:number|null|undefined) => value == null ? '—' : value.toLocaleString('en-US');
    const d=this.data;
    return [
      {name:this.i18n.t('enrolment'),value:fmt(d?.enrolment)},
      {name:this.i18n.t('schools'),value:fmt(d?.schools)},
      {name:this.i18n.t('classrooms'),value:fmt(d?.classrooms)},
      {name:this.i18n.t('teachers'),value:fmt(d?.teachers)},
      {name:this.i18n.t('pupilTeacherRatio'),value:fmt(d?.pupilTeacherRatio)},
      {name:this.i18n.t('pupilClassroomRatio'),value:fmt(d?.pupilClassroomRatio)},
      {name:this.i18n.t('pupilTableRatio'),value:fmt(d?.pupilTableRatio)},
      {name:this.i18n.t('disabledPupils'),value:fmt(d?.disabledPupils)}
    ];
  }
  setRegion(): void { this.district='all'; }
  apply(): void {
    const filters: EducationFilters={year:this.year,region:this.region,district:this.district,level:this.level,classLevel:this.classLevel};
    this.educationService.getDashboard(filters).subscribe(data=>{this.data=data;if(this.viewReady)this.draw();});
  }
  private draw(): void {
    if(!this.data)return;
    this.charts.forEach(c=>c.dispose());this.charts=[];
    const create=(id:string,options:echarts.EChartsOption)=>{
      const el=document.getElementById(id);if(!el)return;
      const chart=echarts.init(el);chart.setOption(options);this.charts.push(chart);
    };
    create('genderChart',{tooltip:{trigger:'item'},legend:{bottom:0},color:['#0870dc','#ff8a00'],series:[{type:'pie',radius:['48%','72%'],label:{formatter:'{d}%'},data:[{name:this.i18n.t('female'),value:this.data.gender.female},{name:this.i18n.t('male'),value:this.data.gender.male}]}]});
    create('trendChart',{tooltip:{trigger:'axis'},grid:{left:70,right:20,top:30,bottom:35},xAxis:{type:'category',data:this.data.trend.map(t=>t.year)},yAxis:{type:'value',scale:true},series:[{type:'line',smooth:true,areaStyle:{opacity:.12},data:this.data.trend.map(t=>t.enrolment)}]});
    const regions=[...this.data.regions].sort((a,b)=>b.total-a.total);
    create('regionChart',{tooltip:{trigger:'axis'},grid:{left:50,right:15,top:25,bottom:100},xAxis:{type:'category',data:regions.map(r=>r.name),axisLabel:{rotate:50,interval:0,fontSize:10}},yAxis:{type:'value'},dataZoom:regions.length>15?[{type:'inside',start:0,end:60},{type:'slider',start:0,end:60,bottom:0}]:[],series:[{type:'bar',barMaxWidth:24,itemStyle:{color:'#2775d3'},data:regions.map(r=>r.total)}]});
  }
}
