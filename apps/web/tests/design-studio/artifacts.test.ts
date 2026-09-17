import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { artifact, contrast, initialProject, parseProject, templates, tokens } from '../../src/components/design-studio/artifacts';

describe('Juh Design artifacts', () => {
  it('round-trips a saved project and rejects malformed imports', () => {
    expect(parseProject(JSON.parse(JSON.stringify(initialProject)))).toEqual(initialProject);
    for (const patch of [{ version: 2 }, { template: 'unknown' }, { radius: NaN }, { color: 'red;}</style>' }, { title: 1 }, { font: 'url(evil)' }]) expect(() => parseProject({ ...initialProject, ...patch })).toThrow();
  });
  it('calculates WCAG reference contrast and readable button foreground', () => {
    expect(contrast('#000000', '#ffffff')).toBe(21);
    expect(contrast('#ffffff', '#ffffff')).toBe(1);
    expect(tokens({ ...initialProject, color: '#ffffff' }).colors.onPrimary).toBe('#000000');
  });
  it('renders every template without turning user content into markup', () => {
    for (const template of templates) {
      const dom = new JSDOM(artifact({ ...initialProject, template: template.id, title: '<img src=x onerror=alert(1)>', items: '<script>alert(1)</script> | escaped' }));
      expect(dom.window.document.querySelector('img')).toBeNull();
      expect(dom.window.document.querySelector('h1')?.textContent).toContain('<img');
      expect(dom.window.document.documentElement.lang).toBe('pt-BR');
      dom.window.close();
    }
  });
  it('navigates carousel slides and handles an empty carousel', () => {
    const dom = new JSDOM(artifact({ ...initialProject, template: 'social' }), { runScripts: 'dangerously' });
    dom.window.document.querySelector<HTMLButtonElement>('#next')!.click();
    expect(dom.window.document.querySelector('#position')?.textContent).toBe('2 / 3');
    dom.window.document.querySelector<HTMLButtonElement>('#previous')!.click();
    expect(dom.window.document.querySelector('#position')?.textContent).toBe('1 / 3');
    dom.window.close();
    const empty = new JSDOM(artifact({ ...initialProject, template: 'social', items: '' }), { runScripts: 'dangerously' });
    empty.window.document.querySelector<HTMLButtonElement>('#next')!.click();
    expect(empty.window.document.querySelector('#position')?.textContent).toBe('0 / 0');
    empty.window.close();
  });
  it('filters catalog products and shows the no-results state', () => {
    const dom = new JSDOM(artifact({ ...initialProject, template: 'catalog' }), { runScripts: 'dangerously' });
    const input = dom.window.document.querySelector<HTMLInputElement>('#search')!;
    input.value = 'xyz'; input.dispatchEvent(new dom.window.Event('input'));
    expect(dom.window.document.querySelector<HTMLElement>('#empty')!.hidden).toBe(false);
    input.value = 'identidade'; input.dispatchEvent(new dom.window.Event('input'));
    expect([...dom.window.document.querySelectorAll<HTMLElement>('.card')].filter(n=>!n.hidden)).toHaveLength(1);
    dom.window.close();
  });
  it('updates dashboard values from its period filter', () => {
    const dom = new JSDOM(artifact({ ...initialProject, template: 'dashboard' }), { runScripts: 'dangerously' });
    const select = dom.window.document.querySelector<HTMLSelectElement>('#period')!;
    select.value = '0.7'; select.dispatchEvent(new dom.window.Event('change'));
    expect(dom.window.document.querySelector('.metric')?.textContent).toBe('17');
    dom.window.close();
  });
});
