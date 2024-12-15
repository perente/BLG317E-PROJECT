"use client"
import {useModalStore} from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import {useEffect, useState} from "react";
import {Button} from "../button";
import {createMedallist, updateMedallist} from "@/service/service";

const NewMedallistModal = () => {
    const newMedallistModalData = useModalStore((state) => state.newMedallistModalData);
    const setNewMedallistModalData = useModalStore((state) => state.setNewMedallistModalData);

    const [medalDate, setMedalDate] = useState("");
    const [medalCode, setMedalCode] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("M");
    const [countryCode, setCountryCode] = useState("");
    const [teamGender, setTeamGender] = useState("");
    const [discipline, setDiscipline] = useState("");
    const [event, setEvent] = useState("");
    const [codeAthlete, setCodeAthlete] = useState("");
    const [codeTeam, setCodeTeam] = useState("");
    const [isMedallist, setIsMedallist] = useState(false);

    useEffect(() => {
        if (newMedallistModalData?.editMode) {
            const {medallist} = newMedallistModalData;
            setMedalDate(medallist.medal_date || "");
            setMedalCode(medallist.medal_code || "");
            setName(medallist.name || "");
            setGender(medallist.gender || "M");
            setCountryCode(medallist.country_code || "");
            setTeamGender(medallist.team_gender || "");
            setDiscipline(medallist.discipline || "");
            setEvent(medallist.event || "");
            setCodeAthlete(medallist.code_athlete || "");
            setCodeTeam(medallist.code_team || "");
            setIsMedallist(medallist.is_medallist || false);
        } else {
            resetFields();
        }
    }, [newMedallistModalData]);

    const resetFields = () => {
        setMedalDate("");
        setMedalCode("");
        setName("");
        setGender("M");
        setCountryCode("");
        setTeamGender("");
        setDiscipline("");
        setEvent("");
        setCodeAthlete("");
        setCodeTeam("");
        setIsMedallist(false);
    };

    const handleSaveMedallist = () => {
        const medallistData = {
            medal_date: medalDate,
            medal_code: medalCode,
            name,
            gender,
            country_code: countryCode,
            team_gender: teamGender,
            discipline,
            event,
            code_athlete: codeAthlete,
            code_team: codeTeam,
            is_medallist: isMedallist,
        };

        if (newMedallistModalData?.editMode) {
            updateMedallist(newMedallistModalData.medallist.id, medallistData)
                .then(() => {
                    setNewMedallistModalData(null);
                    newMedallistModalData.update();
                })
                .catch((error) => {
                    alert("Error updating medallist: " + error.message);
                });
        } else {
            createMedallist(medallistData)
                .then(() => {
                    setNewMedallistModalData(null);
                    newMedallistModalData.update();
                })
                .catch((error) => {
                    alert("Error creating medallist: " + error.message);
                });
        }
    };

    return (
        <ModalSkeleton
            show={!!newMedallistModalData}
            outsideClick={() => setNewMedallistModalData(null)}
        >
            <div>
                <h5 className="font-semibold text-lg text-center mb-4">
                    {newMedallistModalData?.editMode ? "Edit" : "Create"} Medallist
                </h5>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block font-semibold">Medal Date:</label>
                        <input
                            type="date"
                            value={medalDate}
                            onChange={(e) => setMedalDate(e.target.value)}
                            className="border border-gray-400 rounded-md p-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Medal Code:</label>
                        <input
                            type="number"
                            value={medalCode}
                            onChange={(e) => setMedalCode(e.target.value)}
                            className="border border-gray-400 rounded-md p-2 w-full"
                            placeholder="Enter medal code"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-400 rounded-md p-2 w-full"
                            placeholder="Enter medallist's name"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Gender:</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="border border-gray-400 rounded-md p-2 w-full"
                        >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold">Country Code:</label>
                        <input
                            type="text"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="border border-gray-400 rounded-md p-2 w-full"
                            placeholder="Enter country code"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Team Gender:</label>
                        <select
                            value={teamGender}
                            onChange={(e) => setTeamGender(e.target.value)}
                            className="border border-gray-400 rounded-md p-2 w-full"
                        >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="Mixed">Mixed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold">Discipline:</label>
                        <input
                            type="text"
                            value={discipline}
                            onChange={(e) => setDiscipline(e.target.value)}
                            className="border border-gray-400 rounded-md p-2 w-full"
                            placeholder="Enter discipline"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Event:</label>
                        <input
                            type="text"
                            value={event}
                            onChange={(e) => setEvent(e.target.value)}
                            className="border border-gray-400 rounded-md p-2 w-full"
                            placeholder="Enter event"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Athlete Code:</label>
                        <input
                            type="text"
                            value={codeAthlete}
                            onChange={(e) => setCodeAthlete(e.target.value)}
                            className="border border-gray-400 rounded-md p-2 w-full"
                            placeholder="Enter athlete code"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Team Code:</label>
                        <input
                            type="text"
                            value={codeTeam}
                            onChange={(e) => setCodeTeam(e.target.value)}
                            className="border border-gray-400 rounded-md p-2 w-full"
                            placeholder="Enter team code (if any)"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Is Medallist:</label>
                        <input
                            type="checkbox"
                            checked={isMedallist}
                            onChange={(e) => setIsMedallist(e.target.checked)}
                            className="border border-gray-400 rounded-md"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <Button onClick={() => setNewMedallistModalData(null)}>Cancel</Button>
                    <Button onClick={handleSaveMedallist}>
                        {newMedallistModalData?.editMode ? "Save Changes" : "Create Medallist"}
                    </Button>
                </div>
            </div>
        </ModalSkeleton>
    );
};

export default NewMedallistModal;