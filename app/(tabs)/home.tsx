import React from 'react';
import { ScrollView } from 'react-native';
import Header from '@/components/Header';
import Title from '@/components/Title';
import SpecialityMenu from '@/components/SpecialityMenu';
import TopDoctors from '@/components/TopDoctors';
import NewDoctors from '@/components/NewDoctors';
import Banner from '@/components/Banner';

const Home: React.FC = () => {
  return (
    <ScrollView className="flex-1 bg-white">
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
  );
};

export default Home;