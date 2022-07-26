import Joi from "joi";

export const loginValidator = async (email, password) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  try {
    const result = await schema.validateAsync({ email, password });
    return result;
  } catch (error) {
    return error;
  }
};

export const registerValidator = async (
  email,
  password,
  username,
  type,
  confPassword
) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    type: Joi.string(),
    password_confirmation: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
  });

  try {
    const result = await schema.validateAsync({
      email,
      password,
      username,
      type,
      password_confirmation: confPassword,
    });
    return result;
  } catch (error) {
    return error;
  }
};
