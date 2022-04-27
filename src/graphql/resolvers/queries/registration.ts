import { Context } from '../../../index'

export default {
  Query: {
    registrations: (_: any, __: any, { db }: Context) => {
      return db.tbl_registration.findMany({
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      })
    },
  },
}
