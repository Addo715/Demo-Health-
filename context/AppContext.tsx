import { createContext, ReactNode } from "react";
import { doctors } from '@/assets/images/assets';

// Types
export interface Doctor {
  _id: string;
  name: string;
  image: any;
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: {
    line1: string;
    line2: string;
  };
  available?: boolean;
}

interface AppContextType {
  doctors: Doctor[];
  currencySymbol: string;
}

// Create the context
export const AppContext = createContext<AppContextType>({} as AppContextType);

// Create the provider
const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const currencySymbol = '$';

  const value: AppContextType = {
    doctors,
    currencySymbol,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;