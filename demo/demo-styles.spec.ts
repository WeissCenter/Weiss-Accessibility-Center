import { readFileSync } from 'node:fs';

describe('demo accessibility center styles', () => {
  function getDemoBuildOptions() {
    const angularConfig = JSON.parse(readFileSync('angular.json', 'utf8'));
    return angularConfig.projects['accessibility-center-demo'].architect.build
      .options;
  }

  it('loads demo token defaults before the accessibility center stylesheet', () => {
    const styles = getDemoBuildOptions().styles;

    expect(styles).toContain('demo/a11y-center-tokens.scss');
    expect(styles.indexOf('demo/a11y-center-tokens.scss')).toBeLessThan(
      styles.indexOf('src/lib/index.scss')
    );
  });

  it('loads generated project styles before accessibility center runtime modifiers', () => {
    const styles = getDemoBuildOptions().styles;

    expect(styles).toContain('demo/styles.scss');
    expect(styles.indexOf('demo/styles.scss')).toBeLessThan(
      styles.indexOf('src/lib/index.scss')
    );
  });

  it('defines the USWDS custom properties required by panel and strip styles', () => {
    const tokenStyles = readFileSync('demo/a11y-center-tokens.scss', 'utf8');

    [
      '--usa-base-lightest',
      '--usa-border-color-lighter',
      '--usa-spacing-mobile',
      '--usa-spacing-mobile-lg',
      '--usa-box-shadow-2',
      '--usa-h3-font-size',
      '--usa-body-font-size',
      '--usa-primary-dark',
      '--usa-primary-darkest',
      '--usa-modal-overlay-background-color',
      '--usa-color-yellow-vivid-10',
    ].forEach((token) => {
      expect(tokenStyles).toContain(token);
    });
  });

  it('loads USWDS JavaScript for interactive components', () => {
    expect(getDemoBuildOptions().scripts).toContain(
      'node_modules/@uswds/uswds/dist/js/uswds.min.js'
    );
  });
});
