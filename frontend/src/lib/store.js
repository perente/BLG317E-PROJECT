
import { create } from 'zustand';


export const useModalStore = create(
  (set) => ({
    newScheduleModal: false,
    toggleNewScheduleModal: () => set(state => ({ newScheduleModal: !state.newScheduleModal })),

    newDisciplineModalData: null,
    setNewDisciplineModalData: (data) => set({ newDisciplineModalData: data }),

  }),
  { name: 'modalStore' }
);
