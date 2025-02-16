import React from 'react'

const BackendErrorMessages = ({backendErrors}) => {
  if (!backendErrors) {
    return null;
  }

  return (
    <ul className="error-messages">
      {Object.entries(backendErrors).map(([field, messages]) =>
        messages.map((message, index) => (
          <li key={`${field}-${index}`}>{`${field}: ${message}`}</li>
        ))
      )}
    </ul>
  );
}

export default BackendErrorMessages
