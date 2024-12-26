"use client"
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import Input from "../input";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { createNewCoach, updateCoach } from "@/service/service";
import toast from "react-hot-toast";


const NewCoachModal = () => {

    const newCoachModal = useModalStore((state) => state.newCoachModal)
    const setNewCoachModal = useModalStore((state) => state.setNewCoachModal)
    const [coach_code, setCoachCode] = useState("")
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const [coach_function, setCoachFunction] = useState("")
    const [country_code, setCountryCode] = useState("")
    const [disciplines, setDisciplines] = useState("")
    const [birth_date, setBirthDate] = useState("")
    const [countryList, setCountryList] = useState([])
    const [disciplineList, setDisciplineList] = useState([])


    useEffect(() => {
        if (newCoachModal?.edit) {
            setCoachCode(newCoachModal?.coach?.coach_code)
            setBirthDate(new Date(newCoachModal?.coach?.birth_date).toISOString().slice(0, 16))
            setName(newCoachModal?.coach?.name)
            setCoachFunction(newCoachModal?.coach?.coach_function)
            setGender(newCoachModal?.coach?.gender)
            setCountryCode(newCoachModal?.coach?.country_code)
            setDisciplines(newCoachModal?.coach?.disciplines)
        }
        setCountryList(newCoachModal?.countries)
        setDisciplineList(newCoachModal?.all_disciplines)
        if (!newCoachModal) {
            setCoachCode("")
            setBirthDate("")
            setName("")
            setCoachFunction("")
            setGender("")
            setCountryCode("")
            setDisciplines("")
            setCountryList([])
            setDisciplineList([])
        }

    }, [newCoachModal])


    const handleNewCoach = () => {
        if (newCoachModal?.edit) {

            updateCoach(newCoachModal?.coach?.coach_code, {
                name: name,
                coach_function: coach_function,
                birth_date: birth_date,
                disciplines: disciplines,
                country_code: country_code,
                gender: gender
            }).then((res) => {
                toast.success("Coach Updated")
                newCoachModal?.update()
                setNewCoachModal(null)
            }
            ).catch((err) => {
                console.log(err)
                toast.error(err)
            }).finally(() => {
            })
            return
        } else {
            createNewCoach({
                coach_code: coach_code,
                name: name,
                coach_function: coach_function,
                birth_date: birth_date,
                disciplines: disciplines,
                country_code: country_code,
                gender: gender
            }).then((res) => {
                toast.success("New Coach Created")
                newCoachModal?.update()
                setNewCoachModal(null)
            }).catch((err) => {
                console.log(err)
                toast.error(err)
            }).finally(() => {
            })
        }
    }

    return (
        <ModalSkeleton
            show={!!newCoachModal}
            outsideClick={() => setNewCoachModal(null)}
        >
            <div>
                <h5 className="font-semibold text-lg text-center mb-2">
                    {newCoachModal?.edit ? "Edit" : "New"} Coach
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

                    {newCoachModal?.edit ? "" : <div className="flex flex-col gap-2">
                        <h3 className="">Coach Code:</h3>
                        <input
                            value={coach_code}
                            onChange={(e) => setCoachCode(e.target.value)}
                            type="text"
                            name="coach_code"
                            className="border border-gray-400 rounded-md p-1 ri"
                            placeholder="Enter coach code"
                        />
                    </div>}


                    <div className="flex flex-col gap-2">
                        <h3 className="">Function:</h3>
                        <input
                            type="text"
                            value={coach_function}
                            onChange={(e) => setCoachFunction(e.target.value)}
                            name="function"
                            className="border border-gray-400 rounded-md p-1 ri"
                            placeholder="Enter function"
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
                        <h3 className="">Discipline:</h3>
                        <select className="border border-gray-400 rounded-md p-1 w-full"
                            value={disciplines}
                            onChange={(e) => {
                                setDisciplines(e.target.value);
                            }}
                        >
                            <option value="">Select Discipline</option>
                            {disciplineList?.map((discipline) => (
                                <option key={discipline.discipline_code} value={discipline.name}>{discipline.name}</option>
                            ))}
                        </select>

                    </div>

                </div>
                <div className="w-full flex justify-center gap-4 mt-4">
                    <Button
                        onClick={() => { setNewCoachModal(null) }}
                    >
                        Close
                    </Button>
                    <Button
                        disabled={coach_code === "" || name === "" || gender === "" || country_code === "" || coach_function === "" || disciplines === "" || birth_date === ""}
                        onClick={() => {
                            handleNewCoach()
                        }}
                    >
                        {newCoachModal?.edit ? "Edit" : "Create"} Coach
                    </Button>
                </div>
            </div>
        </ModalSkeleton>
    )
}

export default NewCoachModal
