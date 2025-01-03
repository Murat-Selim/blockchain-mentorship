import React from "react";
import styled from "styled-components";

const HeroContainer = styled.header`
  background: url("background.jpg") no-repeat center center;
  background-size: cover;
  text-align: center;
  padding: 100px 20px;
  color: white;
`;

const HeroSection: React.FC = () => (
  <HeroContainer>
    <h1>Your Path to Blockchain Mastery: Connect with Expert Mentors</h1>
    <p>Empowering the Next Generation of Web3 Enthusiasts!</p>
    <button>Get Started</button>
  </HeroContainer>
);

export default HeroSection;
