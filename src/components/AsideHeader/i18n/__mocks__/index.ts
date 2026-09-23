import en from '../en.json';

export default function translate(key: string) {
    return en[key as keyof typeof en] ?? key;
}
