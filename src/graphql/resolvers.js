const { PrismaClient } = require('@prisma/client')
const { resolvers: scalarResolvers } = require('graphql-scalars')
const db = new PrismaClient()

module.exports = {
  Query: {
    singleclass(_root, { id }) {
      return db.tbl_wmfclasslist.findUnique({
        where: { id },
      })
    },
    classes() {
      return db.tbl_wmfclasslist.findMany()
    },
    classNumber(_root, { classNumber }) {
      return db.tbl_wmfclasslist.findUnique({ where: { classNumber } })
    },
    async category(_root, { id }) {
      return await db.tbl_category.findUnique({
        where: { id },
      })
    },
    async categoriesByName(_root, { name }) {
      return await db.tbl_category.findMany({
        where: { name: { contains: name } },
      })
    },
    async disciplines() {
      return await db.tbl_discipline.findMany()
    },
    async discipline(_root, { id }) {
      return await db.tbl_discipline.findUnique({
        where: { id },
      })
    },
    async disciplinesByName(_root, { name }) {
      return await db.tbl_discipline.findMany({
        where: { name: { contains: name } },
      })
    },
    async levels() {
      return await db.tbl_level.findMany()
    },
    async level(_root, { id }) {
      return await db.tbl_level.findUnique({
        where: { id },
      })
    },
    async levelsByName(_root, { name }) {
      return await db.tbl_level.findMany({
        where: { name: { contains: name } },
      })
    },
    async sacredTitles() {
      return await db.tbl_sacred.findMany()
    },
    async sacredTitle(_root, { id }) {
      return await db.tbl_sacred.findUnique({
        where: { id },
      })
    },
    async soloGroupSchool(_root, { sgs }) {
      return await db.tbl_classlist.findMany({
        where: { SGS: sgs },
      })
    },
    async subdisciplines() {
      return await db.tbl_subdiscipline.findMany()
    },
    async subdiscipline(_root, { id }) {
      return await db.tbl_subdiscipline.findUnique({
        where: { id },
      })
    },
    async subdisciplinesByName(_root, { name }) {
      return await db.tbl_subdiscipline.findMany({
        where: { name: { contains: name } },
      })
    },
    async trophies() {
      return await db.tbl_trophy.findMany()
    },
    async trophy(root, { id }) {
      return await db.tbl_trophy.findUnique({
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
      return await db.tbl_trophy.findMany({
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
      return await db.tbl_classlist.findMany({
        where: {
          id: {
            in: classIDs,
          },
        },
      })
    },
  },
}
