import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Package {
  id: string;
  title: string;
  location: string;
  price: string;
  duration: string;
  image: string;
  description: string;
}

export interface VisaType {
  id: string;
  name: string;
  docs: string[];
  steps: string[];
  fee: string;
  time: string;
}

export interface GlobalSettings {
  whatsappNumber: string;
  alertBanner: {
    enabled: boolean;
    text: string;
  };
  systemPrompt: string;
}

interface AppContextType {
  packages: Package[];
  visaTypes: VisaType[];
  settings: GlobalSettings;
  updatePackages: (packages: Package[]) => void;
  updateVisaTypes: (visaTypes: VisaType[]) => void;
  updateSettings: (settings: GlobalSettings) => void;
  saveChanges: () => void;
}

const defaultPackages: Package[] = [
  {
    id: 'maldives',
    title: "Maldives Escape",
    location: "Maldives",
    price: "45,000",
    duration: "4N/5D",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800",
    description: "Experience luxury overwater villas and crystal clear waters in the heart of the Indian Ocean."
  },
  {
    id: 'dubai',
    title: "Dubai City Lights",
    location: "UAE",
    price: "38,000",
    duration: "5N/6D",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
    description: "From the Burj Khalifa to desert safaris, discover the ultimate modern oasis."
  },
  {
    id: 'bali',
    title: "Bali Adventure",
    location: "Indonesia",
    price: "52,000",
    duration: "6N/7D",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    description: "Immerse yourself in the spiritual beauty and lush landscapes of the Island of Gods."
  }
];

const defaultVisaTypes: VisaType[] = [
  {
    id: 'tourist',
    name: 'Tourist Visa',
    docs: ['Passport (6 months validity)', 'Recent Photos', 'Bank Statement', 'Return Tickets'],
    steps: ['Document Review', 'Form Submission', 'Appointment Booking', 'Visa Grant'],
    fee: 'Starting from ₹4,500',
    time: '5-7 Working Days'
  },
  {
    id: 'business',
    name: 'Business Visa',
    docs: ['Invitation Letter', 'Company Profile', 'Tax Returns', 'Covering Letter'],
    steps: ['Verification', 'Submission', 'Interview Prep', 'Visa Collection'],
    fee: 'Starting from ₹8,000',
    time: '10-15 Working Days'
  },
  {
    id: 'student',
    name: 'Student Visa',
    docs: ['Offer Letter', 'Financial Proof', 'Academic Records', 'English Proficiency'],
    steps: ['I-20/CAS Issuance', 'Fee Payment', 'Biometrics', 'Interview'],
    fee: 'Varies by Country',
    time: '3-6 Weeks'
  }
];

const defaultSettings: GlobalSettings = {
  whatsappNumber: "917902745614",
  alertBanner: {
    enabled: true,
    text: "Flash Sale on Dubai Packages - Limited Time Offer!"
  },
  systemPrompt: `Provide comprehensive travel information for the requested destination. 
Include:
1. Flight trends (typical prices from India, airlines).
2. Visa requirements for Indian citizens.
3. Top 3 tour packages with prices and durations.
4. Best time to visit.
5. A brief description.`
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>(() => {
    const saved = localStorage.getItem('travelplus_packages');
    return saved ? JSON.parse(saved) : defaultPackages;
  });

  const [visaTypes, setVisaTypes] = useState<VisaType[]>(() => {
    const saved = localStorage.getItem('travelplus_visa_types');
    return saved ? JSON.parse(saved) : defaultVisaTypes;
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('travelplus_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const saveChanges = () => {
    localStorage.setItem('travelplus_packages', JSON.stringify(packages));
    localStorage.setItem('travelplus_visa_types', JSON.stringify(visaTypes));
    localStorage.setItem('travelplus_settings', JSON.stringify(settings));
  };

  return (
    <AppContext.Provider value={{ 
      packages, 
      visaTypes, 
      settings, 
      updatePackages: setPackages, 
      updateVisaTypes: setVisaTypes, 
      updateSettings: setSettings,
      saveChanges
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
