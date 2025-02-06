import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ViewChildren,
  ElementRef,
  QueryList,
  ViewChild,
  SimpleChanges,
} from "@angular/core";
import {
  PanelData,
  ModuleTypes,
} from "../../weiss-accessibility-center.interfaces";
import { WeissAccessibilityCenterService } from "../../weiss-accessibility-center.service";

@Component({
  selector: "weiss-accessibility-panel",
  templateUrl: "./panel.component.html",
  styleUrl: "./panel.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class PanelComponent {
  @Input() data: PanelData | undefined;
  @Output() statusMessageChange = new EventEmitter<string>();
  @ViewChild("accessibilityPanel") panelContent!: ElementRef;
  @ViewChildren("accordionButton") accordionButtons!: QueryList<ElementRef>;

  multiSelectable: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.multiSelectable = this.data.multiSelectableAccordions ?? false;
    }
  }

  private scrollElementIntoView(element: Element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  handleKeyboardEvent(event: KeyboardEvent, sectionId: string) {
    // Check if the key pressed is Enter or Space
    if (event.key === "Enter" || event.key === " ") {
      // Wait for DOM update
      setTimeout(() => {
        const contentElement = document.getElementById(sectionId);
        if (contentElement && this.expand[sectionId]) {
          this.scrollElementIntoView(contentElement);
        }
      }, 0);
    }
  }

  public moduleKeys: ModuleTypes[] = [];

  public expand: { [key in ModuleTypes]?: boolean } = {};

  constructor(
    public weissAccessibilityCenterService: WeissAccessibilityCenterService
  ) {}

  public close(): void {
    this.weissAccessibilityCenterService.toggleWeissAccessibilityCenter(
      null,
      true
    );
  }

  ngOnInit() {
    if (this.data) {
      this.multiSelectable = this.data.multiSelectableAccordions?? false;
      this.moduleKeys = Object.keys(this.data.modules) as ModuleTypes[];
      this.expand = this.moduleKeys.reduce((acc, module) => {
        acc[module] = false;
        return acc;
      }, {} as { [key in ModuleTypes]?: boolean });
    }
  }

}
