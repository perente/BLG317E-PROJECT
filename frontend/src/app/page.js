"use client";
import { Button } from "@/components/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

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
    <div className="flex h-[100vh]">
      <Script src="https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js" />
      <main className="w-full flex-1 flex flex-col justify-center items-center z-10">
        <h1 className="text-xl mb-4">Welcome to The Olympic Games</h1>
        <div>
          <ul className="grid grid-cols-3 gap-3">
            <Button onClick={() => routerPush("/schedules")}>Schedules</Button>
            <Button onClick={() => routerPush("/events")}>Events</Button>
            <Button onClick={() => routerPush("/medals")}>Medals</Button>
            <Button onClick={() => routerPush("/athletes")}>Athletes</Button>
            <Button onClick={() => routerPush("/teams")}>Teams</Button>
            <Button onClick={() => routerPush("/leaderboard")}>Leaderboard</Button>
          </ul>
        </div>
      </main>
    </div>
  );
}
