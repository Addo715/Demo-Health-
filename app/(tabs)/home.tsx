import Banner from '@/components/Banner';
import Header from '@/components/Header';
import NewDoctors from '@/components/NewDoctors';
import SpecialityMenu from '@/components/SpecialityMenu';
import Title from '@/components/Title';
import TopDoctors from '@/components/TopDoctors';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
      <ScrollView className="flex-1">
        <Header />
        <Title
          title="Find by Speciality"
          subtitle="Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free."
        />
        <SpecialityMenu />
        <TopDoctors
          title="Top Doctors To Book"
          subtitle="Simply browse through our extensive list of trusted doctors"
        />
        <NewDoctors />
        <Banner />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;