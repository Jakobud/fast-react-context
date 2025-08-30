import { memo } from "react";
import { useAppStore } from "./AppContext";

const TextInput = ({ value }: { value: "first" | "last" }) => {
  const [fieldValue, setFieldValue] = useAppStore(value);

  return (
    <div className="field">
      {value}:{" "}
      <input
        value={fieldValue}
        onChange={(e) => setFieldValue(e.target.value)}
      />
    </div>
  );
};

export default memo(TextInput);
