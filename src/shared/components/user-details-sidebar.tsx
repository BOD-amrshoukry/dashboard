import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const UserDetailsSidebar = ({ isMobile }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ bottom: 0, left: 0 });
  const triggerRef = useRef(null);
  const popupRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        popupOpen
      ) {
        setPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popupOpen]);
  const handleOpenPopup = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPos({
      bottom: isMobile ? rect.height : 16, // small offset below the element
      left: isMobile ? 16 : rect.width + 16,
    });
    setPopupOpen(true);
  };

  return (
    <>
      <div className="px-[8px] transition">
        <div
          className="flex px-[8px] bg-main-background hover:bg-second-background transition-[0.5s]  w-full rounded-level1 py-[8px] mb-[8px] cursor-pointer gap-[12px] items-center"
          ref={triggerRef}
          onClick={handleOpenPopup}>
          <div className="rounded-level1 h-[48px] w-[48px] bg-main text-second-background flex justify-center items-center font-bold text-[20px]">
            AS
          </div>
          <div className="flex flex-col">
            <p className="text-[16px]">Amr Shoukry</p>
            <p className="text-[12px]">Employee</p>
          </div>
        </div>
      </div>

      {/* Portal popup */}
      {popupOpen &&
        createPortal(
          <div
            ref={popupRef} // <-- attach ref here
            className="absolute z-50 bg-second-background shadow-lg  border border-main-background w-60 rounded-level1"
            style={{
              bottom: popupPos.bottom,
              ...(isRTL ? { right: popupPos.left } : { left: popupPos.left }),
            }}>
            <div className="flex px-[16px] w-full py-[16px] gap-[12px] items-center">
              <div className="rounded-level1 h-[48px] w-[48px] bg-main text-second-background flex justify-center items-center font-bold text-[20px]">
                AS
              </div>
              <div className="flex flex-col">
                <p className="text-[16px]">Amr Shoukry</p>
                <p className="text-[12px]">Employee</p>
              </div>
            </div>
            <hr />
            <p className="px-[16px] py-[8px]">Logout</p>
          </div>,
          document.body,
        )}
    </>
  );
};

export default UserDetailsSidebar;

