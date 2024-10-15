import { NgModule } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeissAccessibilityCenterComponent } from './weiss-accessibility-center.component';
import { WeissAccessibilityToggleDirective } from './weiss-accessibility-center.directive';
import { WeissAccessibilityCenterService } from './weiss-accessibility-center.service';
import { PanelComponent } from './templates/panel/panel.component';
import { StripComponent } from './templates/strip/strip.component';
import * as i0 from "@angular/core";
export class WeissAccessibilityCenterModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: WeissAccessibilityCenterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.7", ngImport: i0, type: WeissAccessibilityCenterModule, declarations: [WeissAccessibilityCenterComponent,
            WeissAccessibilityToggleDirective,
            StripComponent,
            PanelComponent], imports: [CommonModule,
            FormsModule,
            AsyncPipe], exports: [WeissAccessibilityCenterComponent,
            WeissAccessibilityToggleDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: WeissAccessibilityCenterModule, providers: [WeissAccessibilityCenterService], imports: [CommonModule,
            FormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: WeissAccessibilityCenterModule, decorators: [{
            type: NgModule,
            args: [{
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
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIvc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzFELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMzRixPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMzRixPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDbkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1DQUFtQyxDQUFDOztBQW9CbkUsTUFBTSxPQUFPLDhCQUE4Qjs4R0FBOUIsOEJBQThCOytHQUE5Qiw4QkFBOEIsaUJBaEJ2QyxpQ0FBaUM7WUFDakMsaUNBQWlDO1lBQ2pDLGNBQWM7WUFDZCxjQUFjLGFBR2QsWUFBWTtZQUNaLFdBQVc7WUFDWCxTQUFTLGFBSVQsaUNBQWlDO1lBQ2pDLGlDQUFpQzsrR0FHeEIsOEJBQThCLGFBTjlCLENBQUMsK0JBQStCLENBQUMsWUFKMUMsWUFBWTtZQUNaLFdBQVc7OzJGQVNGLDhCQUE4QjtrQkFsQjFDLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLGlDQUFpQzt3QkFDakMsaUNBQWlDO3dCQUNqQyxjQUFjO3dCQUNkLGNBQWM7cUJBQ2Y7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxTQUFTO3FCQUNWO29CQUNELFNBQVMsRUFBRSxDQUFDLCtCQUErQixDQUFDO29CQUM1QyxPQUFPLEVBQUU7d0JBQ1AsaUNBQWlDO3dCQUNqQyxpQ0FBaUM7cUJBQ2xDO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSwgQXN5bmNQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyQ29tcG9uZW50IH0gZnJvbSAnLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgV2Vpc3NBY2Nlc3NpYmlsaXR5VG9nZ2xlRGlyZWN0aXZlIH0gZnJvbSAnLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSB9IGZyb20gJy4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQYW5lbENvbXBvbmVudCB9IGZyb20gJy4vdGVtcGxhdGVzL3BhbmVsL3BhbmVsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTdHJpcENvbXBvbmVudCB9IGZyb20gJy4vdGVtcGxhdGVzL3N0cmlwL3N0cmlwLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlckNvbXBvbmVudCxcbiAgICBXZWlzc0FjY2Vzc2liaWxpdHlUb2dnbGVEaXJlY3RpdmUsXG4gICAgU3RyaXBDb21wb25lbnQsXG4gICAgUGFuZWxDb21wb25lbnQsXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgQXN5bmNQaXBlXG4gIF0sXG4gIHByb3ZpZGVyczogW1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2VdLFxuICBleHBvcnRzOiBbXG4gICAgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyQ29tcG9uZW50LFxuICAgIFdlaXNzQWNjZXNzaWJpbGl0eVRvZ2dsZURpcmVjdGl2ZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlck1vZHVsZSB7IH1cbiJdfQ==