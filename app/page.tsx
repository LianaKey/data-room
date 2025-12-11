"use client";

import Image from "next/image";
import GetStartedButton from "./components/GetStartedButton";

const screens = [
  {
    title: "Your Files, Anywhere",
    description:
      "Access, share, and collaborate on your files from any device. Your data, always available, always secure.",
    image: "/window.svg",
  },

  {
    title: "Effortless Collaboration",
    description:
      "Invite your team, comment, and work together in real time. Boost productivity with seamless file sharing.",
    image: "/globe.svg",
  },
  {
    title: "Secure & Reliable Storage",
    description:
      "Your files are protected with enterprise-grade security. Trust your data with our Dropbox-like service.",
    image: "/file.svg",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-24 py-12 px-4">
      {screens.map((screen, idx) => (
        <section
          key={screen.title}
          className={`flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-5xl gap-12 ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}
          id={idx === 1 ? "features" : idx === 2 ? "security" : undefined}
        >
          <div className="flex-1 flex flex-col items-start gap-4">
            <h2 className="text-4xl font-extrabold text-blue-800 dark:text-white mb-2">
              {screen.title}
            </h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-4">
              {screen.description}
            </p>
            {idx === 0 && (
              <GetStartedButton className="inline-block rounded-full bg-blue-700 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-800 transition">
                Get Started
              </GetStartedButton>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Image
              src={screen.image}
              alt={screen.title}
              width={340}
              height={340}
              className="rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6"
              priority
            />
          </div>
        </section>
      ))}
    </main>
  );
}
