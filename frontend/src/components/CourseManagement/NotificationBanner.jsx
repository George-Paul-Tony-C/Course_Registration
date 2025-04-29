import React from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

/**
 * Notification banner component for displaying errors, success messages, or info
 * 
 * @param {Object} props
 * @param {Object|null} props.notification - Notification object with type and message
 * @param {Function} props.onClose - Function to close the notification
 * @param {string} props.error - Error message (alternative to notification)
 * @param {Function} props.onClearError - Function to clear error (alternative to onClose)
 */
const NotificationBanner = ({ notification, onClose, error, onClearError }) => {
  // If we have neither notification nor error, don't render anything
  if (!notification && !error) return null;
  
  // Determine what to display
  const type = notification?.type || (error ? 'error' : 'info');
  const message = notification?.message || error;
  const handleClose = onClose || onClearError;
  
  // Style mapping based on notification type
  const styles = {
    success: {
      border: 'border-green-400',
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: <CheckCircle2 size={20} className="mr-2" />
    },
    error: {
      border: 'border-red-400',
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: <AlertCircle size={20} className="mr-2" />
    },
    info: {
      border: 'border-blue-400',
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: <Info size={20} className="mr-2" />
    },
    warning: {
      border: 'border-yellow-400',
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      icon: <AlertCircle size={20} className="mr-2" />
    }
  };
  
  const currentStyle = styles[type] || styles.info;
  
  return (
    <div className={`mb-4 flex items-center rounded border px-4 py-3 ${currentStyle.border} ${currentStyle.bg} ${currentStyle.text} animate-fadeIn transition-all duration-300 ease-in-out`}>
      {currentStyle.icon}
      <div className="flex-1">{message}</div>
      {handleClose && (
        <button 
          className="ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={handleClose}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default NotificationBanner;