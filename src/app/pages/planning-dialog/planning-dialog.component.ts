import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PlanningDialogData} from "../planning/planning.component";
import {PlanningService} from "../../services/planning.service";
import {Planning} from "../../interfaces/interfaces";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-planning-dialog',
  templateUrl: './planning-dialog.component.html',
  styleUrls: ['./planning-dialog.component.scss']
})
export class PlanningDialogComponent implements OnInit{

  public planning?: Planning;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PlanningDialogData,
              public planningService: PlanningService) { }

  ngOnInit(): void {
    this.getPlanningInfo();
  }

  public getPlanningInfo() {
    this.planningService.getTask(this.data.id)
      .pipe(take<Planning>(1))
      .subscribe(pl => this.planning = pl);
  }
}
