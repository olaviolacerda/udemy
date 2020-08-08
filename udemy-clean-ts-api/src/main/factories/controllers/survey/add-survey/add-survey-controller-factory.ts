import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/add-survey/db-add-survey-factory'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '@/presentation/protocols'
import { makeAddSurveyValidationComposite } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidationComposite(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
