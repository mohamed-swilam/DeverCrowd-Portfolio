import { FaGlobe } from "react-icons/fa";
import { FaRocket } from "react-icons/fa";
import { FaStickyNote } from "react-icons/fa";

export const vmc = [
  {
    title: "Vision",
    icon: (
      <span aria-label="globe">
        <FaGlobe />
      </span>
    ),
    desc: (
      <>
        We aim to be the trusted digital product partner for ambitious
        businesses, helping them compete, scale, and lead through better digital
        experiences.
      </>
    ),
  },
  {
    title: "Mission",
    icon: (
      <span aria-label="globe">
        <FaRocket />
      </span>
    ),
    desc: (
      <>
        We build websites, mobile apps, and custom digital solutions that solve
        real business problems and deliver measurable outcomes.
      </>
    ),
  },
  {
    title: "Approach",
    icon: (
      <span aria-label="gear">
        <FaStickyNote />
      </span>
    ),
    desc: (
      <>
        We work as a product-minded team: understand your goals, design with
        users in mind, and deliver reliable software with clear communication at
        every step.
      </>
    ),
  },
];

export const whoweare = {
  title: "About DeverCrowd",
  description: (
    <>
      <span className="text-primary font-semibold">DeverCrowd</span> is a
      digital product studio focused on building business-ready solutions.
      <br />
      
      We partner with startups and companies to plan, design, and develop
      high-performing websites, mobile applications, and scalable platforms that
      support real growth.
    </>
  ),
};
