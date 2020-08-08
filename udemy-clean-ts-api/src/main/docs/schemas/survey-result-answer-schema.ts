export const surveyResultAnswerSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    count: {
      type: 'number',
      format: 'integer'

    },
    percent: {
      type: 'number',
      format: 'double'
    }
  }
}
