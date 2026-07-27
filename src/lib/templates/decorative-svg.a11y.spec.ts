import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Decorative icons in the accessibility center must be hidden with aria-hidden="true" and
 * must not also claim role="img" — the two contradict each other, and screen readers were
 * reporting the close button's icon as an image. Every close button and accordion heading
 * already carries its own visible text, so no icon here needs an accessible name.
 */
describe('Accessibility center decorative SVGs', () => {
  const templates: [string, string][] = [
    ['panel', readFileSync(join(__dirname, 'panel/panel.component.html'), 'utf8')],
    ['strip', readFileSync(join(__dirname, 'strip/strip.component.html'), 'utf8')],
  ];

  it.each(templates)('%s template opens at least one svg', (_name, template) => {
    expect(template.match(/<svg\b[^>]*>/g)?.length).toBeGreaterThan(0);
  });

  it.each(templates)('%s template hides every decorative svg', (_name, template) => {
    const unhidden = (template.match(/<svg\b[^>]*>/g) ?? []).filter((svg) => !svg.includes('aria-hidden="true"'));

    expect(unhidden).toEqual([]);
  });

  it.each(templates)('%s template never combines role="img" with aria-hidden', (_name, template) => {
    const roleImg = (template.match(/<svg\b[^>]*>/g) ?? []).filter((svg) => svg.includes('role="img"'));

    expect(roleImg).toEqual([]);
  });
});
