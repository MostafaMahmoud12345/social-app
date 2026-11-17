"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.Provider = void 0;
var Provider;
(function (Provider) {
    Provider[Provider["local"] = 0] = "local";
    Provider[Provider["google"] = 1] = "google";
    Provider[Provider["facebook"] = 2] = "facebook";
})(Provider || (exports.Provider = Provider = {}));
var Gender;
(function (Gender) {
    Gender[Gender["male"] = 0] = "male";
    Gender[Gender["femaile"] = 1] = "femaile";
})(Gender || (exports.Gender = Gender = {}));
