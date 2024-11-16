"use client"
import { getSchedules } from "@/service/service"
import { useEffect, useState } from "react"


export default function Page() {


  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    getSchedules().then((res) => {
      setSchedules(res.data)
    })
  }, [])

  return (
    <div>
      <h1>Schedules</h1>
      <div>
        {schedules.map((schedule) => (
          <div className="flex flex-col border border-gray-400 rounded-lg p-2 m-4" key={schedule.schedule_code}>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Start Date:</p>
              <h2>{schedule.start_date}</h2>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">End Date:</p>
              <p>{schedule.end_date}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Gender:</p>
              <p>{schedule.gender}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Status:</p>
              <p>{schedule.status}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Event Name:</p>
              <p>{schedule.event_name}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Event Code:</p>
              <p>{schedule.event_code}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Venue:</p>
              <p>{schedule.venue}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Phase:</p>
              <p>{schedule.phase}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Schedule Code:</p>
              <p>{schedule.schedule_code}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">URL:</p>
              <p>{schedule.url}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="font-semibold">Discipline Code:</p>
              <p>{schedule.discipline_code}</p>
            </div>

          </div>
        ))
        }

      </div>
    </div>


  )

}