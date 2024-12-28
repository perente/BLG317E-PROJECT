"use client";

import { Button } from "@/components/button";
import { getMedallists, getDisciplines, getEvents } from "@/service/service";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {log} from "next/dist/server/typescript/utils";

function Medallists() {
  const [medallists, setMedallists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Filters & Sorting
  const [medal_date, setMedalDate] = useState(params.get("medal_date") ?? "");
  const [medal_code, setMedalCode] = useState(params.get("medal_code") ?? "");
  const [athlete_gender, setAthleteGender] = useState(params.get("athlete_gender") ?? "");
  const [country_code, setCountryCode] = useState(params.get("country_code") ?? "");
  const [athlete_name, setAthleteName] = useState(params.get("athlete_name") ?? "");
  const [order, setOrder] = useState(params.get("order") ?? "");
  const [orderBy, setOrderBy] = useState(params.get("order_by") ?? "");

  // New discipline and event filters
  const [discipline, setDiscipline] = useState(params.get("discipline") ?? "");
  const [event, setEvent] = useState(params.get("event") ?? "");
  const [disciplines, setDisciplines] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    handleGetMedallists();
    // Reset pagination and inputs based on new params
    setCurrentPage(1);
    setMedalDate(params.get("medal_date") ?? "");
    setMedalCode(params.get("medal_code") ?? "");
    setAthleteGender(params.get("athlete_gender") ?? "");
    setDiscipline(params.get("discipline") ?? "");
    setEvent(params.get("event") ?? "");
    setCountryCode(params.get("country_code") ?? "");
    setOrder(params.get("order") ?? "");
    setOrderBy(params.get("order_by") ?? "");

    fetchDisciplinesAndEvents();
  }, [params]);

  const fetchDisciplinesAndEvents = async () => {
  try {
    const disciplinesData = await getDisciplines();
    setDisciplines(disciplinesData.data);

    // Fetch events only if a discipline is selected
    if (discipline) {
      const eventsData = await getEvents();
      setEvents(eventsData.data);
    } else {
      setEvents([]); // Clear events when no discipline is selected
    }
  } catch (error) {
    alert("Failed to fetch disciplines or events.");
  }
};

  const handleGetMedallists = async () => {
    let filter = {};
    if (params.get("medal_date")) filter.medal_date = params.get("medal_date");
    if (params.get("medal_code")) filter.medal_code = params.get("medal_code");
    if (params.get("discipline")) filter.discipline = params.get("discipline");
    if (params.get("event")) filter.event = params.get("event");
    if (params.get("country_code")) filter.country_code = params.get("country_code");
    if (params.get("athlete_name")) filter.athlete_name = params.get("athlete_name");
    if (params.get("athlete_gender")) filter.athlete_gender = params.get("athlete_gender");
    if (params.get("order")) filter.order = params.get("order");
    if (params.get("order_by")) filter.order_by = params.get("order_by");

    setLoading(true);
    console.log(filter);
    try {
      const res = await getMedallists(filter);
      setMedallists(res.data);
    } finally {
      setLoading(false);
    }
  };

  // Pagination

  const onChange = ({ event, name }) => {
    const current = new URLSearchParams(Array.from(params.entries()));
    const value = event.target.value.trim();
    if (!value) {
      current.delete(name);
    } else {
      current.set(name, event.target.value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`);
  };

  const orderMedallists = (orderBy) => {
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
    router.replace(`${pathname}${query}`);
  };

  const totalPages = Math.ceil(medallists.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = medallists.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container m-auto">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-3xl">Medallists</h1>
      </div>

      <div>
        <h3 className="text-xl font-semibold inline-block mr-4">Filters</h3>
        <Button size="xs" onClick={() => router.push(pathname)} className="mb-4 inline-block text-xs px-2 py-1">
          Clear Filters
        </Button>
        <div className="flex flex-wrap gap-2">
          {/* Existing Filters */}
          <div>
            <label>Name:</label>
            <input
                type="text"
                className="border border-gray-400 rounded-md p-1 h-[34px]"
                value={athlete_name}
                onChange={(e) => {
                  setAthleteName(e.target.value);
                  onChange({event: e, name: "athlete_name"});
                }}
            />
          </div>
          <div>
            <label>Medal Date:</label>
            <input
                type="date"
                className="border border-gray-400 rounded-md p-1 h-[34px]"
                value={medal_date}
                onChange={(e) => {
                  setMedalDate(e.target.value);
                  onChange({event: e, name: "medal_date"});
                }}
            />
          </div>
          <div>
            <label>Medal:</label>
            <select
                className="border border-gray-400 rounded-md p-1 h-[34px]"
                value={medal_code}
                onChange={(e) => {
                  setMedalCode(e.target.value);
                  onChange({event: e, name: "medal_code"});
                }}
            >
              <option value="">All</option>
              {["Gold", "Silver", "Bronze"].map((medal, index) => (
                  <option key={index} value={index + 1}>
                    {medal}
                  </option>
              ))}
            </select>
          </div>
          <div>
            <label>Gender:</label>
            <select
                className="border border-gray-400 rounded-md p-1 h-[34px]"
                value={athlete_gender}
                onChange={(e) => {
                  setAthleteGender(e.target.value);
                  onChange({event: e, name: "athlete_gender"});
                }}
            >
              <option value="">All</option>
              <option value="m">Male</option>
              <option value="f">Female</option>
              <option value="x">Mixed</option>
            </select>
          </div>
          <div>
            <label>Country Code:</label>
            <input
                type="text"
                className="border border-gray-400 rounded-md p-1 h-[34px]"
                value={country_code}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  onChange({event: e, name: "country_code"});
                }}
            />
          </div>
          <div>
            <label>Discipline:</label>
            <select
                className="border border-gray-400 rounded-md p-1 h-[34px]"
                value={discipline}
                onChange={(e) => {
                  setDiscipline(e.target.value);
                  setEvent(""); // Reset event when discipline changes
                  onChange({event: e, name: "discipline"});
                }}
            >
              <option value="">All</option>
              {disciplines.map((d) => (
                  <option key={d.discipline_code} value={d.name}>
                    {d.name}
                  </option>
              ))}
            </select>
          </div>
          <div>
            <label>Event:</label>
            <select
                className="border border-gray-400 rounded-md p-1 h-[34px]"
                value={event}
                onChange={(e) => {
                  setEvent(e.target.value);
                  onChange({event: e, name: "event"});
                }}
            >
              <option value="">All</option>
              {events
                  .filter((e) => !discipline || e.sport_name === discipline)
                  .map((e) => {
                    return (
                        // Combine discipline and event_name to ensure uniqueness
                        <option key={`${e.sport_name}-${e.event_name}`} value={e.event_name}>
                          {e.event_name}
                        </option>
                    );
                  })}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
          <p className="text-lg font-semibold mt-4">Loading...</p>
      ) : medallists.length === 0 ? (
          <p className="text-lg font-semibold mt-4">No medallists found</p>
      ) : (
          <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
            <thead>
            <tr className="bg-gray-200">
              <SortableHeader
                  title="Name"
                  column="name"
                  orderBy={orderBy}
                  order={order}
                  onClick={orderMedallists}
              />
              <SortableHeader
                  title="Medal Date"
              column="medal_date"
                orderBy={orderBy}
                order={order}
                onClick={orderMedallists}
              />
              <SortableHeader
                title="Medal"
                column="medal_code"
                orderBy={orderBy}
                order={order}
                onClick={orderMedallists}
              />
              <SortableHeader
                title="Gender"
                column="gender"
                orderBy={orderBy}
                order={order}
                onClick={orderMedallists}
              />
              <SortableHeader
                title="Discipline"
                column="discipline"
                orderBy={orderBy}
                order={order}
                onClick={orderMedallists}
              />
              <SortableHeader
                title="Event"
                column="event"
                orderBy={orderBy}
                order={order}
                onClick={orderMedallists}
              />
            </tr>
          </thead>
          <tbody>
            {currentItems.map((medallist) => (
              <tr key={medallist.id} className="border-b">
                <td className="border border-gray-400 px-2 py-1">{medallist.athlete_name}</td>
                <td className="border border-gray-400 px-2 py-1">{new Date(medallist.medal_date).toDateString()}</td>
                <td className="border border-gray-400 px-2 py-1 text-3xl">{medallist.medal_code === 1 ? "🥇" : (medallist.medal_code === 2 ? "🥈" : "🥉")}</td>
                <td className="border border-gray-400 px-2 py-1">{medallist.athlete_gender}</td>
                <td className="border border-gray-400 px-2 py-1">{medallist.discipline}</td>
                <td className="border border-gray-400 px-2 py-1">{medallist.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {medallists.length > itemsPerPage && (
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
      )}
    </div>
  );
}

// A helper component for sortable headers with arrows
function SortableHeader({ title, column, orderBy, order, onClick }) {
  return (
    <th
      onClick={() => onClick(column)}
      className="border border-gray-400 px-2 py-1 cursor-pointer"
    >
      <div className="flex items-center justify-center">
        <span>{title}</span>
        <div className="opacity-10 flex items-center justify-center flex-col ml-1">
          <TiArrowSortedDown
            className={"w-5 h-5 mt-[6px] " + (orderBy === column && order === "asc" ? "opacity-100" : "opacity-30")}
            style={{ rotate: "180deg" }}
          />
          <TiArrowSortedDown
            className={"w-5 h-5 mt-[-10px] " + (orderBy === column && order === "desc" ? "opacity-100" : "opacity-30")}
            style={{ rotate: "0deg" }}
          />
        </div>
      </div>
    </th>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Medallists />
    </Suspense>
  );
}