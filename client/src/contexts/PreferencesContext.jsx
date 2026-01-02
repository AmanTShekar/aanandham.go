import { createContext, useContext, useState, useEffect } from 'react';

const PreferencesContext = createContext();

export const currencies = [
    { code: 'INR', name: 'Indian rupee', symbol: '₹', rate: 1 },
    { code: 'USD', name: 'United States dollar', symbol: '$', rate: 0.012 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.011 },
    { code: 'GBP', name: 'British pound', symbol: '£', rate: 0.0095 },
    { code: 'CAD', name: 'Canadian dollar', symbol: '$', rate: 0.016 },
    { code: 'AUD', name: 'Australian dollar', symbol: '$', rate: 0.018 },
    { code: 'JPY', name: 'Japanese yen', symbol: '¥', rate: 1.8 },
    { code: 'CNY', name: 'Chinese yuan', symbol: '¥', rate: 0.087 },
    { code: 'BRL', name: 'Brazilian real', symbol: 'R$', rate: 0.06 },
    { code: 'RUB', name: 'Russian ruble', symbol: '₽', rate: 1.1 },
    { code: 'KRW', name: 'South Korean won', symbol: '₩', rate: 16 },
    { code: 'TRY', name: 'Turkish lira', symbol: '₺', rate: 0.38 },
    { code: 'SAR', name: 'Saudi riyal', symbol: '﷼', rate: 0.045 },
    { code: 'AED', name: 'UAE dirham', symbol: 'د.إ', rate: 0.044 },
    { code: 'SEK', name: 'Swedish krona', symbol: 'kr', rate: 0.12 },
    { code: 'CHF', name: 'Swiss franc', symbol: 'Fr.', rate: 0.01 },
    { code: 'MXN', name: 'Mexican peso', symbol: '$', rate: 0.20 },
    { code: 'SGD', name: 'Singapore dollar', symbol: '$', rate: 0.016 },
    { code: 'HKD', name: 'Hong Kong dollar', symbol: '$', rate: 0.093 },
    { code: 'NZD', name: 'New Zealand dollar', symbol: '$', rate: 0.019 }
];

export const languages = [
    { code: 'en-IN', name: 'English', region: 'India' },
    { code: 'en-US', name: 'English', region: 'United States' },
    { code: 'es-ES', name: 'Español', region: 'España' },
    { code: 'fr-FR', name: 'Français', region: 'France' },
    { code: 'de-DE', name: 'Deutsch', region: 'Deutschland' },
    { code: 'it-IT', name: 'Italiano', region: 'Italia' },
    { code: 'pt-BR', name: 'Português', region: 'Brasil' },
    { code: 'zh-CN', name: '中文 (简体)', region: '中国' },
    { code: 'ja-JP', name: '日本語', region: '日本' },
    { code: 'ko-KR', name: '한국어', region: '대한민국' },
    { code: 'ru-RU', name: 'Русский', region: 'Россия' },
    { code: 'ar-SA', name: 'العربية', region: 'المملكة العربية السعودية' },
    { code: 'hi-IN', name: 'हिन्दी', region: 'भारत' },
    { code: 'tr-TR', name: 'Türkçe', region: 'Türkiye' },
    { code: 'nl-NL', name: 'Nederlands', region: 'Nederland' },
    { code: 'sv-SE', name: 'Svenska', region: 'Sverige' },
    { code: 'da-DK', name: 'Dansk', region: 'Danmark' },
    { code: 'no-NO', name: 'Norsk', region: 'Norge' },
    { code: 'fi-FI', name: 'Suomi', region: 'Suomi' },
    { code: 'pl-PL', name: 'Polski', region: 'Polska' },
    { code: 'cs-CZ', name: 'Čeština', region: 'Česká republika' },
    { code: 'th-TH', name: 'ไทย', region: 'ประเทศไทย' },
    { code: 'ms-MY', name: 'Bahasa Melayu', region: 'Malaysia' },
    { code: 'id-ID', name: 'Bahasa Indonesia', region: 'Indonesia' },
    { code: 'vi-VN', name: 'Tiếng Việt', region: 'Việt Nam' },
    { code: 'el-GR', name: 'Ελληνικά', region: 'Ελλάδα' },
    { code: 'he-IL', name: 'עברית', region: 'ישראל' },
    { code: 'uk-UA', name: 'Українська', region: 'Україна' },
    { code: 'lo-LA', name: 'ພາສາລາວ', region: 'ລາວ' }
];

import { translations } from '../data/translations';

export const PreferencesProvider = ({ children }) => {
    // Load saved preferences from localStorage or use defaults
    const getSavedCurrency = () => {
        try {
            const saved = localStorage.getItem('annadnam_currency');
            if (saved) {
                const currencyCode = JSON.parse(saved);
                return currencies.find(c => c.code === currencyCode) || currencies[0];
            }
        } catch (error) {
            console.error('Error loading saved currency:', error);
        }
        return currencies[0];
    };

    const getSavedLanguage = () => {
        try {
            const saved = localStorage.getItem('annadnam_language');
            if (saved) {
                const langCode = JSON.parse(saved);
                return languages.find(l => l.code === langCode) || languages[0];
            }
        } catch (error) {
            console.error('Error loading saved language:', error);
        }
        return languages[0];
    };

    const [currency, setCurrencyState] = useState(getSavedCurrency());
    const [language, setLanguageState] = useState(getSavedLanguage());

    // Wrapper functions to save to localStorage when preferences change
    const setCurrency = (newCurrency) => {
        setCurrencyState(newCurrency);
        try {
            localStorage.setItem('annadnam_currency', JSON.stringify(newCurrency.code));
        } catch (error) {
            console.error('Error saving currency:', error);
        }
    };

    const setLanguage = (newLanguage) => {
        setLanguageState(newLanguage);
        try {
            localStorage.setItem('annadnam_language', JSON.stringify(newLanguage.code));
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    // Helper to format price
    const formatPrice = (priceInINR) => {
        const converted = priceInINR * currency.rate;
        return new Intl.NumberFormat(language.code, {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(converted);
    };

    // Translation helper
    const t = (key) => {
        const langCode = language.code;
        // Fallback to English if translation not found for specific language
        const translation = translations[langCode]?.[key] || translations['en-US'][key] || key;
        return translation;
    };

    const value = {
        currency,
        setCurrency,
        language,
        setLanguage,
        formatPrice,
        t,
        currencies,
        languages
    };

    return (
        <PreferencesContext.Provider value={value}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
};
