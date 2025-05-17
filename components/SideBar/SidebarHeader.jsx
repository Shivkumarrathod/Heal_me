import { X } from 'lucide-react';

const SidebarHeader = ({ isMobile, onClose }) => (
  <div className="flex justify-between items-center mb-4 ">
    <div className="hidden md:block text-[22px] font-semibold text-[#64BD64]">Heal_Me</div>
    {isMobile && (
      <button onClick={onClose} className='cursor-pointer'>
        <X size={28} className="text-white" />
      </button>
    )}
  </div>
);

export default SidebarHeader;
