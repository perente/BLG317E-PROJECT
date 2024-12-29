"use client";
import {useModalStore} from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import {useEffect, useState} from "react";
import {Button} from "../button";
import {newMedallist, updateMedallist} from "@/service/service";
import toast from "react-hot-toast";

const NewMedallistModal = () => {
    const newMedallistModalData = useModalStore((state) => state.newMedallistModalData);
    const setNewMedallistModalData = useModalStore((state) => state.setNewMedallistModalData);

    const [medalDate, setMedalDate] = useState("");
    const [medalCode, setMedalCode] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [discipline, setDiscipline] = useState("");
    const [event, setEvent] = useState("");
    const [codeAthlete, setCodeAthlete] = useState("");
    const [withTeam, setWithTeam] = useState(false); // State to toggle team-related fields
    const [teamGender, setTeamGender] = useState("");
    const [codeTeam, setCodeTeam] = useState("");

    useEffect(() => {
        if (newMedallistModalData?.editMode) {
            const {medallist} = newMedallistModalData;
            setMedalDate(new Date(newMedallistModalData?.medallist?.medal_date).toISOString().split('T')[0]);
            setMedalCode(newMedallistModalData?.medallist?.medal_code);
            setCountryCode(newMedallistModalData?.medallist?.country_code);
            setDiscipline(newMedallistModalData?.medallist?.discipline);
            setEvent(newMedallistModalData?.medallist?.event);
            setCodeAthlete(newMedallistModalData?.medallist?.code_athlete);
            setWithTeam(!!medallist.code_team);
            setTeamGender(medallist.team_gender || "");
            setCodeTeam(medallist.code_team || "");
        } else {
            resetFields();
        }
    }, [newMedallistModalData]);

    const resetFields = () => {
        setMedalDate("");
        setMedalCode("");
        setCountryCode("");
        setDiscipline("");
        setEvent("");
        setCodeAthlete("");
        setWithTeam(false);
        setTeamGender("");
        setCodeTeam("");
    };

    const handleSaveMedallist = () => {
        const medallistData = {
            medal_date: medalDate,
            medal_code: medalCode,
            country_code: countryCode,
            discipline,
            event,
            code_athlete: codeAthlete,
            team_gender: withTeam ? teamGender : null,
            code_team: withTeam ? codeTeam : null,
        };

        if (newMedallistModalData?.editMode) {
            updateMedallist(newMedallistModalData.medallist.id, medallistData)
                .then(() => {
                    setNewMedallistModalData(null);
                    newMedallistModalData.update();
                    toast.success("Medallist Updated");
                })
                .catch((error) => {
                });
        } else {
            newMedallist(medallistData)
                .then(() => {
                    setNewMedallistModalData(null);
                    newMedallistModalData.update();
                    toast.success("New Medallist Added");
                })
                .catch((error) => {
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
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Is this a team event?</label>
                        <input
                            type="checkbox"
                            checked={withTeam}
                            onChange={() => setWithTeam((prev) => !prev)}
                            className="w-5 h-5"
                        />
                    </div>
                    {withTeam && (
                        <>
                            <div>
                                <label className="block font-semibold">Team Gender:</label>
                                <select
                                    value={teamGender}
                                    onChange={(e) => setTeamGender(e.target.value)}
                                    className="border border-gray-400 rounded-md p-2 w-full"
                                >
                                    <option value="">Select Team Gender</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="Mixed">Mixed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-semibold">Team Code:</label>
                                <input
                                    type="text"
                                    value={codeTeam}
                                    onChange={(e) => setCodeTeam(e.target.value)}
                                    className="border border-gray-400 rounded-md p-2 w-full"
                                    placeholder="Enter team code"
                                />
                            </div>
                        </>
                    )}
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
