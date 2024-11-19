// SnackBar.js

import React from 'react';
import { X } from 'lucide-react';

export const SnackBar = ({
  id,
  backgroundColor,
  message,
  handleClose,
  bottom,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClose(id);
    }, 5000); // Snackbar will disappear after 5 seconds

    return () => clearTimeout(timer);
  }, [id, handleClose]);

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        color: 'white',
        position: 'fixed',
        bottom: `${bottom}px`,
        right: '20px',
        padding: '10px',
        borderRadius: '5px',
        maxWidth: '300px',
        zIndex: 1000,
        marginBottom: '10px', // Space between snack bars
      }}
    >
      {message}
      <button
        onClick={() => handleClose(id)}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        <X size={20} />
      </button>
    </div>
  );
};