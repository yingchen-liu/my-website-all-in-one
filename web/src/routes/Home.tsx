import HeaderMenu from "../components/Common/HeaderMenu";
import AboutMe from "../components/Index/AboutMe";
import Banner from "../components/Index/Banner";
import Experiences from "../components/Index/Experiences";


function Home() {
  return (
    <div className="bg-gray-800 text-blue-100">
      <div className="container mx-auto max-w-5xl px-10">
        <HeaderMenu activeItem="" />

        <Banner />
        <AboutMe />
        <Experiences />
      </div>
    </div>
  );
}

export default Home;
