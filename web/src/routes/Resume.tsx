import Header from "../components/Resume/Header";
import Experience from "../components/Resume/Experience";
import Skills from "../components/Resume/Skills";
import Education from "../components/Resume/Education";
import Hobbies from "../components/Resume/Hobbies";
import Strengths from "../components/Resume/Strengths";
import "./Resume.css";
import { useEffect } from "react";

function Resume() {
  useEffect(() => {
    document.title = 'My Resume | Yingchen Liu';
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <div>
      <Header />

      <div className="bg-white grid grid-cols-2 gap-4">
        <div className="py-6 pl-10 pr-6">
          <Strengths />
          <h2 className="text-2xl font-bold mb-4">Working Experiences</h2>
          <Experience
            role="Senior Software Engineer"
            employmentType="Full-Time, Remote"
            location="US"
            company="Aimi.fm"
            date="Jun 2022 - May 2024"
            projects="Cross-Platform AI Interactive Music Service, Aimi Player Android App, aimi.fm Next.js Website, Electron AI Music Editing IDE"
            technologies="TypeScript, Kotlin, React, Next.js, AWS, Android JetPack, Electron, C++, Terraform, GitHub Actions"
            testimonial="I just want to say that I've really appreciated working with you - you've been really helpful and hardworking and very easy to get along with."
            testimonialFrom="J Curtis (Senior Software Engineer) from Aimi.fm"
            description={[
              "Led the rewrite of Aimi's AI interactive music backend service in TypeScript and C++, ensuring cross-platform compatibility for Mac, Linux, Android, and iOS.",
              "Deployed backend service to AWS (ECS, Lambda, S3, etc.) using CI/CD and Terraform.",
              "Initiated the rewrite for Aimi's Android interactive player app using Kotlin, Media3, and JetPack Compose, laying the groundwork for modernization and improved functionality.",
              "Contributed to the redevelopment of Aimi's website using React, Next.js, and GraphQL.",
              "Worked in a modernization group to enhance development workflow using GitHub Actions, and reduced the build time of Aimi's music backend by 47%.",
            ]}
          />
          <Experience
            role="Software Consultant"
            employmentType="Full-Time, Hybrid"
            location="AU"
            company="Cognizant Servian"
            date="May 2021 - Jun 2022"
            subProject="Engagement Lead / Solution Architect @ Optus"
            projects="OptuSafe Secure ID Verification Solution (11 million users)"
            technologies="Java, TypeScript, GCP, Kubernetes, Spring Boot, React, Redux, Redis, Apigee, Terraform, Docker, BitBucket Pipelines"
            description={[
              "Ran discovery sessions and scoping activities with Optus.",
              "Led an Agile team of 3: organised, facilitated team ceremonies, conducted code reviews, and trained junior engineers.",
              "Solution design: negotiated interface contract with other systems, produced Solution Design documents, delivering highly available, scalable, and secure full-stack web solutions with Kubernetes, addressing stringent security requirements.",
              "Managed stakeholders, budget, risks, timeline, and resources.",
              "Managed releases: ensured changes were approved by Change Advisory Board (CAB) and InfoSec.",
            ]}
          />
          <Experience
            subProject="Back-End / Android Engineer @ Airtasker"
            projects="Airtasker's New BFF (Backend For Frontend), Airtasker Android App (5 million users)"
            technologies="Kotlin, Android, Spring Boot"
            testimonial="You came into the team late but put in an incredible effort to do ALL of the BFF work and push Android across the line with Alex. You've worked so hard right until the last day to get everything finished before you leave us and for that we're very grateful! Thanks for being a gun engineer and making this project a success. We couldn't have done it without you."
            testimonialFrom="Mitchell Weiss (Tech Lead Manager) from Airtasker"
          />
        </div>
        <div className="py-6 pl-6 pr-10">
          <Experience
            description={[
              "Built native Android application and Spring Boot BFF (Backend For Frontend) for dynamically generated UI components.",
              "Wrote unit tests and UI tests for Test Driven Development.",
              "Performed strict code reviews.",
              "Worked closely with backend teams and other platform teams to balance cross-platform consistency.",
              "Mentored junior engineers.",
            ]}
          />
          <Experience
            subProject="Cloud / Data Engineer @ Lendlease"
            projects="Service Desk Tickets Classification Services, Service Desk Chatbot"
            technologies="Python, GCP, VertexAI, AutoML, Pandas, Terraform, Kubeflow, Docker, Dialogflow"
            testimonial="Yingchen is one of the best developers I have ever met."
            testimonialFrom="John Kelaita (Principal Consultant) from Cognizant Servian"
            description={[
              "Conducted data cleaning using Pandas.",
              "Trained NLP (Natural Language Processing) models using AutoML on VertexAI.",
              "Designed and implemented ML pipelines on Kubeflow.",
              "Integrated Lendlease's ServiceNow system using Python and deployed it on GCP (Cloud Functions and Pub/Sub) with Docker.",
              "Solved a complex process problem that affects the client's Service Desk team and developed an elegant solution that allows Lendlease to reduce 30 offshore staff out of manually processing requests.",
            ]}
          />
          <Experience
            role="Lead Full-Stack Developer"
            employmentType="Full-Time, Hybrid"
            location="AU" // Specify if it's Remote or another location
            company="Strength By Numbers"
            date="Jun 2018 - May 2021"
            projects="AxIT Bluetooth Muscle Strength Measurement and Analyzing Android App"
            technologies="Java, AWS, Android, Spring Boot, Node.js, React, MongoDB, ReactiveX, Bluetooth, BigQuery, Docker"
            description={[
              "Worked closely with product owners and customers to determine requirements and provide project estimates and timelines.",
              "Designed system architecture for mobile apps, web apps, and web services.",
              "Developed, implemented, tested, and deployed mobile apps, web apps, and web services.",
              "Designed and implemented body movement assessment algorithms with physiotherapists and researchers.",
              "Solved complex multi-threading and asynchronous Bluetooth problems with ReactiveX.",
              "Identified BLE connectivity issues with BigQuery and DataStudio. Solved the key issues together with the hardware team, reducing bug rate by 62.4%.",
              "Designed, developed, and deployed highly available and scalable cloud services on AWS (Elastic Beanstalks, SQS, S3 and etc.), serving 200+ physio/fitness centres.",
            ]}
          />
          <Experience
            role="Full-Stack Developer"
            employmentType="Casual, On-Site"
            location="AU"
            company="SensiLab, Monash University"
            date="Sep 2016 - Jun 2018"
            projects="SensiLab's WordPress Website, LED Screens Management System, SensiLab Inventory System"
            technologies="Node.js, Express.js, React, Redux, C, C++, PHP, MySQL, MongoDB, Firebase, RethinkDB, WordPress, Arduino, PCB Design, 3D Printing"
            description={[
              "Developed complex, real-time and responsive web systems using React, Redux, MongoDB, etc.",
              "Optimized SensiLab's WordPress website.",
              "Developed WordPress themes and plugins.",
              "Installed, migrated, and managed Linux servers.",
              "Arduino hardware prototyping.",
            ]}
          />
        </div>
      </div>

      <div className="bg-white grid grid-cols-2 gap-4 mt-20">
        <div className="py-6 pl-10 pr-6">
          <Skills />
        </div>
        <div className="py-6 pl-6 pr-10">
          <Education />
          <Hobbies />
        </div>
      </div>
    </div>
  );
}

export default Resume;
