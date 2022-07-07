import { Context } from '../../../index'
import validator from 'validator'
import { Prisma, tbl_reg_performer } from '@prisma/client'

interface PerformerPayloadType {
  userErrors: {
    message: string
  }[]
  performer:
    | tbl_reg_performer
    | Prisma.Prisma__tbl_reg_performerClient<tbl_reg_performer>
    | null
}

export const PerformerMutations = {
  /**
   *
   * Create a Performer
   *
   * @param registrationID The id of the registration form.
   * @param performer The performer object to add to the registration.
   *
   **/
  performerCreate: async (
    _: any,
    {
      registrationID,
      performer,
    }: { registrationID: number; performer: tbl_reg_performer },
    { db, userInfo }: Context
  ): Promise<PerformerPayloadType> => {
    /**
     * Check if User is logged in.
     */
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to add a performer',
          },
        ],
        performer: null,
      }
    }

    /**
     * Verify appropraite userID in database.
     * If UserInfo Exists, check if the actual user is
     * authorized to add a performer to this registration.
     * Admin and Staff are always allowed.
     */
    if (!userInfo.admin && !userInfo.staff) {
      let idCheck = await db.tbl_registration.findUnique({
        where: {
          id: Number(registrationID),
        },
        select: {
          id: true,
          performerType: true,
          tbl_user: {
            select: { id: true },
          },
        },
      })

      if (idCheck?.tbl_user?.id != userInfo.userID) {
        return {
          userErrors: [
            {
              message: 'Not Authorized to create performer',
            },
          ],
          performer: null,
        }
      }

      /**
       * Check to see if there is already one performer if
       * performerType is set to 'SOLO'
       */
      let numberOfPerformers = await db.tbl_registration.findMany({
        where: {
          id: Number(registrationID),
          tbl_reg_performer: {
            some: {},
          },
        },
      })

      if (
        numberOfPerformers[0] &&
        numberOfPerformers[0].performerType === 'SOLO'
      ) {
        return {
          userErrors: [
            {
              message:
                'Solo Registration already has a performer listed.  Cannot add another performer.',
            },
          ],
          performer: null,
        }
      }
      /**
       * Verify that the performingType is set to 'SOLO'.
       */
      if (idCheck.performerType != 'SOLO') {
        return {
          userErrors: [
            {
              message:
                'Solo performers can only be added to solo registration form',
            },
          ],
          performer: null,
        }
      }
    }
    /**
     * Adds the Performer and any details into registration record
     * in the database.
     */
    performer.regID = Number(registrationID)
    return {
      userErrors: [],
      performer: await db.tbl_reg_performer.create({
        data: {
          ...performer,
        },
      }),
    }
  },

  /**
   * Update Performer Details
   *
   * @param performerID The id of the performer
   * @param performer The Performer details object.
   * @returns
   */
  performerUpdate: async (
    _: any,
    {
      performerID,
      performer,
    }: { performerID: number; performer: tbl_reg_performer },
    { db, userInfo }: Context
  ): Promise<PerformerPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to update a performer',
          },
        ],
        performer: null,
      }
    }

    /**
     * First check if the performer exists in the database.
     * If not, return an error.
     */
    if (!userInfo.admin && !userInfo.staff) {
      let performerExists: tbl_reg_performer | null =
        await db.tbl_reg_performer.findUnique({
          where: {
            id: Number(performerID),
          },
        })
      if (!performerExists) {
        return {
          userErrors: [
            {
              message: 'Performer does not exist in registration form.',
            },
          ],
          performer: null,
        }
      } else {
        /**
         * Verify appropraite userID in database.
         * If UserInfo Exists, check if the actual user is
         * authorized to update performer details in this registration.
         * Admin and Staff are always allowed.
         */

        let idCheck = await db.tbl_reg_performer.findUnique({
          where: {
            id: Number(performerID),
          },
          select: {
            id: true,
            tbl_registration: {
              select: {
                tbl_user: {
                  select: { id: true },
                },
              },
            },
          },
        })

        if (idCheck?.tbl_registration?.tbl_user.id != userInfo.userID) {
          return {
            userErrors: [
              {
                message: 'Not Authorized to update performer',
              },
            ],
            performer: null,
          }
        }
      }
    }
    /**
     * Enter the edits in the database
     */
    return {
      userErrors: [],
      performer: await db.tbl_reg_performer.update({
        data: {
          ...performer,
        },
        where: {
          id: Number(performerID),
        },
      }),
    }
  },

  performerDelete: async (
    _: any,
    { performerID }: { performerID: tbl_reg_performer['id'] },
    { db, userInfo }: Context
  ): Promise<PerformerPayloadType> => {
    /**
     * Checks if user is logged in.
     */
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to delete a performer',
          },
        ],
        performer: null,
      }
    }
    /**
     * Verifies that the performer exists in the database.
     */
    if (!userInfo.admin && !userInfo.staff) {
      let performerExists: tbl_reg_performer | null =
        await db.tbl_reg_performer.findUnique({
          where: {
            id: Number(performerID),
          },
        })
      if (!performerExists) {
        return {
          userErrors: [
            {
              message: 'Performer does not exist in registration form.',
            },
          ],
          performer: null,
        }
      } else {
        /**
         * Verify appropraite userID in database.
         * If UserInfo Exists, check if the actual user is
         * authorized to delete the performer details in this
         * registration. Admin and Staff are always allowed.
         */
        let idCheck = await db.tbl_reg_performer.findUnique({
          where: {
            id: Number(performerID),
          },
          select: {
            id: true,
            tbl_registration: {
              select: {
                tbl_user: {
                  select: { id: true },
                },
              },
            },
          },
        })

        if (idCheck?.tbl_registration?.tbl_user.id != userInfo.userID) {
          return {
            userErrors: [
              {
                message: 'Not Authorized to delete performer',
              },
            ],
            performer: null,
          }
        }
      }
    }
    return {
      userErrors: [],
      performer: await db.tbl_reg_performer.delete({
        where: {
          id: Number(performerID),
        },
      }),
    }
  },
}
