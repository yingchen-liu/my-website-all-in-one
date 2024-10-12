import { useState } from "react";
import { Link, Paragraph, Section } from "./Section";

// Define MenuItem with React elements as content
interface MenuItem {
  id: number | number[];
  label: string;
  content?: React.ReactNode; // This will hold React elements or JSX
  indent?: boolean;
}

interface ExpereinceProps {
  company: string;
  companyHref: string;
  position: string;
  from: string;
  to: string;
  children: React.ReactNode;
}

const Experience: React.FC<ExpereinceProps> = ({
  company,
  companyHref,
  position,
  from,
  to,
  children,
}) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-blue-200">
        {position} @ <Link href={companyHref}>{company}</Link>
      </h3>
      <div className="text-sm font-sfmono">
        {from} - {to}
      </div>
      <Paragraph className="py-5">{children}</Paragraph>
    </div>
  );
};

const AimiExperience = () => (
  <Experience
    company="Aimi"
    companyHref="https://www.aimi.fm/"
    position="Sensior Software Engineer"
    from="Jun 2022"
    to="May 2024"
  >
    <div>
      Demonstrated versatility and expertise across diverse software development
      projects:
    </div>
    <ul className="list-disc ml-5 mt-5">
      <li>
        Led the rewriting of a complex AI generative music backend service in
        TypeScript
      </li>
      <li>
        Initiated the rewrite for Aimi's Android interactive player app using
        Kotlin and Jetpack, laying the groundwork for modernisation and improved
        functionality
      </li>
      <li>Managed AWS cloud infrastructure</li>
      <li>
        Worked on a modernization group to enhance development workflow using
        GitHub Actions
      </li>
    </ul>
  </Experience>
);

const OptusExperience = () => (
  <Experience
    company="Optus"
    companyHref="https://www.optus.com.au/"
    position="Engagement Lead"
    from="Jan"
    to="Jun 2022"
  >
    <ul className="list-disc ml-5">
      <li>
        As Engagement Lead at Optus, led a 4-member agile team from Servian,
        demonstrating strong team management skills
      </li>
      <li>
        Facilitated communication and requirement gathering meetings with Optus
        stakeholders, showcasing effective stakeholder management abilities
      </li>
      <li>
        Prioritised tasks for the team to maximise efficiency and productivity,
        monitored project progress and provided regular updates to Optus
      </li>
      <li>
        Collaborated with other Optus teams to ensure system integration and
        interoperability
      </li>
      <li>
        Acted as a solution architect, delivering highly available, scalable,
        and secure full-stack web solutions, addressing stringent security
        requirements
      </li>
    </ul>
  </Experience>
);

const AirtaskerExperience = () => (
  <Experience
    company="Airtasker"
    companyHref="https://www.airtasker.com/au/"
    position="Backend / Android Engineer"
    from="Sep 2021"
    to="Feb 2022"
  >
    <ul className="list-disc ml-5">
      <li>
        Led development for Airtasker's backend-for-frontend service, focusing
        on enhancing flexibility and efficiency of the app
      </li>
      <li>
        Implemented a new workflow for Airtasker's Android app, resulting in
        improved customer retention rates
      </li>
    </ul>
  </Experience>
);

const LendleaseExperience = () => (
  <Experience
    company="Lendlease"
    companyHref="https://www.lendlease.com/au/"
    position="Cloud Engineer"
    from="May"
    to="Oct 2021"
  >
    <ul className="list-disc ml-5">
      <li>
        Trained a ticket (both text and audio) classification model on GCP's
        Vertex AI for Lendlease, reducing the manual classification workforce by
        20 and enhancing accuracy
      </li>
      <li>
        Developed MLOps CI/CD pipelines for accelerated training and deployment
        of models
      </li>
      <li>
        Created a chatbot using Dialogflow for Lendlease's internal IT desk
        service, supported by Python lambda functions
      </li>
    </ul>
  </Experience>
);

const SBNExperience = () => (
  <Experience
    company="Strength By Numbers"
    companyHref="https://www.strengthbynumbers.com/"
    position="Lead Full-Stack Developer"
    from="Jun 2018"
    to="Apr 2021"
  >
    <ul className="list-disc ml-5">
      <li>
        Worked closely with product owners and customers to determine
        requirements and provide project estimates and timelines
      </li>
      <li>
        Researched, analysed and selected technology stacks, services, and
        libraries; designed system architecture for mobile apps, web apps, and
        web services
      </li>
      <li>
        Developed, implemented, tested and deployed mobile apps, web apps, and
        web services
      </li>
      <li>
        Solved complex multi-threading and asynchronous problems with ReactiveX
      </li>
      <li>
        Designed, developed and deployed highly available and scalable cloud
        services on AWS, serving 200+ physio/fitness centres.
      </li>
    </ul>
  </Experience>
);

const SensiLabExperience = () => (
  <Experience
    company="SensiLab"
    companyHref="https://sensilab.monash.edu/"
    position="Full-Stack Developer"
    from="Sep 2016"
    to="May 2018"
  >
    <ul className="list-disc ml-5">
      <li>Full-stack web development</li>
      <li>Wordpress theme and plugin development</li>
      <li>Hardware prototyping</li>
    </ul>
  </Experience>
);

// Array of menu items with corresponding React content
const items: MenuItem[] = [
  { id: 1, label: "Aimi", content: <AimiExperience /> },
  { id: [3, 4, 5], label: "Servian" },
  { id: 3, label: "Optus", indent: true, content: <OptusExperience /> },
  { id: 4, label: "Airtasker", indent: true, content: <AirtaskerExperience /> },
  { id: 5, label: "Lendlease", indent: true, content: <LendleaseExperience /> },
  { id: 6, label: "Strength By Numbers", content: <SBNExperience /> },
  { id: 7, label: "SensiLab", content: <SensiLabExperience /> },
];

const Experiences: React.FC = () => {
  const [activeItem, setActiveItem] = useState<MenuItem>(items[0]);

  return (
    <Section id="experiences" title="Where I've Worked" side="right">
      <div className="flex w-5/6">
        {/* Side Menu */}
        <div className="w-1/4 px-5">
          <ul>
            {items.map((item, i) => (
              <li
                key={Array.isArray(item.id) ? item.id.join(",") : item.id}
                className={`px-7 py-3 cursor-pointer border-l-2 border-blue-100 font-sfmono text-xs ${
                  activeItem.id === item.id ||
                  (Array.isArray(item.id) &&
                    item.id.includes(activeItem.id as number))
                    ? "text-white"
                    : "border-opacity-10 text-blue-200 text-opacity-50"
                } transition-all duration-500 ease-in-out`}
                onClick={() => {
                  setActiveItem(Array.isArray(item.id) ? items[i + 1] : item);
                }}
              >
                {item.indent ? <span>&nbsp;&nbsp;</span> : ""}
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Content */}
        <div className="w-3/4 px-10">
          <div>{activeItem.content}</div>
        </div>
      </div>
    </Section>
  );
};

export default Experiences;
