import { Context } from '../../../index'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import JWT_SIGNATURE from '../../../utils/keys'
import { tbl_user } from '@prisma/client'

interface SignupArgs {
  credentials: {
    email: tbl_user['email']
    password: tbl_user['password']
  }
}

interface SigninArgs {
  credentials: {
    email: tbl_user['email']
    password: tbl_user['password']
  }
}

interface UserPayload {
  userErrors: {
    message: string
  }[]
  token: string | null
}

export default {
  Mutation: {
    signup: async (
      _: any,
      { credentials }: SignupArgs,
      { db }: Context
    ): Promise<UserPayload> => {
      const { email, password } = credentials
      if (!email || !password) {
        return {
          userErrors: [
            {
              message: 'You must provide a username and password',
            },
          ],
          token: null,
        }
      }
      const isEmail = validator.isEmail(email)
      if (!isEmail) {
        return {
          userErrors: [{ message: 'Invalid email' }],
          token: null,
        }
      }
      const isValidPassword = validator.isLength(password, { min: 8 })
      if (!isValidPassword) {
        return {
          userErrors: [{ message: 'Invalid email' }],
          token: null,
        }
      }
      const hashedPassword = await bcrypt.hash(password, 15)
      const user = await db.tbl_user.create({
        data: {
          email,
          password: hashedPassword,
          staff: false,
          admin: false,
        },
      })

      const token = await JWT.sign(
        {
          userID: user.id,
          staff: false,
          admin: false,
        },
        JWT_SIGNATURE,
        { expiresIn: 173000 }
      )
      return {
        userErrors: [],
        token,
      }
    },

    signin: async (
      _: any,
      { credentials }: SigninArgs,
      { db }: Context
    ): Promise<UserPayload> => {
      const { email, password } = credentials

      const user = await db.tbl_user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return {
          userErrors: [{ message: 'Invalid credentials' }],
          token: null,
        }
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return {
          userErrors: [{ message: 'Invalid credentials' }],
          token: null,
        }
      }

      return {
        userErrors: [],
        token: JWT.sign(
          { userID: user.id, staff: user.staff, admin: user.admin },
          JWT_SIGNATURE,
          {
            expiresIn: 173000,
          }
        ),
      }
    },
  },
}
