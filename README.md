# Isntall and launch project
## In last version only 4 steps:
1. ng new proj (SCSS)
2. ng add @angular/material
3. npm install angular-in-memory-web-api --save
4. copy files to proj (скачать архив, распаковать, скопировать файлы в proj с заменой существующих)







 Один из вариантов для запуска проекта:
1. ng new proj (создать новый проект и перейти в него)
2. ng add @angular/material (выполнить в консоли, выбрать SCSS, установить анимации)
3. npm i moment
4. npm i @angular/material-moment-adatper
5. npm install --save-dev webpack
6. copy files to proj (скачать архив, распаковать, скопировать файлы в proj с заменой существующих)
7. npm install moment --save


ng serve

# Maing techonologies
In this project I used main technologies: 
- Angular Routing (lazy loading pages, in-memory-web-api, injectable)
- Angular Material (mat-dialog, mat-menu, etc)
- RxJS (Observable, take, pipe, etc)
- Customizing angular material with SCSS (custom drag and drop/copy few elements)

# Functional of the site
## Home Page
In main page we can see table with plannings. Also we can search some data in table with search input field, filtering table with some filters, and sorting by columns (mat-sort).
All filter/searching/sorting information arrives to plannings service, which make http get to "angular-in-memory-web-api". After getting data, service
emulate backend data processing (filtering, sorting, searching) in "pipe" method and return observable necessary data.
We can click on each row (planning) and choose, what we need to do with it: edit, or delete. If we click "edit", we get "Planning Editor Page".

## Planning Editor Page
This page created with two way using: edit existing planning and create new planning. Page consist of two mat-tabs:

### Events editor
In this tab we can choose planning name in mat-select, and type some events. If user not fill all event fields (name, date and time, trainer name), then it not save this event,
that is the logic of application. Event also created with opportunity upgrade in future: we can add button, which will allow creating new event fields. After this we could
add more than 3 events.

### Members editor
In this tab we can choose members, which will consist in current planning. In left side we have all existing users, we can find someone by searching and filtering,
After this, we can check users and drag and copy checked users to joined members. Don't worry, user, which already exist in joined members don't duplicate.
If we want to delete user, we can click del button, or check few users and delete.

After saving new planning will add to plannings table.

# TestProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
