"use client";
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import { Button } from "../button";

const AthleteDetailsModal = () => {
  const athleteDetailsModalData = useModalStore((state) => state.athleteDetailsModalData);
  const setAthleteDetailsModalData = useModalStore((state) => state.setAthleteDetailsModalData);

  const athlete = athleteDetailsModalData?.athlete;

  return (
    <ModalSkeleton show={!!athleteDetailsModalData} outsideClick={() => setAthleteDetailsModalData(null)}>
      <div>
        <h5 className="font-semibold text-lg text-center mb-4">{athlete?.name || "Athlete Details"}</h5>
        <div className="flex flex-col items-start gap-2 px-4">
          <div className="flex flex-col gap-1">
            <p><strong>Medals:</strong></p>
            <p>- Gold: {athlete?.gold_medals}</p>
            <p>- Silver: {athlete?.silver_medals}</p>
            <p>- Bronze: {athlete?.bronze_medals}</p>
          </div>
        </div>
        <Button onClick={() => setAthleteDetailsModalData(null)} className="mt-4 w-full" type="button">
          Close
        </Button>
      </div>
    </ModalSkeleton>
  );
};

export default AthleteDetailsModal;
