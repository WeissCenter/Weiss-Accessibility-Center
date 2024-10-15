import { EventEmitter, SimpleChanges } from '@angular/core';
import { WeissAccessibilityCenterService } from '../../weiss-accessibility-center.service';
import { ModuleTypes, PanelData } from '../../weiss-accessibility-center.interfaces';
import * as i0 from "@angular/core";
export declare class StripComponent {
    weissAccessibilityCenterService: WeissAccessibilityCenterService;
    data: PanelData | undefined;
    statusMessageChange: EventEmitter<string>;
    moduleKeys: ModuleTypes[];
    selectedModule: ModuleTypes | undefined;
    dynamicTabIndex: number;
    closeSelectionPanel: boolean;
    showSelectionPanel: boolean;
    toggleModule(item: ModuleTypes): void;
    get dynamicTabIndexValue(): number;
    constructor(weissAccessibilityCenterService: WeissAccessibilityCenterService);
    close(): void;
    onSettingsChange(module: ModuleTypes, value: string): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StripComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<StripComponent, "weiss-accessibility-strip", never, { "data": { "alias": "data"; "required": false; }; "closeSelectionPanel": { "alias": "closeSelectionPanel"; "required": false; }; }, { "statusMessageChange": "statusMessageChange"; }, never, never, false, never>;
}
//# sourceMappingURL=strip.component.d.ts.map