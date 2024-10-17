const LoadingSpinner = ({
  size = "sm",
  dark = true,
  message = "Loading...",
}) => {
  let spinnerSizer = 4;
  let textSize = "sm";
  let color = "gray-700";
  switch (size) {
    case "lg":
      spinnerSizer = 4;
      textSize = "lg";
  }
  if (!dark) {
    color = "white";
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin border-${spinnerSizer} border-t-transparent border-${color} rounded-full w-${spinnerSizer} h-${spinnerSizer}`}
      ></div>
      <span className={`ml-2 text-${color} text-${textSize}`}>{message}</span>
    </div>
  );
};

export default LoadingSpinner;
