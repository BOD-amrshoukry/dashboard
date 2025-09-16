// // store/useMessagesSidebarStore.ts
// import { create } from 'zustand';

// interface MessagesSidebarStore {
//   isExpanded: boolean;
//   toggleSidebar: () => void;
//   setExpanded: (value: boolean) => void;
//   desktopExpanded: boolean; // remember desktop preference
// }

// const useMessagesSidebarStore = create<MessagesSidebarStore>((set, get) => {
//   const isClient = typeof window !== 'undefined';
//   const initialExpanded = isClient ? window.innerWidth > 1280 : true;
//   const initialDesktopExpanded = initialExpanded;

//   if (isClient) {
//     let lastIsDesktop = window.innerWidth > 1280;

//     const handleResize = () => {
//       const isDesktop = window.innerWidth > 1280;

//       if (isDesktop !== lastIsDesktop) {
//         if (!isDesktop) {
//           // collapse on mobile
//           set({ isExpanded: false });
//         } else {
//           // restore desktop preference
//           const { desktopExpanded } = get();
//           set({ isExpanded: desktopExpanded });
//         }
//         lastIsDesktop = isDesktop;
//       }
//     };

//     window.addEventListener('resize', handleResize);
//   }

//   return {
//     isExpanded: initialExpanded,
//     desktopExpanded: initialDesktopExpanded,
//     toggleSidebar: () =>
//       set((state) => {
//         const isDesktop =
//           typeof window !== 'undefined' ? window.innerWidth > 1280 : true;
//         if (isDesktop) {
//           return {
//             isExpanded: !state.isExpanded,
//             desktopExpanded: !state.isExpanded,
//           };
//         }
//         return { isExpanded: !state.isExpanded };
//       }),
//     setExpanded: (value) =>
//       set(() => {
//         const isDesktop =
//           typeof window !== 'undefined' ? window.innerWidth > 1280 : true;
//         if (isDesktop) {
//           return { isExpanded: value, desktopExpanded: value };
//         }
//         return { isExpanded: value };
//       }),
//   };
// });

// export default useMessagesSidebarStore;

// store/useMessagesSidebarStore.ts
import { create } from 'zustand';

interface MessagesSidebarStore {
  isExpanded: boolean;
  toggleSidebar: () => void;
  setExpanded: (value: boolean) => void;
}

const useMessagesSidebarStore = create<MessagesSidebarStore>((set) => {
  const isClient = typeof window !== 'undefined';
  const initialExpanded = true;

  if (isClient) {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        set({ isExpanded: true });
      }
    };
    window.addEventListener('resize', handleResize);
  }
  return {
    isExpanded: initialExpanded,
    toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
    setExpanded: (value) => set({ isExpanded: value }),
  };
});

export default useMessagesSidebarStore;

