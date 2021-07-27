import {Component, OnInit, ViewChild} from '@angular/core';
import {Months, ProgramTitle, Status, TableFiltering, TablePlanning, Trainer} from "../../interfaces/interfaces";
import {MatSort, Sort} from "@angular/material/sort";
import {MatSelect} from "@angular/material/select";
import {PlanningService} from "../../services/planning.service";
import {take} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {


  //Table-columns
  public displayedColumns: string[] = ['date', 'title', 'membersCount', 'trainer', 'progress', 'menu'];

  //Table data
  public dataSource: any = [];

  //Table searching, filtering and sorting
  public searchText: string = '';
  public sortBy?: Sort;
  public tableFiltering: TableFiltering = {
    programTitle: -1,
    period: new Date(0),
    membersCount: -1,
    trainer: '',
    status: 0
  }

  //Generic for get enums keys and values
  public getEnumNames<T>(e:T): string[] {
    return Object.keys(e).slice(Object.keys(e).length/2);
  }
  public getEnumKeys<T>(e:T): number[] {
    return Object.keys(e).map(s => parseInt(s, 10)).slice(0, Object.keys(e).length/2);
  }

  public trainersNames: string[] = [Trainer[0], Trainer[1], Trainer[2]];
  public trainersVals: number[] = [0, 1, 2];

  //Title Select Filter
  public titlesSelect = new FormControl();
  public titlesNames: string[] = this.getEnumNames(ProgramTitle);
  public titlesVals: number[] = this.getEnumKeys(ProgramTitle);

  //Status Select Filter
  public statusSelect = new FormControl();
  public statusNames: string[] = this.getEnumNames(Status);
  public statusVals: number[] = this.getEnumKeys(Status);

  //Period Select Filter
  public periodSelect = new FormGroup({
    start: new FormControl('', Validators.min(this.periodMinSelect?.valueOf() || 0)),
    end: new FormControl('', Validators.max(this.periodMaxSelect?.valueOf() || 0))
  });
  public periodMinSelect?: Date;
  public periodMaxSelect?: Date;





  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild('matSelect') matSelect?: MatSelect;

  constructor(public planningsService: PlanningService) {
  }

  ngOnInit(): void {
    this.tableHandler();
  }

  public convertDate(date:Date):string {
    return this.planningsService.convertDate(date);
  }

  public activeFilters(): number {
    let res = 0;

    if (this.tableFiltering.trainer !== '') res++;
    if (this.tableFiltering.programTitle !== -1) res++;
    if (this.tableFiltering.period.getTime() !== 0) res++;
    if (this.tableFiltering.membersCount !== -1) res++;
    if (this.tableFiltering.status !==0) res++;

    return res;
  }

  public resetFilters(): void {
    this.tableFiltering = {
      programTitle: -1,
      period: new Date(0),
      membersCount: -1,
      trainer: '',
      status: 0
    };
  }

  public resetSearch(): void {
    this.searchText = '';
  }

  public resetTitleFilter(): void {
    this.tableFiltering.programTitle = -1;
  }

  public closeDatePicker(eventData: any, dp?:any) {
    // get month and year from eventData and close datepicker, thus not allowing user to select date
    dp.close();
    this.tableFiltering.period.setTime(Date.parse(eventData));
  }


  public tableHandler(): void {


    //console.log(this.activeFilters());
    this.planningsService.getParametrizedTable(this.sortBy,
      this.activeFilters() > 0 ? this.tableFiltering : undefined,
      this.searchText)
      .pipe(take<TablePlanning[]>(1))
      .subscribe(table => {

        //Get data to table
        this.dataSource = this.dataSource
          ? new MatTableDataSource<TablePlanning>(table)
          : (table);

        this.dataSource.sort = this.sort;

      });

  }

  public deletePlanning(id: number): void {
    this.planningsService.deleteTask(id).subscribe();
    this.tableHandler();
  }


}
