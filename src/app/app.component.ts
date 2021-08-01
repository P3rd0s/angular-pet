import {Component} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {PlanningService} from "./services/planning.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  public addPlanning():void{
    this.planningsService.openDialogCall(true);
  }

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private planningsService: PlanningService) {
    this.matIconRegistry.addSvgIcon('add',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/add.svg`));
    this.matIconRegistry.addSvgIcon('planning',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/planning.svg`));
    this.matIconRegistry.addSvgIcon('search',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/search.svg`));
    this.matIconRegistry.addSvgIcon('expand',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/expand.svg`));
    this.matIconRegistry.addSvgIcon('filter',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/filter.svg`));
    this.matIconRegistry.addSvgIcon('x',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/x.svg`));
    this.matIconRegistry.addSvgIcon('progress',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/progress.svg`));
    this.matIconRegistry.addSvgIcon('ok',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/ok.svg`));
    this.matIconRegistry.addSvgIcon('edit',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/edit.svg`));
    this.matIconRegistry.addSvgIcon('del',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/del.svg`));
    this.matIconRegistry.addSvgIcon('trashbox',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/trashbox.svg`));
    this.matIconRegistry.addSvgIcon('trainer',this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/trainer.svg`));
  }
  title = 'test-project';
}
