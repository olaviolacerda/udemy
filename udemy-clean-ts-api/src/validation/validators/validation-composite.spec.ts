import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'
import { mockValidationComposite } from '@/validation/test'
import { ValidationComposite } from './validation-composite'

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidationComposite(), mockValidationComposite()]
  const sut = new ValidationComposite(validationStubs)
  return {
    validationStubs,
    sut
  }
}

describe('Validation Composite', () => {
  test('Should returns an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    const randomPosition = Math.floor(Math.random() * (validationStubs.length))
    jest.spyOn(validationStubs[randomPosition], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ any_field: 'any_field' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should returns the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ any_field: 'any_field' })
    expect(error).toEqual(new Error())
  })

  test('Should not returns if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ any_field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
