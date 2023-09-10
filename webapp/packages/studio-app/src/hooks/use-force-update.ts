import {useState} from "react";

const useForceUpdate = () => {
  const [value, setValue] = useState<number>(0);

  return () => {
    console.log(`useForceUpdate(): component should be rerendered`);

    setValue((prev) => {
      return prev + 1;
    });
  };
}

export default useForceUpdate;
