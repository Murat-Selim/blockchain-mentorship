import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import TestimonialsSection from "../components/TestimonialsSection";
import MentorProfilesSection from "../components/MentorProfilesSection";
import CallToActionSection from "../components/CallToActionSection";
import Footer from "../components/Footer";

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
