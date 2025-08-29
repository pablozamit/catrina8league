import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: 'es' | 'en' | 'la') => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };
  return (
    <div className="flex justify-center space-x-4 mt-6">
      <img
        src="/flags/burgundy.svg"
        alt="Español"
        className="w-8 h-6 cursor-pointer"
        onClick={() => changeLanguage('es')}
      />
      <img
        src="/flags/uk.svg"
        alt="English"
        className="w-8 h-6 cursor-pointer"
        onClick={() => changeLanguage('en')}
      />
      <img
        src="/flags/vatican.svg"
        alt="Latina"
        className="w-8 h-6 cursor-pointer"
        onClick={() => changeLanguage('la')}
      />
    </div>
  );
};

export default LanguageSelector;
