import { Dispatch, SetStateAction } from "react";
import Button from "./elements/Button";
import Typography from "./elements/Typography";

const ButtonCounter = ({
  count,
  setCount,
}: {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="bg-gray-100 shadow-md rounded-lg p-5 w-fit flex flex-col items-center gap-2">
      <Typography variant="h6">{count}</Typography>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  );
};

export default ButtonCounter;
