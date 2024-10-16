import { useEffect } from "react";
import HeaderMenu from "../components/Common/HeaderMenu";
import AboutMe from "../components/Index/AboutMe";
import Banner from "../components/Index/Banner";
import Contact from "../components/Index/Contact";
import Experiences from "../components/Index/Experiences";
import Footer from "../components/Index/Footer";
import Projects from "../components/Index/Projects";


function Home() {
  useEffect(() => {
    document.title = 'Yingchen Liu | Senior Full-Stack Engineer';
    document.body.style.backgroundColor = "#1f2937";
  }, []);
  
  return (
    <div className="bg-gray-800 text-blue-100">
      <div className="container mx-auto max-w-5xl px-5 md:px-10">
        <HeaderMenu activeItem="home" />

        <Banner />
        <AboutMe />
        <Experiences />
        <Projects />
        <Contact />

        <Footer />
      </div>
    </div>
  );
}

export default Home;
