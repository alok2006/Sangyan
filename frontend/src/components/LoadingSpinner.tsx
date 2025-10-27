interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

const LoadingSpinner = ({ 
  size = 'medium', 
  text,
  className = '' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}
      />
      {text && (
        <p className="mt-4 text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
