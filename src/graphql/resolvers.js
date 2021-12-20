const { PrismaClient } = require('@prisma/client')
const { resolvers: scalarResolvers } = require('graphql-scalars')
const db = new PrismaClient()

module.exports = {
  Query: {
    wmfclass(_root, { id }) {
      return db.tbl_wmfclasslist.findUnique({
        where: { id },
      })
    },
    wmfclasses() {
      return db.tbl_wmfclasslist.findMany()
    },
    wmfclassNumber(_root, { classNumber }) {
      return db.tbl_wmfclasslist.findUnique({ where: { classNumber } })
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
    async classes(parent) {
      return await db.tbl_wmfclasslist.findMany({
        where: { id: parent.category },
      })
    },
  },
  ClassTrophy: {},
  Discipline: {},
  Sacred: {},
  Level: {},
  Subdiscipline: {},
  Trophy: {},

  Wmfclasslist: {
    async discipline(parent) {
      return await db.tbl_discipline.findUnique({
        where: { id: parent.discipline },
      })
    },
    async subdiscipline(parent) {
      return await db.tbl_subdiscipline.findUnique({
        where: { id: parent.subdiscipline },
      })
    },
    async category(parent) {
      return await db.tbl_category.findUnique({
        where: { id: parent.category },
      })
    },
    async level(parent) {
      return await db.tbl_levels.findUnique({
        where: { id: parent.level },
      })
    },
  },
}
