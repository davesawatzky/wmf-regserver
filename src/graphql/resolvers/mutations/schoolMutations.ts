import { Context } from '../../../index'
import validator from 'validator'
import { Prisma, tbl_reg_school } from '@prisma/client'

interface SchoolPayloadType {
  userErrors: {
    message: string
  }[]
  school:
    | tbl_reg_school
    | Prisma.Prisma__tbl_reg_schoolClient<tbl_reg_school>
    | null
}

export const SchoolMutations = {
  /**
   *
   * Create School
   *
   * @param registrationID The id of the registration form.
   * @param school The school details to add to the registration.
   *
   **/
  schoolCreate: async (
    _: any,
    {
      registrationID,
      school,
    }: { registrationID: number; school: tbl_reg_school },
    { db, userInfo }: Context
  ): Promise<SchoolPayloadType> => {
    /**
     * Check if user is logged in
     */
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to add a school',
          },
        ],
        school: null,
      }
    }
    /**
     * Verify appropraite userID in database.
     * If UserInfo Exists, check if the actual user is
     * authorized to add a school to this registration.
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

      if (idCheck?.tbl_user.id != userInfo.userID) {
        return {
          userErrors: [
            {
              message: 'Not Authorized to create entry',
            },
          ],
          school: null,
        }
      }
      if (idCheck.performerType != 'SCHOOL') {
        return {
          userErrors: [
            {
              message: `Cannot add school to ${idCheck.performerType} registration form.`,
            },
          ],
          school: null,
        }
      }
      /**
       * Check to see if there is already one school listed if
       * performerType is set to 'SCHOOL'
       */
      let numberOfSchools = await db.tbl_registration.findMany({
        where: {
          id: Number(registrationID),
          tbl_reg_school: {
            some: {},
          },
        },
      })

      if (numberOfSchools[0] && numberOfSchools[0].performerType === 'SCHOOL') {
        return {
          userErrors: [
            {
              message:
                'School Registration form already has a school listed.  Cannot add another school.',
            },
          ],
          school: null,
        }
      }
    }
    /**
     * Adds the Performer and any details into registration record
     * in the database.
     */
    school.regID = Number(registrationID)
    return {
      userErrors: [],
      school: await db.tbl_reg_school.create({
        data: {
          ...school,
        },
      }),
    }
  },

  /**
   * Update School Details
   * @param schoolID The id number of the school
   * @param school The school object containing all the details
   * @returns
   */
  schoolUpdate: async (
    _: any,
    { schoolID, school }: { schoolID: number; school: tbl_reg_school },
    { db, userInfo }: Context
  ): Promise<SchoolPayloadType> => {
    /**
     * Check to make sure user exists
     */
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to update a school',
          },
        ],
        school: null,
      }
    }

    /**
     * First check if the performer exists in the database.
     * If not, return an error.
     */
    if (!userInfo.admin && !userInfo.staff) {
      let schoolExists: tbl_reg_school | null =
        await db.tbl_reg_school.findUnique({
          where: {
            id: Number(schoolID),
          },
        })
      if (!schoolExists) {
        return {
          userErrors: [
            {
              message: 'School does not exist in registration form.',
            },
          ],
          school: null,
        }
      } else {
        /**
         * Verify appropraite userID in database.
         * If UserInfo Exists, check if the actual user is
         * authorized to update performer details in this registration.
         * Admin and Staff are always allowed.
         */
        let idCheck = await db.tbl_reg_school.findUnique({
          where: {
            id: Number(schoolID),
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
                message: 'Not Authorized to update school',
              },
            ],
            school: null,
          }
        }
      }
    }
    /**
     * Enters the edits in the database
     */
    return {
      userErrors: [],
      school: await db.tbl_reg_school.update({
        data: {
          ...school,
        },
        where: {
          id: Number(schoolID),
        },
      }),
    }
  },
  /**
   * Deletes a school from a registration form
   *
   * @param schoolID The id of the school in the database
   * @returns school object
   */
  schoolDelete: async (
    _: any,
    { schoolID }: { schoolID: tbl_reg_school['id'] },
    { db, userInfo }: Context
  ): Promise<SchoolPayloadType> => {
    /**
     * Check if user is logged in
     */
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to delete a school',
          },
        ],
        school: null,
      }
    }
    /**
     * Verify that the school exists in the database.
     */
    if (!userInfo.admin && !userInfo.staff) {
      let schoolExists: tbl_reg_school | null =
        await db.tbl_reg_school.findUnique({
          where: {
            id: Number(schoolID),
          },
        })
      if (!schoolExists) {
        return {
          userErrors: [
            {
              message: 'school does not exist in registration form.',
            },
          ],
          school: null,
        }
      } else {
        /**
         * Verify appropraite userID in database.
         * If UserInfo Exists, check if the actual user is
         * authorized to delete the performer details in this
         * registration. Admin and Staff are always allowed.
         */
        let idCheck = await db.tbl_reg_school.findUnique({
          where: {
            id: Number(schoolID),
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
                message: 'Not Authorized to delete school',
              },
            ],
            school: null,
          }
        }
      }
    }
    /**
     * Delete the object from the database
     */
    return {
      userErrors: [],
      school: await db.tbl_reg_school.delete({
        where: {
          id: Number(schoolID),
        },
      }),
    }
  },
}
