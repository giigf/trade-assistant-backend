"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trade = void 0;
// src/trade/trade.entity.ts
var user_entity_1 = require("../user/user.entity");
var typeorm_1 = require("typeorm");
var Trade = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('trades')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _date_start_decorators;
    var _date_start_initializers = [];
    var _date_start_extraInitializers = [];
    var _date_end_decorators;
    var _date_end_initializers = [];
    var _date_end_extraInitializers = [];
    var _note_decorators;
    var _note_initializers = [];
    var _note_extraInitializers = [];
    var _start_price_decorators;
    var _start_price_initializers = [];
    var _start_price_extraInitializers = [];
    var _end_price_decorators;
    var _end_price_initializers = [];
    var _end_price_extraInitializers = [];
    var Trade = _classThis = /** @class */ (function () {
        function Trade_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.user = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.userId = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.date_start = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _date_start_initializers, void 0));
            this.date_end = (__runInitializers(this, _date_start_extraInitializers), __runInitializers(this, _date_end_initializers, void 0));
            this.note = (__runInitializers(this, _date_end_extraInitializers), __runInitializers(this, _note_initializers, void 0));
            this.start_price = (__runInitializers(this, _note_extraInitializers), __runInitializers(this, _start_price_initializers, void 0));
            this.end_price = (__runInitializers(this, _start_price_extraInitializers), __runInitializers(this, _end_price_initializers, void 0));
            __runInitializers(this, _end_price_extraInitializers);
        }
        return Trade_1;
    }());
    __setFunctionName(_classThis, "Trade");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _user_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (user) { return user.trades; }, { eager: true }), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        _userId_decorators = [(0, typeorm_1.Column)()];
        _date_start_decorators = [(0, typeorm_1.Column)({ type: 'timestamp' })];
        _date_end_decorators = [(0, typeorm_1.Column)({ type: 'timestamp' })];
        _note_decorators = [(0, typeorm_1.Column)()];
        _start_price_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })];
        _end_price_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _date_start_decorators, { kind: "field", name: "date_start", static: false, private: false, access: { has: function (obj) { return "date_start" in obj; }, get: function (obj) { return obj.date_start; }, set: function (obj, value) { obj.date_start = value; } }, metadata: _metadata }, _date_start_initializers, _date_start_extraInitializers);
        __esDecorate(null, null, _date_end_decorators, { kind: "field", name: "date_end", static: false, private: false, access: { has: function (obj) { return "date_end" in obj; }, get: function (obj) { return obj.date_end; }, set: function (obj, value) { obj.date_end = value; } }, metadata: _metadata }, _date_end_initializers, _date_end_extraInitializers);
        __esDecorate(null, null, _note_decorators, { kind: "field", name: "note", static: false, private: false, access: { has: function (obj) { return "note" in obj; }, get: function (obj) { return obj.note; }, set: function (obj, value) { obj.note = value; } }, metadata: _metadata }, _note_initializers, _note_extraInitializers);
        __esDecorate(null, null, _start_price_decorators, { kind: "field", name: "start_price", static: false, private: false, access: { has: function (obj) { return "start_price" in obj; }, get: function (obj) { return obj.start_price; }, set: function (obj, value) { obj.start_price = value; } }, metadata: _metadata }, _start_price_initializers, _start_price_extraInitializers);
        __esDecorate(null, null, _end_price_decorators, { kind: "field", name: "end_price", static: false, private: false, access: { has: function (obj) { return "end_price" in obj; }, get: function (obj) { return obj.end_price; }, set: function (obj, value) { obj.end_price = value; } }, metadata: _metadata }, _end_price_initializers, _end_price_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Trade = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Trade = _classThis;
}();
exports.Trade = Trade;
