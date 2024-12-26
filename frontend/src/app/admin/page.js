"use client";
import { CustomButton } from "@/components/custom-button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { GrSchedule } from "react-icons/gr";
import { GiPartyFlags } from "react-icons/gi";
import { FaMedal } from "react-icons/fa";
import { MdSportsHandball } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { MdLeaderboard } from "react-icons/md";
import { MdOutlineSportsBaseball } from "react-icons/md";
import { BsFillFlagFill } from "react-icons/bs";
import { Button } from "@/components/button";
import { deleteCookie } from "cookies-next";
import confetti from "canvas-confetti";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
    }, 1000);
  }, [])

  const routerPush = (path) => {
    router.push(path);
  };


  return (
    <div className="flex h-full flex-col py-12 flex-1 bg-[#f5f5f5]">
      <div className="flex justify-end container mx-auto">
        <Button
          type="error"
          onClick={() => {
            deleteCookie("auth");
            location.reload();
          }}>Log Out</Button>
      </div>
      <main className="w-full flex-1 flex flex-col items-center z-10 mt-16">
        <h1 className="text-3xl mb-6 font-paris font-semibold text-black">Olympic Games Management Panel</h1>
        <div>
          <ul className="grid grid-cols-4 gap-3">
            <Button onClick={() => routerPush("/admin/schedules")}>Schedules</Button>
            <Button onClick={() => routerPush("/admin/events")}>Events</Button>
            <Button onClick={() => routerPush("/admin/medallists")}>Medallists</Button>
            <Button onClick={() => routerPush("/admin/athletes")}>Athletes</Button>
            <Button onClick={() => routerPush("/admin/coaches")}>Coaches</Button>
            <Button onClick={() => routerPush("/admin/teams")}>Teams</Button>
            <Button onClick={() => routerPush("/admin/leaderboard")}>Leaderboard</Button>
            <Button onClick={() => routerPush("/admin/disciplines")}>Disciplines</Button>
            <Button onClick={() => routerPush("/admin/countries")}>Countries</Button>
          </ul>
        </div>
      </main>
    </div>
  );
}
