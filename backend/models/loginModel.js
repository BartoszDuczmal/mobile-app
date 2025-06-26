import Joi from "joi";

const schemaLogin = Joi.object({
  email: Joi.string().max(50).email().required(),
  pass: Joi.string().min(8).max(30).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).+$")).required(),
})

export default schemaLogin;