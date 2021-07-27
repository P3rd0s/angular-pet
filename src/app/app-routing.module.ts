import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlanningDialogModule} from "./pages/planning-dialog/planning-dialog.module";

const routes: Routes = [
  {path: 'planning',loadChildren: () => import('./pages/planning/planning.module').then(m => m.PlanningModule)},
  {path: '', redirectTo: 'planning', pathMatch: 'full'},
  { path: 'planning-dialog', loadChildren: () => import('./pages/planning-dialog/planning-dialog.module').then(m => m.PlanningDialogModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
