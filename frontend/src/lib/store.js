import { create } from 'zustand';


export const useModalStore = create(
  (set) => ({
    newScheduleModal: null,
    setNewScheduleModal: (data) => set({ newScheduleModal: data }),

    newDisciplineModalData: null,
    setNewDisciplineModalData: (data) => set({ newDisciplineModalData: data }),

    newCountryModalData: null,
    setNewCountryModalData: (data) => set({ newCountryModalData: data }),

    newMedallistModalData: null,
    setNewMedallistModalData: (data) => set({ newMedallistModalData: data }),

    updateScheduleGroupModal: null,
    setUpdateScheduleGroupModal: (data) => set({ updateScheduleGroupModal: data }),

    newTeamModal: null,
    setNewTeamModal: (data) => set({ newTeamModal: data }),
  }),
  { name: 'modalStore' }
);
