'use client';
import { Bot, HeartPulse, Home, Image, Menu, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import AIConsult from '../AIConsult';
import DoctorConsult from '../DoctorConsult';
import HomeCard from '../HomeCard';
import ImageDiagno from '../ImageDiagno';
import Symptoms from '../Symptoms';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import UserCard from './UserCard';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Home');

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const sidebarBg = 'linear-gradient(135deg, #d0e8f2 0%, #a3c9e2 100%)';

  // Menu items with icons and labels
  const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: HeartPulse, label: 'Symptoms' },
    { icon: Image, label: 'Image Diagnosis' },
    { icon: Bot, label: 'AI Consult' },
    { icon: Stethoscope, label: 'Doctor Consult' },
  ];

  // Components defined inside Sidebar
  const HomeComponent = () => <HomeCard/>;
  const SymptomsComponent = () => <Symptoms/>;
  const ImageDiagnosisComponent = () => <ImageDiagno/>;
  const AIConsultComponent = () => <AIConsult/>;
  const DoctorConsultComponent = () => <DoctorConsult/>;

  const componentMap = {
    Home: HomeComponent,
    Symptoms: SymptomsComponent,
    'Image Diagnosis': ImageDiagnosisComponent,
    'AI Consult': AIConsultComponent,
    'Doctor Consult': DoctorConsultComponent,
  };

  const ActiveComponent = componentMap[activeMenu] || (() => <div>Select a menu</div>);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50 cursor-pointer">
        <button onClick={() => setIsOpen(true)} className="bg-[#201F1F] p-2 rounded-full cursor-pointer">
          <Menu size={24} className="text-white" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" />
      )}

      {/* Sidebar + Panel Container */}
      <div
        className={`fixed top-0 left-0 h-screen w-screen flex z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static`}
      >
        {/* Sidebar */}
        <div
          style={{ background: sidebarBg }}
          className="w-[290px] h-full p-5 flex flex-col justify-between shadow-lg transition-colors duration-300"
        >
          {/* Header */}
          <div className="md:hidden">
            <SidebarHeader isMobile onClose={() => setIsOpen(false)} />
          </div>
          <div className="hidden md:block">
            <SidebarHeader />
          </div>

          {/* Menu */}
          <SidebarMenu
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
            isLight={true}
            menuItems={menuItems} // Pass menu items here if SidebarMenu uses them
          />

          {/* User */}
          <UserCard isLight={true} />
        </div>

        {/* Dynamic Panel */}
        <div
          style={{ background: 'rgba(227, 242, 253, 0.9)' }}s
          className="flex-1 h-full  shadow-inner overflow-auto"
        >
          <ActiveComponent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
