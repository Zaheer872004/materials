"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "./ui/images-slider";
import { Button } from "./ui/moving-border";
import Link from "next/link";

export function ImagesSliderDemo() {
  const images = [
    "https://hankunfluid.oss-us-west-1.aliyuncs.com/Uploads/keditor/image/20230301/20230301170907_98017.jpg",
    "https://hankunfluid.oss-us-west-1.aliyuncs.com/Uploads/keditor/image/20230417/20230417101157_56167.jpg",
    "https://www.myssp.com/hubfs/Instrumentation-Products-Fixed-handle-2.webp",
  ];
  return (
    <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        

        <div
    className="h-auto md:h-[40rem] w-full rounded-md flex flex-col items-end justify-center relative overflow-hidden mx-auto py-10 md:py-0"
    > 
      {/* <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      /> */}

      <div 
      className=" p-4 relative z-4 w-full text-center"
      > 

      {/* <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      /> */}

        <h1
        className="mt-20 md:mt-0 text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
        >Lorem, ipsum dolor.</h1>

        <p 
        className="mt-4 font-normal text-base md:text-lg text-neutral-300 max-w-lg mx-auto"
        >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo dolorum cumque temporibus sed vero a ipsum voluptatibus, libero ipsa aperiam sequi aliquid saepe quas eos reiciendis quos. Ab, ipsam aut!</p>

        <div className="mt-4">
                <Link href={"/service"}>
                    <Button
                    borderRadius="1.75rem"
                    className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                    Explore Service
                    </Button>
                </Link>
            </div>
      </div>



    </div>
      </motion.div>
    </ImagesSlider>
  );
}

/*

<div
    className="h-auto md:h-[40rem] w-full rounded-md flex flex-col items-end justify-center relative overflow-hidden mx-auto py-10 md:py-0"
    > 
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <div 
      className=" p-4 relative z-4 w-full text-center"
      > 

      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

        <h1
        className="mt-20 md:mt-0 text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
        >Truck Transport Services</h1>

        <p 
        className="mt-4 font-normal text-base md:text-lg text-neutral-300 max-w-lg mx-auto"
        >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo dolorum cumque temporibus sed vero a ipsum voluptatibus, libero ipsa aperiam sequi aliquid saepe quas eos reiciendis quos. Ab, ipsam aut!</p>

        <div className="mt-4">
                <Link href={"/service"}>
                    <Button
                    borderRadius="1.75rem"
                    className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                    Explore Service
                    </Button>
                </Link>
            </div>
      </div>



    </div>


*/
