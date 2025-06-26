import Joi from "joi";

const schemaPost = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  desc: Joi.string().min(3).max(400).required(),
})

export default schemaPost;