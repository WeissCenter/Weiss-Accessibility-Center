import { Observable } from 'rxjs';
import * as i0 from '@angular/core';
import { OnDestroy, AfterViewInit, ElementRef, Renderer2, SimpleChanges, OnInit, OnChanges, EventEmitter, QueryList } from '@angular/core';
import * as i1 from '@angular/common';
import * as i2 from '@angular/forms';

type ModuleOptions = {
    title: string;
    description: string;
    data: ModuleDataOptions[];
};
type ModuleDataOptions = {
    name: string;
    value: string;
};
type PositionOptions = 'left' | 'right' | 'start' | 'end';
type AccessibilityOptions = {
    displayType?: DisplayType;
    overlay?: boolean;
    position?: PositionOptions;
    include?: ModuleTypes[];
    title?: string;
    description?: string;
    multiSelectableAccordions?: boolean;
    fontSize?: ModuleOptions;
    theme?: ModuleOptions;
    layout?: ModuleOptions;
    spacing?: ModuleOptions;
    language?: ModuleOptions;
};
type DisplayType = 'panel' | 'strip' | 'popover';
type ModuleTypes = 'fontSize' | 'theme' | 'layout' | 'spacing' | 'language';
interface WeissAccessibilitySettings {
    fontSize: string;
    theme: string;
    spacing: string;
    language: string;
    layout: string;
}
interface PanelData {
    title: string;
    description: string;
    position: PositionOptions;
    multiSelectableAccordions?: boolean;
    modules: {
        [key in ModuleTypes]?: ModuleOptions;
    };
}

declare class WeissAccessibilityCenterService {
    private document;
    private platformId;
    private isBrowser;
    weissAccessibilityThemes: ModuleDataOptions[];
    weissAccessibilityFontSizes: ModuleDataOptions[];
    weissAccessibilitySpacing: ModuleDataOptions[];
    weissAccessibilityLayouts: ModuleDataOptions[];
    weissAccessibilityLanguages: ModuleDataOptions[];
    defaultWeissAccessibilitySettings: WeissAccessibilitySettings;
    private defaultId;
    private targetIdSubject;
    readonly targetId$: Observable<string>;
    setTargetId(id: string | null): void;
    private accessibilitySettingsSubject;
    weissAccessibilitySettings$: Observable<WeissAccessibilitySettings>;
    private target;
    private showWeissAccessibilityCenter;
    showWeissAccessibilityCenter$: Observable<boolean>;
    toggleWeissAccessibilityCenter(targetElement?: HTMLElement | null, forceClose?: boolean): void;
    constructor(document: Document, platformId: Object);
    updateSettings(newSettings: Partial<WeissAccessibilitySettings>): void;
    getCurrentSettings(): WeissAccessibilitySettings;
    private getSavedSettings;
    private applySettings;
    resetSettings(onlyThese?: Array<keyof WeissAccessibilitySettings>): void;
    getBrowserLanguage(): string;
    normalizeLanguageCode(languageCode: string): string;
    getSupportedLanguage(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<WeissAccessibilityCenterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WeissAccessibilityCenterService>;
}

declare class WeissAccessibilityCenterComponent implements OnDestroy, AfterViewInit {
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
    get closeLabel(): string;
    get resetAllLabel(): string;
    get resetLabel(): string;
    get resetStatusMessage(): string;
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
    static ɵcmp: i0.ɵɵComponentDeclaration<WeissAccessibilityCenterComponent, "weiss-accessibility-center", never, { "options": { "alias": "options"; "required": false; }; "title": { "alias": "title"; "required": false; }; "description": { "alias": "description"; "required": false; }; "displayType": { "alias": "displayType"; "required": false; }; "overlay": { "alias": "overlay"; "required": false; }; "position": { "alias": "position"; "required": false; }; "modules": { "alias": "modules"; "required": false; }; "fontSize": { "alias": "fontSize"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "spacing": { "alias": "spacing"; "required": false; }; "layout": { "alias": "layout"; "required": false; }; "multiSelectableAccordions": { "alias": "multiSelectableAccordions"; "required": false; }; "languageMap": { "alias": "languageMap"; "required": false; }; "selectedLanguage": { "alias": "selectedLanguage"; "required": false; }; }, {}, never, never, true, never>;
}

declare class WeissAccessibilityToggleDirective implements OnInit, OnDestroy, OnChanges {
    private el;
    private renderer;
    private accessibilityService;
    targetId: string;
    private ariaExpanded;
    private subscription;
    constructor(el: ElementRef, renderer: Renderer2, accessibilityService: WeissAccessibilityCenterService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private pushTargetIdToService;
    private updateAriaControls;
    private makeElementFocusable;
    onClick(target: HTMLElement): void;
    onKeyDown(event: KeyboardEvent): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WeissAccessibilityToggleDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WeissAccessibilityToggleDirective, "[weissA11yToggle]", never, { "targetId": { "alias": "weissA11yToggle"; "required": false; }; }, {}, never, never, true, never>;
}

declare class StripComponent {
    weissAccessibilityCenterService: WeissAccessibilityCenterService;
    data: PanelData | undefined;
    closeLabel?: string;
    resetLabel?: string;
    resetStatusMessage?: string;
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
    static ɵcmp: i0.ɵɵComponentDeclaration<StripComponent, "weiss-accessibility-strip", never, { "data": { "alias": "data"; "required": false; }; "closeLabel": { "alias": "closeLabel"; "required": false; }; "resetLabel": { "alias": "resetLabel"; "required": false; }; "resetStatusMessage": { "alias": "resetStatusMessage"; "required": false; }; "closeSelectionPanel": { "alias": "closeSelectionPanel"; "required": false; }; }, { "statusMessageChange": "statusMessageChange"; }, never, never, true, never>;
}

declare class PanelComponent {
    weissAccessibilityCenterService: WeissAccessibilityCenterService;
    data: PanelData | undefined;
    closeLabel?: string;
    resetAllLabel?: string;
    resetStatusMessage?: string;
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
    static ɵcmp: i0.ɵɵComponentDeclaration<PanelComponent, "weiss-accessibility-panel", never, { "data": { "alias": "data"; "required": false; }; "closeLabel": { "alias": "closeLabel"; "required": false; }; "resetAllLabel": { "alias": "resetAllLabel"; "required": false; }; "resetStatusMessage": { "alias": "resetStatusMessage"; "required": false; }; }, { "statusMessageChange": "statusMessageChange"; }, never, never, true, never>;
}

declare class WeissAccessibilityCenterModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<WeissAccessibilityCenterModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<WeissAccessibilityCenterModule, never, [typeof i1.CommonModule, typeof i2.FormsModule, typeof i1.AsyncPipe, typeof WeissAccessibilityCenterComponent, typeof WeissAccessibilityToggleDirective, typeof StripComponent, typeof PanelComponent], [typeof WeissAccessibilityCenterComponent, typeof WeissAccessibilityToggleDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<WeissAccessibilityCenterModule>;
}

export { WeissAccessibilityCenterComponent, WeissAccessibilityCenterModule, WeissAccessibilityCenterService, WeissAccessibilityToggleDirective };
export type { AccessibilityOptions, DisplayType, ModuleDataOptions, ModuleOptions, ModuleTypes, PanelData, PositionOptions, WeissAccessibilitySettings };
