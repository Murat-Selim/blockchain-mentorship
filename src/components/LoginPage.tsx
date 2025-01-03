import React from "react";
import styled from "styled-components";

const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #61dafb;
  border: none;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #21a1f1;
  }
`;

const LoginPage: React.FC = () => {
  return (
    <LoginPageContainer>
      <h1>Log in</h1>
      <a href="#">Sign up as a student</a> or <a href="#">Sign up as a tutor</a>
      <Button>Continue with Google</Button>
      <Button>Continue with Facebook</Button>
      <Button>Continue with Apple</Button>
      <Form>
        <label>Email</label>
        <Input
          type="email"
          placeholder="Your email"
        />
        <label>Password</label>
        <Input
          type="password"
          placeholder="Your password"
        />
        <a href="#">Forgot your password?</a>
        <label>
          <Input type="checkbox" /> Remember me
        </label>
        <Button type="submit">Log in</Button>
      </Form>
      <p>
        By clicking Log in or Continue with, you agree to our
        <a href="#"> Terms of Use</a> and <a href="#"> Privacy Policy</a>.
      </p>
    </LoginPageContainer>
  );
};

export default LoginPage;
