import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const AuthenticatorComponent = ({ children }) => {
  return (
    <Authenticator>
      {({ signOut, user }) => React.cloneElement(children, { signOut, user })}
    </Authenticator>
  );
};

export default AuthenticatorComponent;
