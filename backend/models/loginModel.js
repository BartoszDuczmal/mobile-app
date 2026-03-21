import Joi from "joi";

const schemaLogin = Joi.object({
  name: Joi.string().min(3).max(30).required().pattern(new RegExp("^[a-zA-Z0-9 ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.,!?()-]+$")),
  email: Joi.string().max(50).email({ tlds: { allow: false } }).required(),
  pass: Joi.string().min(8).max(30).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).+$")).required(),
})

export default schemaLogin;