export const accountSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      format: 'token',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzMzNWE1NGFmYTgyNjVhZDU5OGQzNSIsImlhdCI6MTU4OTg1MTU2MX0.9iQ8rJOu7zEWkshDE6PJoT39teFp15RxpxhExwYMcUI'
    },
    name: {
      type: 'string',
      example: 'Manguinho'
    }
  }
}
