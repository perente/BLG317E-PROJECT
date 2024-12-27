"use client";
import { Button } from "@/components/button";
import { useModalStore } from "@/lib/store";
import { deleteCountry, getCountries } from "@/service/service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaMedal } from "react-icons/fa";
import toast from "react-hot-toast";

const Modal = ({ isOpen, onClose, country }) => {
  if (!isOpen) return null;

  const totalMedals = (country?.gold_medal || 0) + (country?.silver_medal || 0) + (country?.bronze_medal || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white p-6 rounded-lg"
        style={{
          width: "25%",
          minHeight: "25%",
          maxWidth: "90%",
          maxHeight: "90%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">{country?.country_name || "Unknown Country"}</h2>
        <p className="flex items-center gap-2 mb-2">
          <FaMedal className="text-yellow-500" /> Gold Medals: {country?.gold_medal || 0}
        </p>
        <p className="flex items-center gap-2 mb-2">
          <FaMedal className="text-gray-400" /> Silver Medals: {country?.silver_medal || 0}
        </p>
        <p className="flex items-center gap-2 mb-4">
          <FaMedal className="text-amber-700" /> Bronze Medals: {country?.bronze_medal || 0}
        </p>
        <p className="mb-4 font-semibold text-xl">Total Medals: {totalMedals}</p>
        <div className="flex justify-center mt-auto">
          <Button onClick={onClose} size="md">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function CountriesPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setNewCountryModalData = useModalStore((state) => state.setNewCountryModalData);
  const setUpdateMedalsModalData = useModalStore((state) => state.setUpdateMedalsModalData);
  const router = useRouter();

  useEffect(() => {
    handleGetCountries();
  }, []);

  const handleGetCountries = async () => {
    setLoading(true);
    try {
      const res = await getCountries();
      setCountries(res.data);
    } catch (error) {
      toast.error("Failed to fetch countries: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCountry = async (country_code) => {
    try {
      const res = await deleteCountry(country_code);
      if (res.status === 200) {
        setCountries(countries.filter((country) => country.country_code !== country_code));
        toast.success("Country deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete country: " + error.message);
    }
  };

  const showCountryDetails = (country) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container m-auto">
      <h1 className="text-3xl my-4">Countries</h1>
      <Button
        onClick={() => {
          setNewCountryModalData({ update: handleGetCountries });
        }}
        className="mb-4"
      >
        Create New Country
      </Button>
      <div className="grid grid-cols-4 gap-4 my-4">
        {countries.length === 0 ? (
          <p className="text-lg text-center font-semibold">No countries available.</p>
        ) : (
          countries.map((country, index) => (
            <div
              key={country.country_code || `country-${index}`}
              className="flex flex-col border border-gray-400 rounded-lg p-4 max-w-sm gap-4 duration-300 cursor-pointer hover:outline"
              onClick={() => showCountryDetails(country)}
            >
              <div className="flex justify-center">
                <img
                  className="w-20 h-12 object-contain"
                  src={
                    "https://gstatic.olympics.com/s1/t_original/static/noc/oly/3x2/180x120/" +
                    country.country_code +
                    ".png"
                  }
                  alt={country?.country_name || "Country"}
                  onError={(e) => {
                    e.target.src =
                      "https://www.denizcilikdergisi.com/wp-content/uploads/2024/08/prof_dr_hasan_mandal_manset.jpg";
                  }}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="font-bold">{country?.country_name || "Unknown Country"}</div>
                <div>
                  Country code: <span className="font-bold">{country?.country_code || "N/A"}</span>
                </div>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUpdateMedalsModalData({
                      country,
                      update: handleGetCountries, // Function to refresh data after update
                    });
                  }}
                >
                  <FaEdit />
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCountry(country.country_code);
                  }}
                >
                  <MdDelete />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        country={selectedCountry}
      />
    </div>
  );
}
