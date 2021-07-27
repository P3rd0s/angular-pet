import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: 'planning',loadChildren: () => import('./pages/planning/planning.module').then(m => m.PlanningModule)},
  {path: '', redirectTo: 'planning', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
