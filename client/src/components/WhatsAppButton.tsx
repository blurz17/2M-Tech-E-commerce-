import React, { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  title?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = "201006683289",
  message = " Hello",
  className = "",
  title = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    {
      id: 'whatsapp',
      icon: FaWhatsapp,
      label: title || 'WhatsApp',
      action: () => {
        const encodedMessage = encodeURIComponent(message || '');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
      },
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-500'
    },
   
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`fixed bottom-20 right-6 z-50 ${className}`}>
      {/* Main Toggle Button - Fixed Position */}
      <button
        onClick={toggleMenu}
        className={`${
          isOpen 
            ? 'bg-gray-600 hover:bg-gray-700 rotate-45' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        } text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 relative z-10`}
        aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
      >
        {isOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <div className="text-xl">💬</div>
        )}
      </button>

      {/* Contact Options Menu - Positioned Absolutely */}
      <div className={`absolute bottom-full right-0 transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="mb-4 space-y-2">
          {contacts.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <div
                key={contact.id}
                className={`transform transition-all duration-300 ease-out ${
                  isOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-4 opacity-0'
                }`}
                style={{ 
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms' 
                }}
              >
                <div className="flex items-center justify-end space-x-3 group">
                  {/* Label */}
                  <div className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium whitespace-nowrap">
                    {contact.label}
                  </div>
                  
                  {/* Button */}
                  <button
                    onClick={contact.action}
                    className={`${contact.color} text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-white`}
                    aria-label={contact.label}
                  >
                    <IconComponent className="text-lg" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Background Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 -z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default WhatsAppButton;
