import { Validation } from '@/presentation/protocols'

export const mockValidationComposite = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
