"use client";
import { Button } from "@/components/button";
import { getDisciplines, getEvents, getTopSports } from "@/service/service";
import { useSearchParams, usePathname, useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaEdit, FaExternalLinkSquareAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topSports, setTopSports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [event_name, setEventName] = useState(params.get("event_name") ?? "");
  const [sport_name, setSportName] = useState(params.get("sport_name") ?? "");
  const [discipline_code, setDisciplineCode] = useState(params.get("discipline_code") ?? "");
  const [order, setOrder] = useState(params.get("order") ?? "");
  const [orderBy, setOrderBy] = useState(params.get("order_by") ?? "");
  const [disciplines, setDisciplines] = useState([]);


  useEffect(() => {
    handleGetEvents();
    getDisciplines().then((res) => {
      setDisciplines(res.data);
    }).catch((error) => {
      alert(error);
    });
    setCurrentPage(1);
    setEventName(params.get("event_name") ?? "");
    setSportName(params.get("sport_name") ?? "");
    setDisciplineCode(params.get("discipline_code") ?? "");
    setOrder(params.get("order") ?? "");
    setOrderBy(params.get("order_by") ?? "");
  }, [params]);

  const handleGetEvents = async () => {
    let filter = {};
    if (params.get("event_name")) filter.event_name = params.get("event_name");
    if (params.get("sport_name")) filter.sport_name = params.get("sport_name");
    if (params.get("discipline_code")) filter.discipline_code = params.get("discipline_code");
    if (params.get("order")) filter.order = params.get("order");
    if (params.get("order_by")) filter.order_by = params.get("order_by");
    
    setLoading(true);
    getEvents(filter)
      .then((res) => {
        setEvents(res.data);
      })
      .finally(() => { 
        setLoading(false)
      });
  }

  const handleGetTopSports = async () => {
    try {
      const res = await getTopSports();
      setTopSports(res.data);
      setIsModalOpen(true);
    } catch (error) {
      alert("Failed to find top sports: " + error.message);
    }
  }

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = events.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for(let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const onChange = ({ event, name }) => {
    const current = new URLSearchParams(Array.from(params.entries()));
    const value = event.target.value.trim();
    if (!value) current.delete(name);
    else current.set(name, event.target.value);

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`)
  };

  function updateSearchParamForCurrentPage({ key, value }) {
    const { replace } = useRouter();
    const newUrl = updateSearchParam({ key, value })
    replace(newUrl)
}

  const orderEvents = (orderBy) => {
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
    <div className="container mx-auto pb-4">
      <div className="flex justify-end my-4">
        <Button onClick={()=>{handleGetTopSports()}} className="px-4 py-2 rounded">
          Display Top Sports
        </Button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Top Sports</h2>
            {topSports.length > 0 ? (
              <ul className="list-disc pl-5">
                {topSports.map((sport, index) => (
                  <li key={index} className="mb-1">
                    {sport.sport_name} - {sport.event_count} events
                  </li>
                ))}
              </ul>
            ) : (
              <p>No top sports found.</p>
            )}
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between my-4">
        <h1 className="text-3xl">Events</h1>
      </div>
      <div>
        <h3 className="text-xl font-semibold inline-block mr-4">Filters</h3>
        <Button size="xs" onClick={() => router.push(pathname)} className="mb-4 inline-block text-xs px-2 py-1">
          Clear Filters
        </Button>
        <div className="flex gap-2 items-center">
                <div className="">
            <label htmlFor="" className="mr-1">Event Name:</label>
            <select
              name="event_name"
              className="border border-gray-400 rounded-md p-1 h-[34px] w-full"
              value={event_name}
              onChange={(e) => {
                setEventName(e.target.value);
                onChange({ event: e, name: "event_name" });
              }}
            >
              <option value="">All</option>
              {events
                .map((event) => event.event_name)
                .filter((value, index, self) => self.indexOf(value) === index) // Get unique values
                .map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
            </select>
          </div>
          <div className="">
            <label htmlFor="" className="mr-1">Sport Name:</label>
            <select
              name="sport_name"
              className="border border-gray-400 rounded-md p-1 h-[34px] w-full"
              value={sport_name}
              onChange={(e) => {
                setSportName(e.target.value);
                onChange({ event: e, name: "sport_name" });
              }}
            >
              <option value="">All</option>
              {events
                .map((event) => event.sport_name)
                .filter((value, index, self) => self.indexOf(value) === index) // Get unique values
                .map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
            </select>
          </div>
          <div className="">
            <label htmlFor="discipline" className="mr-1">Discipline Code:</label>
            <select className="border border-gray-400 rounded-md p-1 h-[34px] w-full"
              value={discipline_code}
              onChange={(e) => {
                setDisciplineCode(e.target.value);
                onChange({ event: e, name: "discipline_code" });
              }}
            >
              <option value="">All</option>
              {disciplines
                .map((discipline) => discipline.discipline_code)
                .filter((value, index, self) => self.indexOf(value) === index) // Get unique values
                .map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      {events.length === 0 ?

        <p className="text-lg font-semibold mt-4">No events found</p>

        : <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th
                onClick={() => orderEvents("event_name")}
                className="border border-gray-400 px-2 py-1 cursor-pointer">
                <div className="flex items-center justify-center">
                  <span>Event Name</span>
                  <div className="opcity-10 flex items-center justify-center flex-col">
                    <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "event_name" && order === "asc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "180deg" }} />
                    <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "event_name" && order === "desc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "0deg" }} />
                  </div>
                </div>
              </th>
              <th
                onClick={() => orderEvents("sport_name")}
                className="border border-gray-400 px-2 py-1 cursor-pointer">
                <div className="flex items-center justify-center">
                  <span>Sport Name</span>
                  <div className="opcity-10 flex items-center justify-center flex-col">
                    <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "sport_name" && order === "asc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "180deg" }} />
                    <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "sport_name" && order === "desc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "0deg" }} />
                  </div>
                </div>
              </th>
              <th
                onClick={() => orderEvents("discipline_code")}
                className="border border-gray-400 px-2 py-1 cursor-pointer">
                <div className="flex items-center justify-center">
                  <span>Discipline Code</span>
                  <div className="opcity-10 flex items-center justify-center flex-col">
                    <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "discipline_code" && order === "asc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "180deg" }} />
                    <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "discipline_code" && order === "desc" ? "opacity-100" : "opacity-30")}
                      style={{ rotate: "0deg" }} />
                  </div>
                </div>
              </th>
              <th className="border border-gray-400 px-2 py-1 cursor-pointer"></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((event) => (
              <tr key={event.events_code} className="border-b">
                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                  {event.event_name}
                </td>
                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                  {event.sport_name}
                </td>
                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                  <div className="flex items-center gap-5">
                    <span>{event.discipline_code}</span>
                    <div className="flex justify-center">
                      <img
                        className="w-10 h-10"
                        src={`https://gstatic.olympics.com/s1/t_original/static/light/pictograms-paris-2024/olympics/${event.discipline_code}_small.svg`}
                        onError={(e) => {
                          e.target.src = "https://olympics.com/images/static/b2p-images/logo_color.svg";
                        }}
                        alt={`${event.discipline_code} icon`}
                      />
                    </div>
                  </div>
                </td>
                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                  <div className="flex gap-1">
                    {event?.url ? (
                      <a
                        href={event?.url.startsWith("http") ? event?.url : "https://olympics.com" + event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaExternalLinkSquareAlt className="w-5 h-5 mt-[2px]" />
                      </a>
                    ) : (
                      "No URL"
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}

      {/* Pagination */}
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
    </div >
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Events />
    </Suspense>
  );
}