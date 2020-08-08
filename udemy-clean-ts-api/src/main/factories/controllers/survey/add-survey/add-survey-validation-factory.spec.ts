import { Validation } from '@/presentation/protocols'
import { RequiredFieldsValidation, ValidationComposite } from '@/validation/validators'
import { makeAddSurveyValidationComposite } from './add-survey-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidationComposite()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldsValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
