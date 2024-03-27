class BadRequestError extends Error {
    constructor(message) {
        super(message)
        this.name = "BadRequestError"
        this.statusCode = 400;
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFOundError";
        this.statusCode = 404;
    }
}

export { BadRequestError, NotFoundError }