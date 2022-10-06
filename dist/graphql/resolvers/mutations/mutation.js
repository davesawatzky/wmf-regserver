"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
var auth_1 = require("./auth");
var regmutations_1 = require("./regmutations");
var performerMutations_1 = require("./performerMutations");
var schoolMutations_1 = require("./schoolMutations");
var teacherMutations_1 = require("./teacherMutations");
var groupMutations_1 = require("./groupMutations");
var communityMutations_1 = require("./communityMutations");
var classMutations_1 = require("./classMutations");
var selectionMutations_1 = require("./selectionMutations");
exports.Mutation = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, auth_1.AuthMutations), regmutations_1.RegistrationMutations), performerMutations_1.PerformerMutations), schoolMutations_1.SchoolMutations), teacherMutations_1.TeacherMutations), groupMutations_1.GroupMutations), communityMutations_1.CommunityMutations), classMutations_1.RegisteredClassMutations), selectionMutations_1.SelectionMutations);
//# sourceMappingURL=mutation.js.map