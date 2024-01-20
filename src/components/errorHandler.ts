class CustomError extends Error {
  constructor(message: string, status = 500, data = []) {
    super(message);
    this.name = this.constructor.name;
    //@ts-ignore
    this.status = status;
    //@ts-ignore
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
