'use client'
import { Button } from "@/components/button";
import { useEffect, useState } from "react";

const Athletes = () => {


    return (
        <div className="h-[100vh] w-full flex flex-col items-center gap-16">

            <div className=" w-full text-center text-xl font-semibold bg-blue-500 text-white py-10 " >
                <h1>Athletes</h1>
            </div>

            <div className="flex justify-between items-center gap-20 px-16 sm:py-9 sm:text-lg rounded-lg  bg-white shadow-md " >

                <div className=" flex gap-4 items-center rounded-lg border-2 border-gray-400 px-8 py-3 text-black" >
                    <p>All Disciplines</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
                <div className=" flex gap-4 items-center rounded-lg border-2 border-gray-400 px-8 py-3 text-black text-lg" >
                    <p>All NOCs</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
                <div className=" flex gap-4 items-center rounded-lg border-2 border-gray-400 px-8 py-3 text-black text-lg" >
                    <p>All Gender</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>

                <div className="" >
                    <Button>Reset Filters</Button>
                </div>

            </div>

            <div className="w-full" >
                <div className="w-full flex justify-around items-center px-20 py-6 text-lg" >
                    <p>Name</p>
                    <p>NOC</p>
                    <p>Discipline</p>
                </div>
                <div className="shadow-md h-2 bg-white"></div>
            </div>

        </div>


    );
};

export default Athletes;
