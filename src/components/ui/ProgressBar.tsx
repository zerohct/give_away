interface ProgressBarProps {
  value: number;
  color?: "purple" | "blue" | "green" | "red";
}

export default function ProgressBar({
  value,
  color = "blue",
}: ProgressBarProps) {
  const colorStyles = {
    purple: "bg-gradient-to-r from-purple-500 to-purple-400",
    blue: "bg-gradient-to-r from-blue-500 to-blue-400",
    green: "bg-gradient-to-r from-green-500 to-green-400",
    red: "bg-gradient-to-r from-red-500 to-red-400",
  };

  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${colorStyles[color]}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
