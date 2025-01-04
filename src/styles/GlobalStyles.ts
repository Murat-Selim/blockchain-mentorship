import { createGlobalStyle } from "styled-components";
import styled from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Libre Baskerville", serif;
    font-weight: 400;
  }

    button {
    background-color: #61dafb;
    color: #282c34;
    padding: 0.7rem 1.3rem;
    cursor: pointer;
    font-size: 16px;
    font-weight: 700;
    border-radius: 8px;
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
      transform: scale(1.05);
    }

    &:active {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transform: scale(0.95);
    }
  }

    form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: white;
    padding: 2rem;
    margin: 1rem 0 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    }
`;

export const GoogleButton = styled.button`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background-color: white;
  color: #282c34;
`;

export const FormButton = styled.button`
  background-color: #21a1f1;
  color: #282c34;
`;

export const FormHeader = styled.h1`
  margin-bottom: 1rem;
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 86vh;
  background-color: #f0f0f0;
  padding: 2rem;
`;

export default GlobalStyles;
