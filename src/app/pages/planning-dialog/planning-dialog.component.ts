import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PlanningDialogData} from "../planning/planning.component";
import {PlanningService} from "../../services/planning.service";
import {
  Event, Experience,
  getEnumKeys,
  Group,
  JoinCondition,
  Member,
  MemberFiltering,
  Planning, Position,
  ProgramTitle,
  Trainer
} from "../../interfaces/interfaces";
import {take} from "rxjs/operators";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {moveItemInArray} from "@angular/cdk/drag-drop";

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
  public groupEnum: typeof Group = Group;
  public positionEnum: typeof Position = Position;
  public experienceEnum: typeof Experience = Experience;
  getEnumKeys = getEnumKeys;

  //Search and filtering
  public searchText: string = '';
  public membersFilter: MemberFiltering = {
    group: -1,
    position: -1,
    experience: -1
  };

  public groupControl: FormControl = new FormControl();
  public positionControl: FormControl = new FormControl();
  public experienceControl: FormControl = new FormControl();

  //Visible search and filters fields
  public filtersDisplayed: any = {
    search: true,
    group: true,
    position: true,
    experience: true
  };



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
        this.joinedMembers = [...this.planning.members];//Object.assign(this.planning.members, {checked: false});

        if (this.planning.events.length) {
          //get 3 (last) events
          this.planning.events.slice(Math.max(this.planning.events.length - this.formArr.length, 0))
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

  public memberSubscription(list: Member[]): void {
    this.membersList = list;
    this.membersList.map(member => Object.assign(member, {checked: false}));
  }

  public getMembersList(): void {
    this.planningService.getMembers()
      .pipe(take<Member[]>(1))
      .subscribe(list => this.memberSubscription(list));

  }

  //**************************************************************************************************************
  //******************************-----------FILTERS HANDLER--------------****************************************
  //****************                                                                               ***************

  public activeFilters(): number {
    let res = 0;
    if (this.membersFilter.group !== -1) res++;
    if (this.membersFilter.position !== -1) res++;
    if (this.membersFilter.experience !== -1) res++;
    return res;
  }

  public resetFilters(): void {
    this.membersFilter = {
      group: -1,
      position: -1,
      experience: -1
    };
  }

  public filterHandler() {

    this.planningService.getParametrizedMembers(this.activeFilters() > 0
      ? this.membersFilter
      : undefined, this.searchText)
      .pipe(take<Member[]>(1))
      .subscribe(list => this.memberSubscription(list));
    this.isCopyAllMembers = false;
  }


  //**************************************************************************************************************
  //******************************------------EVENTS BLOCK----------------****************************************
  //****************                                                                               ***************

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

    //DELETE UNUSABLE PROP
    this.planning.members = this.joinedMembers.map(m => {
      delete m.checked;
      return m;
    });

    //Update data, put to server
    this.planningService.updateTask(this.planning)
      .pipe(take<Planning>(1))
      .subscribe((updated: Planning) => this.planning = updated);

  }


  //**************************************************************************************************************
  //******************************----------DRAG N DROP BLOCK-------------****************************************
  //****************                                                                               ***************

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

  public noReturnPredicate(): boolean {
    return false;
  }

  public deleteOneJoined(id: any): void {
    this.joinedMembers = this.joinedMembers.filter(m => m.id !== id);
  }

  public deleteCheckedJoined(): void {
    this.joinedMembers = this.joinedMembers.filter(m => !m.checked);
    this.isDeleteAllJoined = false;
  }


  //**************************************************************************************************************
  //******************************----------CHECKBOXES BLOCK--------------****************************************
  //****************                                                                               ***************

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

}
