import { SimpleChanges, OnDestroy, AfterViewInit, Renderer2, ElementRef } from "@angular/core";
import { AccessibilityOptions, DisplayType, ModuleOptions, ModuleTypes, PanelData, PositionOptions } from "./weiss-accessibility-center.interfaces";
import { WeissAccessibilityCenterService } from "./weiss-accessibility-center.service";
import * as i0 from "@angular/core";
export declare class WeissAccessibilityCenterComponent implements OnDestroy, AfterViewInit {
    weissAccessibilityCenterService: WeissAccessibilityCenterService;
    private renderer;
    centerEl: ElementRef<HTMLElement>;
    options: AccessibilityOptions | undefined;
    title: string | undefined;
    description: string | undefined;
    displayType: DisplayType | undefined;
    overlay: boolean | undefined;
    position: PositionOptions | undefined;
    modules: ModuleTypes[] | undefined;
    fontSize: ModuleOptions | undefined;
    theme: ModuleOptions | undefined;
    spacing: ModuleOptions | undefined;
    layout: ModuleOptions | undefined;
    multiSelectableAccordions: boolean | undefined;
    /**
     * Optional language map for custom translations. Example:
     * {
     *   en: { title: 'Accessibility', description: '...' },
     *   es: { title: 'Accesibilidad', description: '...' }
     * }
     */
    languageMap?: {
        [lang: string]: {
            [key: string]: string;
        };
    };
    /**
     * Currently selected language code
     */
    selectedLanguage?: string;
    currentOptions: AccessibilityOptions;
    showWeissAccessibilityCenter: boolean;
    data: PanelData | undefined;
    private firstFocusableElement;
    private lastFocusableElement;
    private focusableElementsString;
    statusMessage: string;
    forceCloseSelectionPanel: boolean;
    private focusTimeoutId;
    private destroy$;
    accessibleName: string;
    /**
     * Returns the translated string for a given key, using languageMap if available
     */
    getTranslation(key: string, fallback: string): string;
    constructor(weissAccessibilityCenterService: WeissAccessibilityCenterService, renderer: Renderer2);
    ngAfterViewInit(): void;
    onStatusMessageChange(newMessage: string): void;
    private scrollElementIntoView;
    handleKeyboardEvent(event: KeyboardEvent): void;
    ngOnChanges(changes: SimpleChanges): void;
    setupOptions(): void;
    buildData(): PanelData;
    private translationFn;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WeissAccessibilityCenterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WeissAccessibilityCenterComponent, "weiss-accessibility-center", never, { "options": { "alias": "options"; "required": false; }; "title": { "alias": "title"; "required": false; }; "description": { "alias": "description"; "required": false; }; "displayType": { "alias": "displayType"; "required": false; }; "overlay": { "alias": "overlay"; "required": false; }; "position": { "alias": "position"; "required": false; }; "modules": { "alias": "modules"; "required": false; }; "fontSize": { "alias": "fontSize"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "spacing": { "alias": "spacing"; "required": false; }; "layout": { "alias": "layout"; "required": false; }; "multiSelectableAccordions": { "alias": "multiSelectableAccordions"; "required": false; }; "languageMap": { "alias": "languageMap"; "required": false; }; "selectedLanguage": { "alias": "selectedLanguage"; "required": false; }; }, {}, never, never, false, never>;
}
