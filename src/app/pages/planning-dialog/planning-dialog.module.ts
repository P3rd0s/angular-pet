import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningDialogRoutingModule } from './planning-dialog-routing.module';
import { PlanningDialogComponent } from './planning-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";

import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";


@NgModule({
  declarations: [
    PlanningDialogComponent
  ],
  imports: [
    CommonModule,
    PlanningDialogRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTabsModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,
    DragDropModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [
  ]
})
export class PlanningDialogModule { }
