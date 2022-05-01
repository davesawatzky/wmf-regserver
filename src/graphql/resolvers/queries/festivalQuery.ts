import {
  tbl_category,
  tbl_classlist,
  tbl_discipline,
  tbl_level,
  tbl_sacred,
  tbl_subdiscipline,
  tbl_trophy,
} from '@prisma/client'
import { Context } from '../../../index'

export const festivalQueries = {
  classById: (_: any, { id }: tbl_classlist, { db }: Context) => {
    return db.tbl_classlist.findUnique({
      where: { id },
    })
  },
  classes: (_: any, __: any, { db }: Context) => {
    return db.tbl_classlist.findMany()
  },
  classNumber: (_: any, { classNumber }: tbl_classlist, { db }: Context) => {
    return db.tbl_classlist.findUnique({ where: { classNumber } })
  },
  category: (_: any, { id }: tbl_category, { db }: Context) => {
    return db.tbl_category.findUnique({
      where: { id },
    })
  },
  categories: (_: any, __: any, { db }: Context) => {
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
  levels: (_: any, __: any, { db }: Context) => {
    return db.tbl_level.findMany()
  },
  level: (_: any, { id }: tbl_level, { db }: Context) => {
    return db.tbl_level.findUnique({
      where: { id },
    })
  },
  levelsByName: (_: any, { name }: tbl_level, { db }: Context) => {
    return db.tbl_level.findMany({
      where: { name: { contains: name } },
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
  soloGroupSchool: (_: any, { SGS }: tbl_classlist, { db }: Context) => {
    return db.tbl_classlist.findMany({
      where: { SGS },
    })
  },
  subdisciplines: (_: any, __: any, { db }: Context) => {
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
  discipline: ({ disciplineID }: tbl_classlist, _: any, { db }: Context) => {
    return db.tbl_discipline.findUnique({
      where: { id: disciplineID },
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
  classes: ({ id }: tbl_discipline, _: any, { db }: Context) => {
    return db.tbl_classlist.findMany({
      where: { disciplineID: id },
    })
  },
}

export const Sacred = {}

export const Level = {
  classes: ({ id }: tbl_level, _: any, { db }: Context) => {
    return db.tbl_classlist.findMany({
      where: { levelID: id },
    })
  },
}

export const Subdiscipline = {
  classes: ({ id }: tbl_subdiscipline, _: any, { db }: Context) => {
    return db.tbl_classlist.findMany({
      where: { subdisciplineID: id },
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
