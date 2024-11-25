"use client";
import { Button } from "@/components/button";
import { useModalStore } from "@/lib/store";
import { deleteSchedule, getSchedules } from "@/service/service";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function Page() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 10; // Number of items per page
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [start_date, setStartDate] = useState(params.get("start_date") ?? "");
  const [end_date, setEndDate] = useState(params.get("end_date") ?? "");
  const [status, setStatus] = useState(params.get("status") ?? "");
  const [venue, setVenue] = useState(params.get("venue") ?? "");
  const [phase, setPhase] = useState(params.get("phase") ?? "");
  const [event_code, setEventCode] = useState(params.get("event_code") ?? "");
  const [discipline, setDiscipline] = useState(params.get("discipline") ?? "");
  const [gender, setGender] = useState(params.get("gender") ?? "");

  useEffect(() => {
    handleGetSchedules();
    setCurrentPage(1);
    setStartDate(params.get("start_date") ?? "");
    setEndDate(params.get("end_date") ?? "");
    setStatus(params.get("status") ?? "");
    setVenue(params.get("venue") ?? "");
    setPhase(params.get("phase") ?? "");
    setEventCode(params.get("event_code") ?? "");
    setDiscipline(params.get("discipline") ?? "");
    setGender(params.get("gender") ?? "");
  }, [params]);



  const handleGetSchedules = async () => {
    let filter = {};
    if (params.get("discipline")) filter.discipline_code = params.get("discipline");
    if (params.get("start_date")) filter.start_date = params.get("start_date");
    if (params.get("end_date")) filter.end_date = params.get("end_date");
    if (params.get("venue")) filter.venue = params.get("venue");
    if (params.get("phase")) filter.phase = params.get("phase");
    if (params.get("event_code")) filter.event_code = params.get("event_code");
    if (params.get("status")) filter.status = params.get("status");
    if (params.get("gender")) filter.gender = params.get("gender");


    setLoading(true);
    getSchedules(filter)
      .then((res) => {
        setSchedules(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Calculate total pages
  const totalPages = Math.ceil(schedules.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = schedules.slice(indexOfFirstItem, indexOfLastItem);

  const toggleNewScheduleModal = useModalStore((state) => state.toggleNewScheduleModal);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleDeleteSchedule = async (id) => {
    deleteSchedule(id).then((res) => {
      if (res.status === 200) {
        setSchedules(schedules.filter((schedule) => schedule.schedule_code !== id));
      }
    }).catch((error) => {
      alert(error);
    }).finally(() => {
      handleGetSchedules();
    });
  }
  const onChange = ({ event, name }) => {
    const current = new URLSearchParams(Array.from(params.entries())); // -> has to use this form
    const value = event.target.value.trim();
    if (!value) {
      current.delete(name);
    } else {
      current.set(name, event.target.value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`)
  };


  if (loading && params.size === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container m-auto">
        <h1 className="text-3xl my-4">Schedules</h1>
        <Button onClick={toggleNewScheduleModal} className="mb-4">
          Create New Schedule
        </Button>
        <div>
          <h3 className="text-xl font-semibold inline-block mr-4">Filters</h3>
          <Button size="xs" onClick={() => router.push(pathname)} className="mb-4 inline-block text-xs px-2 py-1">
            Clear Filters
          </Button>
          <div className="flex gap-2 items-center">
            <div className="">
              <label htmlFor="" className="mr-1">Start Date:</label>
              <input
                type="datetime-local"
                className="border border-gray-400 rounded-md p-1 h-[34px]"
                value={start_date}
                max={params.get("end_date")}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  onChange({ event: e, name: "start_date" });
                }}
              />
            </div>
            <div className="">
              <label htmlFor="" className="mr-1">End Date:</label>
              <input
                type="datetime-local"
                className="border border-gray-400 rounded-md p-1 h-[34px]"
                value={end_date}
                min={params.get("start_date")}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  onChange({ event: e, name: "end_date" });
                }}
              />
            </div>
            <div className="">
              <label htmlFor="discipline" className="mr-1">Status:</label>
              <select className="border border-gray-400 rounded-md p-1 h-[34px] w-full"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  onChange({ event: e, name: "status" });
                }}
              >
                <option value="">All</option>
                <option value="finished">Finished</option>
                <option value="canceled">Canceled</option>
                <option value="active">Active</option>
              </select>
            </div>
            <div className="">
              <label htmlFor="discipline" className="mr-1">Gender:</label>
              <select className="border border-gray-400 rounded-md p-1 h-[34px] w-full"
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  onChange({ event: e, name: "gender" });
                }}
              >
                <option value="">All</option>
                <option value="w">Woman</option>
                <option value="m">Man</option>
                <option value="x">Mixed</option>
                <option value="o">O</option>
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
                <option value="ARC">ARC</option>
                <option value="GAR">GAR</option>
                <option value="SWA">SWA</option>
              </select>
            </div>
            <div className="">
              <label htmlFor="discipline" className="mr-1">Event:</label>
              <select className="border border-gray-400 rounded-md p-1 h-[34px] w-full"
                value={event_code}
                onChange={(e) => {
                  setEventCode(e.target.value);
                  onChange({ event: e, name: "event_code" });
                }}
              >
                <option value="">All</option>
                <option value="1">E1</option>
                <option value="2">E2</option>
              </select>
            </div>
            <div className="">
              <label htmlFor="venue" className="mr-1">Venue:</label>
              <input
                type="text"
                name="venue"
                className="border border-gray-400 rounded-md p-1 h-[34px]"
                value={venue}
                onChange={(e) => {
                  setVenue(e.target.value);
                  onChange({ event: e, name: "venue" });
                }}
              />
            </div>
            <div className="">
              <label htmlFor="phase" className="mr-1">Phase:</label>
              <input
                type="text"
                name="phase"
                className="border border-gray-400 rounded-md p-1 h-[34px]"
                value={phase}
                onChange={(e) => {
                  setPhase(e.target.value);
                  onChange({ event: e, name: "phase" });
                }}
              />
            </div>
          </div>
        </div>
        {schedules.length === 0 ?

          <p className="text-lg font-semibold mt-4">No schedules found</p>

          : <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
            <thead>
              <tr className="bg-gray-200">
                {/* Table headers remain the same */}
                <th className="border border-gray-400 px-2 py-1">Start Date</th>
                <th className="border border-gray-400 px-2 py-1">End Date</th>
                <th className="border border-gray-400 px-2 py-1">Gender</th>
                <th className="border border-gray-400 px-2 py-1">Status</th>
                <th className="border border-gray-400 px-2 py-1">Event Name</th>
                <th className="border border-gray-400 px-2 py-1">Venue</th>
                <th className="border border-gray-400 px-2 py-1">Phase</th>
                <th className="border border-gray-400 px-2 py-1">Discipline Name</th>
                <th className="border border-gray-400 px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((schedule) => (
                <tr key={schedule.schedule_code} className="border-b">
                  {/* Table data remains the same */}
                  <td className="border border-gray-400 px-2 py-1">
                    {schedule.start_date}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {schedule.end_date}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {schedule.gender}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {schedule.status}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {schedule.event_name}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {schedule.venue}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {schedule.phase}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {schedule.name}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    <div className="flex gap-1">
                      <a
                        href={"https://olympics.com" + schedule.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaExternalLinkSquareAlt className="w-5 h-5 mt-[2px]" />
                      </a>
                      <div className="cursor-pointer" onClick={() => { handleDeleteSchedule(schedule.schedule_code) }}>
                        <MdDelete className="w-6 h-6" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>}

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
    </Suspense>
  );
}
