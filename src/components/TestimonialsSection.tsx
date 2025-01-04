import React from "react";
import styled from "styled-components";

const TestimonialsContainer = styled.section`
  padding: 50px 20px;
  text-align: center;
`;

const TestimonialsSection: React.FC = () => (
  <TestimonialsContainer>
    <h2>What Our Users Say</h2>
    {/* User testimonials go here */}
  </TestimonialsContainer>
);

export default TestimonialsSection;
