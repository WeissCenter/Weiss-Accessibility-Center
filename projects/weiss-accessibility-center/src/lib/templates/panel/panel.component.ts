import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  PanelData,
  ModuleTypes,
} from '../../weiss-accessibility-center.interfaces';
import { WeissAccessibilityCenterService } from '../../weiss-accessibility-center.service';

@Component({
  selector: 'weiss-accessibility-panel',
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PanelComponent {
  @Input() data: PanelData | undefined;
  @Output() statusMessageChange = new EventEmitter<string>();

  public moduleKeys: ModuleTypes[] = [];

  public expand: { [key in ModuleTypes]?: boolean } = {};

  public toggleExpand(item: ModuleTypes): void {
    // Close all other modules
    this.moduleKeys.forEach((module) => {
      if (module !== item) this.expand[module] = false;
    });
    this.expand[item] = !this.expand[item];
  }

  constructor(
    public weissAccessibilityCenterService: WeissAccessibilityCenterService
  ) {}

  public close(): void {
    this.weissAccessibilityCenterService.toggleWeissAccessibilityCenter(null, true);
  }

  ngOnInit() {
    if (this.data) {
      console.log(this.data);
      this.moduleKeys = Object.keys(this.data.modules) as ModuleTypes[];
      this.expand = this.moduleKeys.reduce((acc, module) => {
        acc[module] = false;
        return acc;
      }, {} as { [key in ModuleTypes]?: boolean });
    }
  }
}
