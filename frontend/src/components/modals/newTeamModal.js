"use client";
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { createNewTeam, getAthletes, getCoaches, getCountries, getDisciplines, newMedallist, updateMedallist } from "@/service/service";
import Select from "react-select";
import ReactSelect from "../select/CustomSelect";
import toast from "react-hot-toast";

const NewTeamModal = () => {
    const newTeamModal = useModalStore((state) => state.newTeamModal);
    const setNewTeamModal = useModalStore((state) => state.setNewTeamModal);

    const [athletes, setAthletes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAthletes, setSelectedAthletes] = useState();
    const [athleteList, setAthleteList] = useState([]);

    const [coaches, setCoaches] = useState([]);
    const [selectedCoaches, setSelectedCoaches] = useState();
    const [coachList, setCoachList] = useState([]);

    const [disciplines, setDisciplines] = useState([]);
    const [countries, setCountries] = useState([]);

    const [teamName, setTeamName] = useState("");
    const [teamCountry, setTeamCountry] = useState("");
    const [teamGender, setTeamGender] = useState("");
    const [teamDiscipline, setTeamDiscipline] = useState("");

    useEffect(() => {
        setSelectedAthletes();
        setSelectedCoaches();
        setCoaches([]);
        setTeamName("");
        setTeamCountry("");
        setTeamGender("");
        setTeamDiscipline("");
        setDisciplines([]);
        setCountries([]);
        setAthletes([]);
        setCoaches([]);
        setAthleteList([]);
        setCoachList([]);
        if (newTeamModal) {
            setLoading(true);
            getDisciplines().then((res) => {
                res.data.forEach(element => {
                    setDisciplines((prev) => [...prev, { value: element.discipline_code, label: element.name }]);
                });
            }).then(() => {
                setCountries([]);
                getCountries().then((res) => {
                    res.data.forEach(element => {
                        setCountries((prev) => [...prev, { value: element.country_code, label: element.country_name }]);
                    });
                });
            }).catch((err) => {
                console.log(err);
            }
            ).finally(() => {
                setLoading(false);
            });
        }
    }, [newTeamModal]);


    const handleCreateTeam = () => {
        console.log(athleteList);
        console.log(selectedCoaches);

        createNewTeam({
            team_name: teamName,
            team_gender: teamGender?.value,
            country_code: teamCountry?.value,
            athlete_codes: athleteList.map((item) => item.value),
            coach_codes: coachList.map((item) => item.value) ?? [],
            discipline_code: teamDiscipline?.value
        }).then((res) => {
            console.log(res);
            toast.success("Team Created Successfully");
            setNewTeamModal(null);
        }
        ).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        setSelectedAthletes(null);
        setSelectedCoaches(null);
        setAthleteList([]);
        if (!teamCountry || !teamGender) return;
        setAthletes([]);
        getAthletes(
            (teamGender?.value === "X" || teamGender?.value === "O" ? { country_code: teamCountry?.value } : {
                country_code: teamCountry?.value,
                gender: (teamGender?.value === "W" ? "F" : "M")
            })
        ).then((res) => {
            res.data.forEach(element => {
                setCoaches([]);
                setAthletes((prev) => [...prev, { value: element.athlete_code, label: element.name }]);
            });
        }
        ).then(() => {
            getCoaches({ country_code: teamCountry?.value }).then((res) => {
                res.data.forEach(element => {
                    setCoaches((prev) => [...prev, { value: element.coach_code, label: element.name }]);
                });
            });
        }
        ).catch((err) => {
            console.log(err);
        }
        );
    }, [teamCountry, teamGender]);



    return (
        <ModalSkeleton
            show={!!newTeamModal}
            outsideClick={() => setNewTeamModal(null)}
        >
            <div className="h-[68vh]">
                {loading ? <div className="m-auto text-center h-full flex items-center justify-center">
                    <div className="animate-spin">
                        Loading...
                    </div>
                </div> :
                    <div>
                        <div
                            onClick={() => {
                                console.log(athletes);
                                console.log(coaches);
                            }}
                            className="text-2xl font-bold">
                            Create New Team
                        </div>
                        <div className="flex justify-between gap-4 items-start">
                            <div className="text-lg mt-4 flex-1">
                                <h3>
                                    Select Country
                                </h3>
                                <ReactSelect
                                    name="Country"
                                    options={countries}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={(value) => setTeamCountry(value)}
                                    placeholder={"Select Choaches"}
                                />
                            </div>
                            <div className="text-lg mt-4 flex-1">
                                <h3>
                                    Select Gender
                                </h3>
                                <ReactSelect
                                    name="Country"
                                    options={[{ value: "W", label: "Woman" }, { value: "M", label: "Man" }, { value: "X", label: "Mixed" }, { value: "O", label: "Other" }]}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={(value) => setTeamGender(value)}
                                    placeholder={"Select Choaches"}
                                />
                            </div>
                        </div>
                        <div className="text-lg mt-4">
                            <h3>
                                Select Discipline
                            </h3>
                            <ReactSelect
                                name="Discipline"
                                options={disciplines}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(value) => setTeamDiscipline(value)}
                                placeholder={"Select Discipline"}
                            />
                        </div>
                        <div className="text-lg mt-4">
                            <h3>
                                Select Athletes
                            </h3>
                            <ReactSelect
                                name="Athlets"
                                isMulti
                                options={athletes}
                                value={selectedAthletes}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(value) => {
                                    setSelectedAthletes(value.value);
                                    setAthleteList(value);
                                }
                                }
                                placeholder={"Select Athletes"}
                            />
                        </div>
                        <div className="text-lg mt-4">
                            <h3>
                                Select Choaches
                            </h3>
                            <ReactSelect
                                name="Choaches"
                                options={coaches}
                                isMulti
                                value={selectedCoaches}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(value) => {
                                    setSelectedCoaches(value.value);
                                    setCoachList(value);
                                }}
                                placeholder={"Select Choaches"}
                            />
                        </div>
                        <div className="text-lg mt-4">
                            <h3>
                                Team Name
                            </h3>
                            <input
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                            <Button onClick={() => setNewTeamModal(null)}>Cancel</Button>
                            <Button onClick={() => {
                                handleCreateTeam();
                            }}
                                disabled={!teamName || !teamCountry || !teamGender || !teamDiscipline}
                            >
                                {newTeamModal?.editMode ? "Save Changes" : "Create Team"}
                            </Button>
                        </div>
                    </div>
                }
            </div>
        </ModalSkeleton>
    );
};

export default NewTeamModal;