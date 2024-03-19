import { CircularProgress } from "@nextui-org/react";

const Loading = () => {
  return (
    <div className="flex w-full justify-center mt-5">
      <CircularProgress size="lg" aria-label="Loading..." />
    </div>
  );
};

export default Loading;
