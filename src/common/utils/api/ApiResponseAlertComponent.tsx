import React from 'react';
import { Alert } from 'react-bootstrap';

export interface AlertMessageProps {
  success?: string | null;
  initialErrorMessage?: string | null;
  errors?: string[] | null;
  className?: string;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  success,
  initialErrorMessage,
  errors,
  className = "mb-3"
}) => {
  if (!success && !initialErrorMessage && !errors) {
    return null;
  }

  return (
    <>
      {success && (
        <Alert variant="success" className={className}>
          <strong>Success!</strong> {success}
        </Alert>
      )}

      {(initialErrorMessage || errors) && (
        <Alert variant="danger" className={className}>
          {initialErrorMessage && (
            <strong>{initialErrorMessage}</strong>
          )}
          {errors && errors.length > 0 && (
            <div className={initialErrorMessage ? "mt-1" : ""}>
              {errors.map((errorMsg: string, index: number) => (
                <div key={index} className={index > 0 ? 'mt-1' : ''}>
                  {errorMsg}
                </div>
              ))}
            </div>
          )}
        </Alert>
      )}
    </>
  );
};

export default AlertMessage;