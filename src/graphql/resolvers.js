const { PrismaClient } = require('@prisma/client')
const { resolvers: scalarResolvers } = require('graphql-scalars')
const db = new PrismaClient()

module.exports = {
  Query: {
    singleclass(_root, { id }) {
      return db.tbl_classlist.findUnique({
        where: { id },
      })
    },
    classes() {
      return db.tbl_classlist.findMany()
    },
    classNumber(_root, { classNumber }) {
      return db.tbl_classlist.findUnique({ where: { classNumber } })
    },
    categories() {
      return db.tbl_category.findMany()
    },
    category(_root, { id }) {
      return db.tbl_category.findUnique({
        where: { id },
      })
    },
    disciplines() {
      return db.tbl_discipline.findMany()
    },
    discipline(_root, { id }) {
      return db.tbl_discipline.findUnique({
        where: { id },
      })
    },
    levels() {
      return db.tbl_level.findMany()
    },
    level(_root, { id }) {
      return db.tbl_level.findUnique({
        where: { id },
      })
    },
    sacredTitles() {
      return db.tbl_sacred.findMany()
    },
    sacredTitle(_root, { id }) {
      return db.tbl_sacred.findUnique({
        where: { id },
      })
    },
    subdisciplines() {
      return db.tbl_subdiscipline.findMany()
    },
    subdiscipline(_root, { id }) {
      return db.tbl_subdiscipline.findUnique({
        where: { id },
      })
    },
    trophies() {
      return db.tbl_trophy.findMany()
    },
    trophy(root, { id }) {
      return db.tbl_trophy.findUnique({
        where: { id },
      })
    },
  },

  Category: {
    async classes(root) {
      return await db.tbl_classlist.findMany({
        where: { categoryID: root.id },
      })
    },
  },

  Classlist: {
    async discipline(root) {
      return await db.tbl_discipline.findUnique({
        where: { id: root.disciplineID },
      })
    },
    async subdiscipline(root) {
      return await db.tbl_subdiscipline.findUnique({
        where: { id: root.subdisciplineID },
      })
    },
    async category(root) {
      return await db.tbl_category.findUnique({
        where: { id: root.categoryID },
      })
    },
    async level(root) {
      return await db.tbl_level.findUnique({
        where: { id: root.levelID },
      })
    },
    async trophies(root) {
      const classIDs = await db.tbl_class_trophy.findMany({
        where: { classID: root.id },
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
  },

  Discipline: {
    async classes(root) {
      return await db.tbl_classlist.findMany({
        where: { disciplineID: root.id },
      })
    },
  },

  Sacred: {},
  Level: {
    async classes(root) {
      return await db.tbl_classlist.findMany({
        where: { levelID: root.id },
      })
    },
  },
  Subdiscipline: {
    async classes(root) {
      return await db.tbl_classlist.findMany({
        where: { subdisciplineID: root.id },
      })
    },
  },

  Trophy: {
    async classes(root) {
      const trophyIDs = await db.tbl_class_trophy.findMany({
        where: { trophyID: root.id },
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
  },
}
