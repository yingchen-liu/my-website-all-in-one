const Header = () => {
  return (
    <header className="bg-black text-white py-6 px-10 text-center">
      <h1 className="text-4xl font-bold">Yingchen Liu</h1>
      <p className="mt-4 font-normal">
        Versatile Senior Full-Stack Software Engineer with over 8 years of
        experience in Web, Mobile, Cloud, and a touch of AI across diverse
        industries. Demonstrated expertise in delivering high-impact projects
        for both large enterprises and startups, consistently showcasing a
        commitment to innovation and excellence in creating high-quality
        solutions.
      </p>
      <p className="mt-2 font-normal">
        Website:{" "}
        <a
          href="https://yingchenliu.com"
          target="_blank"
          className="hover:text-white hover:underline"
        >
          https://yingchenliu.com
        </a>&nbsp;&nbsp;&nbsp;
        Email:{" "}
        <a
          href="mailto:info@yingchenliu.com"
          className="hover:text-white hover:underline"
        >
          info@yingchenliu.com
        </a>
      </p>
    </header>
  );
};

export default Header;
