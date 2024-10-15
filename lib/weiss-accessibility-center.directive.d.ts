import { ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { WeissAccessibilityCenterService } from './weiss-accessibility-center.service';
import * as i0 from "@angular/core";
export declare class WeissAccessibilityToggleDirective implements OnInit, OnDestroy {
    private el;
    private renderer;
    private accessibilityService;
    targetId: string;
    private ariaExpanded;
    private subscription;
    constructor(el: ElementRef, renderer: Renderer2, accessibilityService: WeissAccessibilityCenterService);
    ngOnInit(): void;
    private makeElementFocusable;
    onClick(target: HTMLElement): void;
    onKeyDown(event: KeyboardEvent): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WeissAccessibilityToggleDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WeissAccessibilityToggleDirective, "[weissA11yToggle]", never, { "targetId": { "alias": "weissA11yToggle"; "required": false; }; }, {}, never, never, false, never>;
}
//# sourceMappingURL=weiss-accessibility-center.directive.d.ts.map