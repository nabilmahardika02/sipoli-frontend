import { Dispatch, SetStateAction, useState } from "react";
import Typography from "./elements/Typography";

const ButtonCounter = ({counter, setCounter}: {counter: number, setCounter: Dispatch<SetStateAction<number>>}) => {


  return (
    <div className="flex flex-col items-center">
      <Typography font="ubuntu" variant="h2">
        {counter}
      </Typography>
      <button
        onClick={() => setCounter(counter + 1)}
        className="bg-blue-400 hover:bg-blue-500 active:ring-1 active:ring-blue-500 px-3 py-2 rounded-lg text-white"
      >
        Click Me!
      </button>
    </div>
  );
};

export default ButtonCounter;
