import React, { useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { deleteCookie } from '../utils/auth';
import { Link, useNavigate } from 'react-router-dom';
import useUser from '../hooks/use-user';
import DataDisplay from './data-display';
import { BASE_URL } from '../constants/api';
import { queryClient } from '../../lib/tanstackquery';
import useClearPushToken from '../hooks/use-clear-push-token';

interface UserDetailsSidebarProps {
  isMobile?: boolean;
}

interface PopupPos {
  bottom: number;
  left: number;
}

const UserDetailsSidebar: React.FC<UserDetailsSidebarProps> = ({
  isMobile = false,
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupPos, setPopupPos] = useState<PopupPos>({ bottom: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const navigate = useNavigate();

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | globalThis.MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        popupOpen
      ) {
        setPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popupOpen]);

  const handleOpenPopup = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPos({
      bottom: isMobile ? rect.height : 16, // small offset below the element
      left: isMobile ? 16 : rect.width + 16,
    });
    setPopupOpen(true);
  };

  const {
    mutate: mutateClear,
    isPending: isPendingClear,
    isError: isErrorClear,
  } = useClearPushToken();

  const handleLogout = () => {
    deleteCookie('token');
    mutateClear();
    queryClient.clear();
    navigate('/login');
  };

  const { data, isPending, isError, refetch } = useUser();

  return (
    <>
      <div className="px-[8px] transition h-[80px]">
        <div
          className="flex px-[8px] bg-main-background hover:bg-second-background duration-300  w-full rounded-level1 py-[8px] mb-[8px] cursor-pointer gap-[12px] items-center"
          ref={triggerRef}
          onClick={handleOpenPopup}>
          <DataDisplay
            data={data}
            isLoading={isPending}
            refetch={refetch}
            error={isError ? t('profile.errors.load') : undefined}>
            <>
              <div className="rounded-level1 h-[48px] w-[48px] bg-main text-second-background flex justify-center items-center font-bold text-[20px] overflow-hidden">
                {data?.image?.formats ? (
                  <img
                    src={`${BASE_URL}${data?.image?.formats.thumbnail.url}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center ">
                    {`${data?.name?.split(' ')[0]?.[0]?.toUpperCase() ?? ''}${
                      data?.name?.split(' ')[1]?.[0]?.toUpperCase() ?? ''
                    }`}
                  </div>
                )}
              </div>
              <div className="flex flex-col max-w-[200px]">
                <p className="text-[16px] truncate" title={data?.name}>
                  {data?.name}
                </p>
                <p className="text-[12px]">{t(`profile.text.${data?.type}`)}</p>
              </div>
            </>
          </DataDisplay>
        </div>
      </div>

      {/* Portal popup */}
      {popupOpen &&
        createPortal(
          <div
            ref={popupRef} // <-- attach ref here
            className="fixed z-[99999] bg-second-background shadow-lg border border-main-background w-[60] rounded-level1"
            style={{
              bottom: popupPos.bottom,
              ...(isRTL ? { right: popupPos.left } : { left: popupPos.left }),
            }}>
            <div className="flex px-[16px] w-full py-[16px] gap-[12px] items-center">
              <DataDisplay
                data={data}
                isLoading={isPending}
                refetch={refetch}
                error={isError ? t('profile.errors.load') : undefined}>
                <div className="rounded-level1 h-[48px] w-[48px] bg-main text-second-background flex justify-center items-center font-bold text-[20px] overflow-hidden">
                  {data?.image?.formats ? (
                    <img
                      src={`${BASE_URL}${data?.image?.formats.thumbnail.url}`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center ">
                      {`${data?.name?.split(' ')[0]?.[0]?.toUpperCase() ?? ''}${
                        data?.name?.split(' ')[1]?.[0]?.toUpperCase() ?? ''
                      }`}
                    </div>
                  )}
                </div>
                <div className="flex flex-col max-w-[140px]">
                  <p className="text-[16px] truncate" title={data?.name}>
                    {data?.name}
                  </p>
                  <p className="text-[12px]">
                    {t(`profile.text.${data?.type}`)}
                  </p>
                </div>
              </DataDisplay>
            </div>
            <hr />
            <Link
              to={'/profile'}
              className="flex px-[16px] py-[8px]"
              onClick={() => setPopupOpen(false)}>
              {t('profile.text.profile')}
            </Link>

            <hr />
            <button
              className="px-[16px] py-[8px] w-full text-start"
              onClick={handleLogout}>
              {t('profile.text.logout')}
            </button>
          </div>,
          document.body,
        )}
    </>
  );
};

export default UserDetailsSidebar;

