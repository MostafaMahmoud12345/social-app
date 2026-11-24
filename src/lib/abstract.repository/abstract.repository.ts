import { DeleteResult, HydratedDocument, Model, QueryFilter, QueryOptions, UpdateQuery } from "mongoose";

export abstract class AbstractRepository<T>{
    protected constructor (private model:Model<T>){}
    async create(data:T):Promise<HydratedDocument<T>>{
 return await this.model.create(data)
    }
    async update(filter:QueryFilter<T>,newData:UpdateQuery<T>,options?:QueryOptions):Promise<HydratedDocument<T>|null>{
        return await this.model.findOneAndUpdate(filter,newData,options)
    }
    async delete(filter:QueryFilter<T>):Promise<DeleteResult>{
        return await this.model.deleteOne(filter)
    }
    async getOne(filter:QueryFilter<T>):Promise<HydratedDocument<T>|null>{
        return await this.model.findOne(filter)
    }
    
}