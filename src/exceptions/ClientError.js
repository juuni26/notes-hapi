class ClientError extends Error {
  constructor(message, statusCode = 400, name = 'ClientError') {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
  }
}

module.exports = ClientError;