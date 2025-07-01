
export const handleError = (error: unknown) => {
  // For debugging: log the full error to the server console.
  if (error instanceof Error) {
    // This is a native JavaScript Error (e.g., TypeError, RangeError)
    console.error(error.message);
    // You can also log the stack for more details
    // console.error(error.stack);
    throw new Error(`An error occurred: ${error.message}`);
  } else if (typeof error === 'string') {
    // This is a custom string error message
    console.error(error);
    throw new Error(`An error occurred: ${error}`);
  } else {
    // This is an unknown type of error
    console.error("An unknown error occurred", error);
    throw new Error('An unknown error occurred');
  }
};