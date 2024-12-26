"use client";
import { useEffect, useState } from "react";
import { getCountries } from "@/service/service";
import toast from "react-hot-toast";

export default function CountriesPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

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
    alert(`Country: ${country?.country_name || "Unknown"}
Gold Medals: ${country?.gold_medal || 0}
Silver Medals: ${country?.silver_medal || 0}
Bronze Medals: ${country?.bronze_medal || 0}`);
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
  );
}
