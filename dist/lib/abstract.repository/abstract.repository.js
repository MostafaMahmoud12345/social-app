"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
class AbstractRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return await this.model.create(data);
    }
    async update(filter, newData, options) {
        return await this.model.findOneAndUpdate(filter, newData, options);
    }
    async delete(filter) {
        return await this.model.deleteOne(filter);
    }
    async getOne(filter) {
        return await this.model.findOne(filter);
    }
}
exports.AbstractRepository = AbstractRepository;
