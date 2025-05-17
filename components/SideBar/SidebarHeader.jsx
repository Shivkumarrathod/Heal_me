import { X } from 'lucide-react';

const SidebarHeader = ({ isMobile, onClose }) => (
  <div className="flex justify-between items-center mb-4 w-full">
    <div className="hidden md:block text-[22px]  text-purple-500 font-bold text-center">Heal Me</div>
    {isMobile && (
      <button onClick={onClose} className='cursor-pointer'>
        <X size={28} className="text-white" />
      </button>
    )}
  </div>
);

export default SidebarHeader;
