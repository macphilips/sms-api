export const errors = {
  USR_01: field => `${field} already exists`,
  USR_02: 'Contact with given ID doesn\'t exists',
  USR_03: 'Entity with given ID doesn\'t exists',
};

class HttpError extends Error {
  constructor(code, field, message, statusCode = 500) {
    super();
    this.message = errors[code] || message;
    this.code = code;
    this.field = field;
    if (errors[code] instanceof Function) {
      this.message = errors[code](field) || message;
    }
    this.statusCode = statusCode;
  }
}

export default HttpError;
