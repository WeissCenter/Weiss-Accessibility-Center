import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DisplayType,
  ModuleTypes,
  PositionOptions,
  WeissAccessibilityCenterComponent,
  WeissAccessibilityCenterService,
  WeissAccessibilityToggleDirective,
} from '../../../src/public-api';
import {
  buildPlaygroundOptions,
  DEFAULT_MODULE_SELECTION,
  ModuleSelection,
  PlaygroundControls,
} from '../../playground-options';

@Component({
  selector: 'demo-root',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    FormsModule,
    WeissAccessibilityCenterComponent,
    WeissAccessibilityToggleDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly accessibilityCenterService = inject(
    WeissAccessibilityCenterService
  );

  readonly settings$ =
    this.accessibilityCenterService.weissAccessibilitySettings$;

  readonly moduleKeys: ModuleTypes[] = [
    'fontSize',
    'theme',
    'spacing',
    'layout',
    'language',
  ];
  readonly displayTypes: Array<Exclude<DisplayType, 'popover'>> = [
    'panel',
    'strip',
  ];
  readonly positions: PositionOptions[] = ['end', 'start', 'right', 'left'];

  readonly moduleLabels: Record<ModuleTypes, string> = {
    fontSize: 'Text size',
    theme: 'Color theme',
    spacing: 'Spacing',
    layout: 'Layout',
    language: 'Language',
  };

  controls: PlaygroundControls = {
    displayType: 'panel',
    overlay: true,
    position: 'end',
    multiSelectableAccordions: false,
    modules: { ...DEFAULT_MODULE_SELECTION },
  };

  options = buildPlaygroundOptions(this.controls);

  syncOptions(): void {
    this.options = buildPlaygroundOptions({
      ...this.controls,
      modules: { ...this.controls.modules },
    });
  }

  moduleDescription(module: ModuleTypes): string {
    const descriptions: Record<ModuleTypes, string> = {
      fontSize: 'Render text-size controls.',
      theme: 'Render color-theme controls.',
      spacing: 'Render spacing controls.',
      layout: 'Render layout controls.',
      language: 'Render language controls.',
    };

    return descriptions[module];
  }

  toggleModule(module: ModuleTypes, checked: boolean): void {
    this.controls.modules = {
      ...this.controls.modules,
      [module]: checked,
    } as ModuleSelection;
    this.syncOptions();
  }
}
