"use client";

import { logout } from "@/actions/logout";
import { getLoggedInUser } from "@/appwrite/config";
import { Button } from "@mantine/core";
import Link from "next/link";
import { Models } from "node-appwrite";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar/page";
import Footer from "@/components/folder/page";

interface SectionContent {
  title: string;
  description: string;
  image: string;
  background: string;
  character: string;
  backgroundImage: string;
}

const sections: Record<string, SectionContent> = {
  spidercraft: {
    title: "/svg/spidercraftlogo.svg",  // Changed this line to use the image path
    description:
      "Spidercraft is a 4-round online event that challenges participants' aptitude, image recognition, quiz knowledge, and gaming skills.",
    image: "/svg/spidercraft.svg",
    background: "",
    character: "/svg/spiderman.svg",
    backgroundImage: "/svg/bg1.svg",
  },
  aptitude: {
    title: "WEB OF KNOWLEDGE",
    description:
      "Test your problem-solving skills with a series of aptitude questions.",
    image: "/svg/aptitude.svg",
    background: "",
    character: "/svg/gwen2.svg",
    backgroundImage: "/svg/bg1.svg",
  },
  imageGuesser: {
    title: "SPIDEY SENSE",
    description:
      "Put your visual recognition skills to the test with our image guessing challenge.",
    image: "/svg/imageguesser.svg",
    background: "",
    character: "/svg/imageguess.svg",
    backgroundImage: "/svg/bg1.svg",
  },
  quizRound: {
    title: "ALGOWEB",
    description:
      "Challenge your knowledge with our comprehensive quiz covering various topics.",
    image: "/svg/quizround.svg",
    background: "",
    character: "/svg/codeforces.svg",
    backgroundImage: "/svg/bg1.svg",
  },
  flappySpider: {
    title: "SPIDERMAN: CITY CHASE",
    description:
      "Test your gaming skills with our Spider-Man themed endless runner game.",
    image: "/svg/flappyspidey.svg",
    background: "",
    character: "/svg/webspider.svg",
    backgroundImage: "/svg/bg1.svg",
  },
};

const HomePage = () => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>();
  const [activeSection, setActiveSection] = useState("spidercraft");

  useEffect(() => {
    getLoggedInUser().then((user) => setUser(user));
  }, []);

  const renderLogoutButton = () => {
    if (activeSection !== "spidercraft" || !user) return null;

    return (
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={async () => await logout()}
          fullWidth
          size="lg"
          className="button-Sponsor"
        >
          LOG OUT
        </Button>
      </div>
    );
  };

  const renderActionButtons = () => {
    if (activeSection !== "spidercraft") return null;

    if (user) {
      return (
        <div className="space-x-4 flex justify-center items-center left-0 right-0">
          <Link href="/round-1">
            <Button fullWidth size="lg" className="button-Sponsor">
              Proceed To Rounds
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-x-6 flex ">
        <Link href="/register">
          <Button fullWidth size="lg" className="button-Sponsor">
            REGISTER
          </Button>
        </Link>
        <Link href="/login">
          <Button fullWidth size="lg" className="button-Sponsor">
            SIGN IN
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 grid grid-cols-[350px_1fr]">
          {/* Left Sidebar */}
          <div className="">
            <div className="flex flex-col h-[calc(99vh-82px)]">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className="relative w-full h-32 overflow-hidden group border-b border-white/10"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${section.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      transform: "scale(1.02)",
                    }}
                  />
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      activeSection === key
                        ? ""
                        : "bg-black/50 group-hover:bg-black/30"
                    }`}
                  />
                  {key === 'spidercraft' ? (
                    <img 
                      src={section.title}
                      alt="Spidercraft"
                      className="relative z-10 h-16 mt-16 ml-2"
                    />
                  ) : (
                    <h2 className="relative z-10 text-2xl font-bold tracking-wider p-2 mt-16 text-left text-white font-robotoCondensed">
                      {section.title}
                    </h2>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div
            className="relative transition-all duration-500 bg-cover bg-center h-[calc(100vh-64px)]"
            style={{
              backgroundImage: `url(${sections[activeSection].backgroundImage})`,
            }}
          >
            <div
              className={`absolute inset-0 ${sections[activeSection].background}`}
            ></div>
            {renderLogoutButton()}
            <div className="relative h-screen p-16 -mt-48 flex items-center">
              <div className="flex-1 space-y-6 max-w-2xl">
                <div className="space-y-2">
                  {activeSection === 'spidercraft' ? (
                    <img 
                      src={sections[activeSection].title}
                      alt="Spidercraft"
                      className="h-24"
                    />
                  ) : (
                    <h1 className="text-7xl font-bold tracking-wider font-robotoCondensed">
                      {sections[activeSection].title}
                    </h1>
                  )}
                  <div className="flex items-center space-x-1">
                    <div className="h-1 w-64 bg-red-600"></div>
                    <div className="h-1 w-64 bg-white"></div>
                  </div>
                </div>
                <p className="text-xl text-gray-300 leading-relaxed font-poppins">
                  {sections[activeSection].description}
                </p>
                <div className="pt-8">{renderActionButtons()}</div>
              </div>
            </div>

            {/* Character image */}
            <div className="absolute right-0 -bottom-80 h-[1000px] w-[50">
              <img
                src={sections[activeSection].character || "/placeholder.svg"}
                alt={sections[activeSection].title}
                className="h-[680px] w-auto object-contain"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;