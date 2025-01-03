import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background: #333;
  color: white;
  padding: 20px 0;
  text-align: center;
`;

const Nav = styled.nav`
  margin-bottom: 10px;
`;

const NavLink = styled.a`
  color: white;
  margin: 0 10px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SocialMedia = styled.div`
  margin-top: 10px;
`;

const ContactInfo = styled.p`
  margin-top: 10px;
`;

const Footer: React.FC = () => (
  <FooterContainer>
    <Nav>
      <NavLink href="#">About Us</NavLink>
      <NavLink href="#">Contact Us</NavLink>
      <NavLink href="#">Terms of Service</NavLink>
      <NavLink href="#">Privacy Policy</NavLink>
    </Nav>
    <SocialMedia>{/* Social media links go here */}</SocialMedia>
    <ContactInfo>Contact: info@mentorshipplatform.com</ContactInfo>
  </FooterContainer>
);

export default Footer;
