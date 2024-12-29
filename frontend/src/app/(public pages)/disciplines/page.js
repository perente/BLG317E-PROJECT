"use client"
import { Button } from "@/components/button"
import { useModalStore } from "@/lib/store";
import { deleteDiscipline, getDisciplines, getEvents, getSchedules } from "@/service/service"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


export default function Page() {
  const [disciplines, setDisciplines] = useState([])
  const [loading, setLoading] = useState(false)

  const setNewDisciplineModalData = useModalStore((state) => state.setNewDisciplineModalData)

  const router = useRouter()

  useEffect(() => {
    handleGetDisciplines()
  }, [])

  const handleGetDisciplines = async () => {
    setLoading(true)
    getDisciplines().then((res) => {
      setDisciplines(res.data)
    }).finally(() => {
      setLoading(false)
    })
  }

  const handleDeleteDiscipline = async (id) => {
    deleteDiscipline(id).then((res) => {
      if (res.status === 200) {
        setDisciplines(disciplines.filter((discipline) => discipline.discipline_code !== id))
      }
    }).catch((error) => {
      alert(error)
    }).finally(() => {
      handleGetDisciplines()
    })
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container m-auto">
      <h1 className="text-3xl my-4">Discipline</h1>
      <div className="flex flex-wrap gap-3 justify-center my-4">
        {disciplines.map((discipline) => (
          <div className="flex flex-col border border-gray-400 rounded-lg p-2 max-w-60 gap-2 duration-300 cursor-pointer hover:outline " key={discipline.id}
            onClick={() => {
              router.push(`/schedules/?discipline=${discipline.discipline_code}`)
            }}
          >
            <div className="flex justify-center">
              <img className="w-20" src={`https://gstatic.olympics.com/s1/t_original/static/light/pictograms-paris-2024/olympics/${discipline.discipline_code}_small.svg`}
                onError={(e) => {
                  e.target.src = "https://olympics.com/images/static/b2p-images/logo_color.svg"
                }
                }
              />
            </div>
            <div className="flex justify-between flex-col items-center">
              <div className="font-bold">{discipline.name}</div>
              <div className="">Discipline Code:<span className="font-bold">{discipline.discipline_code}</span> </div>
            </div>
          </div>
        ))
        }
      </div>
    </div>


  )

}