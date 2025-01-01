// import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";

import Link from "next/link";
import { BackgroundGradient } from "./ui/background-gradient";

export function BentoGridDemo() {
  return (
    <>
      <div className="bg-gray-900">
      <BackgroundGradient className=" ">
        <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow">
          <BentoGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {items.map((item, i) => (
              <Link href={item.title} key={i} className="flex justify-start items-center text-center text-wrap">
                <BentoGridItem className=""
                  title={item.title}
                  description={item.description}
                  header={item.header}
                />
              </Link>
            ))}
          </BentoGrid>
        </div>
      </BackgroundGradient>
      </div>
    </>
  );
}




const items = [
  {
    title: "The Spirit of Innovation",
    description: "Explore the fascinating journey of groundbreaking ideas and inventions that have shaped the modern world. From the earliest concepts to the revolutionary creations that define our present, discover how human ingenuity has driven progress and innovation in every field of life. This journey will inspire you to think outside the box and embrace the endless possibilities of innovation.",
    header: (
      <img
        src="https://d570f7c543ae30237739.cdn6.editmysite.com/uploads/b/acc9fd50-20a7-11ea-ba6e-93971141b8e7/IMG_20200129_150751-01(1).jpeg?width=2400&optimize=medium"
        alt="The Dawn of Innovation"
        className="w-full h-[100%] object-cover rounded-xl"
      />
    ),
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology and how it has reshaped every aspect of human existence. From the advent of the internet to the rise of AI and smart devices, the digital revolution continues to evolve at an unprecedented pace, enabling new possibilities and challenges. Join us as we explore the profound impacts technology has had on communication, business, healthcare, and our everyday lives.",
    header: (
      <img
        src="https://d570f7c543ae30237739.cdn6.editmysite.com/uploads/b/acc9fd50-20a7-11ea-ba6e-93971141b8e7/IMG_20200129_140346-01.jpeg?width=2400&optimize=medium"
        alt="The Digital Revolution"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty and functionality behind thoughtful and intentional design. Whether it's graphic design, architecture, or user interfaces, great design has the power to transform the world around us. Learn how design principles are used to solve complex problems, create aesthetically pleasing solutions, and improve user experiences. The art of design is about more than just visuals—it's about creating meaningful and impactful connections.",
    header: (
      <img
        src="https://d570f7c543ae30237739.cdn6.editmysite.com/uploads/b/acc9fd50-20a7-11ea-ba6e-93971141b8e7/IMG_20200129_140704-01.jpeg?width=2400&optimize=medium"
        alt="The Art of Design"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
  },
  {
    title: "The Power of Communication",
    description: "Understand the profound impact of effective communication in our personal and professional lives. Good communication is the cornerstone of successful relationships, whether in the workplace, at home, or in public discourse. Learn how words, gestures, and technology have evolved to facilitate meaningful conversations and connection across cultures and communities. The power of communication is essential for fostering understanding, collaboration, and progress.",
    header: (
      <img
        src="https://d570f7c543ae30237739.cdn6.editmysite.com/uploads/b/acc9fd50-20a7-11ea-ba6e-93971141b8e7/IMG_20200129_142438-01.jpeg?width=2400&optimize=medium"
        alt="The Power of Communication"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
  },
  {
    title: "The Pursuit of Knowledge",
    description: "Join the ongoing quest for understanding and enlightenment. Whether through formal education, self-study, or personal experiences, the pursuit of knowledge is an ever-evolving journey that shapes our worldview. Explore how curiosity drives innovation, intellectual growth, and personal development. The quest for knowledge is not only about gaining facts but about learning to think critically, question assumptions, and embrace new perspectives.",
    header: (
      <img
        src="https://d570f7c543ae30237739.cdn6.editmysite.com/uploads/b/acc9fd50-20a7-11ea-ba6e-93971141b8e7/IMG_20200129_150934-01(1).jpeg?width=2400&optimize=medium"
        alt="The Pursuit of Knowledge"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
  },
  {
    title: "The Joy of Creation",
    description: "Experience the exhilarating thrill of bringing ideas to life. Whether it's through art, technology, music, or writing, creation allows us to express our innermost thoughts and make an impact on the world around us. Discover the joy of the creative process, from the initial spark of inspiration to the satisfaction of seeing your vision come to life. The joy of creation is not just about the final product—it's about the journey of self-expression and fulfillment.",
    header: (
      <img
        src="https://d570f7c543ae30237739.cdn6.editmysite.com/uploads/b/acc9fd50-20a7-11ea-ba6e-93971141b8e7/IMG_20200129_135942__01-01.jpeg?width=2400&optimize=medium"
        alt="The Joy of Creation"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
  },
  {
    title: "The Spirit of Adventure",
    description: "Embark on exciting journeys and thrilling discoveries that push the limits of our imagination and courage. From exploring new frontiers in the natural world to venturing into the unknown realms of space and the digital age, adventure calls to those seeking new challenges. Whether it's a physical adventure or a mental one, the spirit of adventure is about embracing uncertainty and pushing past fear to uncover new possibilities and experiences.",
    header: (
      <img
        src="https://d570f7c543ae30237739.cdn6.editmysite.com/uploads/b/acc9fd50-20a7-11ea-ba6e-93971141b8e7/IMG_20200129_141600-01.jpeg?width=2400&optimize=medium"
        alt="The Spirit of Adventure"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
  },
  {
    title: "The Spirit of Adventure",
    description: "Embark on exciting journeys and thrilling discoveries that push the limits of our imagination and courage. From exploring new frontiers in the natural world to venturing into the unknown realms of space and the digital age, adventure calls to those seeking new challenges. Whether it's a physical adventure or a mental one, the spirit of adventure is about embracing uncertainty and pushing past fear to uncover new possibilities and experiences.",
    header: (
      <img
        src="https://d570f7c543ae30237739.cdn6.editmysite.com/uploads/b/acc9fd50-20a7-11ea-ba6e-93971141b8e7/IMG_20200129_141600-01.jpeg?width=2400&optimize=medium"
        alt="The Spirit of Adventure"
        className="w-full h-full object-cover rounded-xl"
      />
    ),
  },
];

