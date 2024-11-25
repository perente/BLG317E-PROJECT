"use client";
import { Button } from "@/components/button";
import { useModalStore } from "@/lib/store";
import { deleteSchedule, getSchedules } from "@/service/service";
import { useEffect, useState } from "react";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function Page() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    handleGetSchedules();
  }, []);

  const handleGetSchedules = async () => {
    setLoading(true);
    getSchedules()
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




  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container m-auto">
      <h1 className="text-3xl my-4">Schedules</h1>
      <Button onClick={toggleNewScheduleModal} className="mb-4">
        Create New Schedule
      </Button>
      <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
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
      </table>

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
  );
}
