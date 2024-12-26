'use client'
import { Button } from "@/components/button";
import { useModalStore } from "@/lib/store";
import { getCoaches, getCountries, deleteCoaches, getDisciplines } from "@/service/service";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaEdit, FaExternalLinkSquareAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";

const Coaches = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const itemsPerPage = 10; // Number of items per page
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [birth_date, setBirthDate] = useState(params.get("birth_date") ?? "");
    const [gender, setGender] = useState(params.get("gender") ?? "");
    const [coach_function, setCoachFunction] = useState(params.get("coach_function") ?? "");
    const [country_code, setCountryCode] = useState(params.get("country_code") ?? "");
    const [name, setName] = useState(params.get("name") ?? "");
    const [disciplines, setDisciplines] = useState(params.get("disciplines") ?? "");


    const [order, setOrder] = useState(params.get("order") ?? "");
    const [orderBy, setOrderBy] = useState(params.get("order_by") ?? "");
    const [countries, setCountries] = useState([]);
    const [all_disciplines, setAllDisciplines] = useState([]);



    useEffect(() => {
        handleGetCoaches();
        getCountries().then((res) => {
            setCountries(res.data);
        }).catch((error) => {
            alert(error);
        });
        getDisciplines().then((res) => {
            setAllDisciplines(res.data);
        }).catch((error) => {
            alert(error);
        });
        setCurrentPage(1);
        setBirthDate(params.get("birth_date") ?? "");
        setGender(params.get("gender") ?? "");
        setCoachFunction(params.get("coach_function") ?? "");
        setCountryCode(params.get("country_code") ?? "");
        setName(params.get("name") ?? "");
        setDisciplines(params.get("disciplines") ?? "");
        setOrder(params.get("order") ?? "");
        setOrderBy(params.get("order_by") ?? "");
    }, [params]);


    const handleGetCoaches = async () => {
        let filter = {};
        if (params.get("coach_code")) filter.coach_code = params.get("coach_code");
        if (params.get("name")) filter.name = params.get("name");
        if (params.get("country_code")) filter.country_code = params.get("country_code");
        if (params.get("coach_function")) filter.coach_function = params.get("coach_function");
        if (params.get("gender")) filter.gender = params.get("gender");
        if (params.get("birth_date")) filter.birth_date = params.get("birth_date");
        if (params.get("disciplines")) filter.disciplines = params.get("disciplines");
        if (params.get("order")) filter.order = params.get("order");
        if (params.get("order_by")) filter.order_by = params.get("order_by");

        setLoading(true);
        getCoaches(filter) // This function fetches coach data
            .then((res) => {
                setCoaches(res.data); // Assuming res.data contains the coaches
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Calculate total pages
    const totalPages = Math.ceil(coaches.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = coaches.slice(indexOfFirstItem, indexOfLastItem);

    const setNewCoachModal = useModalStore((state) => state.setNewCoachModal);

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleDeleteCoach = async (id) => {
        deleteCoaches(id).then((res) => {
            if (res.status === 200) {
                setCoaches(coaches.filter((coach) => coach.coach_code !== id));
            }
        }).catch((error) => {
            alert(error);
        }).finally(() => {
            handleGetCoaches();
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
        router.replace(`${pathname}${query}`)
    };




    function updateSearchParamForCurrentPage({ key, value }) {
        const { replace } = useRouter();
        const newUrl = updateSearchParam({ key, value })
        replace(newUrl)
    }


    const orderCoaches = (orderBy) => {
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
                <h1 className="text-3xl">Coaches</h1>
                <Button onClick={() => { setNewCoachModal({ update: handleGetCoaches, countries: countries, all_disciplines: all_disciplines }) }} className="">
                    Create New Coach
                </Button>
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
                        <label htmlFor="disciplines" className="mr-1">Disciplines:</label>
                        <select className="border border-gray-400 rounded-md p-1 h-[34px] w-full"
                            value={disciplines}
                            onChange={(e) => {
                                setDisciplines(e.target.value);
                                onChange({ event: e, name: "disciplines" });
                            }}
                        >
                            <option value="">All</option>
                            {all_disciplines.
                                map((discipline) => (
                                    <option key={discipline.discipline_code} value={discipline.name}>{discipline.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="coach_function" className="mr-1">Function:</label>
                        <input
                            type="text"
                            name="coach_function"
                            className="border border-gray-400 rounded-md p-1 h-[34px]"
                            value={coach_function}
                            onChange={(e) => {
                                setCoachFunction(e.target.value);
                                onChange({ event: e, name: "coach_function" });
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
            {coaches.length === 0 ?

                <p className="text-lg font-semibold mt-4">No coaches found</p>

                : <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th
                                onClick={() => orderCoaches("name")}
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
                                onClick={() => orderCoaches("birth_date")}
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
                                onClick={() => orderCoaches("gender")}
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
                                onClick={() => orderCoaches("country_name")}
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
                                onClick={() => orderCoaches("coach_function")}
                                className="border border-gray-400 px-2 py-1 cursor-pointer">
                                <div className="flex items-center justify-center">
                                    <span>Function</span>
                                    <div className="opcity-10 flex items-center justify-center flex-col">
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "coach_function" && order === "asc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "180deg" }} />
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "coach_function" && order === "desc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "0deg" }} />
                                    </div>
                                </div>
                            </th>

                            <th
                                onClick={() => orderCoaches("disciplines")}
                                className="border border-gray-400 px-2 py-1 cursor-pointer">
                                <div className="flex items-center justify-center">
                                    <span>Disciplines</span>
                                    <div className="opcity-10 flex items-center justify-center flex-col">
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[6px] " + (orderBy === "disciplines" && order === "asc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "180deg" }} />
                                        <TiArrowSortedDown className={"w-5 h-5 mt-[-10px] " + (orderBy === "disciplines" && order === "desc" ? "opacity-100" : "opacity-30")}
                                            style={{ rotate: "0deg" }} />
                                    </div>
                                </div>
                            </th>


                            <th className="border border-gray-400 px-2 py-1 cursor-pointer"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((coach) => (
                            <tr key={coach.coach_code} className="border-b">
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    {coach.name}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    {coach.birth_date}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    {coach.gender}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    {coach.country_name}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    {coach.coach_function}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    {coach.disciplines}
                                </td>
                                <td className="border border-gray-400 px-2 py-1 cursor-pointer">
                                    <div className="flex gap-1">
                                        <div className="cursor-pointer" onClick={() => { handleDeleteCoach(coach.coach_code) }}>
                                            <MdDelete className="w-6 h-6" />
                                        </div>
                                        <div className="cursor-pointer" onClick={() => { setNewCoachModal({ update: handleGetCoaches, edit: true, coach: coach, countries: countries, all_disciplines: all_disciplines }) }}
                                        >
                                            <FaEdit className="w-6 h-6" />
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

        </div >


    );
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Coaches />
        </Suspense>
    )
}
