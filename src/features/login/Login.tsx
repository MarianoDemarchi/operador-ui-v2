// src/router/Login.tsx
import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { components, formFields } from "./configLoginAws";

interface Props {
  children: (args: {
    user: any;
    signOut: () => Promise<void>;
  }) => React.ReactNode;
}

const Login: React.FC<Props> = ({ children }) => {
  return (
    <Authenticator
      components={components}
      hideSignUp
      formFields={formFields}
      loginMechanisms={["email"]}
      initialState="signIn"
    >
      {children}
    </Authenticator>
  );
};

export default Login;
