import { Navigate, Outlet } from 'react-router-dom';
import { decodeJwt, getCookie } from '../../shared/utils/auth';
import Loading from '../../shared/components/loading';
import useUser from '../../shared/hooks/use-user';

const OwnerManagerRoutes = () => {
  const { isPending: isPendingMe, data: myData } = useUser();

  if (isPendingMe) return <Loading />;
  const isOwnerManager = myData?.type === 'owner' || myData?.type === 'manager';

  return isOwnerManager ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default OwnerManagerRoutes;

