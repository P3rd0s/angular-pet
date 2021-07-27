import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Sort} from "@angular/material/sort";
import {Months, Planning, ProgramTitle, TableFiltering, TablePlanning, Trainer} from "../interfaces/interfaces";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PlanningService {


  private planningUrl = 'api/plannings';
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public convertDate(date: Date): string {

    return (date.getDay() + ' '
      + Months[date.getMonth()] + ', '
      + date.toTimeString().slice(0, 5));
  }

  //Emulating backend calculations
  public getParametrizedTable(sort?: Sort, filter?: TableFiltering, search?: string): Observable<TablePlanning[]> {

    return this.getTasks().pipe(
      catchError(this.handleError<Planning[]>('get plannings table with filters/sort/search', [])),
      map<Planning[], TablePlanning[]>(plannings => {

        //Searching in some fields, if we have search string
        if (search) {
          plannings = plannings.filter((planning: Planning) => {
            let eventsLen = planning.events.length;
            //last event - actual and latest
            if ((eventsLen && (this.convertDate(new Date(planning.events[eventsLen - 1].date)).indexOf(search) !== -1))
              || ProgramTitle[planning.title].indexOf(search) !== -1) return true;
            return false;
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

            if ( //1st line - check filter active, 2nd line, check filter

              //By program title (name)
              (filter.programTitle !== -1
                && filter.programTitle !== planning.title)

              //By program title (name)
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
              && (Trainer[(planning.events[len - 1].trainer)]).indexOf(filter.trainer) === -1)

            ) return false;

            return true
          })
        }

        if (plannings.length == 0) return [];

        let table: TablePlanning[] = [];


        plannings.map(planning => {

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

          table.push(tableRow);
        })

        //sorting
        table = sort
          ? table.sort((d1: any, d2: any) => this.compare(d1[sort.active], d2[sort.active], sort.direction === 'asc'))
          : table

        return table;
      })
    );
  }


  //******************************************************************************************************************
  //DEVICES' METHODS
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

  public constructor(private http: HttpClient) {
  }
}
