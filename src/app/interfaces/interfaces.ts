export enum ProgramTitle {
  'Страхование с заботой о клиенте',
  'Главные правила продаж',
  'Первичное обучение КС',
  'Вторичное обучение КС',
  'Вклады: теория и практика',
  'Очное обучение менеджеров'
}

export enum Trainer {
  'Сергей Ефремов',
  'Иван Петров',
  'Петр Иванов'
}

export enum EventType {
  'Тренинг',
  'Марафон'
}

export enum JoinCondition {
  'Не использовать код доступа',
  'Требовать регистрацию',
  'Запросить только имя и фамилию',
  'Не требовать регистрацию, имя и фамилию'
}

export enum Group {
  'Администрирование',
  'Участники мероприятия'
}

export enum Position {
  'Менеджер по персоналу',
  'Ментор',
  'Специалист по безопасности'
}

export enum Experience {
  'Без опыта',
  '1 - 3 года',
  '3 - 10 лет',
}

export enum Status {
  'Активные' = 1,
  'Завершены'
}

export enum Months {
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек'
}

export interface Event {
  eventName: string,
  eventType: EventType,
  trainer: Trainer,
  date: Date
}

export interface Member {
  name: string,
  group: Group,
  position: Position,
  experience: Experience
}


export interface Planning {
  id: number,
  title: ProgramTitle,
  progress: number,

  events:Event[],

  joinCondition: JoinCondition,

  members: Member[]


}

export interface TablePlanning {
  id: number,
  date: Date,
  title: string,
  membersCount: number,
  trainer: string,
  progress: number

}

export interface TableFiltering {
  programTitle: number,
  period: Date,
  membersCount: number,
  trainer: string,
  status: number
}
