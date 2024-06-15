import "semantic-ui-css/semantic.min.css";
import "./Home.css";
import { Container } from "semantic-ui-react";
import ProfileCard from "../components/index/ProfileCard";
import HeaderMenu from "../components/Common/HeaderMenu";
import React from "react";

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
