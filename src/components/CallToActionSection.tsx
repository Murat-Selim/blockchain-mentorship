import React from "react";
import styled from "styled-components";

const CTAContainer = styled.section`
  padding: 50px 20px;
  text-align: center;
`;

const CallToActionSection: React.FC = () => (
  <CTAContainer>
    <h2>Ready to Start Your Web3 Journey?</h2>
    <p>Join our community and unlock your potential.</p>
    <button>Sign Up Now</button>
  </CTAContainer>
);

export default CallToActionSection;
