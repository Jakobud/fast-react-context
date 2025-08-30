import createFastContext from "./createFastContext";

const { Provider, useStore } = createFastContext({
  first: "",
  last: "",
  count: 0,
});

export { Provider as AppProvider, useStore as useAppStore };
