import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PlanningDialogData} from "../planning/planning.component";
import {PlanningService} from "../../services/planning.service";
import {
  Event,
  getEnumKeys,
  JoinCondition, Member,
  Planning,
  ProgramTitle,
  TablePlanning,
  Trainer
} from "../../interfaces/interfaces";
import {take} from "rxjs/operators";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {CdkDragDrop, moveItemInArray, copyArrayItem, CdkDragStart} from "@angular/cdk/drag-drop";

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

  //For editing planning members.any type needs for check without this field in DB
  public membersList: any[] = [];
  //public selectedMembers: any[] = [];
  public isCopyAllMembers: boolean = false;

  //For delete joined members with checkbox
  public joinedMembers: any[] = [];
  public isDeleteAllJoined: boolean = false;

  //For drag and drop few members
  public isDragging: boolean = false;

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
    this.getMembersList();
  }

  public getPlanningInfo(): void {
    this.planningService.getTask(this.data.id)
      .pipe(take<Planning>(1))
      .subscribe(pl => {
        this.planning = pl;
        this.joinedMembers = Object.assign(this.planning.members, {checked: false});

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

      });
  }

  public getMembersList(): void {
    this.planningService.getMembers()
      .pipe(take<Member[]>(1))
      .subscribe(list => {
        this.membersList = list;

        //DONT FORGET REMOVE CHECKED AND CHECKEDDEL PROPS
        this.membersList.map(member => Object.assign(member, {checked: false}));
      });

  }

  public isEventFilled(event: FormGroup): Event | undefined {

    if (!event.get('eventName')
      || !event.get('trainer')
      || !event.get('date')
      || !event.get('time')
      || event.get('eventName')?.value == null
      || event.get('trainer')?.value == null
      || event.get('date')?.value == null
      || event.get('time')?.value == null) return undefined;

    return {
      eventName: event.get('eventName')?.value,
      trainer: event.get('trainer')?.value,
      date: new Date(event.get('date')?.value.setHours(parseInt((event.get('time')?.value.slice(0, 2)), 10),
        parseInt((event.get('time')?.value.slice(3, 5)))))
    }
  }

  public saveChanges(): void {
    let localEvents: Event[] = [];
    for (let formGr of this.formArr.controls) {
      let event = this.isEventFilled(formGr);
      if (event) localEvents.push(event);
    }
    this.planning.events = localEvents;

    this.planningService.updateTask(this.planning)
      .pipe(take<Planning>(1))
      .subscribe((updated: Planning) => this.planning = updated);

  }

  drop(event: any) {

    this.isDragging = false;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (this.countChecked(false) != 0) {

      //Add all selected members to current planning
      for (let m of this.membersList) {
        if (m.checked && this.joinedMembers.findIndex(member => member.id == m.id) == -1) {

          //Push into joined members, disable checked state, sort maybe
          this.joinedMembers.push(Object.assign({}, m));
          this.joinedMembers[this.joinedMembers.length - 1].checked = false;
        }
      }
    } else {

      //Drop single member
      if (this.joinedMembers.findIndex(m => m.id == event.previousContainer.data[event.previousIndex].id) == -1)
        this.joinedMembers.push(Object.assign({}, event.previousContainer.data[event.previousIndex]));
    }

    // Unchecked all
    for (let i in this.membersList) {
      this.membersList[i].checked = false;
    }
    this.isCopyAllMembers = false;
  }

  onDragStarted(event: CdkDragStart, index: number): void {
    this.isDragging = true;
  }


  //Refresh selected members Array
  // public onTouch(event: any, idx: number): void {
  //
  //   this.selectedMembers = [];
  //   for (let i in this.membersList) {
  //     if (this.membersList[i].checked) {
  //       this.selectedMembers.push(this.membersList[i]);
  //     }
  //   }
  // }

  public updateAllChecked(isJoined: boolean = true) {
    //For joined checkbox
    if (isJoined) this.isDeleteAllJoined = this.countChecked() == this.joinedMembers.length;
    //For members checkbox
    else this.isCopyAllMembers = this.countChecked(isJoined) == this.membersList.length;
  }

  public someChecked(isJoined: boolean = true): boolean {
    //For joined checkbox
    if (isJoined) return this.countChecked() > 0 && !this.isDeleteAllJoined;
    //For members checkbox
    return this.countChecked(isJoined) > 0 && !this.isCopyAllMembers;
  }

  public setAllJoinedChecked(isAllChecked: boolean): void {
    this.isDeleteAllJoined = isAllChecked;
    for (let i = 0; i < this.joinedMembers.length; i++)
      this.joinedMembers[i].checked = isAllChecked;

  }

  public setAllMembersChecked(isAllChecked: boolean): void {
    this.isCopyAllMembers = isAllChecked;
    for (let i = 0; i < this.membersList.length; i++)
      this.membersList[i].checked = isAllChecked;
  }

  //How much checked joined members
  public countChecked(isJoined: boolean = true): number {
    let res = 0;
    //For joined checkbox
    if (isJoined) this.joinedMembers.map(m => m.checked ? res++ : {});
    //For members checkbox
    else this.membersList.map(m => m.checked ? res++ : {});
    return res;
  }

  public noReturnPredicate(): boolean {
    return false;
  }

  test() {
    console.log(this.joinedMembers);
  }

}
