import authResolvers from './auth'
import registrationMutations from './registration'

export const Mutation = {
  ...authResolvers,
  ...registrationMutations,
}
