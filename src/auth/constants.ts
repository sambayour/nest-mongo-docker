export const jwtConstants = {
  secret:
    process.env.JWT_SECRET ??
    'This is supposed to be a secret so you know what to do (*-*)',
};
