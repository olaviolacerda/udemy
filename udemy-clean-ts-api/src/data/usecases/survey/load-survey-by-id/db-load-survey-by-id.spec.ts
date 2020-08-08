import { mockLoadSurveyByIdRepository } from '@/data/test'
import { mockSurveyModel } from '@/domain/test'
import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadSpy).toHaveBeenCalled()
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(mockSurveyModel())
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
