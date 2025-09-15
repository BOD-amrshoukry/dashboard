import React from 'react';
import useSidebarStore from '../store/use-sidebar-store';
import clsx from 'clsx';
import { PanelLeft } from 'lucide-react';
import Breadcrumb from '../components/bread-crumb';
import { useTranslation } from 'react-i18next';
import Loading from '../components/loading';

const DashboardTopBar = ({ breadcrumb, isPending = false }) => {
  const { isExpanded, setExpanded, toggleSidebar } = useSidebarStore();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <>
      <div
        className={clsx(
          'pt-[12px] pb-[24px] fixed top-0  bg-main-background z-50',
          isExpanded ? 'w-[calc(100%-320px)]' : 'w-[100%]',
          isRTL ? 'pl-[16px] pr-[16px] left-0' : 'pr-[16px] pl-[16px] right-0',
        )}>
        <div
          className={clsx(
            'w-full bg-second-background rounded-level1 p-[16px]',
          )}>
          <div className="flex gap-[16px]">
            <button className="cursor-pointer" onClick={() => toggleSidebar()}>
              <PanelLeft />{' '}
            </button>
            <p>|</p>
            {isPending ? (
              <Loading size={'sm'} />
            ) : (
              <Breadcrumb items={breadcrumb} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardTopBar;

