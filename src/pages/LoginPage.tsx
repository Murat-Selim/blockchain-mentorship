import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import GoogleLogo from "../assets/google-icon.svg";
import {
  GoogleButton,
  FormButton,
  FormHeader,
  PageContainer,
} from "../styles/GlobalStyles";

const LoginPage: React.FC = () => {
  return (
    <PageContainer>
      <FormHeader>Log in</FormHeader>
      <GoogleButton>
        <img
          src={GoogleLogo}
          alt="Google logo"
        />
        Log in with Google
      </GoogleButton>
      <form>
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
        <a href="#">Forgot your password?</a>
        <label>
          <input type="checkbox" /> Remember me
        </label>
        <FormButton type="submit">Log in</FormButton>
      </form>
      <p>
        Don't have an account yet? <Link to="/signup">Sign up!</Link>
      </p>
    </PageContainer>
  );
};

export default LoginPage;
