export function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error("❌ Error:", error.message);
    throw new Error(error.message);
  } else {
    console.error("❌ Unknown error occurred:", error);
    throw new Error("An unknown error occurred.");
  }
}
