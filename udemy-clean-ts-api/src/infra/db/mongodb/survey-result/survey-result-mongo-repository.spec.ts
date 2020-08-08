import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let surveyResultCollection: Collection
let surveyCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const surveyData: AddSurveyParams = {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer_1'
    }, {
      answer: 'any_answer_2'
    },
    {
      answer: 'any_answer_3'
    }],
    date: new Date()
  }
  const { ops } = await surveyCollection.insertOne(surveyData)
  return MongoHelper.map(ops[0])
}

const makeAccount = async (): Promise<AccountModel> => {
  const accountData: AddAccountParams = {
    email: 'any_email',
    name: 'any_name',
    password: 'any_password'
  }
  const { ops } = await accountCollection.insertOne(accountData)
  return MongoHelper.map(ops[0])
}

const makeSurveyResultParams = ({ accountId, surveyId, answer }: Partial<SaveSurveyResultParams>): any => ({
  accountId: new ObjectId(accountId),
  surveyId: new ObjectId(surveyId),
  date: new Date(),
  answer
})

const makeSurveyResultModel = async ({ accountId, surveyId, answer }: Partial<SaveSurveyResultParams>): Promise<SurveyResultModel> => {
  const surveyDataResult = makeSurveyResultParams({ accountId, surveyId, answer })
  const { ops } = await surveyResultCollection.insertOne(surveyDataResult)
  return MongoHelper.map(ops[0])
}

const makeSurveyResults = async ({ id: surveyId, answers }: SurveyModel, { id: accountId }: AccountModel): Promise<void> => {
  await surveyResultCollection.insertMany([
    makeSurveyResultParams({ accountId, surveyId, answer: answers[0].answer }),
    makeSurveyResultParams({ accountId, surveyId, answer: answers[0].answer }),
    makeSurveyResultParams({ accountId, surveyId, answer: answers[1].answer }),
    makeSurveyResultParams({ accountId, surveyId, answer: answers[1].answer })
  ])
}

describe('SurveyResultMongoRepository', () => {
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

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: account.id
      })
      expect(surveyResult).toBeTruthy()
    })

    test('Should update a survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await makeSurveyResultModel({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer
      })
      const sut = makeSut()
      await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection
        .find({
          surveyId: survey.id,
          accountId: account.id
        }).toArray()

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId', () => {
    test('Should load survey result', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await makeSurveyResults(survey, account)
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })

    test('Should return null if there is no survey result', async () => {
      const survey = await makeSurvey()
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id)
      expect(surveyResult).toBeNull()
    })
  })
})
