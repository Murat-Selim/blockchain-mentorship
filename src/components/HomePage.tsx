import React from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import TestimonialsSection from "./TestimonialsSection";
import MentorProfilesSection from "./MentorProfilesSection";
import CallToActionSection from "./CallToActionSection";
import Footer from "./Footer";
import Navbar from "./Navbar";

const HomePage: React.FC = () => (
  <>
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <TestimonialsSection />
    <MentorProfilesSection />
    <CallToActionSection />
    <Footer />
  </>
);

export default HomePage;
