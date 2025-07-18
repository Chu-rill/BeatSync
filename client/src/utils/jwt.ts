// Function to store JWT token in session storage for 2 hours
export function storeToken(token: string) {
  // Get current time and calculate expiration time (2 hours from now)
  const currentTime = new Date().getTime();
  const expirationTime = currentTime + 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  // Store token and expiration time in session storage
  sessionStorage.setItem("beatsync-token", token);
  sessionStorage.setItem("tokenExpiration", expirationTime.toString());
}

// Function to retrieve JWT token from session storage
export function getToken() {
  // Get token and expiration time from session storage
  const token = sessionStorage.getItem("beatsync-token");
  const expirationTime = sessionStorage.getItem("tokenExpiration");

  // Check if token is expired
  if (!token || !expirationTime) {
    return null; // Token not found or expiration time not set
  }

  const currentTime = new Date().getTime();
  if (currentTime > parseInt(expirationTime, 10)) {
    // Token has expired, remove it from session storage
    sessionStorage.removeItem("beatsync-token");
    sessionStorage.removeItem("tokenExpiration");
    return null;
  }

  return token; // Return valid token
}
