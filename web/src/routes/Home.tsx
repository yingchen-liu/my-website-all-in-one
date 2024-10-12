import HeaderMenu from "../components/Common/HeaderMenu";
import { TypeAnimation } from "react-type-animation";

interface LinkProps {
  children: React.ReactNode;
  href: string;
}
interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

const Link: React.FC<LinkProps> = ({ children, href }) => {
  return (
    <a
      className="text-white hover:text-blue-100 hover:underline"
      target="_blank"
      href={href}
    >
      {children}
    </a>
  );
};

const Paragraph: React.FC<ParagraphProps> = ({ children, className }) => {
  return (
    <p className={`text-blue-100 font-calibre text-opacity-60 text-xl mb-3 ${className}`}>
      {children}
    </p>
  );
};

function Home() {
  return (
    <div className="bg-gray-800 text-blue-100">
      <div className="container mx-auto max-w-5xl px-10">
        <HeaderMenu activeItem="" />

        <section className="py-20">
          <p className="text-white font-thin font-sfmono mb-6">
            Hi, my name is
          </p>
          <h1 className="text-7xl font-bold">Yingchen Liu</h1>
          <h2 className="text-blue-100 text-opacity-60 text-7xl font-bold">
            <TypeAnimation
              className="h-[150px] overflow-hidden"
              sequence={[
                "I build scalable web apps.",
                1000,
                "I build Android apps with Kotlin and Jetpack Compose.",
                1000,
                "I build React & Next.js web apps.",
                1000,
                "I build cloud infrastructure on AWS and GCP.",
                1000,
                "I manage CI/CD pipelines.",
                1000,
                "I improve WordPress site performance.",
                1000,
                "I integrate AI with mobile and web applications.",
                1000,
              ]}
              wrapper="span"
              speed={70}
              cursor={true}
              repeat={Infinity}
              style={{ display: "inline-block" }}
            />
          </h2>

          <Paragraph className="w-1/2">
            Versatile Senior Software Engineer with over 7 years of hands-on
            experience, specialising in full-stack web, mobile, and cloud
            technologies.
          </Paragraph>
        </section>

        <section className="py-20">
          <div id="about">#about</div>
          <h2 className="text-4xl text-blue-100 mb-5">About Me</h2>

          <div className="flex">
            <div className="w-1/2">
              <Paragraph>
                Hi! I'm Yingchen, a passionate developer specializing in web and
                mobile applications. My coding journey began in 2005 during a
                middle school website competition, where I created a
                friend-making platform using ASP and Access. This experience
                sparked my interest in technology.
              </Paragraph>{" "}
              <Paragraph>
                Since then, I've had the privilege of working with startups,
                large corporations, and on various freelance projects, excelling
                at turning complex challenges into innovative solutions.
              </Paragraph>{" "}
              <Paragraph>
                At <Link href="https://aimi.fm">Aimi</Link>, I led the rewrite
                of an AI generative music backend in TypeScript and modernized
                their Android interactive music player app with Kotlin and
                Jetpack Compose, demonstrating my ability to drive technological
                advancement. As Engagement Lead at{" "}
                <Link href="https://optus.com.au">Optus</Link>, I showcased my
                skills in team management and solution architecture, delivering
                secure and scalable web solutions. My contributions at{" "}
                <Link href="https://www.airtasker.com/au/">Airtasker</Link>{" "}
                improved app flexibility and customer retention through
                innovative enhancements to both the app and backend.
              </Paragraph>{" "}
              <Paragraph>
                I thrive on creating impactful products and optimizing
                workflows, positioning me as a top-tier tech talent ready to
                tackle your next big project.
              </Paragraph>
            </div>
            <div className="w-1/2 flex justify-center items-start">
              <div className="w-2/3 rounded-lg image-container">
                <img
                  className="filter-image"
                  src="/images/yingchen.jpg"
                />
                <div className="blue-tint" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
