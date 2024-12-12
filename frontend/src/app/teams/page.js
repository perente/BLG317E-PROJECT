"use client";
import { Button } from "@/components/button";
import { useModalStore } from "@/lib/store";
import { getTeams, deleteTeam } from "@/service/teams_service";
import { getDisciplines ,getCountries} from "@/service/service";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [teamName, setTeamName] = useState(params.get("team_name") ?? "");
  const [countryName, setCountryName] = useState(params.get("country_name") ?? "");
  const [country_code, setCountryCode] = useState(params.get("country_code") ?? "");
  const [disciplineName, setDisciplineName] = useState(params.get("discipline_name") ?? "");
  const [discipline, setDiscipline] = useState(params.get("discipline") ?? "");
  const [teamGender, setTeamGender] = useState(params.get("team_gender") ?? "");
  const [numAthletes, setNumAthletes] = useState(params.get("num_athletes") ?? "");
  const [order, setOrder] = useState(params.get("order") ?? "");
  const [orderBy, setOrderBy] = useState(params.get("order_by") ?? "");

  const [disciplines, setDisciplines] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    handleGetTeams();
    getCountries().then((res) => {
      setCountries(res.data);
  }).catch((error) => {
      alert(error);
  });
    getDisciplines().then((res) => {
      setDisciplines(res.data);
    }).catch((error) => {
      alert(error);
    });
    setCurrentPage(1);
    setTeamName(params.get("team_name") ?? "");
    setCountryName(params.get("country_name") ?? "");
    setCountryCode(params.get("country_code") ?? "");
    setDisciplineName(params.get("discipline_name") ?? "");
    setDiscipline(params.get("discipline") ?? "");
    setTeamGender(params.get("team_gender") ?? "");
    setNumAthletes(params.get("num_athletes") ?? "");
    setOrder(params.get("order") ?? "");
    setOrderBy(params.get("order_by") ?? "");
  }, [params]);

  const handleGetTeams = async () => {
    let filter = {};
    if (params.get("team_name")) filter.team_name = params.get("team_name");
    if (params.get("country_name")) filter.country_name = params.get("country_name");
    if (params.get("country_code")) filter.country_code = params.get("country_code");
    if (params.get("discipline_name")) filter.discipline_name = params.get("discipline_name");
    if (params.get("discipline")) filter.discipline_code = params.get("discipline");
    if (params.get("team_gender")) filter.team_gender = params.get("team_gender");
    if (params.get("num_athletes")) filter.num_athletes = params.get("num_athletes");
    if (params.get("order")) filter.order = params.get("order");
    if (params.get("order_by")) filter.order_by = params.get("order_by");

    setLoading(true);
    getTeams(filter)
      .then((res) => {
        setTeams(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const totalPages = Math.ceil((teams?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = teams?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const setNewTeamModal = useModalStore((state) => state.setNewTeamModal);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const onChange = ({ event, name }) => {
    const current = new URLSearchParams(Array.from(params.entries())); 
    const value = event.target.value.trim();

    console.log("Filter Change:", name, value); // Debug log
  
    if (!value) {
      current.delete(name);
    } else {
      current.set(name, event.target.value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`)
  };

  function updateSearchParamForCurrentPage({ key, value }) {
      const { replace } = useRouter();
      const newUrl = updateSearchParam({ key, value })
      replace(newUrl)
    }
  
    const handleDeleteTeam = async (id) => {
      deleteTeam(id).then((res) => {
        if (res.status === 200) {
          setTeams(teams.filter((team) => team.team_code !== id));
        }
      }).catch((error) => {
        alert(error);
      }).finally(() => {
        handleGetTeams();
      });
    }

  const orderTeams = (orderBy) => {
    const current = new URLSearchParams(Array.from(params.entries())); // -> has to use this form
    const value = orderBy;
    if (!value) {
      current.delete("order_by");
      current.delete("order");
    } else {
      if (order === "asc") {
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
    router.push(`${pathname}${query}`)
  };
  

  if (loading  && params.size === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container m-auto">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-3xl">Teams</h1>
        <Button
          onClick={() =>
            setNewTeamModal({
              update: handleGetTeams,
            })
          }
        >
          Create New Team
        </Button>
      </div>
      <div>
        <h3 className="text-xl font-semibold inline-block mr-4">Filters</h3>
        <Button size="xs" onClick={() => router.push(pathname)} className="mb-4 inline-block text-xs px-2 py-1">
          Clear Filters
        </Button>
        <div className="flex gap-2 items-center">
          {/* Filter Inputs */}
          <div>
            <label htmlFor="" className="mr-1">Team Name:</label>
            <input
              type="text"
              name="team_name"
              className="border border-gray-400 rounded-md p-1 h-[34px]"
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                console.log("Input Value:", e.target.value); // Log input value
                onChange({ event: e, name: "team_name" });
              }}
            />
          </div>
          <div className="flex flex-col">
                        <label htmlFor="country" className="mr-1">Country:</label>
                        <select className="border border-gray-400 rounded-md p-1 h-[34px] w-full"
                            value={country_code}
                            onChange={(e) => {
                                setCountryCode(e.target.value);
                                onChange({ event: e, name: "country_code" });
                            }}
                        >
                            <option value="">All</option>
                            {countries.
                                map((country) => (
                                    <option key={country.country_code} value={country.country_code}>{country.country_name}</option>
                                ))
                            }
                        </select>
                    </div>
          <div className="">
            <label htmlFor="discipline" className="mr-1">Discipline:</label>
            <select className="border border-gray-400 rounded-md p-1 h-[34px] w-full"
              value={discipline}
              onChange={(e) => {
                setDiscipline(e.target.value);
                onChange({ event: e, name: "discipline" });
              }}
            >
              <option value="">All</option>
              {disciplines.map((discipline) => (
                <option key={discipline.discipline_code} value={discipline.discipline_code}>{discipline.name}</option>
              ))
              }
            </select>
          </div>
          <div>
            <label htmlFor="" className="mr-1">Gender:</label>
            <select
              className="border border-gray-400 rounded-md p-1 h-[34px]"
              value={teamGender}
              onChange={(e) => {
                setTeamGender(e.target.value);
                onChange({ event: e, name: "team_gender" });
              }}
            >
              <option value="">All</option>
              <option value="M">Men</option>
              <option value="W">Women</option>
              <option value="X">Mixed</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div>
  <label htmlFor="num_athletes" className="mr-1"># of Athletes:</label>
  <input
    type="number"
    id="num_athletes"
    name="num_athletes"
    min="2"
    max="25"
    className="border border-gray-400 rounded-md p-1 h-[34px]"
    value={numAthletes}
    onChange={(e) => {
      const value = Math.min(25, Math.max(2, Number(e.target.value))); // Minimum 2, maksimum 25
      setNumAthletes(value);
      onChange({ event: e, name: "num_athletes" });
    }}
  />
</div>

        </div>
      </div>
      {teams.length === 0 ? (
        <p className="text-lg font-semibold mt-4">No teams found</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th
                onClick={() => orderTeams("team_name")}
                className="border border-gray-400 px-2 py-1 cursor-pointer"
              >
                <div className="flex items-center justify-center">
                  <span>Team Name</span>
                  <div className="opcity-10 flex items-center justify-center flex-col ">
                    <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "team_name" && order === "asc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "180deg" }} />
                    <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "team_name" && order === "desc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "0deg" }} />
                  </div>
                </div>
              </th>
              <th
                onClick={() => orderTeams("country_name")}
                className="border border-gray-400 px-2 py-1 cursor-pointer">
                <div className="flex items-center justify-center">
                  <span>Country</span>
                  <div className="opcity-10 flex items-center justify-center flex-col">
                    <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "country_name" && order === "asc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "180deg" }} />
                    <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "country_name" && order === "desc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "0deg" }} />
                  </div>
                </div>
              </th>
              <th
                onClick={() => orderTeams("discipline_name")}
                className="border border-gray-400 px-2 py-1 cursor-pointer">
                <div className="flex items-center justify-center">
                  <span>Discipline</span>
                  <div className="opcity-10 flex items-center justify-center flex-col">
                    <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "discipline_name" && order === "asc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "180deg" }} />
                    <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "discipline_name" && order === "desc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "0deg" }} />
                  </div>
                </div>
              </th>
              <th
                onClick={() => orderTeams("team_gender")}
                className="border border-gray-400 px-2 py-1 cursor-pointer"
              >
                <div className="flex items-center justify-center">
                  <span>Gender</span>
                  <div className="opcity-10 flex items-center justify-center flex-col">
                    <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "team_gender" && order === "asc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "180deg" }} />
                    <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "team_gender" && order === "desc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "0deg" }} />
                  </div>
                </div>
              </th>
              <th
                onClick={() => orderTeams("num_athletes")}
                className="border border-gray-400 px-2 py-1 cursor-pointer"
              >
                <div className="flex items-center justify-center">
                  <span> # of Athletes </span>
                  <div className="opcity-10 flex items-center justify-center flex-col">
                    <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "num_athletes" && order === "asc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "180deg" }} />
                    <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "num_athletes" && order === "desc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "0deg" }} />
                  </div>
                </div>
              </th>
              <th className="border border-gray-400 px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((team) => (
              <tr key={team.team_code} className="border-b">
                <td className="border border-gray-400 px-2 py-1">{team.team_name}</td>
                <td className="border border-gray-400 px-2 py-1">{team.country_name}</td>
                <td className="border border-gray-400 px-2 py-1">{team.discipline_name}</td>
                <td className="border border-gray-400 px-2 py-1">{team.team_gender}</td>
                <td className="border border-gray-400 px-2 py-1">{team.num_athletes}</td>
                <td className="border border-gray-400 px-2 py-1">
                  <div className="flex gap-1">
                    <div className="cursor-pointer">
                      <FaEdit className="w-6 h-6" />
                    </div>
                    <div className="cursor-pointer" onClick={() => handleDeleteTeam(team.team_code)}>
                      <MdDelete className="w-6 h-6" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded-l disabled:opacity-50"
        >
          Previous
        </button>
        <select
          value={currentPage}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
          className="mx-2 px-3 py-1 bg-gray-200 text-black"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <option key={number} value={number}>
              Page {number}
            </option>
          ))}
        </select>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded-r disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Teams />
    </Suspense>
  );
}