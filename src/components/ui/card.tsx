import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>;
}

export function CardDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>;
}
