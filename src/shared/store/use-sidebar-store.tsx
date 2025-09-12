// store/useSidebarStore.ts
import { create } from 'zustand';

interface SidebarStore {
  isExpanded: boolean;
  toggleSidebar: () => void;
  setExpanded: (value: boolean) => void;
  desktopExpanded: boolean; // remember desktop preference
}

const useSidebarStore = create<SidebarStore>((set, get) => {
  const isClient = typeof window !== 'undefined';
  const initialExpanded = isClient ? window.innerWidth > 768 : true;
  const initialDesktopExpanded = initialExpanded; // default desktop state

  if (isClient) {
    let lastIsDesktop = window.innerWidth > 768;

    const handleResize = () => {
      const isDesktop = window.innerWidth > 768;

      if (isDesktop !== lastIsDesktop) {
        // Mobile view: always collapse
        if (!isDesktop) {
          set({ isExpanded: false });
        } else {
          // Desktop view: restore previous desktop preference
          const { desktopExpanded } = get();
          set({ isExpanded: desktopExpanded });
        }
        lastIsDesktop = isDesktop;
      }
    };

    window.addEventListener('resize', handleResize);
  }

  return {
    isExpanded: initialExpanded,
    desktopExpanded: initialDesktopExpanded,
    toggleSidebar: () =>
      set((state) => {
        const isDesktop =
          typeof window !== 'undefined' ? window.innerWidth > 768 : true;
        // update desktop preference if on desktop
        if (isDesktop) {
          return {
            isExpanded: !state.isExpanded,
            desktopExpanded: !state.isExpanded,
          };
        }
        return { isExpanded: !state.isExpanded };
      }),
    setExpanded: (value) =>
      set((state) => {
        const isDesktop =
          typeof window !== 'undefined' ? window.innerWidth > 768 : true;
        if (isDesktop) {
          return { isExpanded: value, desktopExpanded: value };
        }
        return { isExpanded: value };
      }),
  };
});

export default useSidebarStore;

