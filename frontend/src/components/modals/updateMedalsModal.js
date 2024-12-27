"use client";
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { updateCountry } from "@/service/service";
import toast from "react-hot-toast";

const UpdateMedalsModal = () => {
  const updateMedalsModalData = useModalStore((state) => state.updateMedalsModalData);
  const setUpdateMedalsModalData = useModalStore((state) => state.setUpdateMedalsModalData);

  const [goldMedal, setGoldMedal] = useState(0);
  const [silverMedal, setSilverMedal] = useState(0);
  const [bronzeMedal, setBronzeMedal] = useState(0);

  useEffect(() => {
    if (updateMedalsModalData?.edit) {
      setGoldMedal(updateMedalsModalData?.country?.gold_medal || 0);
      setSilverMedal(updateMedalsModalData?.country?.silver_medal || 0);
      setBronzeMedal(updateMedalsModalData?.country?.bronze_medal || 0);
    }
  }, [updateMedalsModalData]);

  const handleUpdateMedals = () => {
    if (!updateMedalsModalData?.country?.country_code) {
      toast.error("Invalid country data");
      return;
    }

    updateCountry(updateMedalsModalData.country.country_code, {
      gold_medal: goldMedal,
      silver_medal: silverMedal,
      bronze_medal: bronzeMedal,
    })
      .then(() => {
        toast.success("Medals updated successfully");
        setUpdateMedalsModalData(null);
        if (updateMedalsModalData.update) {
          updateMedalsModalData.update();
        }
      })
      .catch((error) => {
        console.error("Error updating medals:", error);
        toast.error("Failed to update medals");
      });
  };

  return (
    <ModalSkeleton show={!!updateMedalsModalData} outsideClick={() => setUpdateMedalsModalData(null)}>
      <div>
        <h5 className="font-semibold text-lg text-center mb-4">Edit Medals</h5>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold">Gold Medals:</label>
            <input
              type="number"
              value={goldMedal}
              onChange={(e) => setGoldMedal(parseInt(e.target.value, 10) || 0)}
              className="border border-gray-400 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Silver Medals:</label>
            <input
              type="number"
              value={silverMedal}
              onChange={(e) => setSilverMedal(parseInt(e.target.value, 10) || 0)}
              className="border border-gray-400 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Bronze Medals:</label>
            <input
              type="number"
              value={bronzeMedal}
              onChange={(e) => setBronzeMedal(parseInt(e.target.value, 10) || 0)}
              className="border border-gray-400 rounded-md p-2 w-full"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={() => setUpdateMedalsModalData(null)}>Cancel</Button>
          <Button onClick={handleUpdateMedals}>Save Changes</Button>
        </div>
      </div>
    </ModalSkeleton>
  );
};

export default UpdateMedalsModal;
