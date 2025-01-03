import React from "react";
import styled from "styled-components";
import GoogleLogo from "../assets/google-icon.svg";
import {
  GoogleButton,
  FormButton,
  FormHeader,
  PageContainer,
} from "../styles/GlobalStyles";

const SignUpPage: React.FC = () => {
  return (
    <PageContainer>
      <FormHeader>Sign Up</FormHeader>
      <GoogleButton>
        <img
          src={GoogleLogo}
          alt="Google logo"
        />
        Sign up with Google
      </GoogleButton>
      <form>
        <label>Name</label>
        <input
          type="text"
          placeholder="Your name"
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="Your email"
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Your password"
        />
        <label>
          <input type="checkbox" /> Remember me
        </label>
        <FormButton type="submit">Sign Up</FormButton>
      </form>
    </PageContainer>
  );
};

export default SignUpPage;
