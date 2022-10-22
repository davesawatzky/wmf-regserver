import {
	tbl_category,
	tbl_classlist,
	tbl_discipline,
	tbl_instruments,
	tbl_level,
	tbl_sacred,
	tbl_SGS,
	tbl_subdiscipline,
	tbl_trophy,
} from '@prisma/client'
import { Context } from '../../../server'

interface CategoriesSelect {
	levelID: tbl_classlist
	subdisciplineID: tbl_classlist
}

interface ClassSelect {
	classSearchArgs: {
		subdisciplineID: tbl_classlist
		levelID: tbl_classlist
		categoryID: tbl_classlist
	}
}

export const festivalQueries = {
	classSearch: (_: any, { classSearchArgs }: ClassSelect, { db }: Context) => {
		const { subdisciplineID, levelID, categoryID } = classSearchArgs
		return db.tbl_classlist.findMany({
			where: {
				subdisciplineID: +subdisciplineID,
				levelID: +levelID,
				categoryID: +categoryID,
			},
		})
	},

	classById: (_: any, { id }: tbl_classlist, { db }: Context) => {
		return db.tbl_classlist.findUnique({
			where: { id },
		})
	},
	classes: (_: any, { SGSlabel }: tbl_classlist, { db }: Context) => {
		if (SGSlabel) {
			return db.tbl_classlist.findMany({
				where: {
					SGSlabel,
				},
			})
		}
		return db.tbl_classlist.findMany()
	},
	classByNumber: (_: any, { classNumber }: tbl_classlist, { db }: Context) => {
		return db.tbl_classlist.findUnique({ where: { classNumber } })
	},
	category: (_: any, { id }: tbl_category, { db }: Context) => {
		return db.tbl_category.findUnique({
			where: { id },
		})
	},
	categories: async (
		_: any,
		{ levelID, subdisciplineID }: CategoriesSelect,
		{ db }: Context
	) => {
		if (levelID && subdisciplineID) {
			const classIDs = await db.tbl_classlist.findMany({
				where: {
					subdisciplineID: +subdisciplineID,
					levelID: +levelID,
				},
			})
			const categoryIDs = await classIDs.map((e) => e.categoryID)
			return db.tbl_category.findMany({
				where: {
					id: {
						in: categoryIDs,
					},
				},
			})
		}

		return db.tbl_category.findMany()
	},
	categoriesByName: (_: any, { name }: tbl_category, { db }: Context) => {
		return db.tbl_category.findMany({
			where: { name: { contains: name } },
		})
	},
	disciplines: (_: any, __: any, { db }: Context) => {
		return db.tbl_discipline.findMany()
	},
	discipline: (_: any, { id }: tbl_discipline, { db }: Context) => {
		return db.tbl_discipline.findUnique({
			where: { id },
		})
	},
	disciplinesByName: (_: any, { name }: tbl_discipline, { db }: Context) => {
		return db.tbl_discipline.findMany({
			where: { name: { contains: name } },
		})
	},
	disciplinesByType: (
		_: any,
		{ SGSlabel }: { SGSlabel: tbl_SGS },
		{ db }: Context
	) => {
		return db.tbl_discipline.findMany({
			where: {
				tbl_subdiscipline: {
					some: {
						tbl_classlist: {
							some: {
								SGSlabel: SGSlabel,
							},
						},
					},
				},
			},
		})
	},
	instruments: (_: any, __: any, { db }: Context) => {
		return db.tbl_instruments.findMany()
	},
	instrument: (_: any, { id }: tbl_instruments, { db }: Context) => {
		return db.tbl_instruments.findUnique({
			where: { id },
		})
	},
	levels: async (
		_: any,
		{ subdisciplineID }: tbl_classlist,
		{ db }: Context
	) => {
		if (subdisciplineID) {
			const classIDs = await db.tbl_classlist.findMany({
				where: { subdisciplineID: +subdisciplineID },
			})
			const levelIDs = await classIDs.map((e) => e.levelID)
			return db.tbl_level.findMany({
				where: {
					id: {
						in: levelIDs,
					},
				},
				orderBy: { order: 'asc' },
			})
		}
		return db.tbl_level.findMany({ orderBy: { order: 'asc' } })
	},

	level: (_: any, { id }: tbl_level, { db }: Context) => {
		return db.tbl_level.findUnique({
			where: { id },
		})
	},
	levelsByName: (_: any, { name }: tbl_level, { db }: Context) => {
		return db.tbl_level.findMany({
			where: { name: { contains: name } },
			orderBy: { order: 'asc' },
		})
	},
	sacredTitles: (_: any, __: any, { db }: Context) => {
		return db.tbl_sacred.findMany()
	},
	sacredTitle: (_: any, { id }: tbl_sacred, { db }: Context) => {
		return db.tbl_sacred.findUnique({
			where: { id },
		})
	},
	subdisciplines: (
		_: any,
		{ disciplineID }: tbl_subdiscipline,
		{ db }: Context
	) => {
		if (disciplineID) {
			return db.tbl_subdiscipline.findMany({
				where: { disciplineID: +disciplineID },
			})
		}
		return db.tbl_subdiscipline.findMany()
	},
	subdiscipline: (_: any, { id }: tbl_subdiscipline, { db }: Context) => {
		return db.tbl_subdiscipline.findUnique({
			where: { id },
		})
	},
	subdisciplinesByName: (
		_: any,
		{ name }: tbl_subdiscipline,
		{ db }: Context
	) => {
		return db.tbl_subdiscipline.findMany({
			where: { name: { contains: name } },
		})
	},
	subdisciplinesByType: (
		_: any,
		{ disciplineID, SGSlabel }: tbl_subdiscipline,
		{ db }: Context
	) => {
		if (SGSlabel && !disciplineID) {
			return db.tbl_subdiscipline.findMany({
				where: { SGSlabel },
			})
		} else if (SGSlabel && disciplineID) {
			return db.tbl_subdiscipline.findMany({
				where: { disciplineID: +disciplineID, SGSlabel },
			})
		}
	},
	trophies: (_: any, __: any, { db }: Context) => {
		return db.tbl_trophy.findMany()
	},
	trophy: (_: any, { id }: tbl_trophy, { db }: Context) => {
		return db.tbl_trophy.findUnique({
			where: { id },
		})
	},
	users: async (_: any, __: any, { db }: Context) => {
		return await db.tbl_user.findMany()
	},
}

