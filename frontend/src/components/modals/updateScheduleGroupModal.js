"use client"
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import Input from "../input";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { createNewSchedule, update_schedule_group, updateSchedule } from "@/service/service";
import toast from "react-hot-toast";


const UpdateScheduleGroupModal = () => {

  const updateScheduleGroupModal = useModalStore((state) => state.updateScheduleGroupModal)
  const setUpdateScheduleGroupModal = useModalStore((state) => state.setUpdateScheduleGroupModal)
  const [start_date, setStartDate] = useState("")
  const [end_date, setEndDate] = useState("")
  const [status, setStatus] = useState("")
  const [venue, setVenue] = useState("")
  const [phase, setPhase] = useState("")
  const [gender, setGender] = useState("")
  const [event, setEvent] = useState("")
  const [discipline, setDiscipline] = useState("")
  const [eventList, setEventList] = useState([])
  const [disciplineList, setDisciplineList] = useState([])


  const [delay_day, setDelayDay] = useState(0)
  const [newStatus, setNewStatus] = useState("")
  const [newVenue, setNewVenue] = useState("")
  const [newPhase, setNewPhase] = useState("")
  const [newGender, setNewGender] = useState("")
  const [newEvent, setNewEvent] = useState("")
  const [newDiscipline, setNewDiscipline] = useState("")



  useEffect(() => {
    if (updateScheduleGroupModal?.edit) {
      setStartDate(new Date(updateScheduleGroupModal?.schedule?.start_date).toISOString().slice(0, 16))
      setEndDate(new Date(updateScheduleGroupModal?.schedule?.end_date).toISOString().slice(0, 16))
      setStatus(updateScheduleGroupModal?.schedule?.status)
      setVenue(updateScheduleGroupModal?.schedule?.venue)
      setPhase(updateScheduleGroupModal?.schedule?.phase)
      setGender(updateScheduleGroupModal?.schedule?.gender)
      setEvent(updateScheduleGroupModal?.schedule?.event_code)
      setDiscipline(updateScheduleGroupModal?.schedule?.discipline_code)
    }
    setEventList(updateScheduleGroupModal?.events)
    setDisciplineList(updateScheduleGroupModal?.disciplines)
    if (!updateScheduleGroupModal) {
      setStartDate("")
      setDelayDay(0)
      setEndDate("")
      setStatus("")
      setVenue("")
      setPhase("")
      setGender("")
      setEvent("")
      setDiscipline("")
      setEventList([])
      setDisciplineList([])
      setNewDiscipline("")
      setNewEvent("")
      setNewGender("")
      setNewPhase("")
      setNewStatus("")
      setNewVenue("")
      
    }

  }, [updateScheduleGroupModal])


  const handleUpdateScheduleGroup = async () => {
    update_schedule_group({
      start_date,
      end_date,
      venue,
      phase,
      event_code: event,
      status,
      gender,
      delay_days: delay_day,
      new_gender: newGender,
      new_status: newStatus,
      new_phase: newPhase,
      new_venue: newVenue,
      new_event_code: newEvent
    }).then((response) => {
      console.log(response);

      if (response.status === 200) {
        toast.success("Schedule Group Updated Successfully")
        setUpdateScheduleGroupModal(null)
      } else {
        toast.error("Failed to Update Schedule Group")
      }
      updateScheduleGroupModal?.update()
    }
    ).catch((error) => {
      toast.error("Failed to Update Schedule Group")
    }
    )
  }




  return (
    <ModalSkeleton
      show={!!updateScheduleGroupModal}
      outsideClick={() => setUpdateScheduleGroupModal(null)}
    >
      <div>
        <h4 className="font-semibold text-lg text-center mb-2">
          Update Schedule Group
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <h5 className="font-semibold text-lg col-span-2 text-start">
            Select Schedules
          </h5>
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
              <option value="">All</option>
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
              <option value="">All</option>
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
              <option value="">All Disciplines</option>
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
              <option value="">All Events</option>
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
        <div className="grid grid-cols-2 gap-2 mt-4 border-t-2 pt-2 ">
          <h5 className="font-semibold text-lg col-span-2 text-start">
            Update Schedules With New Attributes
          </h5>
          <div className="flex items-center gap-1">
            <h3 className="">Delay Day Count:</h3>
            <input
              type="number"
              className="border border-gray-400 rounded-md p-1 w-auto"
              value={delay_day}
              onChange={(e) => setDelayDay(e.target.value)}
              placeholder="Delay Schedule"
            />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="">Status:</h3>
            <select className="border border-gray-400 rounded-md p-1"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Don't Change</option>
              <option value="WAITING">Waiting</option>
              <option value="ACTIVE">Active</option>
              <option value="FINISHED">Finished</option>
              <option value="CANCELED">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="">New Venue:</h3>
            <input
              value={newVenue}
              onChange={(e) => setNewVenue(e.target.value)}
              type="text"
              name="venue"
              className="border border-gray-400 rounded-md p-1 ri"
              placeholder="Enter venue"
            />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="">New Phase:</h3>
            <input
              type="text"
              value={newPhase}
              onChange={(e) => setNewPhase(e.target.value)}
              name="phase"
              className="border border-gray-400 rounded-md p-1 ri"
              placeholder="Enter Phase"
            />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="">Gender:</h3>
            <select className="border border-gray-400 rounded-md p-1"
              value={newGender}
              onChange={(e) => setNewGender(e.target.value)}
            >
              <option value="">Don't Change</option>
              <option value="W">Woman</option>
              <option value="M">Man</option>
              <option value="X">Mixed</option>
              <option value="O">Open</option>
            </select>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <h3 className="">Discipline:</h3>
            <select className="border border-gray-400 rounded-md p-1 w-full"
              value={newDiscipline}
              onChange={(e) => {
                setNewDiscipline(e.target.value);
                if (e.target.value === "") {
                  setNewEvent("")
                }
              }}
            >
              <option value="">Don't Change</option>
              {disciplineList?.map((discipline) => (
                <option key={discipline.discipline_code} value={discipline.discipline_code}>{discipline.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <h3 className="">Event:</h3>
            <select className="border border-gray-400 rounded-md p-1 w-full"
              value={newEvent}
              onChange={(e) => {
                setNewEvent(e.target.value);
                setNewDiscipline(eventList.find((event) => event.events_code == e.target.value)?.discipline_code ?? "")
              }}
            >
              <option value="">Don't Change</option>
              {eventList?.filter((event) => {
                if (newDiscipline) {
                  return event.discipline_code == newDiscipline
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
            onClick={() => { setUpdateScheduleGroupModal(null) }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              handleUpdateScheduleGroup()
            }}
          >
            Update Schedule Group
          </Button>
        </div>
      </div>
    </ModalSkeleton>
  )
}

export default UpdateScheduleGroupModal
