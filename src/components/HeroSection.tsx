import React from "react";
import styled from "styled-components";

const HeroContainer = styled.header`
  text-align: center;
  padding: 100px 20px;
  color: black;
  background-color: #21a1f1;
  height: 600px;
  width: 100%;
  -webkit-clip-path: ellipse(150% 100% at 0% 0%);
  clip-path: ellipse(150% 100% at 0% 0%);
`;

const HeroHeader = styled.h1`
  padding: 1rem 0;
  font-weight: 700;
  color: #282c34;
`;
const HeroText = styled.p`
  padding: 1rem 0 2rem;
  font-weight: 700;
  color: beige;
`;
const HeroSection: React.FC = () => (
  <HeroContainer>
    <HeroHeader>
      Your Path to Blockchain Mastery: Connect with Expert Mentors
    </HeroHeader>
    <HeroText>
      Unlock Knowledge, Earn NFTs – Your Web3 Journey Starts Here!
    </HeroText>
    <button>Find Mentors</button>
  </HeroContainer>
);

export default HeroSection;