export const Category = {
	classes: ({ id }: tbl_category, _: any, { db }: Context) => {
		return db.tbl_classlist.findMany({
			where: { categoryID: id },
		})
	},
}

export const Classlist = {
	category: ({ categoryID }: tbl_classlist, _: any, { db }: Context) => {
		return db.tbl_category.findUnique({
			where: { id: categoryID },
		})
	},

	level: ({ levelID }: tbl_classlist, _: any, { db }: Context) => {
		return db.tbl_level.findUnique({
			where: { id: levelID },
		})
	},

	subdiscipline: (
		{ subdisciplineID }: tbl_classlist,
		_: any,
		{ db }: Context
	) => {
		return db.tbl_subdiscipline.findUnique({
			where: { id: subdisciplineID },
		})
	},
	trophies: async ({ id }: tbl_classlist, _: any, { db }: Context) => {
		const classIDs = await db.tbl_class_trophy.findMany({
			where: { classID: id },
		})
		const trophyIDs = await classIDs.map((elem) => {
			return elem.trophyID
		})
		return db.tbl_trophy.findMany({
			where: {
				id: {
					in: trophyIDs,
				},
			},
		})
	},
}

export const Discipline = {
	subdisciplines: ({ id }: tbl_discipline, _: any, { db }: Context) => {
		return db.tbl_subdiscipline.findMany({
			where: { disciplineID: id },
		})
	},
}

export const Level = {
	classes: ({ id }: tbl_level, _: any, { db }: Context) => {
		return db.tbl_classlist.findMany({
			where: { levelID: id },
		})
	},
	categories: async (
		{ id }: tbl_level,
		{ categoryID }: tbl_classlist,
		{ db }: Context
	) => {
		let classIDs: tbl_classlist[]
		if (categoryID) {
			classIDs = await db.tbl_classlist.findMany({
				where: { categoryID, levelID: id },
			})
		} else {
			classIDs = await db.tbl_classlist.findMany({
				where: { levelID: id },
			})
		}
		const categoryIDs = await classIDs.map((e) => e.categoryID)
		return db.tbl_level.findMany({
			where: {
				id: {
					in: categoryIDs,
				},
			},
			orderBy: { order: 'asc' },
		})
	},
}

export const Sacred = {}
export const Subdiscipline = {
	classes: ({ id }: tbl_subdiscipline, _: any, { db }: Context) => {
		return db.tbl_classlist.findMany({
			where: { subdisciplineID: id },
		})
	},
	discipline: (
		{ disciplineID }: tbl_subdiscipline,
		_: any,
		{ db }: Context
	) => {
		return db.tbl_discipline.findUnique({
			where: { id: disciplineID },
		})
	},
	levels: async (
		{ id }: tbl_subdiscipline,
		{ levelID }: tbl_classlist,
		{ db }: Context
	) => {
		let classIDs: tbl_classlist[]
		if (levelID) {
			classIDs = await db.tbl_classlist.findMany({
				where: { levelID, subdisciplineID: id },
			})
		} else {
			classIDs = await db.tbl_classlist.findMany({
				where: { subdisciplineID: id },
			})
		}
		const levelIDs = await classIDs.map((e) => e.levelID)
		return db.tbl_level.findMany({
			where: {
				id: {
					in: levelIDs,
				},
			},
			orderBy: { order: 'asc' },
		})
	},
}

export const Trophy = {
	classes: async ({ id }: tbl_trophy, _: any, { db }: Context) => {
		const trophyIDs = await db.tbl_class_trophy.findMany({
			where: { trophyID: id },
		})
		const classIDs = await trophyIDs.map((elem) => {
			return elem.classID
		})
		return db.tbl_classlist.findMany({
			where: {
				id: {
					in: classIDs,
				},
			},
		})
	},
}
