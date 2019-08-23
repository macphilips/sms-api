import HttpError from './HttpError';

export const errorCatcher = fn => (req, res, next) => fn(req, res, next)
  .catch(e => next(e));

const errorHandler = (error, req, res, next) => { // eslint-disable-line no-unused-vars
  let message;
  ({ message } = error);
  let statusCode;
  let field;
  let code;
  if (error instanceof HttpError) {
    ({
      message,
      field,
      code,
      statusCode,
    } = error);
  } else {
    statusCode = error.status || 500;
  }

  res.status(statusCode)
    .json({
      message,
      field,
      code,
    });
};

export const registerErrorHandler = (app) => {
  app.use(errorHandler);
};
