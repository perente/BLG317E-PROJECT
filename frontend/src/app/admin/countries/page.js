"use client";
import { Button } from "@/components/button";
import { useModalStore } from "@/lib/store";
import { deleteCountry, getCountries, getCountriesAboveAverage, getTopCountries } from "@/service/service";
import { useSearchParams, usePathname, useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
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

const TopNModal = ({
  isOpen,
  onClose,
  onSubmit, 
}) => {
  const [topN, setTopN] = useState("3");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(parseInt(topN, 10) || 3);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white p-6 rounded-lg"
        style={{ width: "25%", maxWidth: "90%", minHeight: "20%" }}
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Get Top N Countries
        </h2>
        <div className="mb-4">
          <label htmlFor="topN" className="block mb-2">
            Enter a number:
          </label>
          <input
            id="topN"
            type="number"
            className="border border-gray-300 rounded-md px-2 py-1 w-full"
            value={topN}
            onChange={(e) => setTopN(e.target.value)}
          />
        </div>
        <div className="flex justify-center gap-2">
          <Button onClick={onClose} size="md" variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} size="md">
            Find
          </Button>
        </div>
      </div>
    </div>
  );
};

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryLong, setCountryLong] = useState("");
  const [goldMedal, setGoldMedal] = useState("");
  const [silverMedal, setSilverMedal] = useState("");
  const [bronzeMedal, setBronzeMedal] = useState("");
  const [total, setTotal] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [order, setOrder] = useState(params.get("order") ?? "");
  const [orderBy, setOrderBy] = useState(params.get("order_by") ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTopNModalOpen, setIsTopNModalOpen] = useState(false);

  const setNewCountryModalData = useModalStore((state) => state.setNewCountryModalData);
  const setUpdateMedalsModalData = useModalStore((state) => state.setUpdateMedalsModalData);


  useEffect(() => {
    handleGetCountries();
    setCountryName(params.get("country_name") ?? "");
    setCountryCode(params.get("country_code") ?? "");
    setCountryLong(params.get("country_long") ?? "");
    setGoldMedal(params.get("gold_medal") ?? "");
    setSilverMedal(params.get("silver_medal") ?? "");
    setBronzeMedal(params.get("bronze_medal") ?? "");
    setTotal(params.get("total") ?? "");
    setOrder(params.get("order") ?? "");
    setOrderBy(params.get("order_by") ?? "");
  }, [params]);

  const handleGetCountries = async () => {
    setLoading(true);
    const filter = {};
      if (params.get("country_name")) {
        filter.country_name = params.get("country_name");
      }
      if (params.get("country_code")) {
        filter.country_code = params.get("country_code");
      }
      if (params.get("country_long")) {
        filter.country_long = params.get("country_long");
      }
      if (params.get("gold_medal")) {
        filter.gold_medal = params.get("gold_medal");
      }
      if (params.get("silver_medal")) {
        filter.silver_medal = params.get("silver_medal");
      }
      if (params.get("bronze_medal")) {
        filter.bronze_medal = params.get("bronze_medal");
      }
      if (params.get("total")) {
        filter.total = params.get("total");
      }
        
    setLoading(true);
      getCountries(filter)
        .then((res) => {
          setCountries(res.data);
        })
        .catch((err) => alert(err))
        .finally(() => { 
          setLoading(false)
        });
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

  const openTopNModal = () => {
    setIsTopNModalOpen(true);
  };
  const closeTopNModal = () => {
    setIsTopNModalOpen(false);
  };

  const handleGetTopCountries = async (n) => {
    setLoading(true);
    try {
      const res = await getTopCountries(n);
      setCountries(res.data);
      toast.success(`Top ${n} Countries are Found`);
    } catch (error) {
      toast.error("Failed to find top countries: " + error.message);
    } finally {
      setLoading(false);
      setIsTopNModalOpen(false); 
    }
  };

  const onChange = ({ country, name }) => {
    const current = new URLSearchParams(Array.from(params.entries()));
    const value = country.target.value.trim();
    if (!value) current.delete(name);
    else current.set(name, country.target.value);

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  function updateSearchParamForCurrentPage({ key, value }) {
    const { replace } = useRouter();
    const newUrl = updateSearchParamForCurrentPage({ key, value })
    replace(newUrl)
}
  
  const orderCountries = (orderBy) => {
    const current = new URLSearchParams(Array.from(params.entries()));
    const value = orderBy;
    if(!value) {
      current.delete("order_by");
      current.delete("order");
    } else {
      if(order === "asc") {
        setOrderBy("");
        setOrder("");
        current.delete("order_by");
        current.delete("order");
      } else {
        current.set("order_by", orderBy);
        current.set("order", order === "" ? "desc" : order === "desc" ? "asc" : "");
      }
    }
    
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  if (loading && params.size === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container m-auto">
      <h1 className="text-3xl my-4">Countries</h1>
      <div className="flex gap-5 mb-8">
        <Button
          onClick={() => {
            setNewCountryModalData({ update: handleGetCountries });
          }}
        >
          Create New Country
        </Button>
        <Button 
          onClick={handleGetCountries}
        >
          All Countries
        </Button>
        <Button 
          onClick={openTopNModal}
        >
          Top N Countries
        </Button>
        <Button 
          onClick={handleGetCountriesAboveAverage}
        >
          Above Avg Countries
        </Button>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold inline-block mr-4">Filters</h3>
        <Button
          size="xs"
          onClick={() => router.push(pathname)} 
          className="mb-4 inline-block text-xs px-2 py-1"
        >
          Clear Filters
        </Button>
        <div className="flex gap-2 items-center mt-2 mb-6 flex-wrap">
          <div className="flex flex-col">
            <label htmlFor="filterName" className="mr-1">
              Country Name:
            </label>
            <input
              id="filterName"
              type="text"
              className="border border-gray-400 rounded-md p-1"
              placeholder="e.g. United States"
              value={countryName}
              onChange={(e) => {
                setCountryName(e.target.value);
                onChange({ country: e, name: "country_name" });
              }}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="filterCode" className="mr-1">
              Country Code:
            </label>
            <input
              id="filterCode"
              type="text"
              className="border border-gray-400 rounded-md p-1"
              placeholder="e.g. USA"
              value={countryCode}
              onChange={(e) => {
                setCountryCode(e.target.value);
                onChange({ country: e, name: "country_code" });
              }}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="filterLong" className="mr-1">
              Country Long:
            </label>
            <input
              id="filterLong"
              type="text"
              className="border border-gray-400 rounded-md p-1"
              placeholder="e.g. United States of America"
              value={countryLong}
              onChange={(e) => {
                setCountryLong(e.target.value);
                onChange({ country: e, name: "country_long" });
              }}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="filterGold" className="mr-1">
              Gold Medals:
            </label>
            <input
              id="filterGold"
              type="number"
              className="border border-gray-400 rounded-md p-1"
              placeholder="e.g. 3"
              value={goldMedal}
              onChange={(e) => {
                setGoldMedal(e.target.value);
                onChange({ country: e, name: "gold_medal" });
              }}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="filterSilver" className="mr-1">
              Silver Medals:
            </label>
            <input
              id="filterSilver"
              type="number"
              className="border border-gray-400 rounded-md p-1"
              placeholder="e.g. 4"
              value={silverMedal}
              onChange={(e) => {
                setSilverMedal(e.target.value);
                onChange({ country: e, name: "silver_medal" });
              }}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="filterBronze" className="mr-1">
              Bronze Medals:
            </label>
            <input
              id="filterBronze"
              type="number"
              className="border border-gray-400 rounded-md p-1"
              placeholder="e.g. 5"
              value={bronzeMedal}
              onChange={(e) => {
                setBronzeMedal(e.target.value);
                onChange({ country: e, name: "bronze_medal" });
              }}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="filterTotal" className="mr-1">
              Total Medals:
            </label>
            <input
              id="filterTotal"
              type="number"
              className="border border-gray-400 rounded-md p-1"
              placeholder="e.g. 12"
              value={total}
              onChange={(e) => {
                setTotal(e.target.value);
                onChange({ country: e, name: "total" });
              }}
            />
          </div>
        </div>
      </div>
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
                      update: handleGetCountries, 
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
      <TopNModal
        isOpen={isTopNModalOpen}
        onClose={closeTopNModal}
        onSubmit={handleGetTopCountries}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Countries />
    </Suspense>
  );
} 