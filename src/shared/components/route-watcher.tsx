import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useSidebarStore from '../store/use-sidebar-store';
import useMessagesSidebarStore from '../../features/chats/store/use-chat-sidebar';

export default function RouteWatcher() {
  const location = useLocation();
  const closeIfMobile = useSidebarStore((s) => s.closeIfMobile);
  const setExpanded = useMessagesSidebarStore((s) => s.setExpanded);
  const isExpanded = useMessagesSidebarStore((s) => s.isExpanded);

  useEffect(() => {
    closeIfMobile();
    if (window.innerWidth <= 1024 && !isExpanded) {
      setExpanded(true);
    }
  }, [location.pathname, closeIfMobile]);

  return null; // no UI, just runs logic
}

