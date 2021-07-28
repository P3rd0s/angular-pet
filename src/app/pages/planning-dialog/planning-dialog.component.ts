import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PlanningDialogData} from "../planning/planning.component";
import {PlanningService} from "../../services/planning.service";
import {getEnumKeys, JoinCondition, Planning, ProgramTitle, Trainer} from "../../interfaces/interfaces";
import {take} from "rxjs/operators";
import {FormArray, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-planning-dialog',
  templateUrl: './planning-dialog.component.html',
  styleUrls: ['./planning-dialog.component.scss']
})
export class PlanningDialogComponent implements OnInit {

  //Current edit planning
  public planning: Planning = {
    //dont forget check this case
    id: -1,
    title: ProgramTitle["Вклады: теория и практика"],
    progress: 0,
    events: [],
    joinCondition: JoinCondition["Не требовать регистрацию, имя и фамилию"],
    members: []
  };

  //Array of events
  public eventsArr: Event[] = [];

  //For each event
  public formX: FormGroup = new FormGroup({
    eventName: new FormControl(),
    trainer: new FormControl(),
    date: new FormControl(),
    time: new FormControl()
  });

  //Any type to avoid problems in html
  public formArr: any = new FormArray([]);

  //Provide from interface to use in html
  public programTitleEnum: typeof ProgramTitle = ProgramTitle;
  public joinCondEnum: typeof JoinCondition = JoinCondition;
  public trainerEnum: typeof Trainer = Trainer;
  getEnumKeys = getEnumKeys;


  constructor(@Inject(MAT_DIALOG_DATA) public data: PlanningDialogData,
              public planningService: PlanningService) {

    //First 3 events in dialog
    this.formArr.push(this.formX);
    this.formArr.push(this.formX);
    this.formArr.push(this.formX);
  }

  ngOnInit(): void {
    this.getPlanningInfo();
  }

  public getPlanningInfo() {
    this.planningService.getTask(this.data.id)
      .pipe(take<Planning>(1))
      .subscribe(pl => {
        this.planning = pl;

        if (this.planning.events.length) {
          this.planning.events.slice(Math.max(this.planning.events.length - this.formArr.length, 0)) //get 3 (last) events
            .map((event, idx) => this.formArr.setControl(idx,
              new FormGroup({
                eventName: new FormControl(event.eventName),
                trainer: new FormControl(event.trainer),
                date: new FormControl(new Date(event.date)),
                time: new FormControl(new Date(event.date).toString().slice(16, 21))
              })
            ));
        }

        console.log(this.formArr);
      });
  }

  public test() {
    console.log(this.formArr);
  }
}
