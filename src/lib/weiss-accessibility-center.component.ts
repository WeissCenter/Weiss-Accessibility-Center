import {
  Component,
  HostListener,
  Input,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  AfterViewInit,
  Renderer2,
  ElementRef
} from "@angular/core";
import {
  AccessibilityOptions,
  DisplayType,
  ModuleOptions,
  ModuleTypes,
  PanelData,
  PositionOptions,
} from "./weiss-accessibility-center.interfaces";
import { WeissAccessibilityCenterService } from "./weiss-accessibility-center.service";
import { createAccessibilityOptions } from "./weiss-accessibility-center.factory";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "weiss-accessibility-center",
  template: `
    <article
      role="dialog"
      aria-modal="true"
      [hidden]="!showWeissAccessibilityCenter"
      id="blargh"
      #center
    >
      <div
        class="background-overlay"
        *ngIf="currentOptions.overlay"
        (click)="
          weissAccessibilityCenterService.toggleWeissAccessibilityCenter(
            null,
            true
          )
        "
      ></div>
      <ng-container *ngIf="currentOptions.displayType === 'panel'">
        <weiss-accessibility-panel
          (statusMessageChange)="onStatusMessageChange($event)"
          [data]="data"
        ></weiss-accessibility-panel>
      </ng-container>
      <ng-container *ngIf="currentOptions.displayType === 'strip'">
        <weiss-accessibility-strip
          [closeSelectionPanel]="forceCloseSelectionPanel"
          (statusMessageChange)="onStatusMessageChange($event)"
          [data]="data"
        ></weiss-accessibility-strip>
      </ng-container>
      <ng-container *ngIf="currentOptions.displayType === 'popover'">
        <!-- <weiss-accessibility-popover></weiss-accessibility-popover> -->
      </ng-container>
      <div
        aria-live="polite"
        id="statusMessage"
        *ngIf="statusMessage"
        class="visually-hidden"
      >
        {{ statusMessage }}
      </div>
    </article>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WeissAccessibilityCenterComponent implements OnDestroy, AfterViewInit {
  @ViewChild("center", { read: ElementRef }) centerEl!: ElementRef<HTMLElement>;

  @Input() options: AccessibilityOptions | undefined;
  @Input() title: string | undefined;
  @Input() description: string | undefined;
  @Input() displayType: DisplayType | undefined;
  @Input() overlay: boolean | undefined;
  @Input() position: PositionOptions | undefined;
  @Input() modules: ModuleTypes[] | undefined;
  @Input() fontSize: ModuleOptions | undefined;
  @Input() theme: ModuleOptions | undefined;
  @Input() spacing: ModuleOptions | undefined;
  @Input() layout: ModuleOptions | undefined;
  @Input() multiSelectableAccordions: boolean | undefined;

  // Merged options object that will be used within the component
  currentOptions: AccessibilityOptions;

  public showWeissAccessibilityCenter = false;
  public data: PanelData | undefined;

  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;
  private focusableElementsString =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], li[tabindex="0"], li[tabindex="-1"], tr[tabindex="0"], tr[tabindex="-1"]';

  public statusMessage: string = "";
  public forceCloseSelectionPanel: boolean = false;

  private focusTimeoutId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public weissAccessibilityCenterService: WeissAccessibilityCenterService,
    private renderer: Renderer2
  ) {
    this.currentOptions = createAccessibilityOptions(
      this.weissAccessibilityCenterService
    );
    this.setupOptions();

    this.weissAccessibilityCenterService.showWeissAccessibilityCenter$
      .pipe(takeUntil(this.destroy$))
      .subscribe((show) => {
        this.showWeissAccessibilityCenter = show;
        this.forceCloseSelectionPanel = !show;

        if (!show && this.focusTimeoutId !== null) {
          clearTimeout(this.focusTimeoutId);
          this.focusTimeoutId = null;
        }

        if (show) {
          const focusableElements =
            this.centerEl?.nativeElement.querySelectorAll(
              this.focusableElementsString
            ) as NodeListOf<HTMLElement>;
          this.firstFocusableElement = focusableElements[0];
          this.lastFocusableElement =
            focusableElements[focusableElements.length - 1];

          this.focusTimeoutId = window.setTimeout(() => {
            this.firstFocusableElement?.focus();
            this.focusTimeoutId = null;
          }, 0);
        }
      });
  }

  ngAfterViewInit(): void {
    // Apply id to the actual <article> after it's in the DOM
    this.weissAccessibilityCenterService.targetId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        const value = id ?? 'weiss-accessibility-center';
        this.renderer.setAttribute(this.centerEl.nativeElement, 'id', value);
      });
  }

  // This method is triggered when the child component emits a new status message
  onStatusMessageChange(newMessage: string) {
    this.statusMessage = newMessage;
  }

  private scrollElementIntoView(element: Element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  // Close panel when user hits escape key
  // Trap focus within the accessibility center
  @HostListener("keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showWeissAccessibilityCenter) {
      const deepActiveElement = document.activeElement;
      if (event.key === "Tab") {
        if (event.shiftKey) {
          /* shift + tab */
          if (deepActiveElement === this.firstFocusableElement) {
            event.preventDefault();
            this.lastFocusableElement?.focus();
          }
        } else {
          /* tab */
          if (deepActiveElement === this.lastFocusableElement) {
            event.preventDefault();
            this.firstFocusableElement?.focus();
          }
        }
        this.scrollElementIntoView(deepActiveElement as Element);
      } else if (event.key === "Escape") {
        this.weissAccessibilityCenterService.toggleWeissAccessibilityCenter(
          null,
          true
        );
        this.statusMessage = "Accessibility center closed";
      } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        // Wait for DOM update
        setTimeout(() => {
          const activeElement = document.activeElement;
          if (
            activeElement &&
            this.centerEl.nativeElement.contains(activeElement)
          ) {
            this.scrollElementIntoView(activeElement);
          }
        }, 0);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["options"] &&
      changes["options"].currentValue !== changes["options"].previousValue
    ) {
      this.setupOptions();
    } else if (
      changes["title"] &&
      changes["title"].currentValue !== changes["title"].previousValue
    ) {
      this.setupOptions();
    } else if (
      changes["description"] &&
      changes["description"].currentValue !==
        changes["description"].previousValue
    ) {
      this.setupOptions();
    } else if (
      changes["displayType"] &&
      changes["displayType"].currentValue !==
        changes["displayType"].previousValue
    ) {
      this.setupOptions();
    } else if (
      changes["modules"] &&
      changes["modules"].currentValue !== changes["modules"].previousValue
    ) {
      this.setupOptions();
    } else if (
      changes["fontSize"] &&
      changes["fontSize"].currentValue !== changes["fontSize"].previousValue
    ) {
      this.setupOptions();
    } else if (
      changes["theme"] &&
      changes["theme"].currentValue !== changes["theme"].previousValue
    ) {
      this.setupOptions();
    } else if (
      changes["spacing"] &&
      changes["spacing"].currentValue !== changes["spacing"].previousValue
    ) {
      this.setupOptions();
    } else if (
      changes["layout"] &&
      changes["layout"].currentValue !== changes["layout"].previousValue
    ) {
      this.setupOptions();
    } else if (
      changes["overlay"] &&
      changes["overlay"].currentValue !== changes["overlay"].previousValue
    ) {
      this.setupOptions();
    } else if (
      changes["position"] &&
      changes["position"].currentValue !== changes["position"].previousValue
    ) {
      this.setupOptions();
    } else if (
      changes["multiSelectableAccordions"] &&
      changes["multiSelectableAccordions"].currentValue !==
        changes["multiSelectableAccordions"].previousValue
    ) {
      this.setupOptions();
    }
  }

  setupOptions() {
    // Merge the provided options with the default ones
    const mergedOptions = {
      ...createAccessibilityOptions(this.weissAccessibilityCenterService),
      ...this.options,
    };

    // If an option was passed individually, override in mergedOptions
    if (this.title) {
      mergedOptions.title = this.title;
    }
    if (this.description) {
      mergedOptions.description = this.description;
    }
    if (this.displayType) {
      mergedOptions.displayType = this.displayType;
    }
    if (this.overlay !== undefined) {
      mergedOptions.overlay = this.overlay;
    }
    if (this.multiSelectableAccordions) {
      mergedOptions.multiSelectableAccordions = this.multiSelectableAccordions;
    }
    if (this.position) {
      mergedOptions.position = this.position;
    }
    if (this.modules) {
      mergedOptions.include = this.modules;
    }
    if (this.fontSize) {
      mergedOptions.fontSize = this.fontSize;
      // If fontSize was passed in specifically, check to be sure it's included in the modules list. If not, add it.
      if (
        mergedOptions.include &&
        !mergedOptions.include.includes("fontSize")
      ) {
        mergedOptions.include.push("fontSize");
      }
    }
    if (this.theme) {
      mergedOptions.theme = this.theme;
      if (mergedOptions.include && !mergedOptions.include.includes("theme")) {
        mergedOptions.include.push("theme");
      }
    }
    if (this.spacing) {
      mergedOptions.spacing = this.spacing;
      if (mergedOptions.include && !mergedOptions.include.includes("spacing")) {
        mergedOptions.include.push("spacing");
      }
    }
    if (this.layout) {
      mergedOptions.layout = this.layout;
      if (mergedOptions.include && !mergedOptions.include.includes("layout")) {
        mergedOptions.include.push("layout");
      }
    }

    // Now store the final merged options
    this.currentOptions = mergedOptions;
    this.data = this.buildData();
  }

  buildData() {
    // Build the data object to pass to the panel
    // Determine which modules to include based on the current options
    const includedModules = this.currentOptions.include || [];
    let moduleData: PanelData["modules"] = {};
    includedModules.forEach((module: ModuleTypes) => {
      // Add the module to the data object
      moduleData[module] = this.currentOptions[module];
    });
    const data: PanelData = {
      title: this.currentOptions.title || "Accessibility settings",
      description:
        this.currentOptions.description ||
        "Adjust the settings below to customize the appearance of this website.",
      modules: moduleData,
      multiSelectableAccordions:
        this.currentOptions.multiSelectableAccordions || false,
      position: this.currentOptions.position || "end",
    };
    return data;
  }

  ngOnDestroy(): void {
    if (this.focusTimeoutId !== null) {
      clearTimeout(this.focusTimeoutId);
      this.focusTimeoutId = null;
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
