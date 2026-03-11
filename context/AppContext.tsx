import { createContext, ReactNode, useState } from "react";
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

export interface Appointment {
  id: string;
  doctor: Doctor;
  slotDate: string;
  slotTime: string;
  bookedAt: Date;
}

interface AppContextType {
  doctors: Doctor[];
  currencySymbol: string;
  appointments: Appointment[];
  bookAppointment: (doctor: Doctor, slotDate: string, slotTime: string) => void;
}

// Create the context
export const AppContext = createContext<AppContextType>({} as AppContextType);

// Create the provider
const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const currencySymbol = '$';
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const bookAppointment = (doctor: Doctor, slotDate: string, slotTime: string) => {
    const newAppt: Appointment = {
      id: Date.now().toString(),
      doctor,
      slotDate,
      slotTime,
      bookedAt: new Date(),
    };
    setAppointments((prev) => [newAppt, ...prev]);
  };

  const value: AppContextType = {
    doctors,
    currencySymbol,
    appointments,
    bookAppointment,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;