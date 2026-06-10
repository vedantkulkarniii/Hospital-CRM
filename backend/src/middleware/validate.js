'use strict';

const { validationResult } = require('express-validator');

/**
 * validate — runs after express-validator chains.
 * If there are errors, returns a 422 response with structured error list.
 * Otherwise calls next().
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed. Please check your input.',
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = validate;
