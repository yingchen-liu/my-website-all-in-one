import "semantic-ui-css/semantic.min.css";
import "./Home.css";
import { Container } from "semantic-ui-react";
import HeaderMenu from "../components/Common/HeaderMenu";
import ProfileCard from "../components/Index/ProfileCard";

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
