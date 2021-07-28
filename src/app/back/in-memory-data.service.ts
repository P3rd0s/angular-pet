import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import {
  Event,
  Experience,
  Group,
  Member,
  Planning,
  Position,
  Trainer,
  ProgramTitle, JoinCondition
} from "../interfaces/interfaces";


@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {


  createDb() {

    const events: Event[] = [
      {
        eventName: 'Главные правила продаж',
        trainer: Trainer["Сергей Ефремов"],
        date: new Date('November 4, 2021 09:00:00')
      },
      {
        eventName: 'Как устроиться на работу',
        trainer: Trainer["Иван Петров"],
        date: new Date('May 18, 2021 19:00:00')
      }
    ];

    const members: Member[] = [
      {
        name: 'Павел Овчинников',
        group: Group["Участники мероприятия"],
        position: Position["Ментор"],
        experience: Experience["1 - 3 года"]
      },
      {
        name: 'Андрей Андреев',
        group: Group["Участники мероприятия"],
        position: Position["Специалист по безопасности"],
        experience: Experience["1 - 3 года"]
      },
      {
        name: 'Алексей Антонов',
        group: Group["Администрирование"],
        position: Position["Менеджер по персоналу"],
        experience: Experience["3 - 10 лет"]
      }
    ];

    const plannings: Planning[] = [
      {
      id: 0,
      title: ProgramTitle["Страхование с заботой о клиенте"],
      progress: 88,

      events: [events[0]],

      joinCondition: JoinCondition["Не использовать код доступа"],

      members: members
      },
      {
        id: 1,
        title: ProgramTitle["Вклады: теория и практика"],
        progress: 41,

        events: [events[1]],

        joinCondition: JoinCondition["Не требовать регистрацию, имя и фамилию"],

        members: members
      }
    ];
    return {plannings};
  }

  genId(plannigs: Planning[]): number {

    return plannigs.length > 0 ? Math.max(...plannigs.map(p => p.id)) + 1 : 0;
  }


}
