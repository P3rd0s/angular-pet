import {Component, OnInit, ViewChild} from '@angular/core';
import {
  getEnumKeys,
  getEnumNames, Planning,
  ProgramTitle,
  Status,
  TableFiltering,
  TablePlanning
} from "../../interfaces/interfaces";
import {MatSort, Sort} from "@angular/material/sort";
import {MatSelect} from "@angular/material/select";
import {PlanningService} from "../../services/planning.service";
import {take} from "rxjs/operators";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {FormControl, Validators} from "@angular/forms";
import {MatOption} from "@angular/material/core";
import {MatDatepicker} from "@angular/material/datepicker";
import {MatDialog} from '@angular/material/dialog';
import {PlanningDialogComponent} from "../planning-dialog/planning-dialog.component";
import {MatMenuPanel, MatMenuTrigger} from "@angular/material/menu";

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

  //For adaptive (mobile) web-page
  public showMobileFilters: boolean = false;
  public mobileSortHeaders: string[] = [
    "По дате последнего ивента",
    "По названию",
    "По количеству участников",
    "По имени тренера",
    "По прогрессу обучения"
  ];

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


  //Title Select Filter
  public titlesSelect = new FormControl();
  public titlesNames: string[] = getEnumNames(ProgramTitle);
  public titlesVals: number[] = getEnumKeys(ProgramTitle);

  //Status Select Filter
  public statusSelect = new FormControl();
  public statusNames: string[] = getEnumNames(Status);
  public statusVals: number[] = getEnumKeys(Status);


  //Show additional filters button
  public isAddFiltersOpened: boolean = false;

  //MembersCount Filter
  public memberCount = new FormControl('', Validators.min(0));
  public mobileSortOptions: any[] = [];


  //Sort control
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild('menu') mobileMenu?: MatMenuPanel;

  //Mobile sort control
  public mobileSort = new FormControl();

  //Reset control
  @ViewChild('matSelectTitle') matSelectTitle?: MatSelect;
  @ViewChild('matSelectStatus') matSelectStatus?: MatSelect;
  @ViewChild('picker') datePicker?: MatDatepicker<any>;
  @ViewChild('table') table?: MatTable<any>;



  constructor(public planningsService: PlanningService,
              public dialog: MatDialog) {
    //Unsubscribe when destroy
    this.planningsService.callNewPlanningDialog$.subscribe(res => {
      if (res) this.openPlanningDialog(-1)
    });

    //Initialize array for mobile sorting options
    for (let i in this.displayedColumns.slice(0, 5)) {
      this.mobileSortOptions.push({
        sort: {
          active: this.displayedColumns[i],
          direction: 'asc'
        },
        name: this.mobileSortHeaders[i] + ' возр.'
      });
      this.mobileSortOptions.push({
        sort: {
          active: this.displayedColumns[i],
          direction: 'desc'
        },
        name: this.mobileSortHeaders[i] + ' уб.'
      });
    }

  }

  ngOnInit(): void {
    this.tableHandler();
  }

  //Date to readable date in table cell
  public convertDate(date: any): string {
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
    const confirmDialog = this.dialog.open(PlanningDialogComponent, {data: {id: id}, position: {right: '-16px'}});
    confirmDialog.afterClosed()
      .pipe(take<TablePlanning>(1))
      .subscribe(isTrue => {

        //Check if save button pressed
        if (isTrue) {

          if (id == -1) this.tableHandler();

          //Update row if need it, without get new table from server
          else
            this.planningsService.getTask(id)
              .pipe(take<Planning>(1))
              .subscribe(pl => {
                let row = this.planningsService.planningToTableRow(pl);
                this.dataSource.data = this.dataSource.data.map((oldRow: any) => {
                  if (oldRow.id === row.id) oldRow = row;
                  return oldRow;
                });
                this.table?.renderRows();
              })
        }
      });

  }
}
