"use client";
import { Button } from "@/components/button";
import { useModalStore } from "@/lib/store";
import { deleteEvent, getDisciplines, getEvents } from "@/service/service";
import { useSearchParams, usePathname, useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaEdit, FaExternalLinkSquareAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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
      .catch((err) => alert(err))
      .finally(() => { 
        setLoading(false)
      });
  }

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = events.slice(indexOfFirstItem, indexOfLastItem);

  const setNewEventModal = useModalStore((state) => state.setNewEventModal);

  const pageNumbers = [];
  for(let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleDeleteEvent = async (id) => {
    deleteEvent(id).then((res) => {
      if(res.status === 200) {
        setEvents(events.filter((event) => event.events_code !== id));
      }
    }).catch((error) => {
      alert(error);
    }).finally(() => {
      handleGetEvents();
    });
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
      <div className="flex items-center justify-between my-4">
        <h1 className="text-3xl">Events</h1>
        <div className="flex gap-x-2">
          <Button onClick={() => setNewEventModal({ update: handleGetEvents, disciplines: disciplines })} className="">
            Create New Event
          </Button>
        </div>
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
                setDiscipline(e.target.value);
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
                  {event.discipline_code}
                </td>
                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                  <div className="flex gap-1">
                    <div className="cursor-pointer" onClick={() => { handleDeleteEvent(event.events_code) }}>
                      <MdDelete className="w-6 h-6" />
                    </div>
                    <div className="cursor-pointer" onClick={() => { setNewEventModal({ update: handleGetEvents, edit: true, event: event, disciplines: disciplines }) }}
                    >
                      <FaEdit className="w-6 h-6" />
                    </div>
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
