"use client";
import { getSchedules } from "@/service/service";
import { useEffect, useState } from "react";

export default function Page() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    setLoading(true);
    getSchedules()
      .then((res) => {
        setSchedules(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(schedules.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = schedules.slice(indexOfFirstItem, indexOfLastItem);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
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
      <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
        <thead>
          <tr className="bg-gray-200">
            {/* Table headers remain the same */}
            <th className="border border-gray-400 px-2 py-1">Start Date</th>
            <th className="border border-gray-400 px-2 py-1">End Date</th>
            <th className="border border-gray-400 px-2 py-1">Gender</th>
            <th className="border border-gray-400 px-2 py-1">Status</th>
            <th className="border border-gray-400 px-2 py-1">Event Name</th>
            <th className="border border-gray-400 px-2 py-1">Event Code</th>
            <th className="border border-gray-400 px-2 py-1">Venue</th>
            <th className="border border-gray-400 px-2 py-1">Phase</th>
            <th className="border border-gray-400 px-2 py-1">Schedule Code</th>
            <th className="border border-gray-400 px-2 py-1">Discipline Code</th>
            <th className="border border-gray-400 px-2 py-1">URL</th>
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
                {schedule.event_code}
              </td>
              <td className="border border-gray-400 px-2 py-1">
                {schedule.venue}
              </td>
              <td className="border border-gray-400 px-2 py-1">
                {schedule.phase}
              </td>
              <td className="border border-gray-400 px-2 py-1">
                {schedule.schedule_code}
              </td>
              <td className="border border-gray-400 px-2 py-1">
                {schedule.discipline_code}
              </td>
              <td className="border border-gray-400 px-2 py-1">
                <a
                  href={"https://olympics.com" + schedule.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to details
                </a>
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
