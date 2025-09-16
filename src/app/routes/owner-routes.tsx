import { Navigate, Outlet } from 'react-router-dom';
import useUser from '../../shared/hooks/use-user';
import Loading from '../../shared/components/loading';

const OwnerRoutes = () => {
  const { isPending: isPendingMe, data: myData } = useUser();

  if (isPendingMe) return <Loading />;

  const isOwner = myData?.type === 'owner';
  return isOwner ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default OwnerRoutes;

