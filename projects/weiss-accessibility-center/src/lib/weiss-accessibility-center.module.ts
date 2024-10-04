import { NgModule } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeissAccessibilityCenterComponent } from './weiss-accessibility-center.component';
import { WeissAccessibilityToggleDirective } from './weiss-accessibility-center.directive';
import { WeissAccessibilityCenterService } from './weiss-accessibility-center.service';
import { PanelComponent } from './templates/panel/panel.component';
import { StripComponent } from './templates/strip/strip.component';

@NgModule({
  declarations: [
    WeissAccessibilityCenterComponent,
    WeissAccessibilityToggleDirective,
    StripComponent,
    PanelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AsyncPipe
  ],
  providers: [WeissAccessibilityCenterService],
  exports: [
    WeissAccessibilityCenterComponent,
    WeissAccessibilityToggleDirective
  ]
})
export class WeissAccessibilityCenterModule { }
