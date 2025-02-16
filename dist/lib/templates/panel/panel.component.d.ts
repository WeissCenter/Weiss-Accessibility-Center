import { EventEmitter, ElementRef, QueryList, SimpleChanges } from "@angular/core";
import { PanelData, ModuleTypes } from "../../weiss-accessibility-center.interfaces";
import { WeissAccessibilityCenterService } from "../../weiss-accessibility-center.service";
import * as i0 from "@angular/core";
export declare class PanelComponent {
    weissAccessibilityCenterService: WeissAccessibilityCenterService;
    data: PanelData | undefined;
    statusMessageChange: EventEmitter<string>;
    panelContent: ElementRef;
    accordionButtons: QueryList<ElementRef>;
    multiSelectable: boolean;
    ngOnChanges(changes: SimpleChanges): void;
    private scrollElementIntoView;
    handleKeyboardEvent(event: KeyboardEvent, sectionId: string): void;
    moduleKeys: ModuleTypes[];
    expand: {
        [key in ModuleTypes]?: boolean;
    };
    constructor(weissAccessibilityCenterService: WeissAccessibilityCenterService);
    close(): void;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PanelComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PanelComponent, "weiss-accessibility-panel", never, { "data": { "alias": "data"; "required": false; }; }, { "statusMessageChange": "statusMessageChange"; }, never, never, false, never>;
}
