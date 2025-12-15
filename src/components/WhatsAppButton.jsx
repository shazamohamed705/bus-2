import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

export default function WhatsAppButton({ whatsappLink }) {
  const { language } = useLanguage();
  const t = translations[language] || translations.ar;
  const isRTL = language === 'ar' || language === 'ur';
  
  // Use whatsappLink from API or empty string (button will still show)
  const link = whatsappLink || '';
  
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 bg-[#25D366] text-white rounded-full p-4 shadow-lg flex items-center justify-center z-50 hover:scale-110 hover:shadow-xl transition-all duration-300"
      style={{ 
        backgroundColor: '#25D366',
        [isRTL ? 'right' : 'left']: '20px',
        bottom: '20px',
        cursor: link ? 'pointer' : 'default',
        opacity: link ? 1 : 0.7
      }}
      aria-label={t.whatsappAriaLabel}
      onClick={(e) => {
        if (!link) {
          e.preventDefault();
        }
      }}
    >
      <FaWhatsapp size={30} />
    </a>
  );
}

