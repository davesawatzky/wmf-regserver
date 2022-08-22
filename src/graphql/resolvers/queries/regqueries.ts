import {
	tbl_registration,
	tbl_reg_classes,
	tbl_reg_performer,
	tbl_user,
} from '@prisma/client'
import { Context } from '../../../server'

export const registrationQueries = {
	registrations: (_: any, __: any, { db, userInfo }: Context) => {
		if (!userInfo) return null
		if (userInfo.admin || userInfo.staff) {
			return db.tbl_registration.findMany({
				orderBy: {
					createdAt: 'desc',
				},
			})
		} else {
			return db.tbl_registration.findMany({
				where: {
					userID: userInfo.userID,
				},
				orderBy: {
					createdAt: 'asc',
				},
			})
		}
	},
	registration: (
		_: any,
		{ id }: tbl_registration,
		{ db, userInfo }: Context
	) => {
		if (!userInfo) return null
		if (userInfo.admin || userInfo.staff) {
			return db.tbl_registration.findUnique({
				where: {
					id,
				},
			})
		} else {
			return db.tbl_registration.findUnique({
				where: { id: Number(id) },
			})
		}
	},
	performers: (_: any, __: any, { db, userInfo }: Context) => {
		if (!userInfo) return null
		if (userInfo.admin || userInfo.staff) {
			return db.tbl_reg_performer.findMany({
				orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
			})
		}
	},
}

export const Registration = {
	performers: ({ id }: tbl_registration, _: any, { db, userInfo }: Context) => {
		if (!userInfo) return null
		return db.tbl_reg_performer.findMany({
			where: { regID: id },
		})
	},
	groups: ({ id }: tbl_registration, _: any, { db, userInfo }: Context) => {
		if (!userInfo) return null
		return db.tbl_reg_group.findMany({
			where: { regID: id },
		})
	},
	registeredClasses: (
		{ id }: tbl_registration,
		_: any,
		{ db, userInfo }: Context
	) => {
		if (!userInfo) return null
		return db.tbl_reg_classes.findMany({
			where: { regID: id },
		})
	},
	school: ({ id }: tbl_registration, _: any, { db, userInfo }: Context) => {
		if (!userInfo) return null
		return db.tbl_reg_school.findMany({
			where: { regID: id },
		})
	},
	teacher: ({ id }: tbl_registration, _: any, { db, userInfo }: Context) => {
		if (!userInfo) return null
		return db.tbl_reg_teacher.findUnique({
			where: { regID: id },
		})
	},
}

export const RegisteredClass = {
	selections: ({ id }: tbl_reg_classes, _: any, { db, userInfo }: Context) => {
		if (!userInfo) return null
		return db.tbl_reg_selection.findMany({
			where: { classpickID: id },
		})
	},
}

export const User = {
	registrations: ({ id }: tbl_user, _: any, { db, userInfo }: Context) => {
		if (!userInfo) return null
		if (userInfo.staff || userInfo.admin) {
			return db.tbl_registration.findMany({
				where: { userID: id },
			})
		} else {
			return db.tbl_registration.findMany({
				where: { AND: [{ userID: id }, { userID: userInfo.userID }] },
			})
		}
	},
}
