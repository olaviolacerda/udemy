import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeAccessToken = async (): Promise<string> => {
    const { ops } = await accountCollection.insertOne({
      name: 'Olavio',
      email: 'olavio.lacerda@mail.com',
      password: '123',
      role: 'admin'
    })
    const id = ops[0]._id
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })

    return accessToken
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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with a valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .send({})
        .expect(403)
    })

    test('Should return 200 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertMany([makeFakeSurvey('any'), makeFakeSurvey('other')])
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .send({})
        .expect(200)
    })

    test('Should return 204 on load surveys with valid accessToken and no surveys at database', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .send({})
        .expect(204)
    })
  })
})
