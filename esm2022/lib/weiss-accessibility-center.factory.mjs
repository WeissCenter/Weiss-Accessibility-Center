export function createAccessibilityOptions(service) {
    return {
        displayType: 'panel',
        overlay: true,
        position: 'end',
        include: ['fontSize', 'theme', 'spacing', 'layout'],
        title: 'Accessibility settings',
        description: 'Adjust the settings below to customize the appearance of this website.',
        fontSize: {
            title: 'Text size',
            description: 'The text-size setting allows you to adjust how big or small the words appear on the screen.',
            data: service.weissAccessibilityFontSizes,
        },
        theme: {
            title: 'Color theme',
            description: 'The color theme setting allows you to adjust the color scheme of the website.',
            data: service.weissAccessibilityThemes,
        },
        spacing: {
            title: 'Spacing',
            description: 'The spacing setting lets you adjust the distance between elements on the page.',
            data: service.weissAccessibilitySpacing,
        },
        layout: {
            title: 'Layout',
            description: 'The layout setting allows you to change how content is arranged on the screen.',
            data: service.weissAccessibilityLayouts,
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyL3NyYy9saWIvd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLFVBQVUsMEJBQTBCLENBQUMsT0FBd0M7SUFDakYsT0FBTztRQUNMLFdBQVcsRUFBRSxPQUFPO1FBQ3BCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsUUFBUSxFQUFFLEtBQUs7UUFDZixPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUM7UUFDbkQsS0FBSyxFQUFFLHdCQUF3QjtRQUMvQixXQUFXLEVBQUUsd0VBQXdFO1FBQ3JGLFFBQVEsRUFBRTtZQUNSLEtBQUssRUFBRSxXQUFXO1lBQ2xCLFdBQVcsRUFBRSw2RkFBNkY7WUFDMUcsSUFBSSxFQUFFLE9BQU8sQ0FBQywyQkFBMkI7U0FDMUM7UUFDRCxLQUFLLEVBQUU7WUFDTCxLQUFLLEVBQUUsYUFBYTtZQUNwQixXQUFXLEVBQUUsK0VBQStFO1lBQzVGLElBQUksRUFBRSxPQUFPLENBQUMsd0JBQXdCO1NBQ3ZDO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsS0FBSyxFQUFFLFNBQVM7WUFDaEIsV0FBVyxFQUFFLGdGQUFnRjtZQUM3RixJQUFJLEVBQUUsT0FBTyxDQUFDLHlCQUF5QjtTQUN4QztRQUNELE1BQU0sRUFBRTtZQUNOLEtBQUssRUFBRSxRQUFRO1lBQ2YsV0FBVyxFQUFFLGdGQUFnRjtZQUM3RixJQUFJLEVBQUUsT0FBTyxDQUFDLHlCQUF5QjtTQUN4QztLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSB9IGZyb20gJy4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBY2Nlc3NpYmlsaXR5T3B0aW9ucyB9IGZyb20gJy4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuaW50ZXJmYWNlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyhzZXJ2aWNlOiBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlKTogQWNjZXNzaWJpbGl0eU9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIGRpc3BsYXlUeXBlOiAncGFuZWwnLFxuICAgIG92ZXJsYXk6IHRydWUsXG4gICAgcG9zaXRpb246ICdlbmQnLFxuICAgIGluY2x1ZGU6IFsnZm9udFNpemUnLCAndGhlbWUnLCAnc3BhY2luZycsICdsYXlvdXQnXSxcbiAgICB0aXRsZTogJ0FjY2Vzc2liaWxpdHkgc2V0dGluZ3MnLFxuICAgIGRlc2NyaXB0aW9uOiAnQWRqdXN0IHRoZSBzZXR0aW5ncyBiZWxvdyB0byBjdXN0b21pemUgdGhlIGFwcGVhcmFuY2Ugb2YgdGhpcyB3ZWJzaXRlLicsXG4gICAgZm9udFNpemU6IHtcbiAgICAgIHRpdGxlOiAnVGV4dCBzaXplJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHRleHQtc2l6ZSBzZXR0aW5nIGFsbG93cyB5b3UgdG8gYWRqdXN0IGhvdyBiaWcgb3Igc21hbGwgdGhlIHdvcmRzIGFwcGVhciBvbiB0aGUgc2NyZWVuLicsXG4gICAgICBkYXRhOiBzZXJ2aWNlLndlaXNzQWNjZXNzaWJpbGl0eUZvbnRTaXplcyxcbiAgICB9LFxuICAgIHRoZW1lOiB7XG4gICAgICB0aXRsZTogJ0NvbG9yIHRoZW1lJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGNvbG9yIHRoZW1lIHNldHRpbmcgYWxsb3dzIHlvdSB0byBhZGp1c3QgdGhlIGNvbG9yIHNjaGVtZSBvZiB0aGUgd2Vic2l0ZS4nLFxuICAgICAgZGF0YTogc2VydmljZS53ZWlzc0FjY2Vzc2liaWxpdHlUaGVtZXMsXG4gICAgfSxcbiAgICBzcGFjaW5nOiB7XG4gICAgICB0aXRsZTogJ1NwYWNpbmcnLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgc3BhY2luZyBzZXR0aW5nIGxldHMgeW91IGFkanVzdCB0aGUgZGlzdGFuY2UgYmV0d2VlbiBlbGVtZW50cyBvbiB0aGUgcGFnZS4nLFxuICAgICAgZGF0YTogc2VydmljZS53ZWlzc0FjY2Vzc2liaWxpdHlTcGFjaW5nLFxuICAgIH0sXG4gICAgbGF5b3V0OiB7XG4gICAgICB0aXRsZTogJ0xheW91dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBsYXlvdXQgc2V0dGluZyBhbGxvd3MgeW91IHRvIGNoYW5nZSBob3cgY29udGVudCBpcyBhcnJhbmdlZCBvbiB0aGUgc2NyZWVuLicsXG4gICAgICBkYXRhOiBzZXJ2aWNlLndlaXNzQWNjZXNzaWJpbGl0eUxheW91dHMsXG4gICAgfSxcbiAgfTtcbn1cbiJdfQ==