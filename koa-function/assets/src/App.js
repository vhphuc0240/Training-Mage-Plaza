import "./App.css";
import Header from "./componets/Header";
import BodyComponent from "./componets/Body";
import { Frame } from "@shopify/polaris";
import React from "react";
import useToast from "./hooks/useToast";
function App() {
  const { CustomToast, isActiveToast } = useToast();

  return (
    <>
      <Header />
      <BodyComponent />
      {isActiveToast && (
        <Frame>
          <CustomToast />
        </Frame>
      )}
    </>
  );
}

export default App;
