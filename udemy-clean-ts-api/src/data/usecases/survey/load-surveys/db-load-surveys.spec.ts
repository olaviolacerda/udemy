import { mockLoadSurveysRepository } from '@/data/test'
import { mockSurveyModels } from '@/domain/test'
import MockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from './db-load-surveys-protocols'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository with correct accountId', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const accountId = 'any_id'
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load(accountId)
    expect(loadAllSpy).toHaveBeenCalledWith(accountId)
  })

  test('Should return surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load('any_id')
    expect(surveys).toEqual(mockSurveyModels())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    const promise = sut.load('any_id')
    await expect(promise).rejects.toThrow()
  })
})
