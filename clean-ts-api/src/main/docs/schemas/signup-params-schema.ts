export const signupParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'Email da Silva'
    },
    email: {
      type: 'string',
      format: 'email',
      example: 'email@mail.com'
    },
    password: {
      type: 'string',
      format: 'password',
      example: '123456'
    },
    passwordConfirmation: {
      type: 'string',
      format: 'password',
      example: '123456'
    }
  },
  required: ['email', 'password', 'name', 'passwordConfirmation']
}
