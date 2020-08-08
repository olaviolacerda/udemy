import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('any_field', 'fieldToCompare')
}
describe('RequiredFieldsValidation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ any_field: 'any_field', fieldToCompare: 'wrong_field' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ any_field: 'any_field', fieldToCompare: 'any_field' })
    expect(error).toBeFalsy()
  })
})
