const Joi = require('@hapi/joi');

const userValidation =  (data) => {
    const schema = Joi.object({
        username: Joi.string()
                .min(4)
                .required(),
        password: Joi.string()
                .min(4)
                .required()
    })
    return schema.validate(data)
}

module.exports = userValidation;