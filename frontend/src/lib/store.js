import { create } from 'zustand';


export const useModalStore = create(
  (set) => ({
    newScheduleModal: null,
    setNewScheduleModal: (data) => set({ newScheduleModal: data }),

    newDisciplineModalData: null,
    setNewDisciplineModalData: (data) => set({ newDisciplineModalData: data }),

    newCountryModalData: null,
    setNewCountryModalData: (data) => set({ newCountryModalData: data }),

    updateMedalsModalData: null,
    setUpdateMedalsModalData: (data) => set({ updateMedalsModalData: data }),

    newEventModal: null,
    setNewEventModal: (data) => set({ newEventModal: data }),

    newMedallistModalData: null,
    setNewMedallistModalData: (data) => set({ newMedallistModalData: data }),

    updateScheduleGroupModal: null,
    setUpdateScheduleGroupModal: (data) => set({ updateScheduleGroupModal: data }),

    newTeamModal: null,
    setNewTeamModal: (data) => set({ newTeamModal: data }),

    newAthleteModal: null,
    setNewAthleteModal: (data) => set({ newAthleteModal: data }),

    newCoachModal: null,
    setNewCoachModal: (data) => set({ newCoachModal: data }),
    
    teamDetailsModalData: null,
    setTeamDetailsModalData: (data) => set({ teamDetailsModalData: data }),
  }),
  { name: 'modalStore' }
);
