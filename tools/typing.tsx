type MyType = [boolean, string | null];

export function safelyCastToBoolean(value: MyType): boolean {
  const [boolValue, strOrNullValue] = value;

  if (typeof boolValue === "boolean") {
    return boolValue; // Already a boolean, no need to cast
  } else if (typeof strOrNullValue === "string") {
    // Check if the string is 'true' or 'false' (case-insensitive)
    const lowercaseStr = strOrNullValue.toLowerCase();
    if (lowercaseStr === "true") {
      return true;
    } else if (lowercaseStr === "false") {
      return false;
    } else {
      // Handle unexpected string values
      throw new Error(`Unexpected string value: ${strOrNullValue}`);
    }
  } else {
    // Handle null values
    throw new Error("Value cannot be safely cast to boolean");
  }
}
