import en from '../i18n/en.json';
import ru from '../i18n/ru.json';

describe('AllPagesPanel i18n', () => {
    it('ru.json and en.json expose the same set of keys', () => {
        expect(Object.keys(ru).sort()).toEqual(Object.keys(en).sort());
    });

    it('every translation value in ru.json is a non-empty string', () => {
        Object.entries(ru).forEach(([key, value]) => {
            expect(typeof value).toBe('string');
            expect((value as string).trim().length).toBeGreaterThan(0);
        });
    });

    it('every translation value in en.json is a non-empty string', () => {
        Object.entries(en).forEach(([key, value]) => {
            expect(typeof value).toBe('string');
            expect((value as string).trim().length).toBeGreaterThan(0);
        });
    });

    it('"all-panel.resetToDefault" key is present in both locales', () => {
        expect(ru).toHaveProperty('all-panel.resetToDefault');
        expect(en).toHaveProperty('all-panel.resetToDefault');
    });

    it('ru "all-panel.resetToDefault" reflects the shortened wording introduced in this change', () => {
        expect(ru['all-panel.resetToDefault']).toBe('По умолчанию');
    });

    it('ru "all-panel.resetToDefault" no longer uses the previous longer wording', () => {
        expect(ru['all-panel.resetToDefault']).not.toBe('Сбросить по умолчанию');
    });

    it('other ru.json translations remain unchanged', () => {
        expect(ru['menu-item.all-pages.title']).toBe('Все страницы');
        expect(ru['all-panel.menu.category.allOther']).toBe('Остальное');
        expect(ru['all-panel.title.editing']).toBe('Настройка панели меню');
        expect(ru['all-panel.title.main']).toBe('Все страницы');
        expect(ru['all-panel.item.pin']).toBe('Закрепить');
        expect(ru['all-panel.item.unpin']).toBe('Открепить');
    });
});