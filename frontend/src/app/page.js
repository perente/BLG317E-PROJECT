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

const sports = [
  "Archery",
  "Artistic Gymnastics",
  "Artistic Swimming",
  "Athletics",
  "Badminton",
  "Basketball",
  "Basketball 3x3",
  "Beach Volleyball",
  "Boxing",
  "Breaking",
  "Canoe Slalom",
  "Canoe Sprint",
  "Cycling BMX Freestyle",
  "Cycling BMX Racing",
  "Cycling Mountain Bike",
  "Cycling Road",
  "Cycling Track",
  "Diving",
  "Equestrian",
  "Fencing",
  "Football",
  "Golf",
  "Handball",
  "Hockey",
  "Judo",
  "Marathon Swimming",
  "Modern Pentathlon",
  "Rhythmic Gymnastics",
  "Rowing",
  "Rugby Sevens",
  "Sailing",
  "Shooting",
  "Skateboarding",
  "Sport Climbing",
  "Surfing",
  "Swimming",
  "Table Tennis",
  "Taekwondo",
  "Tennis",
  "Trampoline",
  "Triathlon",
  "Volleyball",
  "Water Polo",
  "Weightlifting",
  "Wrestling"
];


  return (
    <div className="flex py-12 flex-1 bg-[#f5f5f5]">
      <Script src="https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js" />
      <main className="w-full flex-1 flex flex-col items-center z-10 mt-16">
        <img className="max-w-[240px] mb-12" src="img/logo.png" />
        <h1 className="text-3xl mb-6 font-paris font-semibold text-black ">Welcome to The Olympic Games</h1>
        <div>
          <ul className="grid grid-cols-4 gap-3">
            <CustomButton
              color="#54458C"
              bgLight="#877FB3"
              size="lg"
              icon={<GrSchedule className="scale-150" />}
              onClick={() => routerPush("/schedules")}>Schedules</CustomButton>
            <CustomButton
              size="lg"
              color="#077F86"
              bgLight="#5FBBBB"
              icon={<GiPartyFlags className="scale-150" />}
              onClick={() => routerPush("/events")}>Events</CustomButton>
            <CustomButton
              size="lg"
              color="#81154C"
              bgLight="#BC5D85"
              icon={<FaMedal className="scale-150" />}
              onClick={() => routerPush("/medals")}>Medals</CustomButton>
            <CustomButton
              size="lg"
              color="#8C5B45"
              bgLight="#B78F73"
              icon={<MdSportsHandball className="scale-150" />}
              onClick={() => routerPush("/athletes")}>Athletes</CustomButton>
            <CustomButton
              size="lg"
              color="#86B007"
              bgLight="#B4D356"
              icon={<RiTeamFill className="scale-150" />}
              onClick={() => routerPush("/teams")}>Teams</CustomButton>
            <CustomButton
              size="lg"
              color="#4C8115"
              bgLight="#7BBF5A"
              icon={<MdLeaderboard className="scale-150" />}
              onClick={() => routerPush("/leaderboard")}>Leaderboard</CustomButton>
            <CustomButton
              size="lg"
              color="#6654B4"
              bgLight="#8A83D1"
              icon={<MdOutlineSportsBaseball className="scale-150" />}
              onClick={() => routerPush("/disciplines")}>Disciplines</CustomButton>
            <CustomButton
              size="lg"
              color="#045B70"
              bgLight="#3A8799"
              icon={<BsFillFlagFill className="scale-150" />}
              onClick={() => routerPush("/disciplines")}>Countries</CustomButton>
          </ul>
        </div>
      </main>
    </div>
  );
}
