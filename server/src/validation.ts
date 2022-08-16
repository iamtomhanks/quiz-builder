import { NextFunction, Request, Response } from "express";
import joi from "joi";

const validate = (schema: joi.ObjectSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  const {
      error
    } = schema.validate(req.body);
    if (error) {
      res.status(422).send(error.details[0].message);
    } else {
      next();
    }
};

const MAX_TEXT_LENGTH = 50;

const answer = joi.object().keys({
  text: joi.string()
  .min(1)
  .max(MAX_TEXT_LENGTH)
  .required(),
  isCorrect: joi.boolean()
});

const question = joi.object().keys({
  text: joi.string()
  .min(1)
  .max(MAX_TEXT_LENGTH)
  .required(),
  answers: joi.array().min(1).max(5).items(answer).required()
});

const schemas = {
  newQuiz: joi.object()
  .keys({
    quiz: joi.object().keys({
      title: joi.string()
      .min(1)
      .max(MAX_TEXT_LENGTH)
      .required(),
      questions: joi.array().min(1).max(10).items(question).required()
    }).required(),
  }),
};

export {
  validate,
  schemas
};