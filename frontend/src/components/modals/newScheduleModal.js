"use client"
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import Input from "../input";
import { useState } from "react";
import { Button } from "../button";
import { createNewSchedule } from "@/service/service";


const NewScheduleModal = () => {

  const newScheduleModal = useModalStore((state) => state.newScheduleModal)
  const toggleNewScheduleModal = useModalStore((state) => state.toggleNewScheduleModal)
  const [start_date, setStartDate] = useState("")
  const [end_date, setEndDate] = useState("")
  const [status, setStatus] = useState("")
  const [venue, setVenue] = useState("")
  const [phase, setPhase] = useState("")
  const [gender, setGender] = useState("")
  const [event, setEvent] = useState("")



  const handleNewSchedule = () => {
    createNewSchedule({
      start_date: start_date,
      end_date: end_date,
      status: status,
      venue: venue,
      phase: phase,
      event: event,
      gender: gender
    }).then((res) => {
      console.log(res);
      // toggleNewScheduleModal()
    })
  }

  return (
    <ModalSkeleton
      show={newScheduleModal}
      outsideClick={toggleNewScheduleModal}
    >
      <div>
        <h5 className="font-semibold text-lg text-center mb-2">
          New Schedule
        </h5>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <h3 className="">Start Date:</h3>
            <input
              type="datetime-local"
              name="notification_date"
              className="border border-gray-400 rounded-md p-1"
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
              className="border border-gray-400 rounded-md p-1"
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
              <option value="waiting">Waiting</option>
              <option value="active">Active</option>
              <option value="finished">Finished</option>
              <option value="cancelled">Cancelled</option>
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
              <option value="w">Woman</option>
              <option value="m">Man</option>
            </select>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <h3 className="">Event:</h3>
            <select className="border border-gray-400 rounded-md p-1 w-full"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
            >
              <option value="1">event1</option>
              <option value="2">event2</option>
            </select>
          </div>
        </div>
        <div className="w-full flex justify-center gap-4 mt-4">
          <Button
            onClick={toggleNewScheduleModal}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              handleNewSchedule()
            }}
          >
            Create New Schedule
          </Button>
        </div>
      </div>
    </ModalSkeleton>
  )
}

export default NewScheduleModal
