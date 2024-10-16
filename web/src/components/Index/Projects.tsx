import { Image, Paragraph, Section } from "./Section";
import { FaGooglePlay } from "react-icons/fa";

interface LinkProps {
  href: string;
  children: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ href, children }) => {
  return (
    <a href={href} target="_blank" className="text-blue-200 hover:text-white">
      {children}
    </a>
  );
};

interface ProjectProps {
  title: string;
  titleHref: string;
  description: React.ReactNode;
  myRole: React.ReactNode;
  imgSrc: string;
  techs: string[];
  links?: LinkProps[];
  side?: "left" | "right";
}

const Project: React.FC<ProjectProps> = ({
  title,
  titleHref,
  description,
  myRole,
  imgSrc,
  techs,
  links = [],
  side = "left",
}) => {
  return (
    <div className="mb-20">
      <div
        className={`flex flex-col md:flex-row justify-between items-start max-w-5xl mx-auto ${
          side === "right" ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Text Box */}
        <div className="relative z-10 md:w-1/2">
          <h3
            className={`text-3xl font-bold mb-4 ${
              side === "right" ? "text-right" : ""
            }`}
          >
            <a
              href={titleHref}
              target="_blank"
              className="text-blue-200 hover:text-white"
            >
              {title}
            </a>
          </h3>

          <div
            className={`bg-blue-950 p-5 ${
              side === "right" ? "md:ml-[-150px]" : "md:mr-[-150px]"
            } rounded-md shadow-lg`}
          >
            {description}
          </div>

          <ul
            className={`mt-4 flex flex-wrap gap-x-5 gap-y-2 ${
              side === "right" ? "ml-5 justify-end" : "mr-5"
            }`}
          >
            {techs.map((tech, i) => (
              <li key={`project-${title}-tech-${i}`} className="font-sfmono text-sm whitespace-nowrap">{tech}</li>
            ))}
          </ul>

          <ul className="mt-5">
            {links.map((link, i) => (
              <li key={`project-${title}-link-${i}`}>
                <Link href={link.href}>{link.children}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Image Box */}
        <div className="mt-8 md:mt-0 md:ml-6 relative z-0 md:w-1/2">
          <Image src={imgSrc} className="w-full h-auto rounded-lg" />
        </div>
      </div>

      <div className="justify-end flex">
        <div className="mt-10 md:w-5/6">{myRole}</div>
      </div>
    </div>
  );
};

function AimiProject() {
  return (
    <Project
      title="Aimi Player"
      titleHref="https://www.aimi.fm/"
      imgSrc="/images/aimi-player.png"
      techs={["Android", "Kotlin", "Jetpack Compose", "TypeScript", "C++"]}
      description={
        <>
          <Paragraph className="mb-0">
            Aimi Player is designed to transform how users engage with music by
            offering real-time interaction with generative music. It allows
            users to craft personalized listening experiences that evolve
            dynamically based on their preferences.
          </Paragraph>
        </>
      }
      myRole={
        <>
          <Paragraph>
            I initially developed the Android app for the team using Kotlin and
            Jetpack Compose, integrating our AMOS music service with Android's
            Media3 framework to ensure seamless playback and interaction.
          </Paragraph>
          <Paragraph>
            Later, I transitioned to the team working on AMOS, our
            cross-platform generative music service. My role focused on
            modernizing the service by migrating it to TypeScript and
            implementing a new architecture that improved scalability,
            performance, and maintainability.
          </Paragraph>
        </>
      }
      links={[
        {
          href: "https://play.google.com/store/apps/details?id=fm.aimi.android&hl=en",
          children: <FaGooglePlay />,
        },
      ]}
    ></Project>
  );
}

function OptuSafeProject() {
  return (
    <Project
      title="OptuSafe"
      titleHref="https://optus.com.au/"
      imgSrc="/images/optusafe.png"
      techs={["Java", "Spring Boot", "Kubernetes", "React", "GitLab Pipelines"]}
      side="right"
      description={
        <>
          <Paragraph className="mb-0">
            Optus needed to upgrade their ID verification service to meet
            stringent security standards and improve system efficiency. The
            challenge was to deliver a scalable, secure, and highly available
            solution while coordinating with multiple teams.
          </Paragraph>
        </>
      }
      myRole={
        <>
          <Paragraph>
            I managed the agile team, prioritizing tasks to boost productivity.
            I facilitated meetings to gather requirements and ensure alignment
            with Optus stakeholders. As a solution architect, I designed a
            full-stack web solution using Java, Spring, and Google Cloud,
            addressing critical security needs.
          </Paragraph>
        </>
      }
    ></Project>
  );
}

function AirtaskerProject() {
  return (
    <Project
      title="Airtasker"
      titleHref="https://www.airtasker.com/au/"
      imgSrc="/images/airtasker.png"
      techs={["Kotlin", "Spring Boot", "Android"]}
      description={
        <Paragraph className="mb-0">
          The project aimed to revamp Airtasker's app to improve its performance
          and adaptability. This was achieved by developing a Backend for
          Frontend (BFF) service that consolidated backend interactions,
          allowing the app to make a single request per usage. Additionally, it
          enabled dynamic updates to the app's UI without needing app updates,
          enhancing flexibility.
        </Paragraph>
      }
      myRole={
        <>
          <Paragraph>
            I spearheaded the development of a BFF service using Kotlin and
            Spring, streamlining backend calls. I also contributed to the
            Android development of the "Book Again" workflow, leveraging my
            skills in Android engineering to enhance user experience and
            retention.
          </Paragraph>
        </>
      }
      links={[
        {
          href: "https://play.google.com/store/apps/details?id=au.com.airtasker&hl=en",
          children: <FaGooglePlay />,
        },
      ]}
    ></Project>
  );
}

function Projects() {
  return (
    <Section id="projects" title="Some Things I've Built">
      <AimiProject />
      <OptuSafeProject />
      <AirtaskerProject />
    </Section>
  );
}

export default Projects;
