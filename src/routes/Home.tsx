import "semantic-ui-css/semantic.min.css";
import "./Home.css";
import HeaderMenu from "../components/HeaderMenu";
import { Container } from "semantic-ui-react";
import ProfileCard from "../components/index/ProfileCard";

function Home() {
  return (
    <>
      <HeaderMenu activeItem="" />
      <Container>
        <ProfileCard />
      </Container>
    </>
  );
}

export default Home;
