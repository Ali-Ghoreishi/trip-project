class ErrorHandler extends Error {
  message;
  status;
  code;

  constructor(msg: string, status: number, code: string) {
    super(msg);
    this.message = msg;
    this.status = status || 500;
    if (code) {
      this.code = code || 'Crash';
    }
  }
}

export default ErrorHandler;
