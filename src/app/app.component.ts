import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {PlanningComponent} from "./pages/planning/planning.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
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
  }
  title = 'test-project';
}
