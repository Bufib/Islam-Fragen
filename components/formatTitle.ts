export const formatTitle = (title: string) => {
  return title
    .replace(/([A-Z])/g, " $1") // Add space before each capital letter
    .replace(/\(\s*/g, " (") // Add space before opening parenthesis, removing any existing spaces
    .replace(/\s*\)/g, ") ") // Add space after closing parenthesis, removing any existing spaces
    .replace(/&/g, " & ") // Add space before and after ampersand
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Remove leading and trailing spaces
};
