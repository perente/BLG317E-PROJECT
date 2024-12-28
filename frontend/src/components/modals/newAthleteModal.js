"use client"
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import Input from "../input";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { createNewAthlete, updateAthlete } from "@/service/service";
import toast from "react-hot-toast";


const NewAthleteModal = () => {

    const newAthleteModal = useModalStore((state) => state.newAthleteModal)
    const setNewAthleteModal = useModalStore((state) => state.setNewAthleteModal)
    const [athlete_code, setAthleteCode] = useState("")
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const [country_code, setCountryCode] = useState("")
    const [nationality, setNationality] = useState("")
    const [birth_date, setBirthDate] = useState("")
    const [countryList, setCountryList] = useState([])
    const [disciplines, setDisciplines] = useState([]);
    const [selectedDisciplines, setSelectedDisciplines] = useState([]);


    useEffect(() => {
        if (newAthleteModal?.edit) {
            setAthleteCode(newAthleteModal?.athlete?.athlete_code)
            setBirthDate(new Date(newAthleteModal?.athlete?.birth_date).toISOString().slice(0, 16))
            setName(newAthleteModal?.athlete?.name)
            setNationality(newAthleteModal?.athlete?.nationality)
            setGender(newAthleteModal?.athlete?.gender)
            setCountryCode(newAthleteModal?.athlete?.country_code)
            setSelectedDisciplines(newAthleteModal?.athlete?.disciplines || []);

        }
        setCountryList(newAthleteModal?.countries)
        setDisciplines(newAthleteModal?.all_disciplines)
        if (!newAthleteModal) {
            setAthleteCode("")
            setBirthDate("")
            setName("")
            setNationality("")
            setGender("")
            setCountryCode("")
            setCountryList([])
            setDisciplines([])
        }
        if (!newAthleteModal?.edit) {
            setSelectedDisciplines([])

        }

    }, [newAthleteModal])


    const handleNewAthlete = () => {
        if (newAthleteModal?.edit) {

            updateAthlete(newAthleteModal?.athlete?.athlete_code, {
                name: name,
                nationality: nationality,
                birth_date: birth_date,
                country_code: country_code,
                gender: gender,
                disciplines: selectedDisciplines, // Include disciplines
            }).then((res) => {
                toast.success("Athlete Updated")
                newAthleteModal?.update()
                setNewAthleteModal(null)
            }
            ).catch((err) => {
                console.log(err)
                toast.error(err)
            }).finally(() => {
            })
            return
        } else {
            createNewAthlete({
                athlete_code: athlete_code,
                name: name,
                nationality: nationality,
                birth_date: birth_date,
                country_code: country_code,
                gender: gender,
                disciplines: selectedDisciplines,

            }).then((res) => {
                toast.success("New Athlete Created")
                newAthleteModal?.update()
                setNewAthleteModal(null)
            }).catch((err) => {
                console.log(err)
                toast.error(err)
            }).finally(() => {
            })
        }
    }

    const handleDisciplineChange = (e) => {
        const value = e.target.value; // Get the value of the clicked option
        setSelectedDisciplines((prev) => {
            if (prev.includes(value)) {
                // Remove if already selected
                return prev.filter((discipline) => discipline !== value);
            } else {
                // Add if not already selected
                return [...prev, value];
            }
        });
    };

    return (
        <ModalSkeleton
            show={!!newAthleteModal}
            outsideClick={() => setNewAthleteModal(null)}
        >
            <div>
                <h5 className="font-semibold text-lg text-center mb-2">
                    {newAthleteModal?.edit ? "Edit" : "New"} Athlete
                </h5>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <h3 className="">Birth Date:</h3>
                        <input
                            type="datetime-local"
                            name="birth_date"
                            className="border border-gray-400 rounded-md p-1 w-[200px]"
                            value={birth_date}
                            onChange={(e) => setBirthDate(e.target.value)}
                            placeholder="Doğum tarihini seçiniz"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="">Gender: </h3>
                        <select className="border border-gray-400 rounded-md p-1"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="F">Female</option>
                            <option value="M">Male</option>

                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="">Name:</h3>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            name="name"
                            className="border border-gray-400 rounded-md p-1 ri"
                            placeholder="Enter name"
                        />
                    </div>
                    {newAthleteModal?.edit ? "" : <div className="flex flex-col gap-2">
                        <h3 className="">Athlete Code:</h3>
                        <input
                            value={athlete_code}
                            onChange={(e) => setAthleteCode(e.target.value)}
                            type="text"
                            name="athlete_code"
                            className="border border-gray-400 rounded-md p-1 ri"
                            placeholder="Enter athlete code"
                        />
                    </div>}

                    <div className="flex flex-col gap-2">
                        <h3 className="">Nationality:</h3>
                        <input
                            type="text"
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            name="nationality"
                            className="border border-gray-400 rounded-md p-1 ri"
                            placeholder="Enter Nationality"
                        />
                    </div>

                    <div className="flex flex-col gap-2 col-span-2">
                        <h3 className="">Country:</h3>
                        <select className="border border-gray-400 rounded-md p-1 w-full"
                            value={country_code}
                            onChange={(e) => {
                                setCountryCode(e.target.value);
                            }}
                        >
                            <option value="">Select Country</option>
                            {countryList?.map((country) => (
                                <option key={country.country_code} value={country.country_code}>{country.country_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 col-span-2">
                        <div>
                            <div>
                                {selectedDisciplines.map((discipline, index) => (
                                    <div className=" inline-block border-2 bg-gray-200 rounded-xl p-2 m-1 text-gray-600" key={index}>{discipline}</div>
                                ))}
                            </div>
                        </div>
                        <h3 className="">Discipline:</h3>
                        <select
                            className="border border-gray-400 rounded-lg p-2 w-full h-40 overflow-y-auto "
                            multiple
                            value={selectedDisciplines}
                            onChange={(e) => {
                                handleDisciplineChange(e)
                            }
                            }>
                            {disciplines.map(d => <option className="p-1 hover:bg-gray-200 cursor-pointer"

                                key={d.id} value={d.name}   >{d.name}</option>)}

                        </select>

                    </div>

                </div>
                <div className="w-full flex justify-center gap-4 mt-4">
                    <Button
                        onClick={() => { setNewAthleteModal(null) }}
                    >
                        Close
                    </Button>
                    <Button
                        disabled={athlete_code === "" || name === "" || gender === "" || country_code === "" || nationality === "" || birth_date === ""}
                        onClick={() => {
                            handleNewAthlete()
                        }}
                    >
                        {newAthleteModal?.edit ? "Edit" : "Create"} Athlete
                    </Button>
                </div>
            </div>
        </ModalSkeleton>
    )
}

export default NewAthleteModal
