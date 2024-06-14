import jwt from "jsonwebtoken";

export const sendTokenResponse = (user, statusCode, res) => {
  // If the credentials are valid, the server generates a JWT containing the user's ID and signs it with a secret key.
  // This is the secret key used to sign the JWT. It should be a long, random string stored securely in your environment variables.
  // The secret key ensures that the token cannot be tampered with. Only the server knows this key, so it can verify that the token it receives in subsequent requests is legitimate.
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  //The password is excluded from the user object to avoid sending it back to the client.
  const { password, ...restOfUser } = user._doc;
  // By setting a cookie with the JWT, the server can ensure that the client will include this token in future requests.
  //This token is used to authenticate subsequent requests without the need for the user to re-enter their credentials.
  // The generated token is sent to the client in an HTTP-only cookie for security.
  // The user data (excluding the password) is sent back in the response.
  res
    .cookie("access_token", token, { httpOnly: true })
    .status(statusCode)
    .json(restOfUser);
};
