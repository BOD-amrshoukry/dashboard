import { Settings } from 'lucide-react';
import { useState } from 'react';
import Drawer from './drawer';
import SettingsModal from './settings-modal';
import SettingsData from './settings-data';

const SettingsGuest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});

  return (
    <div className="h-[40px] my-[16px]">
      <button
        className="rounded-full p-[8px] bg-second-background shadow-[0_10px_30px_rgba(0,0,0,0.2)]  cursor-pointer z-50"
        onClick={() => setIsOpen(true)}>
        <Settings stroke="var(--color-main)" />
      </button>
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SettingsData
          setIsOpenModal={setIsOpenModal}
          setModalData={setModalData}
        />
      </Drawer>
      <SettingsModal
        modalData={modalData}
        setIsOpenModal={setIsOpenModal}
        isOpenModal={isOpenModal}
      />
    </div>
  );
};

export default SettingsGuest;

