"use client"
import { getDisciplines, getEvents, getSchedules } from "@/service/service"
import { useEffect, useState } from "react"


export default function Page() {
  const [disciplines, setDisciplines] = useState([])


  useEffect(() => {
    getDisciplines().then((res) => {
      setDisciplines(res.data)
    })
  }, [])

  return (
    <div>
      <h1>Schedules</h1>
      <div>
        {disciplines.map((discipline) => (
          <div className="flex flex-col border border-gray-400 rounded-lg p-2 m-4 max-w-60" key={discipline.id}>
            <div className="flex justify-between">
              <div className="font-bold">{discipline.name}</div>
              <div className="font-bold">{discipline.discipline_code}</div>
            </div>
          </div>
        ))
        }

      </div>
    </div>


  )

}