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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
var axios_1 = require("axios");
var cheerio = require("cheerio");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var OXYLABS_URL = process.env.OXYLABS_URL || "";
var AUTH = {
    username: process.env.OXYLABS_USERNAME || "",
    password: process.env.OXYLABS_PASSWORD || "",
};
// 🔹 Amazon API
function fetchAmazon(query) {
    return __awaiter(this, void 0, void 0, function () {
        var res, items, err_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post(OXYLABS_URL, {
                            source: "amazon_search",
                            query: query,
                            geo_location: "90210",
                            parse: true,
                        }, { auth: AUTH, headers: { "Content-Type": "application/json" } })];
                case 1:
                    res = _d.sent();
                    items = ((_c = (_b = (_a = res.data.results[0]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.results) === null || _c === void 0 ? void 0 : _c.paid) || [];
                    return [2 /*return*/, items.map(function (p) { return ({
                            title: p.title,
                            price: p.price,
                            currency: p.currency || "USD",
                            image: p.url_image,
                            url: p.url,
                            source: "Amazon",
                        }); })];
                case 2:
                    err_1 = _d.sent();
                    console.error("Amazon fetch error:", err_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 🔹 Flipkart API
function fetchFlipkart(query) {
    return __awaiter(this, void 0, void 0, function () {
        var res, html, $_1, products_1, err_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post(OXYLABS_URL, { source: "flipkart_search", query: query }, { auth: AUTH, headers: { "Content-Type": "application/json" } })];
                case 1:
                    res = _c.sent();
                    html = ((_b = (_a = res.data.results[0]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.content) || "";
                    $_1 = cheerio.load(html);
                    products_1 = [];
                    $_1("a").each(function (_, el) {
                        var title = $_1(el).find("div._4rR01T").text() ||
                            $_1(el).find("a.s1Q9rs").attr("title");
                        var priceText = $_1(el).find("div._30jeq3").text().replace(/[₹,]/g, "");
                        var price = parseFloat(priceText) || 0;
                        var image = $_1(el).find("img").attr("src") || "";
                        var url = "https://www.flipkart.com" + ($_1(el).attr("href") || "");
                        if (title && price > 0) {
                            products_1.push({
                                title: title,
                                price: price,
                                currency: "INR",
                                image: image,
                                url: url,
                                source: "Flipkart",
                            });
                        }
                    });
                    return [2 /*return*/, products_1];
                case 2:
                    err_2 = _c.sent();
                    console.error("Flipkart fetch error:", err_2);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 🔹 API Route
app.get("/api/products", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, amazon, flipkart, combined;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                query = req.query.q;
                if (!query) {
                    return [2 /*return*/, res.status(400).json({ error: "Query is required" })];
                }
                return [4 /*yield*/, Promise.all([
                        fetchAmazon(query),
                        fetchFlipkart(query),
                    ])];
            case 1:
                _a = _b.sent(), amazon = _a[0], flipkart = _a[1];
                combined = __spreadArray(__spreadArray([], amazon, true), flipkart, true).sort(function (a, b) { return a.price - b.price; });
                res.json(combined);
                return [2 /*return*/];
        }
    });
}); });
app.listen(PORT, function () { return console.log("\uD83D\uDE80 Backend running on http://localhost:".concat(PORT)); });
