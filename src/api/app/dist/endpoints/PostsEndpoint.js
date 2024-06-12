"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsEndpoint = void 0;
const Endpoint_1 = require("./Endpoint");
const HttpUtils_1 = require("../utils/HttpUtils");
const posts = [
    {
        id: 1,
        title: "My first post",
        content: "This is my first post",
    },
    {
        id: 2,
        title: "My second post",
        content: "This is my second post",
    },
    {
        id: 3,
        title: "My third post",
        content: "This is my third post",
    },
];
class PostsEndpoint extends Endpoint_1.Endpoint {
    get(_) {
        return __awaiter(this, void 0, void 0, function* () {
            return new HttpUtils_1.Response(200, JSON.stringify(posts.filter((post) => post.id === 1)));
        });
    }
}
exports.PostsEndpoint = PostsEndpoint;
