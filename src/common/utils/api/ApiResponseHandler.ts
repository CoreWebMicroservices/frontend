import { useState } from "react";
import { CoreMsApiResonse } from "@/common/model/CoreMsApiModel";

export interface MessageState {
  success: string | null;
  initialErrorMessage: string | null;
  errors: string[] | null;
}

export interface UseMessageStateReturn {
  success: string | null;
  initialErrorMessage: string | null;
  errors: string[] | null;
  clearSuccess: () => void;
  clearError: () => void;
  clearAll: () => void;
  handleResponse: <T>(
    result: CoreMsApiResonse<T>,
    successMessage: string,
    errorContext: string
  ) => void;
}

export class ApiResponseHandler {
  static handleApiResponse<T>(
    result: CoreMsApiResonse<T>,
    successMessage: string,
    errorContext: string
  ): MessageState {
    if (result.result) {
      return {
        success: successMessage,
        initialErrorMessage: null,
        errors: null,
      };
    } else {
      const errorDetails =
        result.errors?.map((err) =>
          err.details ? `${err.description}: ${err.details}` : err.description
        ) || [];

      return {
        success: null,
        initialErrorMessage: errorContext,
        errors: errorDetails.length > 0 ? errorDetails : null,
      };
    }
  }

  static createSuccessTimeout(
    clearCallback: () => void,
    delay: number = 5000
  ): NodeJS.Timeout {
    return setTimeout(clearCallback, delay);
  }
}

export function useMessageState(): UseMessageStateReturn {
  const [success, setSuccess] = useState<string | null>(null);
  const [initialErrorMessage, setInitialErrorMessage] = useState<string | null>(
    null
  );
  const [errors, setErrors] = useState<string[] | null>(null);

  const clearSuccess = () => setSuccess(null);
  const clearError = () => {
    setInitialErrorMessage(null);
    setErrors(null);
  };
  const clearAll = () => {
    setSuccess(null);
    setInitialErrorMessage(null);
    setErrors(null);
  };

  const handleResponse = <T>(
    result: CoreMsApiResonse<T>,
    successMessage: string,
    errorContext: string
  ) => {
    const messageState = ApiResponseHandler.handleApiResponse(
      result,
      successMessage,
      errorContext
    );

    setInitialErrorMessage(messageState.initialErrorMessage);
    setErrors(messageState.errors);
    setSuccess(messageState.success);
  };

  return {
    success,
    initialErrorMessage,
    errors,
    clearSuccess,
    clearError,
    clearAll,
    handleResponse,
  };
}

export default ApiResponseHandler;
