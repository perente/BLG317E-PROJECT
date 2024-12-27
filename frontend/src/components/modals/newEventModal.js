"use client";
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import Input from "../input";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { createNewEvent, updateEvent } from "@/service/service";
import toast from "react-hot-toast";

const NewEventModal = () => {

  const newEventModal = useModalStore((state) => state.newEventModal)
  const setNewEventModal = useModalStore((state) => state.setNewEventModal)

  const [events_code, setEventsCode] = useState("")
  const [event_name, setEventName] = useState("")
  const [sport_name, setSportName] = useState("")
  const [discipline_code, setDisciplineCode] = useState("")
  const [disciplineList, setDisciplineList] = useState([])

  useEffect(() => {
    if (newEventModal?.edit) {
      setEventsCode(newEventModal?.event?.events_code)
      setEventName(newEventModal?.event.event_name)
      setSportName(newEventModal?.event.sport_name)
      setDisciplineCode(newEventModal?.event.discipline_code)
    }
    setDisciplineList(newEventModal?.disciplines)

    if (!newEventModal) {
      setEventsCode("")
      setEventName("")
      setSportName("")
      setDisciplineCode("")
      setDisciplineList([])
    }

  }, [newEventModal])

  const handleNewEvent = () => {

    if (newEventModal?.edit) {
      updateEvent(newEventModal?.event?.events_code, {
        events_code: events_code,
        event_name: event_name,
        sport_name: sport_name,
        discipline_code: discipline_code
      })
      .then((res) => {
        toast.success("Event Updated")
        newEventModal.update()
        setNewEventModal(null)
      })
      .catch((error) => {
      console.log(error)
      toast.error(error)
      })
      .finally(() => {
      })
      return
    } else {
      createNewEvent({
        event_name,
        sport_name,
        discipline_code,
      })
        .then((res) => {
          toast.success("New Event Created");
          newEventModal?.update();
          setNewEventModal(null);
        })
        .catch((error) => {
          console.error("Error creating event:", error);
          toast.error("Failed to create event");
        });
      
    }
  };

  return (
    <ModalSkeleton
      show={!!newEventModal}
      outsideClick={() => setNewEventModal(null)}
    >
      <div>
        <h5 className="font-semibold text-lg text-center mb-4">
          {newEventModal?.edit ? "Edit" : "Create"} Event
        </h5>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h3 className="">Event Name:</h3>
            <input
              type="text"
              value={event_name}
              onChange={(e) => setEventName(e.target.value)}
              name="event_name"
              className="border border-gray-400 rounded-md p-2 w-full"
              placeholder="Enter event name"
            />
          </div>
          <div>
            <h3 className="">Sport Name:</h3>
            <input
              type="text"
              value={sport_name}
              onChange={(e) => setSportName(e.target.value)}
              name="sport_name"
              className="border border-gray-400 rounded-md p-2 w-full"
              placeholder="Enter sport name"
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <h3 className="">Discipline:</h3>
            <select
                className="border border-gray-400 rounded-md p-1 w-full"
                value={discipline_code}
                onChange={(e) => {
                    setDisciplineCode(e.target.value);
                }}
            >
                <option value="">Select Discipline</option>
                {disciplineList?.map((discipline) => (
                    <option key={discipline.discipline_code} value={discipline.discipline_code}>
                        {discipline.name}
                    </option>
                ))}
            </select>
          </div>

        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={() => { setNewEventModal(null)} }>Cancel</Button>
          <Button 
          disabled={event_name === "" || sport_name === "" || discipline_code === ""}
          onClick={handleNewEvent}>
            {newEventModal?.editMode ? "Save Changes" : "Create Event"}
          </Button>
        </div>
      </div>
    </ModalSkeleton>
  );
};

export default NewEventModal;
