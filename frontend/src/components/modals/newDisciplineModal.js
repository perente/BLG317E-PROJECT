"use client"
import { useModalStore } from "@/lib/store";
import ModalSkeleton from "./modalSkeleton";
import Input from "../input";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { newDiscipline, updateDiscipline } from "@/service/service";


const NewDisciplineModal = () => {

  const newDisciplineModalData = useModalStore((state) => state.newDisciplineModalData)
  const setNewDisciplineModalData = useModalStore((state) => state.setNewDisciplineModalData)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")

  useEffect(() => {
    console.log(newDisciplineModalData);
    
    if (newDisciplineModalData?.editMode) {
      setName(newDisciplineModalData?.discipline?.name)
      setCode(newDisciplineModalData?.discipline?.discipline_code)
    }
  }, [newDisciplineModalData])

  const handleNewDiscipline = () => {
    if (newDisciplineModalData?.editMode) {
      updateDiscipline({
        discipline_code: code,
        name: name,
        id: newDisciplineModalData?.discipline?.id
      }).then((res) => {
        setNewDisciplineModalData(null)
        newDisciplineModalData.update()
      }
      ).catch((error) => {
        alert(error)
      })
      return
    }
    newDiscipline({
      discipline_code: code,
      name: name
    }).then((res) => {
      setNewDisciplineModalData(null)
      newDisciplineModalData.update()
    }
    ).catch((error) => {
      alert(error)
    })
  }

  return (
    <ModalSkeleton
      show={!!newDisciplineModalData}
      outsideClick={() => setNewDisciplineModalData(null)}
    >
      <div>
        <h5 className="font-semibold text-lg text-center mb-2">
          {newDisciplineModalData?.editMode ? "Edit" : "New"} Discipline
        </h5>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <h3 className="shrink-0">Discipline Name:</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              name="venue"
              className="border border-gray-400 rounded-md p-1 w-full"
              placeholder="Enter venue"
            />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="">Code:</h3>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              name="phase"
              className="border border-gray-400 rounded-md p-1"
              placeholder="Enter Phase"
            />
          </div>
        </div>
        <div className="w-full flex justify-center gap-4 mt-4">
          <Button
            onClick={() => setNewDisciplineModalData(null)}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              handleNewDiscipline()
            }}
          >
            {newDisciplineModalData?.editMode ? "Edit" : "Create"} Discipline
          </Button>
        </div>
      </div>
    </ModalSkeleton>
  )
}

export default NewDisciplineModal
