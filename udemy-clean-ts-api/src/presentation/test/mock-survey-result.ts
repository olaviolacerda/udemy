import { mockSurveyResultModel } from '@/domain/test/mock-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyResult } from '../controllers/survey-result/load-survey-result/load-survey-result-controller-protocols'
import { SurveyResultModel } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }

  return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }

  return new LoadSurveyResultStub()
}
