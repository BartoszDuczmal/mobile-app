import Joi from "joi";

const schemaPost = Joi.object({
  title: Joi.string().pattern(new RegExp("^[a-zA-Z0-9 ąćęłńóśźżĄĆĘŁŃÓŚŹŻ.,!?()-]+$")).min(3).max(50).required(),
  desc: Joi.string().min(3).max(400).required().replace(/</g, '&lt;').replace(/>/g, '&gt;'),
})

export default schemaPost;