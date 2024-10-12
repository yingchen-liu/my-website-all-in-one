import { Image, Link, Paragraph, Section } from "./Section";

function AboutMe() {
  return (
    <Section id="about" title="About Me">
      <div className="flex">
        <div className="w-1/2">
          <Paragraph>
            Hi! I'm Yingchen, a passionate developer specializing in web and
            mobile applications. My coding journey began in 2005 during a middle
            school website competition, where I created a friend-making platform
            using ASP and Access. This experience sparked my interest in
            technology.
          </Paragraph>
          <Paragraph>
            Since then, I've had the privilege of working with startups, large
            corporations, and on various freelance projects, excelling at
            turning complex challenges into innovative solutions.
          </Paragraph>
          <Paragraph>
            At <Link href="https://aimi.fm">Aimi</Link>, I led the rewrite of an
            AI generative music backend in TypeScript and modernized their
            Android interactive music player app with Kotlin and Jetpack
            Compose, demonstrating my ability to drive technological
            advancement. As Engagement Lead at{" "}
            <Link href="https://optus.com.au">Optus</Link>, I showcased my
            skills in team management and solution architecture, delivering
            secure and scalable web solutions. My contributions at{" "}
            <Link href="https://www.airtasker.com/au/">Airtasker</Link> improved
            app flexibility and customer retention through innovative
            enhancements to both the app and backend.
          </Paragraph>
          <Paragraph>
            I thrive on creating impactful products and optimizing workflows,
            positioning me as a top-tier tech talent ready to tackle your next
            big project.
          </Paragraph>
        </div>
        <div className="w-1/2 flex justify-center items-start">
          <Image src="/images/yingchen.jpg" className="w-2/3" />
        </div>
      </div>
    </Section>
  );
}

export default AboutMe;
