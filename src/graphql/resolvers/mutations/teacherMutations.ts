import { Context } from '../../../index'
import validator from 'validator'
import { Prisma, tbl_reg_teacher } from '@prisma/client'

interface TeacherPayloadType {
  userErrors: {
    message: string
  }[]
  teacher:
    | tbl_reg_teacher
    | Prisma.Prisma__tbl_reg_teacherClient<tbl_reg_teacher>
    | null
}

export const TeacherMutations = {
  /**
   * Create Teacher
   *
   * @param registrationID The registration associated with this teacher
   * @param teacher The teacher object containing all the details.
   * @returns
   */
  teacherCreate: async (
    _: any,
    {
      registrationID,
      teacher,
    }: { registrationID: number; teacher: tbl_reg_teacher },
    { db, userInfo }: Context
  ): Promise<TeacherPayloadType> => {
    /**
     * Check if a user is logged in
     */
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to add a teacher',
          },
        ],
        teacher: null,
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
              message: 'Not Authorized to create teacher',
            },
          ],
          teacher: null,
        }
      }
    }
    /**
     * Check to see if there is already one teacher listed
     */
    let numberOfTeachers = await db.tbl_registration.findMany({
      where: {
        id: Number(registrationID),
        tbl_reg_teacher: {
          some: {},
        },
      },
    })
    if (numberOfTeachers[0]) {
      return {
        userErrors: [
          {
            message:
              'Registration form already has a teacher listed.  Cannot add another teacher.',
          },
        ],
        teacher: null,
      }
    }
    /**
     * Adds teacher details to the database
     */
    teacher.regID = Number(registrationID)
    return {
      userErrors: [],
      teacher: await db.tbl_reg_teacher.create({
        data: {
          ...teacher,
        },
      }),
    }
  },
  /**
   * Update the teacher information on a registration form
   *
   * @param teacherID The id of the teacher in the database
   * @param teacjer The teacher object containing all the details
   * @returns
   */
  teacherUpdate: async (
    _: any,
    { teacherID, teacher }: { teacherID: number; teacher: tbl_reg_teacher },
    { db, userInfo }: Context
  ): Promise<TeacherPayloadType> => {
    /**
     * Make sure the user is logged in
     */
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to update a teacher',
          },
        ],
        teacher: null,
      }
    }
    /**
     * Makes sure the teacher exists in the database.
     */
    if (!userInfo.admin && !userInfo.staff) {
      let teacherExists: tbl_reg_teacher | null =
        await db.tbl_reg_teacher.findUnique({
          where: {
            id: Number(teacherID),
          },
        })
      if (!teacherExists) {
        return {
          userErrors: [
            {
              message: 'Teacher does not exist in registration form.',
            },
          ],
          teacher: null,
        }
      } else {
        /**
         * Verify appropraite userID in database.
         * If UserInfo Exists, check if the actual user is
         * authorized to update performer details in this registration.
         * Admin and Staff are always allowed.
         */
        let idCheck = await db.tbl_reg_teacher.findUnique({
          where: {
            id: Number(teacherID),
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
                message: 'Not Authorized to update teacher',
              },
            ],
            teacher: null,
          }
        }
      }
    }
    /**
     * Enters the edits in the database.
     */
    return {
      userErrors: [],
      teacher: await db.tbl_reg_teacher.update({
        data: {
          ...teacher,
        },
        where: {
          id: Number(teacherID),
        },
      }),
    }
  },
  /**
   * Delete Teacher from registration form.
   *
   * @param teacherID The id of the teacher in the database.
   * @returns
   */
  teacherDelete: async (
    _: any,
    { teacherID }: { teacherID: tbl_reg_teacher['id'] },
    { db, userInfo }: Context
  ): Promise<TeacherPayloadType> => {
    /**
     * Check if user is logged in.
     */
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'You must be logged in to delete a teacher',
          },
        ],
        teacher: null,
      }
    }
    /**
     * Verify that the teacher exists in the database.
     */
    if (!userInfo.admin && !userInfo.staff) {
      let teacherExists: tbl_reg_teacher | null =
        await db.tbl_reg_teacher.findUnique({
          where: {
            id: Number(teacherID),
          },
        })
      if (!teacherExists) {
        return {
          userErrors: [
            {
              message: 'Teacher does not exist in registration form.',
            },
          ],
          teacher: null,
        }
      } else {
        /**
         * Verify appropraite userID in database.
         * If UserInfo Exists, check if the actual user is
         * authorized to delete the performer details in this
         * registration. Admin and Staff are always allowed.
         */
        let idCheck = await db.tbl_reg_teacher.findUnique({
          where: {
            id: Number(teacherID),
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
                message: 'Not Authorized to delete teacher',
              },
            ],
            teacher: null,
          }
        }
      }
    }
    /**
     * Delete the teacher from the database.
     */
    return {
      userErrors: [],
      teacher: await db.tbl_reg_teacher.delete({
        where: {
          id: Number(teacherID),
        },
      }),
    }
  },
}
