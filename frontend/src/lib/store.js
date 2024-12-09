import { create } from 'zustand';


export const useModalStore = create(
  (set) => ({
    newScheduleModal: null,
    setNewScheduleModal:  (data) => set({ newScheduleModal: data }),

    newDisciplineModalData: null,
    setNewDisciplineModalData: (data) => set({ newDisciplineModalData: data }),

    newCountryModalData: null,
    setNewCountryModalData: (data) => set({ newCountryModalData: data }),
  }),
  { name: 'modalStore' }
);
