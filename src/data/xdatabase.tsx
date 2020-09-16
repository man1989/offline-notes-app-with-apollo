import { isPlatform } from "@ionic/react";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { createRxDatabase, addRxPlugin, RxDatabase, RxReplicationState, RxDocument } from "rxdb";
import { RxDBReplicationGraphQLPlugin, RxGraphQLReplicationState } from "rxdb/plugins/replication-graphql";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBValidatePlugin } from "rxdb/plugins/validate";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { NotesSchema } from "./Schema";
import { RxGraphQLReplicationQueryBuilderResponse } from "rxdb/dist/types/types";
addRxPlugin(RxDBReplicationGraphQLPlugin);
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBValidatePlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

class ReplicateData {
    syncUrl: string = "http://localhost:8080/v1/graphql";
    subscriptionUrl: string = "ws://localhost:8080/v1/graphql";
    batchsize: number = 5;
    private replicationState = {} as RxGraphQLReplicationState;

    pullQueryBuilder(doc: any): RxGraphQLReplicationQueryBuilderResponse {
        if (!doc) {
            doc = {
                note_id: "",
                updated_at: new Date(0).toISOString()
            }
        }
        const query = `{
                notes(
                    where: {
                        _or: [
                            {
                                updated_at: {_gt: "${doc.updated_at}"},
                            }
                            {
                                note_id: { _eq: "${doc.note_id}" } ,
                                updated_at: {_eq: "${doc.updated_at}"}
                            }
                        ]
                    },
                    order_by: [{updated_at: asc}, {note_id: asc}]
                ){
                    note_id
                    title
                    text
                    created_at
                    updated_at
                    is_deleted
                }
            }`;
        return {
            query,
            variables: {}
        }
    }

    async setupReplication(db: RxDatabase) {
        this.replicationState = db.notes.syncGraphQL({
            url: this.syncUrl,
            pull: {
                queryBuilder: this.pullQueryBuilder,
            },
            deletedFlag: "is_deleted",
            live: true,
            liveInterval: (60 * 1000 * 10)
        });
        this.replicationState.error$.subscribe(err => {
            console.error('replication error:');
            console.dir(err);
        });
    }

    setupSubscription(replicationState: any) {
        const client = new SubscriptionClient(this.subscriptionUrl, {
            reconnect: true,
            timeout: 1000 * 60,
            connectionCallback: (error, result) => {
                console.log("error: ", error, result);
                if (error) {
                    console.log("Error while connecting subscription: ", error);
                    return;
                }
                console.log("Subscription client connected");
            },
            reconnectionAttempts: 10000,
            inactivityTimeout: 10 * 1000,
            lazy: true
        });
        const query = `subscription onNotesChanged {
            notes {
                note_id
                updated_at
                is_deleted
            }
        }`;
        const ret = client.request({ query });
        ret.subscribe({
            next(data) {
                console.log("change occured: ", data);
                replicationState.run();
            },
            error(error) {
                console.error(`error on request subscribe: `, error);
            }
        });
        return ret;
    }
}

export default class Database {
    private static _instance: RxDatabase;
    private adapter: string = "idb";
    dbName: string = "dummy-db";
    replicateData: ReplicateData;

    private constructor() {
        if (isPlatform("hybrid")) {
            addRxPlugin(require("pouchdb-adapter-cordova-sqlite"));
            this.adapter = "node-cordova-sqlite";
        } else {
            addRxPlugin(require("pouchdb-adapter-idb"));
        }
        this.replicateData = new ReplicateData();
    }

    async create() {
        const db = await createRxDatabase({
            name: this.dbName,
            adapter: this.adapter
        });
        console.log("Database service has been created");
        if (window) {
            (window as any).db = db;
        }
        const notes = await db.collection({
            name: "notes",
            schema: NotesSchema
        });
        notes.preInsert((note) => {
            note.created_at = note.created_at || new Date().toISOString();
            note.updated_at = note.updated_at || new Date().toISOString();
        }, false);
        console.log("hooks created");
        await this.replicateData.setupReplication(db);  
        console.log("replication setup done");
        return db;
    }

    public static async get() {
        if (!Database._instance) {
            const database = new Database();
            Database._instance = await database.create();
        }
        return Database._instance;
    }
}

