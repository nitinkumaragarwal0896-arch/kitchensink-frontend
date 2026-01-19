import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import api from '../services/api';

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const changeLanguage = (lng) => {
    // Change frontend language
    i18n.changeLanguage(lng);
    
    // Update Accept-Language header for backend
    api.defaults.headers.common['Accept-Language'] = lng;
    
    console.log(`[i18n] Language changed to: ${lng}`);
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <Globe className="w-4 h-4 text-gray-600" />
        <select
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="text-sm bg-transparent border-none focus:outline-none cursor-pointer appearance-none pr-6"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

