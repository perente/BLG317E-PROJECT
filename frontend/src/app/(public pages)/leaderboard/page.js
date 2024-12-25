"use client";
import { Button } from "@/components/button";
import { useModalStore } from "@/lib/store";
import { deleteCountry, getCountries, getCountryLeaderboard, getLeaderboard } from "@/service/service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import Confetti from "react-confetti-boom";
import { IoIosArrowDown } from "react-icons/io";
import { useRef } from "react";

export default function CountriesPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countryDetails, setCountryDetails] = useState(null);
  const [showCountryDetail, setShowCountryDetail] = useState(false);

  const router = useRouter();

  useEffect(() => {
    handleGetCountries();
  }, []);

  const handleGetCountries = async () => {
    setLoading(true);
    try {
      const res = await getLeaderboard();
      setCountries(res.data);
    } catch (error) {
      toast.error("Failed to fetch countries: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  const showCountryDetails = (country, cardRef) => {
    setCountryDetails(null);
    setShowCountryDetail(country.country_code === showCountryDetail ? null : country.country_code);

    // Fetch the details of the country
    getCountryLeaderboard(country.country_code).then((res) => {
      setCountryDetails(res.data);
    });
    setTimeout(() => {
      if (country.country_code !== showCountryDetail && cardRef?.current) {
        cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });

        // Add offset of 300px after scrolling into view
        setTimeout(() => {
          window.scrollBy({ top: -200, behavior: "smooth" });
        }, 650); // Delay to ensure initial scroll finishes
      }
    }, 300);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold animate-spin">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="absolute top-[152px] left-0 w-full max-w-[100vw] overflow-hidden -z-20 h-[50vh]">
        <div className="relative ">
          <Confetti
            mode="fall" particleCount={50} shapeSize={18} fadeOutHeight={2.1} colors={['#ff577f', '#ff884b', '#ffcc00', '#ccff00', '#50d2fa', '#ff00ff']} />
        </div>
      </div>
      {/* </div> */}
      <h1 className="text-3xl my-4 font-bold">Leaderboard</h1>

      {countries.length === 0 ? (
        <p className="text-lg text-center font-semibold">No countries available.</p>
      ) : (
        <>
          <AnimatedColumns countries={countries} />
          <div className="flex flex-col gap-4 mt-8 w-full">
            {countries.map((country, index) => {
              if (country.total === 0) return null;
              return (
                <CountryCard key={country.country_code} country={country} index={index} showCountryDetails={showCountryDetails} countryDetails={countryDetails} setCountryDetails={setCountryDetails} showCountryDetail={showCountryDetail} />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}


function AnimatedColumns({ countries }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="mx-auto flex justify-center min-h-[276px]">
      <div className="grid grid-cols-7 gap-4">
        {/* Column 1 */}
        <div className="flex flex-col justify-end items-center col-start-3 col-span-1 gap-2">
          <img
            className="w-28 h-16 object-contain"
            src={
              "https://gstatic.olympics.com/s1/t_original/static/noc/oly/3x2/180x120/" +
              countries?.[1]?.country_code +
              ".png"
            }
            alt={countries?.[1]?.country_name || "Country"}
            onError={(e) => {
              e.target.src =
                "https://www.denizcilikdergisi.com/wp-content/uploads/2024/08/prof_dr_hasan_mandal_manset.jpg";
            }}
          />
          <div
            className={`w-32 bg-[#c4c4c4] transition-all duration-1000 ease-in-out ${animate ? "h-24" : "h-0"
              }`}
          ></div>
          <div className="text-3xl font-paris font-bold">2</div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col justify-end items-center col-start-4 col-span-1 gap-2">
          <img
            className="w-28 h-16 object-contain"
            src={
              "https://gstatic.olympics.com/s1/t_original/static/noc/oly/3x2/180x120/" +
              countries?.[0]?.country_code +
              ".png"
            }
            alt={countries?.[0]?.country_name || "Country"}
            onError={(e) => {
              e.target.src =
                "https://www.denizcilikdergisi.com/wp-content/uploads/2024/08/prof_dr_hasan_mandal_manset.jpg";
            }}
          />
          <div
            className={`w-32 bg-[#EFBF04] transition-all duration-1000 ease-in-out ${animate ? "h-32" : "h-0"
              }`}
          ></div>
          <div className="text-3xl font-paris font-bold">1</div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col justify-end items-center col-start-5 col-span-1 gap-2">
          <img
            className="w-28 h-16 object-contain"
            src={
              "https://gstatic.olympics.com/s1/t_original/static/noc/oly/3x2/180x120/" +
              countries?.[2]?.country_code +
              ".png"
            }
            alt={countries?.[2]?.country_name || "Country"}
            onError={(e) => {
              e.target.src =
                "https://www.denizcilikdergisi.com/wp-content/uploads/2024/08/prof_dr_hasan_mandal_manset.jpg";
            }}
          />
          <div
            className={`w-32 bg-[#ce8946] transition-all duration-1000 ease-in-out ${animate ? "h-20" : "h-0"
              }`}
          ></div>
          <div className="text-3xl font-paris font-bold">3</div>
        </div>
      </div>
    </div>
  );
}


function CountryCard({ country, index, showCountryDetails, countryDetails, setCountryDetails, showCountryDetail }) {

  const cardRef = useRef(null);
  return (
    <div
      key={country.country_code || `country-${index}`}
      ref={cardRef} // Attach the ref to the card
      className="flex flex-col border bg-white border-gray-400 rounded-lg p-4  duration-300 cursor-pointer hover:outline justify-between w-full"
      onClick={() => showCountryDetails(country, cardRef)}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold font-paris">
            {index + 1}.
          </h3>
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
          <div className="flex flex-col items-center font-paris text-xl">
            <div className="font-bold">
              {country?.country_name || "Unknown Country"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="text-3xl font-semibold">🥇</div>
            <div className="text-lg font-semibold w-4 text-end">
              {country?.gold_medal || 0}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-3xl font-semibold">🥈</div>
            <div className="text-lg font-semibold w-4 text-end">
              {country?.silver_medal || 0}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-3xl font-semibold">🥉</div>
            <div className="text-lg font-semibold w-4 text-end">
              {country?.bronze_medal || 0}
            </div>
          </div>
          <div>
            <IoIosArrowDown
              className={`text-2xl duration-300 transform ${showCountryDetail === country.country_code ? "rotate-180" : ""
                }`}
            />
          </div>
        </div>
      </div>
      <div
        ref={(el) => {
          if (el && showCountryDetail === country.country_code) {
            el.style.height = `${el.scrollHeight}px`; // Dynamically set the height for opening
          } else if (el) {
            el.style.height = "0px"; // Set to 0px for closing
          }
        }}
        className="overflow-hidden duration-300 ease-in-out"
      >
        {countryDetails === null && showCountryDetail === country.country_code && (
          <p className="text-lg text-center font-semibold">Loading...</p>
        )}
        {showCountryDetail === country.country_code &&
          countryDetails?.map((discipline, index) => (
            <div
              key={discipline.discipline_name || `country-${index}`}
              className="flex items-center justify-between w-full py-2"
            >
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-semibold font-paris w-4">
                  {index + 1}.
                </h3>
                <div className="flex flex-col items-center font-paris text-xl">
                  <div className="font-bold">{discipline?.discipline_name}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="text-3xl font-semibold">🥇</div>
                  <div className="text-lg font-semibold w-5 text-end">
                    {discipline?.gold_medals || 0}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-3xl font-semibold">🥈</div>
                  <div className="text-lg font-semibold w-5 text-end">
                    {discipline?.silver_medals || 0}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-3xl font-semibold">🥉</div>
                  <div className="text-lg font-semibold w-5 text-end">
                    {discipline?.bronze_medals || 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}