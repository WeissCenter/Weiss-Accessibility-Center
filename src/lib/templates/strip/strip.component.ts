import { Component, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { WeissAccessibilityCenterService } from '../../weiss-accessibility-center.service';
import { WeissAccessibilitySettings, ModuleTypes, PanelData } from '../../weiss-accessibility-center.interfaces';

@Component({
  selector: 'weiss-accessibility-strip',
  templateUrl: './strip.component.html',
  styleUrl: './strip.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class StripComponent {
  @Input() data: PanelData | undefined;
  @Input() closeLabel?: string;
  @Input() resetLabel?: string;
  @Input() resetStatusMessage?: string;
  @Output() statusMessageChange = new EventEmitter<string>();

  public moduleKeys: ModuleTypes[] = [];

  public selectedModule: ModuleTypes | undefined = undefined;

  public dynamicTabIndex: number = 3;
  
  @Input() closeSelectionPanel:boolean = false;
  public showSelectionPanel:boolean = false;

  public toggleModule(item: ModuleTypes): void {
    // Open selection panel if not already open
    // Close selection panel if open and selected module is already open
    // Otherwise, leave panel open and update selected module
    if (!this.showSelectionPanel) {
      this.showSelectionPanel = true;
    } else if (this.selectedModule === item) {
      this.showSelectionPanel = false;
    }
    this.selectedModule = item;
  }

  get dynamicTabIndexValue(): number {
    let tabIndex:number = -1;
    if (this.selectedModule === 'fontSize') {
      tabIndex = 3;
    } else if (this.selectedModule === 'spacing') {
      tabIndex = 5;
    } else if (this.selectedModule === 'theme') {
      tabIndex = 7;
    } else if (this.selectedModule === 'layout') {
      tabIndex = 9;
    }
    return tabIndex;
  }

  constructor(
    public weissAccessibilityCenterService: WeissAccessibilityCenterService
  ) {}

  public close(): void {
    this.weissAccessibilityCenterService.toggleWeissAccessibilityCenter(null, true);
  }

  onSettingsChange(module: ModuleTypes, value: string): void {
    // Create an object with the dynamic key and updated value
    const updatedSettings: Partial<WeissAccessibilitySettings> = { [module]: value };

    // Call the service to update the settings with the dynamic key
    this.weissAccessibilityCenterService.updateSettings(updatedSettings);
  }

  ngOnInit() {
    if (this.data) {
      console.log(this.data);
      this.moduleKeys = Object.keys(this.data.modules) as ModuleTypes[];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['closeSelectionPanel'] &&
      changes['closeSelectionPanel'].currentValue === true
    ) {
      this.showSelectionPanel = false;
    }
  }
}
