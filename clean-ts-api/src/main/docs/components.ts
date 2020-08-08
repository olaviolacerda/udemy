import { badRequest, forbidden, noContent, notFound, serverError, unauthorized } from './components/'
import { apiKeyAuth } from './schemas/'

export default {
  securitySchemes: {
    apiKeyAuth
  },
  badRequest,
  serverError,
  unauthorized,
  forbidden,
  notFound,
  noContent
}
