import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldsValidation, ValidationComposite } from '@/validation/validators'

export const makeAddSurveyValidationComposite = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldsValidation(field))
  }
  return new ValidationComposite(validations)
}
