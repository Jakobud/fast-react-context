import React from "react";
import { AppProvider, useAppStore } from "./AppContext";

import TextInput from "./TextInput";

const Display = React.memo(({ value }: { value: "first" | "last" }) => {
  const [fieldValue] = useAppStore(value);
  return (
    <div className="value">
      {value}: {fieldValue}
    </div>
  );
});

const FormContainer = () => {
  const [count, setCount] = useAppStore("count");
  return (
    <div className="container">
      <h5>FormContainer</h5>
      <TextInput value="first" />
      <TextInput value="last" />
      <button onClick={() => setCount(count + 1)}>Increment Count: {count}</button>
    </div>
  );
};

const DisplayContainer = () => {
  const [count] = useAppStore("count");
  return (
    <div className="container">
      <h5>DisplayContainer</h5>
      <Display value="first" />
      <Display value="last" />
      <div>Count: {count}</div>
    </div>
  );
};

const ContentContainer = () => {
  return (
    <div className="container">
      <h5>ContentContainer</h5>
      <FormContainer />
      <DisplayContainer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <div className="container">
        <h5>App</h5>
        <ContentContainer />
      </div>
    </AppProvider>
  );
}

export default App;
