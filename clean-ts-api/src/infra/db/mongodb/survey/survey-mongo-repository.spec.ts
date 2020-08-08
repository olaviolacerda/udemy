import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyResultCollection: Collection
let surveyCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeFakeSurvey = (pre: string): AddSurveyParams => ({
  question: `${pre}_question`,
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }],
  date: new Date()
})

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on add success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeSurvey('any'))
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load a list of surveys on loadAll success', async () => {
      const addSurveyModels = [makeFakeSurvey('any'), makeFakeSurvey('other')]
      const result = await surveyCollection.insertMany(addSurveyModels)
      const [survey] = result.ops
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: '363136653739356636393634',
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll('363136653739356636393634')
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      // TODO -> fix this expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load an empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll('363136653739356636393634')
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadSurveyById()', () => {
    test('Should load a survey on loadById success', async () => {
      const { ops } = await surveyCollection.insertOne(makeFakeSurvey('any'))
      const sut = makeSut()
      const survey = await sut.loadById(ops[0]._id)
      expect(survey).toBeTruthy()
    })
  })
})
