
import { create } from 'zustand';


export const useModalStore = create(
  (set) => ({
    newScheduleModal: false,
    toggleNewScheduleModal: () => set(state => ({ newScheduleModal: !state.newScheduleModal })),

    // reviewModalData: {},
    // setReviewModalData: (payload) => set(_ => ({ reviewModalData: payload })),

  }),
  { name: 'modalStore' }
);
