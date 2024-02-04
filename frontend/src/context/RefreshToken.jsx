import { createContext, useState } from "react";

export const RefreshTokenCotext = createContext(null);

export const RefreshProvider = (props) => {
  const [RefreshToken, setRefreshToken] = useState(null);

  return (
    <RefreshTokenCotext.Provider value={{ RefreshToken, setRefreshToken }}>
      {props.children}
    </RefreshTokenCotext.Provider>
  );
};
