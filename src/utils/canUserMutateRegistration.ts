import { Context } from '../index'

interface CanUserMutateRegistrationParams {
  userID: number
  registrationId: number
  db: Context['db']
}

export const canUserMutateRegistration = async ({
  userID,
  registrationId,
  db,
}: CanUserMutateRegistrationParams) => {
  const user = await db.tbl_user.findUnique({
    where: {
      id: userID,
    },
  })

  if (!user) {
    return {
      userErrors: [{ message: 'User not found' }],
    }
  }

  const registration = await db.tbl_registration.findUnique({
    where: {
      id: registrationId,
    },
  })

  if (registration?.userID !== user.id) {
    return {
      userErrors: [{ message: 'Not authorized' }],
    }
  }
}
