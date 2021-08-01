import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Sort} from "@angular/material/sort";
import {
  Member,
  MemberFiltering,
  Months,
  Planning,
  ProgramTitle,
  TableFiltering,
  TablePlanning,
  Trainer
} from "../interfaces/interfaces";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PlanningService {


  private planningUrl = 'api/plannings';
  private membersUrl = 'api/members';
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };



  //**************************************************************************************************************
  //******************************----------CALL NEW PLANNING-------------****************************************
  //****************                                                                               ***************
  private callNewPlanningDialog = new BehaviorSubject(false);
  callNewPlanningDialog$ = this.callNewPlanningDialog.asObservable();

  public openDialogCall(newVal: boolean):void {
    this.callNewPlanningDialog.next(newVal);
  }

  //**************************************************************************************************************
  //******************************----------HELPER FUNCTIONS--------------****************************************
  //****************                                                                               ***************
  private handleError<T>(operation:any = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  private static compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public convertDate(date: any): string {

    return (date.getDate() + ' '
      + Months[date.getMonth()] + ', '
      + (date.toTimeString().slice(0, 5)[0] == '0' ? date.toTimeString().slice(1, 5) : date.toTimeString().slice(0, 5)));
  }

  public planningToTableRow (planning: Planning): TablePlanning {
    let len = planning.events.length;
    let date = undefined;
    if (len) {
      date = new Date(planning.events[len - 1].date);
    }

    let tableRow: TablePlanning = {
      id: -1,
      date: new Date(0),
      title: '',
      membersCount: 0,
      trainer: '',
      progress: 0
    }
    if (len) {
      tableRow.date = new Date(date?.valueOf() || 0);
      tableRow.trainer = Trainer[planning.events[planning.events.length - 1].trainer];
    }
    tableRow.id = planning.id;
    tableRow.title = ProgramTitle[planning.title];
    tableRow.membersCount = planning.members.length;
    tableRow.progress = planning.progress;

    return tableRow;
  }

  //Emulating backend calculations (filtering, sorting, searching
  public getParametrizedTable(sort?: Sort, filter?: TableFiltering, search?: string): Observable<TablePlanning[]> {

    return this.getTasks().pipe(
      catchError(this.handleError<Planning[]>('get plannings table with filters/sort/search', [])),
      map<Planning[], TablePlanning[]>(plannings => {

        //Searching in some fields, if we have search string
        if (search) {
          plannings = plannings.filter((planning: Planning) => {
            let eventsLen = planning.events.length;
            //last event - actual and latest
            return (eventsLen && (this.convertDate(new Date(planning.events[eventsLen - 1].date)).indexOf(search) !== -1))
              || ProgramTitle[planning.title].indexOf(search) !== -1;

            //was simplified
            // if ((eventsLen && (this.convertDate(new Date(planning.events[eventsLen - 1].date)).indexOf(search) !== -1))
            //   || ProgramTitle[planning.title].indexOf(search) !== -1) return true;
            // return false;
          });
        }


        //Filtering by some types
        if (filter) {
          plannings = plannings.filter((planning: Planning) => {

            let len = planning.events.length;
            let date = undefined;
            if (len) {
              date = new Date(planning.events[len - 1].date);
            }

            return !(   // 1st line - if filter exist
                        // 2nd line - filtering

              //By program title
              (filter.programTitle !== -1
                && filter.programTitle !== planning.title)

              //By program status (active/completed)
              || ((filter.status === 1 && ((date?.getTime() || (Date.now() + 9999)) < Date.now()))
                || (filter.status === 2 && ((date?.getTime() || (Date.now() + 9999)) > Date.now())))

              //By period (month and year)
              || ((filter.period.valueOf() !== 0 && len !== 0)
                && (filter.period.getMonth() !== (date?.getMonth())
                  || filter.period.getFullYear() !== date?.getFullYear()))

              //By members count
              || (filter.membersCount !== -1
                && (filter.membersCount !== planning.members.length))

              //By trainer (in last available event, if exists)
              || ((filter.trainer !== '' && len !== 0)
                && (Trainer[(planning.events[len - 1].trainer)]).indexOf(filter.trainer) === -1));
          })
        }

        //No matches
        if (plannings.length == 0) return [];

        //Convert filtered plannings to table rows (special interface)
        let table: TablePlanning[] = [];
        plannings.map(planning => {
          table.push(this.planningToTableRow(planning));
        })

        //sorting
        table = sort
          ? table.sort((d1: any, d2: any) =>
            PlanningService.compare(d1[sort.active], d2[sort.active], sort.direction === 'asc'))
          : table

        return table;
      })
    );
  }

  public getParametrizedMembers(filter?: MemberFiltering, search?: string): Observable<Member[]> {
    return this.getMembers().pipe(
      //catchError(this.handleError<Member[]>('get members with filters/search', [])),
      map(members => {

        //Searching by name
        if (search) {
          members = members.filter(m => m.name.indexOf(search) !== -1);
        }


        //Filtering by some types
        if (filter) {
          members = members.filter((member: Member) => {

            return !(   // 1st line - if filter exist
                        // 2nd line - filtering

              //By group
              (filter.group !== -1
                && filter.group !== member.group)

              //By experience
              || (filter.experience !== -1
                && filter.experience !== member.experience)

              //By position
              || (filter.position !== -1
                && filter.position !== member.position));
          });
        }

        //No matches
        if (members.length == 0) return [];

        return members;
      })
    );
  }

  //**************************************************************************************************************
  //******************************-----------HTTP PLANNINGS---------------****************************************
  //****************                                                                               ***************
  public getTasks(): Observable<Planning[]> {
    return this.http.get<Planning[]>(this.planningUrl).pipe(
      catchError(this.handleError<Planning[]>('get plannings', []))
    );
  }


  public getTask(id: number): Observable<Planning> {
    const deviceURL = `${this.planningUrl}/${id}`;
    return this.http.get<Planning>(deviceURL).pipe(
      catchError(this.handleError<Planning>(`get planning id=${id}`))
    )
  }


  public updateTask(planning: Planning): Observable<Planning> {
    return this.http.put<Planning>(this.planningUrl, planning, this.httpOptions).pipe(
      catchError(this.handleError<any>(`update planning id=${planning.id}`))
    );
  }


  public addTask(planning: Planning): Observable<Planning> {
    return this.http.post<Planning>(this.planningUrl, planning, this.httpOptions).pipe(
      catchError(this.handleError<any>(`added planning id=${planning.id}`))
    );
  }


  public deleteTask(id: number): Observable<Planning> {
    const planningURL = `${this.planningUrl}/${id}`;
    return this.http.delete<Planning>(planningURL, this.httpOptions).pipe(
      catchError(this.handleError<Planning>(`deleted planning`))
    );
  }

  public getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.membersUrl).pipe(
      catchError(this.handleError<Member[]>('get members', []))
    );
  }

  public constructor(private http: HttpClient) {
  }
}
