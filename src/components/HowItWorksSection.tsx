import React from "react";
import styled from "styled-components";

const HowItWorksContainer = styled.section`
  padding: 50px 20px;
  text-align: center;
`;

const Step = styled.div`
  margin: 20px 0;
`;

const HowItWorksSection: React.FC = () => (
  <HowItWorksContainer>
    <h2>How It Works</h2>
    <Step>
      <h3>Sign Up and Connect Your Wallet</h3>
      <p>Create an account and link your blockchain wallet to get started.</p>
    </Step>
    <Step>
      <h3>Find Your Mentor</h3>
      <p>
        Browse our list of expert mentors and choose the one that fits your
        learning goals.
      </p>
    </Step>
    <Step>
      <h3>Start Learning and Earn NFTs</h3>
      <p>
        Join sessions, learn, and earn NFTs as a reward for your
        accomplishments.
      </p>
    </Step>
  </HowItWorksContainer>
);

export default HowItWorksSection;
