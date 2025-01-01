'use client'


import { InfiniteMovingCards } from "./ui/infinite-moving-cards"

const testimonials = [
  {
    quote:
      'The team at this transport service exceeded my expectations. They were reliable and handled my goods with care. Highly recommend!',
    name: 'James Walker',
    title: 'Freight Manager',
  },
  {
    quote:
      'Fast, efficient, and friendly! They kept me informed throughout the journey, and my shipment arrived right on time.',
    name: 'Sarah Thompson',
    title: 'Operations Coordinator',
  },
  {
    quote:
      'I’ve worked with several transport companies, but this one stands out for their professionalism and commitment to safety.',
    name: 'Michael Rivera',
    title: 'Logistics Specialist',
  },
  {
    quote:
      'Their dedication to customer satisfaction is remarkable. They went above and beyond to accommodate my shipping needs.',
    name: 'Laura Kim',
    title: 'Supply Chain Manager',
  },
  {
    quote:
      'The drivers are skilled and knowledgeable, and my items arrived in perfect condition. Couldn’t ask for better service!',
    name: 'Chris Patel',
    title: 'Warehouse Supervisor',
  },
  {
    quote:
      'The service was seamless from start to finish. I appreciate the regular updates and timely delivery. Will use them again!',
    name: 'Emily Brooks',
    title: 'Distribution Manager',
  },
  {
    quote:
      'Trustworthy and professional, this transport service has made logistics a breeze for my business. Excellent job!',
    name: 'Robert Garcia',
    title: 'Business Owner',
  },
  {
    quote:
      'I felt confident entrusting them with my delivery. They are responsive, organized, and offer great customer support.',
    name: 'Jessica Lee',
    title: 'Procurement Officer',
  },
  {
    quote:
      'Superb handling of fragile items. They treated every item with respect and ensured a safe, on-time delivery.',
    name: 'Tom Adams',
    title: 'Fleet Manager',
  },
  {
    quote:
      'Impressed with the high-quality service and attention to detail. Their team made sure my shipment was safe every step of the way.',
    name: 'Nancy Baker',
    title: 'Shipping Coordinator',
  },
];




export default function TestomonialCard() {
  return (
    <div className="h-[40rem] w-full dark:bg-black dark:bg-grid-white/[0.2] relative flex flex-col items-center justify-center overflow-hidden">
      <h2 className="text-3xl mb-8 font-bold text-center">Hear our Harmony: Voices of Success</h2>
      <div className="flex justify-center w-full overflow-hidden px-4 sm:px-6 lg:px-8 ">
        <div className="w-full max-w-6xl">
        <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
        </div>
      </div>
    </div>
  )
}
