import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {ProgramTitle, Status, TableFiltering, TablePlanning} from "../../interfaces/interfaces";
import {MatSort, Sort} from "@angular/material/sort";
import {MatSelect} from "@angular/material/select";
import {PlanningService} from "../../services/planning.service";
import {take} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {FormControl, Validators} from "@angular/forms";
import {MatOption} from "@angular/material/core";
import {MatDatepicker} from "@angular/material/datepicker";
import {MatDialog} from '@angular/material/dialog';
import {PlanningDialogModule} from "../planning-dialog/planning-dialog.module";
import {PlanningDialogComponent} from "../planning-dialog/planning-dialog.component";
export interface PlanningDialogData {
  id: number;
}

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
  public getEnumNames<T>(e: T): string[] {
    return Object.keys(e).slice(Object.keys(e).length / 2);
  }

  public getEnumKeys<T>(e: T): number[] {
    return Object.keys(e).map(s => parseInt(s, 10)).slice(0, Object.keys(e).length / 2);
  }

  //Title Select Filter
  public titlesSelect = new FormControl();
  public titlesNames: string[] = this.getEnumNames(ProgramTitle);
  public titlesVals: number[] = this.getEnumKeys(ProgramTitle);

  //Status Select Filter
  public statusSelect = new FormControl();
  public statusNames: string[] = this.getEnumNames(Status);
  public statusVals: number[] = this.getEnumKeys(Status);


  //Show additional filters button
  public isAddFiltersOpened: boolean = false;

  //MembersCount Filter
  public memberCount = new FormControl('', Validators.min(0));


  //Sort control
  @ViewChild(MatSort) sort?: MatSort;

  //Reset control
  @ViewChild('matSelectTitle') matSelectTitle?: MatSelect;
  @ViewChild('matSelectStatus') matSelectStatus?: MatSelect;
  @ViewChild('picker') datePicker?: MatDatepicker<any>;

  constructor(public planningsService: PlanningService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.tableHandler();
  }

  //Date to readable date in table cell
  public convertDate(date: Date): string {
    return this.planningsService.convertDate(date);
  }

  //Count of working filters
  public activeFilters(): number {
    let res = 0;

    if (this.tableFiltering.trainer !== '') res++;
    if (this.tableFiltering.programTitle !== -1) res++;
    if (this.tableFiltering.period.getTime() !== 0) res++;
    if (this.tableFiltering.membersCount !== -1) res++;
    if (this.tableFiltering.status !== 0) res++;

    return res;
  }

  //Reset all filters
  public resetFilters(): void {

    //Order is important
    //Because when #var changes, this.var also change (ngModelChange) to incorrect value,
    //we reset this.tableFiltering later and avoiding this problem
    this.matSelectTitle?.options.forEach((data: MatOption) => data.deselect());
    this.matSelectStatus?.options.forEach((data: MatOption) => data.deselect());
    this.datePicker?.select(0);

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

  public closeDatePicker(eventData: any, dp?: any) {
    dp.close();
    this.tableFiltering.period.setTime(Date.parse(eventData));
  }


  public tableHandler(): void {


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


  public openPlanningDialog(id: number): void {
    const confirmDialog = this.dialog.open(PlanningDialogComponent, {data : {id: id}});
  }

}
