export function createAccessibilityOptions(service) {
    return {
        displayType: 'panel',
        overlay: true,
        position: 'end',
        include: ['fontSize', 'theme', 'spacing', 'layout'],
        title: 'Accessibility settings',
        description: 'Adjust the settings below to customize the appearance of this website.',
        multiSelectableAccordions: false,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLFVBQVUsMEJBQTBCLENBQUMsT0FBd0M7SUFDakYsT0FBTztRQUNMLFdBQVcsRUFBRSxPQUFPO1FBQ3BCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsUUFBUSxFQUFFLEtBQUs7UUFDZixPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUM7UUFDbkQsS0FBSyxFQUFFLHdCQUF3QjtRQUMvQixXQUFXLEVBQUUsd0VBQXdFO1FBQ3JGLHlCQUF5QixFQUFFLEtBQUs7UUFDaEMsUUFBUSxFQUFFO1lBQ1IsS0FBSyxFQUFFLFdBQVc7WUFDbEIsV0FBVyxFQUFFLDZGQUE2RjtZQUMxRyxJQUFJLEVBQUUsT0FBTyxDQUFDLDJCQUEyQjtTQUMxQztRQUNELEtBQUssRUFBRTtZQUNMLEtBQUssRUFBRSxhQUFhO1lBQ3BCLFdBQVcsRUFBRSwrRUFBK0U7WUFDNUYsSUFBSSxFQUFFLE9BQU8sQ0FBQyx3QkFBd0I7U0FDdkM7UUFDRCxPQUFPLEVBQUU7WUFDUCxLQUFLLEVBQUUsU0FBUztZQUNoQixXQUFXLEVBQUUsZ0ZBQWdGO1lBQzdGLElBQUksRUFBRSxPQUFPLENBQUMseUJBQXlCO1NBQ3hDO1FBQ0QsTUFBTSxFQUFFO1lBQ04sS0FBSyxFQUFFLFFBQVE7WUFDZixXQUFXLEVBQUUsZ0ZBQWdGO1lBQzdGLElBQUksRUFBRSxPQUFPLENBQUMseUJBQXlCO1NBQ3hDO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlIH0gZnJvbSAnLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFjY2Vzc2liaWxpdHlPcHRpb25zIH0gZnJvbSAnLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5pbnRlcmZhY2VzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFjY2Vzc2liaWxpdHlPcHRpb25zKHNlcnZpY2U6IFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UpOiBBY2Nlc3NpYmlsaXR5T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgZGlzcGxheVR5cGU6ICdwYW5lbCcsXG4gICAgb3ZlcmxheTogdHJ1ZSxcbiAgICBwb3NpdGlvbjogJ2VuZCcsXG4gICAgaW5jbHVkZTogWydmb250U2l6ZScsICd0aGVtZScsICdzcGFjaW5nJywgJ2xheW91dCddLFxuICAgIHRpdGxlOiAnQWNjZXNzaWJpbGl0eSBzZXR0aW5ncycsXG4gICAgZGVzY3JpcHRpb246ICdBZGp1c3QgdGhlIHNldHRpbmdzIGJlbG93IHRvIGN1c3RvbWl6ZSB0aGUgYXBwZWFyYW5jZSBvZiB0aGlzIHdlYnNpdGUuJyxcbiAgICBtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zOiBmYWxzZSxcbiAgICBmb250U2l6ZToge1xuICAgICAgdGl0bGU6ICdUZXh0IHNpemUnLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgdGV4dC1zaXplIHNldHRpbmcgYWxsb3dzIHlvdSB0byBhZGp1c3QgaG93IGJpZyBvciBzbWFsbCB0aGUgd29yZHMgYXBwZWFyIG9uIHRoZSBzY3JlZW4uJyxcbiAgICAgIGRhdGE6IHNlcnZpY2Uud2Vpc3NBY2Nlc3NpYmlsaXR5Rm9udFNpemVzLFxuICAgIH0sXG4gICAgdGhlbWU6IHtcbiAgICAgIHRpdGxlOiAnQ29sb3IgdGhlbWUnLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGUgY29sb3IgdGhlbWUgc2V0dGluZyBhbGxvd3MgeW91IHRvIGFkanVzdCB0aGUgY29sb3Igc2NoZW1lIG9mIHRoZSB3ZWJzaXRlLicsXG4gICAgICBkYXRhOiBzZXJ2aWNlLndlaXNzQWNjZXNzaWJpbGl0eVRoZW1lcyxcbiAgICB9LFxuICAgIHNwYWNpbmc6IHtcbiAgICAgIHRpdGxlOiAnU3BhY2luZycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBzcGFjaW5nIHNldHRpbmcgbGV0cyB5b3UgYWRqdXN0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGVsZW1lbnRzIG9uIHRoZSBwYWdlLicsXG4gICAgICBkYXRhOiBzZXJ2aWNlLndlaXNzQWNjZXNzaWJpbGl0eVNwYWNpbmcsXG4gICAgfSxcbiAgICBsYXlvdXQ6IHtcbiAgICAgIHRpdGxlOiAnTGF5b3V0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGxheW91dCBzZXR0aW5nIGFsbG93cyB5b3UgdG8gY2hhbmdlIGhvdyBjb250ZW50IGlzIGFycmFuZ2VkIG9uIHRoZSBzY3JlZW4uJyxcbiAgICAgIGRhdGE6IHNlcnZpY2Uud2Vpc3NBY2Nlc3NpYmlsaXR5TGF5b3V0cyxcbiAgICB9LFxuICB9O1xufVxuIl19