"use client";
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { updateCountry } from "@/service/service";
import toast from "react-hot-toast";

const TeamDetailsModalData = () => {
  const teamDetailsModalData = useModalStore((state) => state.teamDetailsModalData);
  const setTeamDetailsModalData = useModalStore((state) => state.setTeamDetailsModalData);



  return (
    <ModalSkeleton show={!!teamDetailsModalData} outsideClick={() => setTeamDetailsModalData(null)}>
      <div>
        <h5 className="font-semibold text-lg text-center mb-4">{teamDetailsModalData?.team_name}</h5>
        <div className="flex flex-col items-center">
          <h5 className="font-semibold text-lg text-center mb-2">Athletes</h5>
          <div className="flex flex-wrap gap-1 mb-4 max-h-60 overflow-y-auto">
            {teamDetailsModalData?.athlete_list.map((athlete) => (
              <div key={athlete.id} className=" rounded-md w-full text-center">
                <p>{athlete.name}</p>
              </div>
            ))}
          </div>
          <h5 className="font-semibold text-lg text-center mb-2">Coaches</h5>
          <div className="flex flex-wrap gap-1">
            {teamDetailsModalData?.coach_list.map((coach) => (
              <div key={coach.id} className="rounded-md w-full text-center">
                <p>{coach.name}</p>
              </div>
            ))}
            {teamDetailsModalData?.coach_list.length === 0 && (
              <div className="rounded-md w-full text-center">
                <p className="text-center">
                  No coaches
                </p>
              </div>
            )}
          </div>

          <Button onClick={() => setTeamDetailsModalData(null)} className="mt-4" type="button">
            Close
          </Button>

        </div>
      </div>
    </ModalSkeleton>
  );
};

export default TeamDetailsModalData;
