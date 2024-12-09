"use client";
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { createCountry, updateCountry } from "@/service/service";

const NewCountryModal = () => {
  const newCountryModalData = useModalStore((state) => state.newCountryModalData);
  const setNewCountryModalData = useModalStore((state) => state.setNewCountryModalData);

  const [code, setCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const [countryLong, setCountryLong] = useState("");
  const [goldMedal, setGoldMedal] = useState(0);
  const [silverMedal, setSilverMedal] = useState(0);
  const [bronzeMedal, setBronzeMedal] = useState(0);

  useEffect(() => {
    if (newCountryModalData?.editMode) {
      const { country } = newCountryModalData;
      setCode(country.code || "");
      setCountryName(country.country_name || "");
      setCountryLong(country.country_long || "");
      setGoldMedal(country.gold_medal || 0);
      setSilverMedal(country.silver_medal || 0);
      setBronzeMedal(country.bronze_medal || 0);
    } else {
      resetFields();
    }
  }, [newCountryModalData]);

  const resetFields = () => {
    setCode("");
    setCountryName("");
    setCountryLong("");
    setGoldMedal(0);
    setSilverMedal(0);
    setBronzeMedal(0);
  };

  const handleSaveCountry = () => {
    const countryData = {
      code,
      country_name: countryName,
      country_long: countryLong,
      gold_medal: goldMedal,
      silver_medal: silverMedal,
      bronze_medal: bronzeMedal,
    };

    if (newCountryModalData?.editMode) {
      updateCountry(newCountryModalData.country.code, countryData)
        .then(() => {
          setNewCountryModalData(null);
          newCountryModalData.update();
        })
        .catch((error) => {
          alert("Error updating country: " + error.message);
        });
    } else {
      createCountry(countryData)
        .then(() => {
          setNewCountryModalData(null);
          newCountryModalData.update();
        })
        .catch((error) => {
          alert("Error creating country: " + error.message);
        });
    }
  };

  return (
    <ModalSkeleton
      show={!!newCountryModalData}
      outsideClick={() => setNewCountryModalData(null)}
    >
      <div>
        <h5 className="font-semibold text-lg text-center mb-4">
          {newCountryModalData?.editMode ? "Edit" : "Create"} Country
        </h5>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block font-semibold">Code:</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-400 rounded-md p-2 w-full"
              placeholder="Enter country code"
            />
          </div>
          <div>
            <label className="block font-semibold">Country Name:</label>
            <input
              type="text"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              className="border border-gray-400 rounded-md p-2 w-full"
              placeholder="Enter country name"
            />
          </div>
          <div>
            <label className="block font-semibold">Country Long Name:</label>
            <input
              type="text"
              value={countryLong}
              onChange={(e) => setCountryLong(e.target.value)}
              className="border border-gray-400 rounded-md p-2 w-full"
              placeholder="Enter full country name"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold">Gold Medals:</label>
              <input
                type="number"
                value={goldMedal}
                onChange={(e) => setGoldMedal(parseInt(e.target.value) || 0)}
                className="border border-gray-400 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block font-semibold">Silver Medals:</label>
              <input
                type="number"
                value={silverMedal}
                onChange={(e) => setSilverMedal(parseInt(e.target.value) || 0)}
                className="border border-gray-400 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block font-semibold">Bronze Medals:</label>
              <input
                type="number"
                value={bronzeMedal}
                onChange={(e) => setBronzeMedal(parseInt(e.target.value) || 0)}
                className="border border-gray-400 rounded-md p-2 w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={() => setNewCountryModalData(null)}>Cancel</Button>
          <Button onClick={handleSaveCountry}>
            {newCountryModalData?.editMode ? "Save Changes" : "Create Country"}
          </Button>
        </div>
      </div>
    </ModalSkeleton>
  );
};

export default NewCountryModal;
