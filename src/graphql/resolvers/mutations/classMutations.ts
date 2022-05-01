import { Context } from '../../../index'
import validator from 'validator'
import { Prisma, tbl_registration, tbl_reg_classpicks } from '@prisma/client'

interface RegisteredClassPayloadType {
  userErrors: {
    message: string
  }[]
  registeredClass:
    | tbl_reg_classpicks
    | Prisma.Prisma__tbl_reg_classpicksClient<tbl_reg_classpicks>
    | null
}

export const RegisteredClassMutations = {
  registeredClassCreate: async (
    _: any,
    {
      registrationID,
      registeredClass,
    }: { registrationID: number; registeredClass: tbl_reg_classpicks },
    { db, userInfo }: Context
  ): Promise<RegisteredClassPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to add a class',
          },
        ],
        registeredClass: null,
      }
    }

    if (!userInfo.admin && !userInfo.staff) {
      let idCheck = await db.tbl_user.findMany({
        select: {
          id: true,
          tbl_registration: {
            select: {
              id: true,
            },
            where: {
              id: registrationID,
            },
          },
        },
      })

      if (!idCheck || idCheck.length > 1 || idCheck[0].id != userInfo.userID) {
        return {
          userErrors: [
            {
              message: 'Not Authorized to enter a class',
            },
          ],
          registeredClass: null,
        }
      }
    }

    registeredClass.regID = Number(registrationID)
    return {
      userErrors: [],
      registeredClass: await db.tbl_reg_classpicks.create({
        data: {
          ...registeredClass,
        },
      }),
    }
  },

  registeredClassUpdate: async (
    _: any,
    {
      registeredClassID,
      registeredClass,
    }: { registeredClassID: number; registeredClass: tbl_reg_classpicks },
    { db, userInfo }: Context
  ): Promise<RegisteredClassPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to update a class',
          },
        ],
        registeredClass: null,
      }
    }

    if (!userInfo.admin && !userInfo.staff) {
      let classEntryExists: tbl_reg_classpicks | null =
        await db.tbl_reg_classpicks.findUnique({
          where: {
            id: Number(registeredClassID),
          },
        })
      if (!classEntryExists) {
        return {
          userErrors: [
            {
              message: 'Class entry does not exist in registration form.',
            },
          ],
          registeredClass: null,
        }
      } else {
        let idCheck = await db.tbl_user.findMany({
          select: {
            id: true,
            tbl_registration: {
              select: {
                id: true,
                tbl_reg_classpicks: {
                  select: {
                    id: true,
                  },
                  where: {
                    id: registeredClassID,
                  },
                },
              },
            },
          },
        })

        if (
          !idCheck ||
          idCheck.length > 1 ||
          idCheck[0].id != userInfo.userID
        ) {
          return {
            userErrors: [
              {
                message: 'Not Authorized to update class entry',
              },
            ],
            registeredClass: null,
          }
        }
      }
    }

    return {
      userErrors: [],
      registeredClass: await db.tbl_reg_classpicks.update({
        data: {
          ...registeredClass,
        },
        where: {
          id: Number(registeredClassID),
        },
      }),
    }
  },

  registeredClassDelete: async (
    _: any,
    { id }: tbl_reg_classpicks,
    { db, userInfo }: Context
  ): Promise<RegisteredClassPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to delete a class entry',
          },
        ],
        registeredClass: null,
      }
    }

    if (!userInfo.admin && !userInfo.staff) {
      let classEntryExists: tbl_reg_classpicks | null =
        await db.tbl_reg_classpicks.findUnique({
          where: {
            id: Number(id),
          },
        })
      if (!classEntryExists) {
        return {
          userErrors: [
            {
              message: 'Class entry does not exist in registration form.',
            },
          ],
          registeredClass: null,
        }
      } else {
        let idCheck = await db.tbl_user.findMany({
          select: {
            id: true,
            tbl_registration: {
              select: {
                id: true,
                tbl_reg_classpicks: {
                  select: {
                    id: true,
                  },
                  where: {
                    id,
                  },
                },
              },
            },
          },
        })

        if (
          !idCheck ||
          idCheck.length > 1 ||
          idCheck[0].id != userInfo.userID
        ) {
          return {
            userErrors: [
              {
                message: 'Not Authorized to delete class entry',
              },
            ],
            registeredClass: null,
          }
        }
      }
    }
    return {
      userErrors: [],
      registeredClass: await db.tbl_reg_classpicks.delete({
        where: {
          id: Number(id),
        },
      }),
    }
  },
}
