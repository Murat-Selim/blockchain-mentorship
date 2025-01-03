import React from "react";
import styled from "styled-components";

const FeaturesContainer = styled.section`
  padding: 50px 20px;
  text-align: center;
`;

const Feature = styled.div`
  margin: 20px 0;
`;

const FeaturesSection: React.FC = () => (
  <FeaturesContainer>
    <h2>Why Choose Us?</h2>
    <Feature>
      <h3>Expert Mentors</h3>
      <p>
        Learn from the best in the industry, with mentors who have real-world
        experience in Web3 technologies.
      </p>
    </Feature>
    <Feature>
      <h3>Earn NFTs</h3>
      <p>Turn Learning into Rewards – Complete Sessions, Earn NFTs!</p>
    </Feature>
    <Feature>
      <h3>Seamless Integration</h3>
      <p>Connect your wallet and start your journey with ease.</p>
    </Feature>
  </FeaturesContainer>
);

export default FeaturesSection;
