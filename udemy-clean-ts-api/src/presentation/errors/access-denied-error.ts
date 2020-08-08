export class AccessDeniedError extends Error {
  constructor () {
    super('Not enough access, stranger')
    this.name = 'AccessDeniedError'
  }
}
