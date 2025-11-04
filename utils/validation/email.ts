import Joi from "joi";

const emailValid = (email: string) => {
    const schema = Joi.string().max(50).email({ tlds: { allow: false } }).required()

    const { error } = schema.validate(email)

    return error ? false : true
}

export default emailValid;