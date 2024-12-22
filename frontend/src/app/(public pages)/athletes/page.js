'use client'
import { Button } from "@/components/button";
import { useModalStore } from "@/lib/store";
import { getAthletes, getCountries } from "@/service/service";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaEdit, FaExternalLinkSquareAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";

const Athletes = () => {
    const [athletes, setAthletes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const itemsPerPage = 10; // Number of items per page
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [birth_date, setBirthDate] = useState(params.get("birth_date") ?? "");
    const [gender, setGender] = useState(params.get("gender") ?? "");
    const [nationality, setNationality] = useState(params.get("nationality") ?? "");
    const [country_code, setCountryCode] = useState(params.get("country_code") ?? "");
    const [name, setName] = useState(params.get("name") ?? "");


    const [order, setOrder] = useState(params.get("order") ?? "");
    const [orderBy, setOrderBy] = useState(params.get("order_by") ?? "");
    const [countries, setCountries] = useState([]);



    useEffect(() => {
        handleGetAthletes();
        getCountries().then((res) => {
            setCountries(res.data);
        }).catch((error) => {
            alert(error);
        });
        setCurrentPage(1);
        setBirthDate(params.get("birth_date") ?? "");
        setGender(params.get("gender") ?? "");
        setNationality(params.get("nationality") ?? "");
        setCountryCode(params.get("country_code") ?? "");
        setName(params.get("name") ?? "");
        setOrder(params.get("order") ?? "");
        setOrderBy(params.get("order_by") ?? "");
    }, [params]);


    const handleGetAthletes = async () => {
        let filter = {};
        if (params.get("athlete_code")) filter.athlete_code = params.get("athlete_code");
        if (params.get("name")) filter.name = params.get("name");
        if (params.get("country_code")) filter.country_code = params.get("country_code");
        if (params.get("nationality")) filter.nationality = params.get("nationality");
        if (params.get("gender")) filter.gender = params.get("gender");
        if (params.get("birth_date")) filter.birth_date = params.get("birth_date");

        setLoading(true);
        getAthletes(filter) // This function fetches athlete data
            .then((res) => {
                setAthletes(res.data); // Assuming res.data contains the athletes
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Calculate total pages
    const totalPages = Math.ceil(athletes.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = athletes.slice(indexOfFirstItem, indexOfLastItem);

    const setNewAthleteModal = useModalStore((state) => state.setNewAthleteModal);

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
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
        router.replace(`${pathname}${query}`)
    };




    function updateSearchParamForCurrentPage({ key, value }) {
        const { replace } = useRouter();
        const newUrl = updateSearchParam({ key, value })
        replace(newUrl)
    }


    const orderAthletes = (orderBy) => {
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
                <h1 className="text-3xl">Athletes</h1>
            </div>
            <div>
                <h3 className="text-xl font-semibold inline-block mr-4">Filters</h3>
                <Button size="xs" onClick={() => router.push(pathname)} className="mb-4 inline-block text-xs px-2 py-1">
                    Clear Filters
                </Button>

                {/* Filtering */}

                <div className="flex gap-6 items-center">
                    <div className="flex flex-col">
                        <label htmlFor="" className="mr-1">Birth Date:</label>
                        <input
                            type="datetime-local"
                            className="border border-gray-400 rounded-md p-1 h-[34px]"
                            value={birth_date}
                            /*max={params.get("end_date")}*/
                            onChange={(e) => {
                                setBirthDate(e.target.value);
                                onChange({ event: e, name: "birth_date" });
                            }}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="" className="mr-1">Gender:</label>
                        <select className="border border-gray-400 rounded-md p-1 h-[34px] w-full"
                            value={gender}
                            onChange={(e) => {
                                setGender(e.target.value);
                                onChange({ event: e, name: "gender" });
                            }}
                        >
                            <option value="">All</option>
                            <option value="F">Woman</option>
                            <option value="M">Man</option>
                        </select>
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
                    <div className="flex flex-col">
                        <label htmlFor="nationality" className="mr-1">Nationality:</label>
                        <input
                            type="text"
                            name="nationality"
                            className="border border-gray-400 rounded-md p-1 h-[34px]"
                            value={nationality}
                            onChange={(e) => {
                                setNationality(e.target.value);
                                onChange({ event: e, name: "nationality" });
                            }}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="name" className="mr-1">Name:</label>
                        <input
                            type="text"
                            name="name"
                            className="border border-gray-400 rounded-md p-1 h-[34px]"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                onChange({ event: e, name: "name" });
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Table Content */}
            {athletes.length === 0 ?

                <p className="text-lg font-semibold mt-4">No athletes found</p>

                : <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th
                                onClick={() => orderAthletes("name")}
                                className="border border-gray-400 px-2 py-1 cursor-pointer">
                                <div className="flex items-center justify-center">
                                    <span>Name</span>
                                    <div className="opcity-10 flex items-center justify-center flex-col">
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "name" && order === "asc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "180deg" }} />
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "name" && order === "desc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "0deg" }} />
                                    </div>
                                </div>
                            </th>
                            <th
                                onClick={() => orderAthletes("birth_date")}
                                className="border border-gray-400 px-2 py-1 cursor-pointer">
                                <div className="flex items-center justify-center">
                                    <span>Birth Date</span>
                                    <div className="opcity-10 flex items-center justify-center flex-col ">
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "birth_date" && order === "asc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "180deg" }} />
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "birth_date" && order === "desc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "0deg" }} />
                                    </div>
                                </div>
                            </th>
                            <th
                                onClick={() => orderAthletes("gender")}
                                className="border border-gray-400 px-2 py-1 cursor-pointer">
                                <div className="flex items-center justify-center">
                                    <span>Gender</span>
                                    <div className="opcity-10 flex items-center justify-center flex-col">
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "gender" && order === "asc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "180deg" }} />
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "gender" && order === "desc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "0deg" }} />
                                    </div>
                                </div>
                            </th>

                            <th
                                onClick={() => orderAthletes("country")}
                                className="border border-gray-400 px-2 py-1 cursor-pointer">
                                <div className="flex items-center justify-center">
                                    <span>Country</span>
                                    <div className="opcity-10 flex items-center justify-center flex-col">
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "country" && order === "asc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "180deg" }} />
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "country" && order === "desc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "0deg" }} />
                                    </div>
                                </div>
                            </th>
                            <th
                                onClick={() => orderAthletes("nationality")}
                                className="border border-gray-400 px-2 py-1 cursor-pointer">
                                <div className="flex items-center justify-center">
                                    <span>Nationality</span>
                                    <div className="opcity-10 flex items-center justify-center flex-col">
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "nationality" && order === "asc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "180deg" }} />
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "nationality" && order === "desc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "0deg" }} />
                                    </div>
                                </div>
                            </th>



                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((athlete) => (
                            <tr key={athlete.athlete_code} className="border-b">
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    {athlete.name}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    {athlete.birth_date}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    {athlete.gender}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    {athlete.country_name}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    {athlete.nationality}
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

        </div >


    );
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Athletes />
        </Suspense>
    )
}
