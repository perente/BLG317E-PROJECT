"use client";
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { createNewTeam, getAthletes, getCoaches, getCountries, getDisciplines, newMedallist, updateMedallist } from "@/service/service";
import Select from "react-select";
import ReactSelect from "../select/CustomSelect";
import toast from "react-hot-toast";
import { updateTeam } from "@/service/teams_service";

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
    if (!newTeamModal?.isEdit) {
      setSelectedAthletes();
      if (newTeamModal?.team?.coach_list?.length === 0) {
        setSelectedCoaches();
      }
    }
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

    const genders = {
      M: "Man",
      W: "Women",
      X: "Mixed",
      O: "Other"
    }

    if (newTeamModal?.isEdit) {
      setTeamName(newTeamModal?.team?.team_name);
      setTeamCountry({ value: newTeamModal?.team?.country_code, label: newTeamModal?.team?.country_name });
      setTeamGender({
        value: (newTeamModal?.team.team_gender === "F" ? "W" : newTeamModal?.team.team_gender), label: genders[(newTeamModal?.team.team_gender === "F" ? "W" : newTeamModal?.team.team_gender)]
      });
      setTeamDiscipline({ value: newTeamModal?.team?.discipline_code, label: newTeamModal?.team?.discipline_name });
      if (newTeamModal?.team?.athlete_list?.length > 0) {
        // setSelectedAthletes(() => [...newTeamModal?.team?.athlete_list?.map((item) => ({ value: item?.athlete_code, label: item.name }))]);
        setAthleteList(() => [...newTeamModal?.team?.athlete_list?.map((item) => ({ value: item?.athlete_code, label: item.name }))]);
      }
      if (newTeamModal?.team?.coach_list?.length > 0) {
        // setSelectedCoaches(() => [...newTeamModal?.team?.coach_list?.map((item) => ({ value: item?.coach_code, label: item.name }))]);
        setCoachList(() => [...newTeamModal?.team?.coach_list?.map((item) => ({ value: item?.coach_code, label: item?.name }))]);
      } else {
        setSelectedCoaches(null);
        setCoachList(null);
      }
      setTeamCountry({ value: newTeamModal?.team?.country_code, label: newTeamModal?.team?.country_name });

    }

  }, [newTeamModal]);



  const handleCreateTeam = () => {

    if (newTeamModal?.isEdit) {
      let athlete_codes = athleteList.map((item) => item.value);
      let coach_codes = coachList.map((item) => item.value);
      let team_name = teamName;
      let data = {
        team_name,
        athlete_codes,
        coach_codes
      }

      updateTeam(newTeamModal?.team?.team_code, data).then((res) => {
        console.log(res);
        toast.success("Team Updated Successfully");
        newTeamModal?.update()
        setNewTeamModal(null);
      }).catch((err) => {
        console.log(err);
      });
      return;
    }

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
    if (newTeamModal?.isEdit) {
    }else{
      setSelectedAthletes(null);
      setSelectedCoaches(null);
      setAthleteList([]);
      setCoachList([]);
    }
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
              {newTeamModal?.isEdit ? "Edit Team" : "Create New Team"}
            </div>
            <div className="flex justify-between gap-4 items-start">
              <div className="text-lg mt-4 flex-1">
                <h3>
                  Select Country
                </h3>
                <ReactSelect
                  name="Country"
                  options={countries}
                  value={teamCountry}
                  disabled={newTeamModal?.isEdit}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(value) => setTeamCountry(value)}
                  placeholder={"Select Country"}
                />
              </div>
              <div className="text-lg mt-4 flex-1">
                <h3>
                  Select Gender
                </h3>
                <ReactSelect
                  name="Country"
                  disabled={newTeamModal?.isEdit}
                  options={[{ value: "W", label: "Woman" }, { value: "M", label: "Man" }, { value: "X", label: "Mixed" }, { value: "O", label: "Other" }]}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={teamGender}
                  onChange={(value) => setTeamGender(value)}
                  placeholder={"Select Gender"}
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
                disabled={newTeamModal?.isEdit}
                defaultValue={teamDiscipline}
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
                value={newTeamModal?.isEdit ? undefined : selectedAthletes}
                defaultValue={ athleteList }
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
                Select Coaches
              </h3>
              <ReactSelect
                name="Coaches"
                options={coaches}
                isMulti
                value={newTeamModal?.isEdit ? undefined : selectedCoaches}
                defaultValue={ coachList}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(value) => {
                  setSelectedCoaches(value.value);
                  setCoachList(value);
                }}
                placeholder={"Select Coaches"}
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
                disabled={!teamName || !teamCountry || !teamGender || !teamDiscipline }
              >
                {newTeamModal?.isEdit ? "Save Changes" : "Create Team"}
              </Button>
            </div>
          </div>
        }
      </div>
    </ModalSkeleton>
  );
};

export default NewTeamModal;