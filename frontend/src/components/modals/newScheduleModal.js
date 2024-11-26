"use client"
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import Input from "../input";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { createNewSchedule, updateSchedule } from "@/service/service";
import toast from "react-hot-toast";


const NewScheduleModal = () => {

  const newScheduleModal = useModalStore((state) => state.newScheduleModal)
  const setNewScheduleModal = useModalStore((state) => state.setNewScheduleModal)
  const [start_date, setStartDate] = useState("")
  const [end_date, setEndDate] = useState("")
  const [status, setStatus] = useState("WAITING")
  const [venue, setVenue] = useState("")
  const [phase, setPhase] = useState("")
  const [gender, setGender] = useState("")
  const [event, setEvent] = useState("")
  const [discipline, setDiscipline] = useState("")
  const [eventList, setEventList] = useState([])
  const [disciplineList, setDisciplineList] = useState([])


  useEffect(() => {
    if (newScheduleModal?.edit) {
      setStartDate(new Date(newScheduleModal?.schedule?.start_date).toISOString().slice(0, 16))
      setEndDate(new Date(newScheduleModal?.schedule?.end_date).toISOString().slice(0, 16))
      setStatus(newScheduleModal?.schedule?.status)
      setVenue(newScheduleModal?.schedule?.venue)
      setPhase(newScheduleModal?.schedule?.phase)
      setGender(newScheduleModal?.schedule?.gender)
      setEvent(newScheduleModal?.schedule?.event_code)
      setDiscipline(newScheduleModal?.schedule?.discipline_code)
    }
    setEventList(newScheduleModal?.events)
    setDisciplineList(newScheduleModal?.disciplines)
    if (!newScheduleModal) {
      setStartDate("")
      setEndDate("")
      setStatus("WAITING")
      setVenue("")
      setPhase("")
      setGender("")
      setEvent("")
      setDiscipline("")
      setEventList([])
      setDisciplineList([])
    }

  }, [newScheduleModal])


  const handleNewSchedule = () => {  
    if (newScheduleModal?.edit) {
      updateSchedule(newScheduleModal?.schedule?.schedule_code, {
        start_date: start_date,
        end_date: end_date,
        status: status,
        venue: venue,
        phase: phase,
        event: event,
        gender: gender
      }).then((res) => {
        toast.success("Schedule Updated")
        newScheduleModal?.update()
        setNewScheduleModal(null)
      }
      ).catch((err) => {
        console.log(err)
        toast.error(err)
      }).finally(() => {
      })
      return
    } else {
      createNewSchedule({
        start_date: start_date,
        end_date: end_date,
        status: status,
        venue: venue,
        phase: phase,
        event: event,
        gender: gender
      }).then((res) => {
        toast.success("New Schedule Created")
        newScheduleModal?.update()
        setNewScheduleModal(null)
      }).catch((err) => {
        console.log(err)
        toast.error(err)
      }).finally(() => {
      })
    }
  }

  return (
    <ModalSkeleton
      show={!!newScheduleModal}
      outsideClick={() => setNewScheduleModal(null)}
    >
      <div>
        <h5 className="font-semibold text-lg text-center mb-2">
          {newScheduleModal?.edit ? "Edit" : "New"} Schedule
        </h5>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <h3 className="">Start Date:</h3>
            <input
              type="datetime-local"
              name="notification_date"
              className="border border-gray-400 rounded-md p-1 w-[200px]"
              value={start_date}
              max={end_date}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Bildirim gönderim tarihini seçiniz"
            />
          </div>
          <div className="flex items-center gap-1">
            <h3 className="">End Date:</h3>
            <input
              type="datetime-local"
              name="notification_date"
              className="border border-gray-400 rounded-md p-1 w-[200px]"
              min={start_date}
              value={end_date}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Bildirim gönderim tarihini seçiniz"
            />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="">Status:</h3>
            <select className="border border-gray-400 rounded-md p-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="WAITING">Waiting</option>
              <option value="ACTIVE">Active</option>
              <option value="FINISHED">Finished</option>
              <option value="CANCELED">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="">Venue:</h3>
            <input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              type="text"
              name="venue"
              className="border border-gray-400 rounded-md p-1 ri"
              placeholder="Enter venue"
            />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="">Phase:</h3>
            <input
              type="text"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              name="phase"
              className="border border-gray-400 rounded-md p-1 ri"
              placeholder="Enter Phase"
            />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="">Gender:</h3>
            <select className="border border-gray-400 rounded-md p-1"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="W">Woman</option>
              <option value="M">Man</option>
              <option value="X">Mixed</option>
              <option value="O">Open</option>
            </select>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <h3 className="">Discipline:</h3>
            <select className="border border-gray-400 rounded-md p-1 w-full"
              value={discipline}
              onChange={(e) => {
                setDiscipline(e.target.value);
                if (e.target.value === "") {
                  setEvent("")
                }
              }}
            >
              <option value="">Select Discipline</option>
              {disciplineList?.map((discipline) => (
                <option key={discipline.discipline_code} value={discipline.discipline_code}>{discipline.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <h3 className="">Event:</h3>
            <select className="border border-gray-400 rounded-md p-1 w-full"
              value={event}
              onChange={(e) => {
                setEvent(e.target.value);
                setDiscipline(eventList.find((event) => event.events_code == e.target.value)?.discipline_code ?? "")
              }}
            >
              <option value="">Select Event</option>
              {eventList?.filter((event) => {
                if (discipline) {
                  return event.discipline_code == discipline
                } else {
                  return true
                }
              })
                .map((event) => (
                  <option key={event.events_code} value={event.events_code}>{event.sport_name} / {event.event_name}</option>
                ))}
            </select>
          </div>
        </div>
        <div className="w-full flex justify-center gap-4 mt-4">
          <Button
            onClick={() => { setNewScheduleModal(null) }}
          >
            Close
          </Button>
          <Button
            disabled={start_date === "" || end_date === "" || status === "" || venue === "" || phase === "" || event === "" || discipline === "" || gender === ""}
            onClick={() => {
              handleNewSchedule()
            }}
          >
            {newScheduleModal?.edit ? "Edit" : "Create"} Schedule
          </Button>
        </div>
      </div>
    </ModalSkeleton>
  )
}

export default NewScheduleModal
