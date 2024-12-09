"use client";
import { Button } from "@/components/button";
import { useModalStore } from "@/lib/store";
import { getTeams, deleteTeam } from "@/service/teams_service";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaEdit, FaExternalLinkSquareAlt } from "react-icons/fa";
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
  const [disciplineName, setDisciplineName] = useState(params.get("discipline_name") ?? "");
  const [teamGender, setTeamGender] = useState(params.get("team_gender") ?? "");
  const [numAthletes, setNumAthletes] = useState(params.get("num_athletes") ?? "");
  const [order, setOrder] = useState(params.get("order") ?? "");
  const [orderBy, setOrderBy] = useState(params.get("order_by") ?? "");

  useEffect(() => {
    console.log("useEffect called");
    handleGetTeams(); 
    setTeamName(params.get("team_name") ?? "");
    setCountryName(params.get("country_name") ?? "");
    setDisciplineName(params.get("discipline_name") ?? "");
    setTeamGender(params.get("team_gender") ?? "");
    setNumAthletes(params.get("num_athletes") ?? "");
    setOrder(params.get("order") ?? "");
    setOrderBy(params.get("order_by") ?? "");
  }, [params]);

  const handleGetTeams = async () => {
    let filter = {};
    if (params.get("team_name")) filter.team_name = params.get("team_name");
    if (params.get("country_name")) filter.country_name = params.get("country_name");
    if (params.get("discipline_name")) filter.discipline_name = params.get("discipline_name");
    if (params.get("team_gender")) filter.team_gender = params.get("team_gender");
    if (params.get("num_athletes")) filter.num_athletes = params.get("num_athletes");
    if (params.get("order")) filter.order = params.get("order");
    if (params.get("order_by")) filter.order_by = params.get("order_by");

    setLoading(true); 
    try {
      console.log("Fetching teams with filter:", filter);
      const res = await getTeams(filter); 
      console.log("API Response:", res);
      setTeams(res); 
    } catch (err) {
      console.error("Error fetching teams:", err);
      alert("Failed to fetch teams data.");
    } finally {
      setLoading(false);
    }
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

  const handleDeleteTeam = async (teamCode) => {
    deleteTeam(teamCode)
      .then((res) => {
        if (res.status === 200) {
          setTeams(teams.filter((team) => team.team_code !== teamCode));
        }
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        handleGetTeams();
      });
  };

  const orderTeams = (orderBy) => {
    const current = new URLSearchParams(Array.from(params.entries()));
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
    router.push(`${pathname}${query}`);
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
      {!teams || teams.length === 0 ? (
        <p className="text-lg font-semibold mt-4">No teams found</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
  <thead>
    <tr className="bg-gray-200">
      <th
        onClick={() => orderTeams("team_name")}
        className="border border-gray-400 px-2 py-1 cursor-pointer"
      >
        Team Name
      </th>
      <th
        onClick={() => orderTeams("country_name")}
        className="border border-gray-400 px-2 py-1 cursor-pointer"
      >
        Country
      </th>
      <th
        onClick={() => orderTeams("discipline_name")}
        className="border border-gray-400 px-2 py-1 cursor-pointer"
      >
        Discipline Name
      </th>
      <th
        onClick={() => orderTeams("team_gender")}
        className="border border-gray-400 px-2 py-1 cursor-pointer"
      >
        Gender
      </th>
      <th
        onClick={() => orderTeams("num_athletes")}
        className="border border-gray-400 px-2 py-1 cursor-pointer"
      >
        Number of Athletes
      </th>
      <th className="border border-gray-400 px-2 py-1"></th>
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
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setNewTeamModal({
                          update: handleGetTeams,
                          team,
                          edit: true,
                        })
                      }
                    >
                      <FaEdit className="w-6 h-6" />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => handleDeleteTeam(team.team_code)}
                    >
                      <MdDelete className="w-6 h-6" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
          {pageNumbers.map((number) => (
            <option key={number} value={number}>
              Page {number}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
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
