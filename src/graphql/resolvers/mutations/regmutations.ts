import { Context } from '../../../index'
import validator from 'validator'
import { Prisma, tbl_registration } from '@prisma/client'
import { canUserMutateInfo } from '../../../utils/canUserMutateInfo'

enum SGSlabel {
  SOLO = 'SOLO',
  GROUP = 'GROUP',
  SCHOOL = 'SCHOOL',
}

interface RegistrationPayloadType {
  userErrors: {
    message: string
  }[]
  registration:
    | tbl_registration
    | Prisma.Prisma__tbl_registrationClient<tbl_registration>
    | null
}

export const RegistrationMutations = {
  registrationCreate: async (
    _: any,
    { label, performerType }: tbl_registration,
    { db, userInfo }: Context
  ): Promise<RegistrationPayloadType> => {
    console.log(userInfo)

    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to create a new registration form',
          },
        ],
        registration: null,
      }
    }
    if (!performerType || !label) {
      return {
        userErrors: [
          {
            message:
              'You must provide a label and performer type for this registration form.',
          },
        ],
        registration: null,
      }
    }
    return {
      userErrors: [],
      registration: db.tbl_registration.create({
        data: {
          label,
          performerType,
          userID: userInfo.userID,
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
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden Access (unauthenticated)',
          },
        ],
        registration: null,
      }
    }
    const error = await canUserMutateInfo({
      userID: userInfo.userID,
      registrationID: Number(registrationID),
      db,
    })

    if (error) return error

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

  registrationDelete: async (
    _: any,
    { id }: tbl_registration,
    { db, userInfo }: Context
  ): Promise<RegistrationPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden Access (unauthenticated)',
          },
        ],
        registration: null,
      }
    }
    const error = await canUserMutateInfo({
      userID: userInfo.userID,
      registrationID: Number(id),
      db,
    })

    if (error) return error

    const registration = await db.tbl_registration.findUnique({
      where: {
        id: Number(id),
      },
    })
    if (!registration) {
      return {
        userErrors: [
          {
            message: 'Registration does not exist',
          },
        ],
        registration: null,
      }
    }
    await db.tbl_registration.delete({
      where: {
        id: registration.id,
      },
    })
    return {
      userErrors: [],
      registration,
    }
  },
}
