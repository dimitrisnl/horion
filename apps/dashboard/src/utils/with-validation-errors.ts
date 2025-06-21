export const mapValidationErrors = (errors: Record<string, Array<string>>) => {
  const mappedErrors: Record<string, Error> = {};

  Object.entries(errors).forEach(([key, messages]) => {
    mappedErrors[key] = new Error(messages[0]);
  });

  return mappedErrors;
};

export function withValidationErrors<T>(
  promise: Promise<T>,
): Promise<T | {fields: Record<string, Error>}> {
  return promise.catch((error) => {
    if (error.code === "INPUT_VALIDATION_FAILED" && error.data?.fieldErrors) {
      return {fields: mapValidationErrors(error.data.fieldErrors)};
    }

    throw error;
  });
}
