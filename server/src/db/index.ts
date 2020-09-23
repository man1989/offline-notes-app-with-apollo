import {Note} from "./models/Note";
import {connect, Model} from "mongoose";
class DB {
    models: {}
    constructor(){
        this.models = {}
    }
    async connect(url: string){
        await connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
        this._populateModels();
        return this;
    }

    private _populateModels(){
        this.models = {
            Note
        };
    }
}

export const db = new DB();