import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication'
import { Authentication } from '@/domain/usecases/account/authentication'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import env from '@/main/config/env'

export const makeDbAuthentication = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(env.bcryptSalt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
