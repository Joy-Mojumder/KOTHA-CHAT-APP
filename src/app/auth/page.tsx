"use client";
import Image from "next/image";
import AuthButtons from "./callback/AuthButtons";

const Page = () => {
  return (
    <div className="flex h-screen w-full">
      <section className="flex-1 flex items-center justify-center dark:bg-[#9b0f4055] bg-[#9b0f40] relative overflow-hidden">
        <img
          src="/Chatting (HD).png"
          alt="KOTHA CORNER LOGO"
          className="absolute -left-5 -bottom-5 lg:w-2/3 w-full h-auto opacity-25 pointer-events-none select-none"
        />
        <div className="flex flex-col px-4 gap-2 text-center font-semibold mb-20">
          <Image
            src="/KOTHA LOGO.png"
            alt="KOTHA APP LOGO"
            width={597}
            height={369}
            className="w-96 z-0 pointer-events-none select-none drop-shadow-xl mx-auto"
          />
          <p className="text-xl lg:text-3xl text-white text-balance">
            The <span className="bg-emerald-500 px-2">BEST</span>
            <span className="px-2">App For</span>
            <span className="bg-amber-500 px-2">CHATTING</span>
          </p>
          <p className="bg-rose-600 my-2 text-center w-1/2 sm:w-1/3 text-xl md:text-3xl text-white mx-auto">
            <span>KOTHA</span>
          </p>
          <AuthButtons />
        </div>
      </section>
      <section className="flex-1 relative overflow-hidden justify-center items-center hidden md:flex">
        <Image
          src="/KOTHA HERO IMAGE.png"
          alt="KOTHA APP HERO IMAGE"
          fill
          sizes="(100vw - 10px)"
          priority
          className="w-full md:object-fill  h-full xl:object-cover dark:opacity-60 opacity-90 pointer-events-none select-none"
        />
      </section>
    </div>
  );
};

export default Page;
