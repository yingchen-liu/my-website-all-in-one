import Header from "../components/Resume/Header";
import Experience from "../components/Resume/Experience";
import Skills from "../components/Resume/Skills";
import Education from "../components/Resume/Education";
import Hobbies from "../components/Resume/Hobbies";
import Strengths from "../components/Resume/Strengths";
import "./Resume.css";

function Resume() {
  const body = document.body;
  body.style.backgroundColor = "white";

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
            location="AU"
            company="Aimi.fm"
            date="Jun 2022 - May 2024"
            projects="Cross-Platform AI Interactive Music Service, aimi.fm Next.js Website, Electron AI Music Editing IDE"
            technologies="TypeScript, React, Next.js, Jest, AWS, Terraform, Android, JetPack, Electron, GitHub Actions, C, C++, Babel, Rollup.js"
            testimonial="I just want to say that I've really appreciated working with you - you've been really helpful and hardworking and very easy to get along with."
            testimonialFrom="J Curtis (Senior Software Engineer) from Aimi.fm"
            description={[
              "Led the rewrite of Aimi's complex AI interactive music backend service in TypeScript and C++, ensuring cross-platform compatibility for Mac, Linux, Android, and iOS.",
              "Deployed backend service to AWS (ECS, Lambda and S3) using CI/CD and Terraform.",
              "Solved complex build challenges with Rollup.js and Babel.",
              "Initiated the rewrite for Aimi's Android interactive player app using Kotlin, Media3, and JetPack Compose, laying the groundwork for modernization and improved functionality.",
              "Wrote unit tests for Test Driven Development.",
              "Contributed to the redevelopment of Aimi's website using React, Next.js, and GraphQL.",
              "Worked in a modernization group to enhance development workflow using GitHub Actions, and reduced the build time of Aimi's music backend by 47%.",
              "Assisted management with hiring processes.",
            ]}
          />
          <Experience
            role="Software Consultant"
            employmentType="Full-Time, Hybrid"
            location="AU"
            company="Cognizant Servian"
            date="May 2021 - Jun 2022"
            subProject="Engagement Lead / Solution Architect @ Optus"
            projects="OptuSafe Secure ID Verification Solution"
            technologies="GCP, Kubernetes, Java, Spring Boot, React, Redux, Redis, Apigee, Terraform, BitBucket Pipelines"
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
            projects="Airtasker's New BFF (Backend For Frontend), Airtasker Android App"
            technologies="Android, Kotlin, Spring Boot"
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
            technologies="GCP, VertexAI, AutoML, Python, Pandas, Terraform, Kubeflow, Docker, Dialogflow"
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
            technologies="AWS, Java, Android, ReactiveX, Bluetooth, Spring Boot, Node.js, MongoDB, BigQuery, React"
            description={[
              "Worked closely with product owners and customers to determine requirements and provide project estimates and timelines.",
              "Designed system architecture for mobile apps, web apps, and web services.",
              "Developed, implemented, tested, and deployed mobile apps, web apps, and web services.",
              "Designed and implemented 22 body movement assessment algorithms with physiotherapists and researchers.",
              "Solved complex multi-threading and asynchronous Bluetooth problems with ReactiveX.",
              "Identified BLE connectivity issues with BigQuery and DataStudio. Solved the key issues together with the hardware team, reducing bug rate by 62.4%.",
              "Designed, developed, and deployed highly available and scalable cloud services on AWS (Elastic Beanstalks, SQS and S3), serving 200+ physio/fitness centres.",
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
              "Optimized SensiLab's WordPress website, increasing Lighthouse score from 23 to 96. Made a plugin to upload assets into CDN, increasing overseas access speed by more than 90%.",
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
