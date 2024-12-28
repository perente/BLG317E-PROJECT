"use client";
import { useEffect, useState } from "react";
import { getCountries, getCountriesAboveAverage, getTopCountries } from "@/service/service";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";
import { FaMedal } from "react-icons/fa";
import toast from "react-hot-toast";

const Modal = ({ isOpen, onClose, country }) => {
  if (!isOpen) return null;

  const totalMedals = country?.total || 0;

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
        <p className="mb-4 font-semibold text-xl">Total Medals: {country?.total || 0}</p>
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

  const showCountryDetails = (country) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  const handleGetCountriesAboveAverage = async () => {
    setLoading(true);
    try {
      const res = await getCountriesAboveAverage();
      setCountries(res.data);
      toast.success("Countries Above Average are Found");
    } catch (error) {
      toast.error("Failed to find countries above average: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTopCountries = async () => {
    const n = prompt("Number of top countries to display:", "3");
    if (!n) return;
    setLoading(true);
    try {
      const res = await getTopCountries(n); 
      setCountries(res.data);
      toast.success(`Top ${n} Countries are Found`);
    } catch (error) {
      toast.error("Failed to find top countries: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container ml-20">
      <h1 className="text-3xl my-4">Countries</h1>
      <div className="flex gap-5 mb-4">
        <Button 
          onClick={handleGetCountries}
        >
          All Countries
        </Button>
        <Button 
          onClick={handleGetTopCountries}
        >
          Top N Countries
        </Button>
        <Button 
          onClick={handleGetCountriesAboveAverage}
        >
          Above Avg Countries
        </Button>
      </div>
      <div>
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
            </div>
          ))
        )}
      </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        country={selectedCountry}
      />
    </div>
  );
}
