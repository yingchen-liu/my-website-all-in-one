import { TypeAnimation } from "react-type-animation";
import { Button, Paragraph } from "./Section";

function Banner() {
  return (
    <section className="py-20 pt-48">
      <p className="text-white font-thin font-sfmono mb-6">Hi, my name is</p>
      <h1 className="md:text-7xl text-5xl font-bold mb-2">Yingchen Liu</h1>
      <h2 className="text-blue-200 text-opacity-60 md:text-7xl text-5xl font-bold">
        <TypeAnimation
          className="h-[190px] md:h-[160px] overflow-hidden"
          sequence={[
            "I build scalable web apps.",
            1000,
            "I build Android apps with Kotlin and Jetpack.",
            1000,
            "I build React & Next.js web apps.",
            1000,
            "I build cloud infrastructure on AWS and GCP.",
            1000,
            "I manage CI/CD pipelines.",
            1000,
            "I improve WordPress site performance.",
            1000,
            "I integrate AI with mobile and web apps.",
            1000,
          ]}
          wrapper="span"
          speed={70}
          cursor={true}
          repeat={Infinity}
          style={{ display: "inline-block" }}
        />
      </h2>

      <Paragraph className="md:w-1/2 mb-6">
        Versatile Senior Software Engineer with over{" "}
        {new Date().getFullYear() - 2016} years of hands-on experience,
        specialising in full-stack web, mobile, and cloud technologies.
      </Paragraph>

      <Button href="/resume">
        My Resume
        <span className="ml-3 inline-block">📝</span>
      </Button>
    </section>
  );
}

export default Banner;
