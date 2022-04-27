import { Context } from '../../../index'
import validator from 'validator'
import { Prisma, tbl_registration } from '@prisma/client'

enum SGSlabel {
  SOLO = 'SOLO',
  GROUP = 'GROUP',
  SCHOOL = 'SCHOOL',
}

interface RegistrationPayloadType {
  userErrors: {
    message: string
  }[]
  registration: Prisma.Prisma__tbl_registrationClient<tbl_registration> | null
}

export default {
  Mutation: {
    registrationCreate: async (
      _: any,
      { performerType }: tbl_registration,
      { db, userInfo }: Context
    ): Promise<RegistrationPayloadType> => {
      if (!performerType) {
        return {
          userErrors: [{ message: 'You must provide a performer type' }],
          registration: null,
        }
      }
      return {
        userErrors: [],
        registration: db.tbl_registration.create({
          data: {
            performerType,
            userID: 18,
          },
        }),
      }
    },

    registrationUpdate: async (
      _: any,
      {
        registrationID,
        registration,
      }: {
        registrationID: number
        registration: tbl_registration
      },
      { db, userInfo }: Context
    ): Promise<RegistrationPayloadType> => {
      const existingRegistration = await db.tbl_registration.findUnique({
        where: {
          id: Number(registrationID),
        },
      })
      if (!existingRegistration) {
        return {
          userErrors: [
            {
              message: 'Registration does not exist',
            },
          ],
          registration: null,
        }
      }

      return {
        userErrors: [],
        registration: db.tbl_registration.update({
          where: {
            id: Number(registrationID),
          },
          data: {
            ...registration,
          },
        }),
      }
    },
  },
}
