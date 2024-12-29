"use client";
import { Suspense, useEffect, useState } from "react";
import { getContributions } from "@/service/service";

function Contributions() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findContributions = async () => {
      try {
        const res = await getContributions();
        setContributions(res.data);
      } catch (error) {
        alert("Failed to load contributions: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    findContributions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-4">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-3xl">Contributions</h1>
      </div>

      {contributions.length === 0 ? (
        <p className="text-lg font-semibold mt-4">No contributions found</p>
      ) : (
        <table className="table-auto w-full mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1 text-left">Country Name</th>
              <th className="px-2 py-1 text-left">Country Code</th>
              <th className="px-2 py-1 text-left">Total Athletes</th>
              <th className="px-2 py-1 text-left">Total Coaches</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((country, index) => (
              <tr key={index} className="border-b">
                <td className="px-2 py-1 flex items-center gap-3">
                  <img
                    className="w-10 h-6 object-contain"
                    src={`https://gstatic.olympics.com/s1/t_original/static/noc/oly/3x2/180x120/${country.country_code}.png`}
                    alt={country?.country_name || "Country"}
                    onError={(e) => {
                      e.target.src =
                        "https://www.denizcilikdergisi.com/wp-content/uploads/2024/08/prof_dr_hasan_mandal_manset.jpg";
                    }}
                  />
                  {country.country_name}
                </td>
                <td className="px-2 py-1">{country.country_code}</td>
                <td className="px-2 py-1">{country.total_athletes}</td>
                <td className="px-2 py-1">{country.total_coaches}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Contributions />
    </Suspense>
  );
}
