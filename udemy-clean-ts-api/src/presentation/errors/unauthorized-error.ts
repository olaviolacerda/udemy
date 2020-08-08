export class UnauthorizedError extends Error {
  constructor () {
    super('Not enough permission, stranger')
    this.name = 'UnauthorizedError'
  }
}
