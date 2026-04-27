const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const validateUserPayload = ({ name, email, password, address }) => {
  if (!name || !email || !password || !address) {
    return "All fields are required";
  }

  if (name.length < 20 || name.length > 60) {
    return "Name must be between 20 and 60 characters";
  }

  if (!emailRegex.test(email)) {
    return "Email must be valid";
  }

  if (address.length > 400) {
    return "Address cannot exceed 400 characters";
  }

  if (!passwordRegex.test(password)) {
    return "Password must be 8-16 characters with one uppercase letter and one special character";
  }

  return "";
};

const validatePassword = (password) => {
  if (!passwordRegex.test(password || "")) {
    return "Password must be 8-16 characters with one uppercase letter and one special character";
  }

  return "";
};

module.exports = { validatePassword, validateUserPayload };
