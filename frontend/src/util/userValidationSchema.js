import * as Yup from "yup";

const USER_USERNAME_MAX_LENGTH = 100;
const USER_PASSWORD_MIN_LENGTH = 6;
const USER_PASSWORD_MAX_LENGTH = 200;

export const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .label("Username")
    .min(1)
    .max(USER_USERNAME_MAX_LENGTH)
    .required(),
  password: Yup.string()
    .label("Password")
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
  confirmPassword: Yup.string()
    .label("Confirmation Password")
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required()
    .test(
      "confirmation-password-matching",
      "Confirmation Password not matching",
      (confirmationPassword, { parent: { password } }) =>
        password === confirmationPassword
    ),
});

export const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .label("Username")
    .min(1)
    .max(USER_USERNAME_MAX_LENGTH)
    .required(),
  password: Yup.string()
    .label("Password")
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
});

export const ProfileSchema = Yup.object().shape({
  username: Yup.string()
    .label("Username")
    .min(1)
    .max(USER_USERNAME_MAX_LENGTH)
    .required(),
});

export const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .label("Old Password")
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
  newPassword: Yup.string()
    .label("New Password")
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
  confirmNewPassword: Yup.string()
    .label("Confirmation New Password")
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required()
    .test(
      "confirmation-new-password-matching",
      "Confirmation New Password not matching",
      (confirmNewPassword, { parent: { newPassword } }) =>
        newPassword === confirmNewPassword
    ),
});
