import React from "react";
import styled from "styled-components";

const MentorProfilesContainer = styled.section`
  padding: 50px 20px;
  text-align: center;
`;

const MentorProfilesSection: React.FC = () => (
  <MentorProfilesContainer>
    <h2>Meet Our Mentors</h2>
    {/* Mentor profiles go here */}
  </MentorProfilesContainer>
);

export default MentorProfilesSection;
