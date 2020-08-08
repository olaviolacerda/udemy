import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { LoginController } from '@/presentation/controllers/login/login/login-controller'
import { Controller } from '@/presentation/protocols'
import { makeLoginValidationComposite } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidationComposite())
  return makeLogControllerDecorator(controller)
}
