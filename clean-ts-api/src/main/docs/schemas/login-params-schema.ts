export const loginParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      example: 'email@mail.com'
    },
    password: {
      type: 'string',
      format: 'password',
      example: '123456'
    }
  },
  required: ['email', 'password']
}
