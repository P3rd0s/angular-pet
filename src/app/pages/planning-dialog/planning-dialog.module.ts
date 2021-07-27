import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningDialogRoutingModule } from './planning-dialog-routing.module';
import { PlanningDialogComponent } from './planning-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    PlanningDialogComponent
  ],
    imports: [
        CommonModule,
        PlanningDialogRoutingModule,
        MatDialogModule
    ]
})
export class PlanningDialogModule { }
