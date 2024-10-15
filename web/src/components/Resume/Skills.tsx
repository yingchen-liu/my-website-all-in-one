interface SkillGroupProps {
  title: string;
  skills: string[];
}

const SkillGroup: React.FC<SkillGroupProps> = ({ title, skills }) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm mt-2">{skills.join(", ")}</p>
    </div>
  );
};

const Skills = () => {
  return (
    <section className="pb-6">
      <h2 className="text-2xl font-bold mb-4">Technical Skills</h2>

      <SkillGroup
        title="Languages"
        skills={[
          "HTML5",
          "JavaScript (ES6)",
          "TypeScript",
          "CSS3",
          "Java",
          "Kotlin",
          "Python",
          "PHP",
          "C/C++",
          "SQL",
          "GLSL",
        ]}
      />

      <SkillGroup
        title="Web"
        skills={[
          "React",
          "Redux",
          "Next.js",
          "Tailwind CSS",
          "Sass",
          "jQuery",
          "Bootstrap",
          "Spring",
          "Spring Boot",
          "Node.js",
          "Express.js",
        ]}
      />

      <SkillGroup title="Cloud" skills={["AWS", "GCP"]} />

      <SkillGroup title="Mobile" skills={["Android", "JetPack", "ReactiveX"]} />

      <SkillGroup
        title="Database"
        skills={[
          "MySQL",
          "SQLite",
          "MongoDB",
          "Neo4j",
          "Redis",
          "BigQuery",
          "Firebase",
        ]}
      />

      <SkillGroup
        title="Testing"
        skills={["JUnit", "Jest", "Espresso", "Mocha", "Chai"]}
      />

      <SkillGroup
        title="Others"
        skills={[
          "Git",
          "Docker",
          "GitHub",
          "GitLab",
          "BitBucket",
          "JIRA",
          "Linux",
          "Bash",
          "Nginx",
          "Apache",
          "RabbitMQ",
          "MQTT",
          "SEO",
          "RESTful",
          "WebSocket",
          "Gradle",
          "Maven",
          "Babel",
          "Rollup.js",
          "OpenGL",
        ]}
      />
    </section>
  );
};

export default Skills;
