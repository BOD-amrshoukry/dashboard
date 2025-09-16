import { Outlet } from 'react-router-dom';

const MarginLayout = () => {
  return (
    <div className="pb-[32px]">
      <Outlet />
    </div>
  );
};

export default MarginLayout;

