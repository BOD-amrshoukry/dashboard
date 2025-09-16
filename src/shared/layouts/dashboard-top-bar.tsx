import React, { type ReactNode } from 'react';
import useSidebarStore from '../store/use-sidebar-store';
import clsx from 'clsx';
import { PanelLeft } from 'lucide-react';
import Breadcrumb from '../components/bread-crumb';
import { useTranslation } from 'react-i18next';
import Loading from '../components/loading';

type BreadcrumbItem = {
  label: string;
  href: string;
};
interface DashboardTopBarProps {
  breadcrumb: BreadcrumbItem[];
  isPending?: boolean;
  children?: ReactNode;
}

const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  breadcrumb,
  isPending = false,
  children,
}) => {
  const { isExpanded, toggleSidebar } = useSidebarStore();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div
      className={clsx(
        'pt-[12px] pb-[24px] fixed top-0 bg-main-background z-[99]',
        isExpanded ? 'w-[calc(100%-320px)]' : 'w-[100%]',
        isRTL ? 'pl-[16px] pr-[16px] left-0' : 'pr-[16px] pl-[16px] right-0',
      )}>
      <div className="w-full bg-second-background rounded-level1 p-[16px]">
        <div className="flex gap-[16px] items-center">
          <button className="cursor-pointer" onClick={() => toggleSidebar()}>
            <PanelLeft />
          </button>
          <p>|</p>
          {isPending ? (
            <Loading size="sm" />
          ) : (
            <Breadcrumb items={breadcrumb} />
          )}
          {/* Children space on the right side */}
          {children && <div className="flex gap-2 w-full">{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default DashboardTopBar;

