interface SkillGroupProps {
  title: string;
  skills: string[][];
}

const SkillGroup: React.FC<SkillGroupProps> = ({ title, skills }) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold">{title}</h3>
      {skills.map((skillsInGroup, i) => (
        <p key={`${title}-skill-group-${i}`} className="text-sm mt-2">{skillsInGroup.join(", ")}</p>
      ))}
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
          ["Java", "Kotlin", "Python", "Swift"],
          ["JavaScript (ES6)", "TypeScript", "HTML5", "CSS3"],
          ["PHP", "C/C++"],
          ["SQL"],
        ]}
      />

      <SkillGroup
        title="Web"
        skills={[
          ["Spring", "Spring Boot"],
          ["Node.js", "Express.js"],
          ["React", "Redux", "Next.js"],
          ["Tailwind CSS", "Sass"],
          ["jQuery", "Bootstrap"],
        ]}
      />

      <SkillGroup title="Cloud" skills={[["AWS", "GCP"]]} />

      <SkillGroup
        title="Mobile"
        skills={[["Android", "JetPack", "ReactiveX"]]}
      />

      <SkillGroup
        title="Database"
        skills={[
          ["MySQL", "SQLite"],
          ["MongoDB", "Neo4j"],
          ["Redis"],
          ["BigQuery", "Firebase"],
        ]}
      />

      <SkillGroup
        title="Testing"
        skills={[["JUnit", "Jest", "Espresso", "Mocha", "Chai"]]}
      />

      <SkillGroup
        title="Others"
        skills={[
          ["Git", "GitHub", "GitLab", "BitBucket"],
          ["Docker", "CI/CD"],
          ["JIRA"],
          ["Linux", "Bash", "Nginx", "Apache"],
          ["RabbitMQ", "MQTT"],
          ["RESTful", "WebSocket", "GraphQL"],
          ["Gradle", "Maven"],
          ["Babel", "Rollup.js"],
        ]}
      />
    </section>
  );
};

export default Skills;
