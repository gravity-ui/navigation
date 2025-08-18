// Тестовое приложение для проверки работы CSS-модулей
import {Logo} from './build/esm/components/Logo/Logo.js';

console.log('Logo component imported successfully');
console.log('CSS classes should be scoped:', Logo);

// Проверим, что CSS-модули работают корректно
import styles from './build/esm/components/Logo/Logo.module.scss.js';
console.log('CSS modules:', styles);
