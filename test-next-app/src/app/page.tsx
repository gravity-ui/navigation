import {InfoButtons} from '../components/InfoButtons';

export default function Home() {
    return (
        <div>
            <div
                style={{
                    background: 'var(--g-color-base-background)',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid var(--g-color-line-generic)',
                }}
            >
                <h3>Информация о CSS-модулях</h3>
                <p>
                    Откройте DevTools и проверьте классы элементов навигации. Все классы должны
                    иметь суффиксы вида <code>ComponentName-module__className___hash</code>
                </p>
                <p>
                    Например: <code>Logo-module__gn-logo___u7qyb</code>
                </p>
            </div>
            <InfoButtons />
        </div>
    );
}
