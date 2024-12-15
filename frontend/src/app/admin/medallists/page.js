"use client";

import { Button } from "@/components/button";
import { getMedallists, deleteMedallist } from "@/service/service";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {useModalStore} from "@/lib/store";

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
  const [gender, setGender] = useState(params.get("gender") ?? "");
  const [discipline, setDiscipline] = useState(params.get("discipline") ?? "");
  const [event, setEvent] = useState(params.get("event") ?? "");
  const [country_code, setCountryCode] = useState(params.get("country_code") ?? "");
  const [order, setOrder] = useState(params.get("order") ?? "");
  const [orderBy, setOrderBy] = useState(params.get("order_by") ?? "");

  const setNewMedallistModalData = useModalStore((state) => state.setNewMedallistModalData);

  useEffect(() => {
    handleGetMedallists();
    // Reset pagination and inputs based on new params
    setCurrentPage(1);
    setMedalDate(params.get("medal_date") ?? "");
    setMedalCode(params.get("medal_code") ?? "");
    setGender(params.get("gender") ?? "");
    setDiscipline(params.get("discipline") ?? "");
    setEvent(params.get("event") ?? "");
    setCountryCode(params.get("country_code") ?? "");
    setOrder(params.get("order") ?? "");
    setOrderBy(params.get("order_by") ?? "");
  }, [params]);

  const handleGetMedallists = async () => {
    let filter = {};
    if (params.get("medal_date")) filter.medal_date = params.get("medal_date");
    if (params.get("medal_code")) filter.medal_code = params.get("medal_code");
    if (params.get("gender")) filter.gender = params.get("gender");
    if (params.get("discipline")) filter.discipline = params.get("discipline");
    if (params.get("event")) filter.event = params.get("event");
    if (params.get("country_code")) filter.country_code = params.get("country_code");
    if (params.get("order")) filter.order = params.get("order");
    if (params.get("order_by")) filter.order_by = params.get("order_by");

    setLoading(true);
    getMedallists(filter)
      .then((res) => {
        setMedallists(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Pagination
  const totalPages = Math.ceil(medallists.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = medallists.slice(indexOfFirstItem, indexOfLastItem);

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

  const handleDeleteMedallist = async (id) => {
    deleteMedallist(id)
      .then((res) => {
        if (res.status === 200) {
          setMedallists(medallists.filter((medallist) => medallist.id !== id));
        }
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        handleGetMedallists();
      });
  };

  const orderMedallists = (col) => {
    const current = new URLSearchParams(Array.from(params.entries()));
    if (!col) {
      current.delete("order_by");
      current.delete("order");
    } else {
      if (orderBy === col) {
        // If same column clicked, switch order asc -> desc -> none
        if (order === "asc") {
          current.set("order", "desc");
        } else if (order === "desc") {
          current.delete("order_by");
          current.delete("order");
        } else {
          current.set("order", "asc");
        }
      } else {
        current.set("order_by", col);
        current.set("order", "desc"); // default start as descending or ascending as per need
      }
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`);
  };

  if (loading && params.size === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container m-auto">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-3xl">Medallists</h1>
        <Button onClick={() => setNewMedallistModalData({ update: handleGetMedallists })}>
          Create New Medallist
        </Button>
      </div>

      <div>
        <h3 className="text-xl font-semibold inline-block mr-4">Filters</h3>
        <Button size="xs" onClick={() => router.push(pathname)} className="mb-4 inline-block text-xs px-2 py-1">
          Clear Filters
        </Button>
        <div className="flex flex-wrap gap-2 items-center">
          <div>
            <label className="mr-1">Medal Date:</label>
            <input
              type="date"
              className="border border-gray-400 rounded-md p-1 h-[34px]"
              value={medal_date}
              onChange={(e) => {
                setMedalDate(e.target.value);
                onChange({ event: e, name: "medal_date" });
              }}
            />
          </div>
          <div>
            <label className="mr-1">Medal Code:</label>
            <input
              type="text"
              className="border border-gray-400 rounded-md p-1 h-[34px]"
              value={medal_code}
              onChange={(e) => {
                setMedalCode(e.target.value);
                onChange({ event: e, name: "medal_code" });
              }}
            />
          </div>
          <div>
            <label className="mr-1">Gender:</label>
            <select
              className="border border-gray-400 rounded-md p-1 h-[34px]"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                onChange({ event: e, name: "gender" });
              }}
            >
              <option value="">All</option>
              <option value="m">Male</option>
              <option value="w">Female</option>
              <option value="x">Mixed</option>
            </select>
          </div>
          <div>
            <label className="mr-1">Discipline:</label>
            <input
              type="text"
              className="border border-gray-400 rounded-md p-1 h-[34px]"
              value={discipline}
              onChange={(e) => {
                setDiscipline(e.target.value);
                onChange({ event: e, name: "discipline" });
              }}
            />
          </div>
          <div>
            <label className="mr-1">Event:</label>
            <input
              type="text"
              className="border border-gray-400 rounded-md p-1 h-[34px]"
              value={event}
              onChange={(e) => {
                setEvent(e.target.value);
                onChange({ event: e, name: "event" });
              }}
            />
          </div>
          <div>
            <label className="mr-1">Country Code:</label>
            <input
              type="text"
              className="border border-gray-400 rounded-md p-1 h-[34px]"
              value={country_code}
              onChange={(e) => {
                setCountryCode(e.target.value);
                onChange({ event: e, name: "country_code" });
              }}
            />
          </div>
        </div>
      </div>

      {medallists.length === 0 ? (
        <p className="text-lg font-semibold mt-4">No medallists found</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <SortableHeader
                title="Medal Date"
                column="medal_date"
                orderBy={orderBy}
                order={order}
                onClick={orderMedallists}
              />
              <SortableHeader
                title="Medal Code"
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
              <th className="border border-gray-400 px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((medallist) => (
              <tr key={medallist.id} className="border-b">
                <td className="border border-gray-400 px-2 py-1">{medallist.medal_date}</td>
                <td className="border border-gray-400 px-2 py-1">{medallist.medal_code}</td>
                <td className="border border-gray-400 px-2 py-1">{medallist.gender}</td>
                <td className="border border-gray-400 px-2 py-1">{medallist.discipline}</td>
                <td className="border border-gray-400 px-2 py-1">{medallist.event}</td>
                <td className="border border-gray-400 px-2 py-1">
                  <div className="flex gap-1">
                    <div className="cursor-pointer" onClick={() => handleDeleteMedallist(medallist.id)}>
                      <MdDelete className="w-6 h-6" />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setNewMedallistModalData({
                          update: handleGetMedallists,
                          medallist: medallist,
                          edit: true,
                        })
                      }
                    >
                      <FaEdit className="w-6 h-6" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
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