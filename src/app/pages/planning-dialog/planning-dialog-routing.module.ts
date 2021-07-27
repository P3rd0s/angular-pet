import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanningDialogComponent } from './planning-dialog.component';

const routes: Routes = [{ path: '', component: PlanningDialogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningDialogRoutingModule { }
