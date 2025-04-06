import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  return (
    <div
      className={`bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-start ${className}`}
    >
      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-medium mb-1">Đã xảy ra lỗi</h4>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
