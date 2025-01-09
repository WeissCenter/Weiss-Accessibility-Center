# Weiss Accessibility Center

**USWDS+ is required to use the Weiss Accessibility Center**
  
A reusable Angular component for managing accessibility options such as font size, theme, layout, spacing, and language. The component allows for flexible configuration with default options that can be customized or overridden as needed.

  

## Features

  

-  **Adjustable Font Size**: Users can adjust text size for improved readability.

-  **Theme Switching**: Choose between predefined themes (e.g., light and dark).

-  **Layout Customization**: Modify layout for user comfort.

-  **Spacing Control**: Adjust spacing between elements.

-  **Flexible Configuration**: Build off of default options or pass in specific, partial configurations.

  

## Installation

  

Install the package directly from the GitHub repository via npm:

  

```bash

npm install git+https://github.com/WeissCenter/Weiss-Accessibility-Center#v1.0.1

```

  

## Usage

### 1. Import the Module

  

In your Angular project, import the `WeissAccessibilityCenterModule` into your app’s module:

  

```typescript

import { WeissAccessibilityCenterModule } from  'weiss-accessibility-center';

@NgModule({
declarations: [...],
imports: [
WeissAccessibilityCenterModule,
...
],
bootstrap: [AppComponent]
})

export  class  AppModule {}

```

In your project's main stylesheet, import the accessibility center styles:

```scss

@import '../node_modules/weiss-accessibility-center/assets/index.scss';

```

  

### 2. Add the Component

  

Add the <weiss-accessibility-center> component to your template. The options object builds off of default settings, meaning you can pass in specific options or override them as needed:

  

```html

<weiss-accessibility-center  [options]="options"></weiss-accessibility-center>

```

  

**Example of Passing a Specific Option:**

You can also pass individual options directly in the template:

  

```html

<weiss-accessibility-center  [displayType]="'strip'"></weiss-accessibility-center>

```

  

### 3. Configure the Options

  

The options object can be partial or full. Defaults are built into the component, and you can override specific parts as needed:

  

```typescript

this.options = {
  displayType: 'panel', // Can be 'panel' or 'strip'
  overlay: true,
  position: 'right',
  include: ['fontSize', 'theme', 'spacing'],
  fontSize: {
    title: 'Font Size',
    description: 'Adjust the font size.',
    data: [
      { name: 'Small', value: 'small' },
      { name: 'Medium', value: 'medium' },
      { name: 'Large', value: 'large' }
    ]
  },
  theme: {
    title: 'Theme',
    description: 'Switch between themes.',
    data: [
      { name: 'Light', value: 'light' },
      { name: 'Dark', value: 'dark' }
    ]
  }
};

```

  

### 4. Accessing Default Module Data from the Service

You can retrieve the default arrays for the module data directly from the WeissAccessibilityCenterService. This allows for dynamic access to default values, enabling flexibility in setting up the accessibility modules:

  

```typescript

import { WeissAccessibilityCenterService } from  'weiss-accessibility-center';

constructor(private weissAccessibilityCenterService: WeissAccessibilityCenterService) {}

ngOnInit(): void {
  // Access default font size settings
  this.fontSizeDefaults = this.weissAccessibilityCenterService.getDefaultFontSizeOptions();
  // Access other default module data similarly
  this.themeDefaults = this.weissAccessibilityCenterService.getDefaultThemeOptions();
}

```

  

### 5. Use the Directive to Toggle the Accessibility Center

You can use the weissA11yToggle directive on any button or focusable element to toggle the visibility of the Accessibility Center:

```html

<button  type="button"  class="usa-button"  weissA11yToggle>Toggle Accessibility Center</button>

```
  

### 6. Supported Accessibility Center Options

The options object supports customization for several modules such as font size, theme, spacing, layout, and language. You can either pass in custom values or rely on the default settings provided by the service.

| Property | Description  | Defaults
|:--|:--|:--|
| **title** | The title of the accessibility center | 'Accessibility Center'
| **description** | A brief description of the accessibility center | 'Adjust accessibility settings.'
| **displayType** | The display type of the accessibility center ('panel', 'strip') | 'panel'
| **overlay** | Whether to display an overlay when the accessibility center is open | true
| **position** | The position of the accessibility center ('left', 'right') | 'right'
| **include** | The modules to include in the accessibility center ('fontSize', 'spacing', 'theme', 'layout') | ['fontSize', 'theme', 'spacing']
| **fontSize** | The font size module configuration | See below
| **theme** | The theme module configuration | See below
| **spacing** | The spacing module configuration | See below
| **layout** | The layout module configuration | See below

### 7. Supported Font Size Options
The font size module supports customizing the font size options. You can pass in an array of objects with a name and value for each option:

```typescript
fontSize: {
  title: 'Font Size',
  description: 'Adjust the font size.',
  data: [
    { name: 'Small', value: 'small' },
    { name: 'Medium', value: 'medium' },
    { name: 'Large', value: 'large' }
  ]
}
```

### 8. Supported Theme Options
The theme module supports customizing the theme options. You can pass in an array
of objects with a name and value for each option:

```typescript
theme: {
  title: 'Theme',
  description: 'Switch between themes.',
  data: [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' }
  ]
}
```

### 9. Supported Spacing Options
The spacing module supports customizing the spacing options. You can pass in an array of objects with a name and value for each option:

```typescript
spacing: {
  title: 'Spacing',
  description: 'Adjust the spacing between elements.',
  data: [
    { name: 'Small', value: 'small' },
    { name: 'Medium', value: 'medium' },
    { name: 'Large', value: 'large' }
  ]
}
```

### 10. Supported Layout Options
The layout module supports customizing the layout options. You can pass in an array
of objects with a name and value for each option:

```typescript
layout: {
  title: 'Layout',
  description: 'Modify the layout for user comfort.',
  data: [
    { name: 'Standard', value: 'standard' },
    { name: 'Compact', value: 'compact' }
  ]
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


