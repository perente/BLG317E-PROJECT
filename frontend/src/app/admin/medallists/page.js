"use client";
import {Button} from "@/components/button";
import {getMedallists, deleteMedallist} from "@/service/service";
import {useParams, usePathname, useSearchParams} from "next/navigation";
import {useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";

function Medallists() {
    const [medallists, setMedallists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const itemsPerPage = 10; // Number of items per page
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [medal_date, setMedalDate] = useState(params.get("medal_date") ?? "");
    const [medal_code, setMedalCode] = useState(params.get("medal_code") ?? "");
    const [gender, setGender] = useState(params.get("gender") ?? "");
    const [discipline, setDiscipline] = useState(params.get("discipline") ?? "");
    const [event, setEvent] = useState(params.get("event") ?? "");
    const [country_code, setCountryCode] = useState(params.get("country_code") ?? "");
    const [order, setOrder] = useState(params.get("order") ?? "");
    const [orderBy, setOrderBy] = useState(params.get("order_by") ?? "");

    useEffect(() => {
        handleGetMedallists();
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
            .then((res) => setMedallists(res.data))
            .finally(() => setLoading(false));
    };

    const totalPages = Math.ceil(medallists.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = medallists.slice(indexOfFirstItem, indexOfLastItem);

    const handleDeleteMedallist = async (id) => {
        deleteMedallist(id)
            .then((res) => {
                if (res.status === 200) {
                    setMedallists(medallists.filter((medallist) => medallist.id !== id));
                }
            })
            .finally(() => handleGetMedallists());
    };

    const onChange = ({event, name}) => {
        const current = new URLSearchParams(Array.from(params.entries()));
        const value = event.target.value.trim();
        if (!value) {
            current.delete(name);
        } else {
            current.set(name, event.target.value);
        }
        router.replace(`${pathname}?${current.toString()}`);
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
        router.push(`${pathname}?${current.toString()}`);
    };

    return (
        <div className="container m-auto">
            <div className="flex items-center justify-between my-4">
                <h1 className="text-3xl">Medallists</h1>
                <Button onClick={() => setNewMedallistModal({update: handleGetMedallists})}>
                    Create New Medallist
                </Button>
            </div>
            <table className="table-auto w-full border-collapse border border-gray-400 mt-4">
                <thead>
                <tr>
                    <th onClick={() => orderMedallists("medal_date")} className="cursor-pointer">Medal Date</th>
                    <th onClick={() => orderMedallists("medal_code")} className="cursor-pointer">Medal Code</th>
                    <th onClick={() => orderMedallists("gender")} className="cursor-pointer">Gender</th>
                    <th onClick={() => orderMedallists("discipline")} className="cursor-pointer">Discipline</th>
                    <th onClick={() => orderMedallists("event")} className="cursor-pointer">Event</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map((medallist) => (
                    <tr key={medallist.id}>
                        <td>{medallist.medal_date}</td>
                        <td>{medallist.medal_code}</td>
                        <td>{medallist.gender}</td>
                        <td>{medallist.discipline}</td>
                        <td>{medallist.event}</td>
                        <td>
                            <Button onClick={() => handleDeleteMedallist(medallist.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Medallists/>
        </Suspense>
    );
}