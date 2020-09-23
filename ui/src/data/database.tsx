import * as RxDB from 'rxdb';
import {isPlatform} from "@ionic/react";
import { NotesSchema } from './Schema';
import {v4 as uuidv4} from "uuid";
import {RxDBValidatePlugin} from 'rxdb/plugins/validate';
import {RxDBReplicationGraphQLPlugin} from 'rxdb/plugins/replication-graphql';
import { RxDBEncryptionPlugin } from 'rxdb/plugins/encryption'
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { update } from 'rxdb/dist/types/plugins/update';

RxDB.addRxPlugin(RxDBValidatePlugin);
RxDB.addRxPlugin(RxDBReplicationGraphQLPlugin);
RxDB.addRxPlugin(RxDBEncryptionPlugin);
let adapter = "idb";

if(isPlatform("hybrid")){
    RxDB.addRxPlugin(require('pouchdb-adapter-cordova-sqlite'));
    adapter = "cordova-sqlite";
}else{
    RxDB.addRxPlugin(require('pouchdb-adapter-idb'));
}

function getEndpoint(protocol: string){
    return `${protocol}://localhost:4000/graphql`
    // return `${protocol}://localhost:8080/v1/graphql`
}

export const createDb = async () => {
    console.log('DatabaseService: creating database..');

    const db = await RxDB.createRxDatabase({
        name: 'notes',
        adapter: adapter,
        password: '|8S_~|nC1>Vf&-9',
        eventReduce: true,
        pouchSettings: {
            location: "default"
        }
    });

    console.log('DatabaseService: created database');
    (window as any).db = db;

    const notes = await db.collection({
        name: 'notes',
        schema: NotesSchema
     });

     notes.preInsert((note) => {
        note.note_id = note.note_id || uuidv4();
        note.created_at = note.created_at || new Date().toISOString();
        note.updated_at = note.updated_at || new Date().toISOString();
    }, false);

    return db;
};

const batchSize = 5;
const pullQueryBuilder = () => {
    return (doc: any) => {
        if (!doc) {
            doc = {
                id: '',
                updated_at: new Date(0).toUTCString()
            };
        }
        const filter = "{\"updated_at\": {\"$gt: \""+doc.updated_at+"\"}}";
        console.log("Filter: ", filter);
        const query = `{
            notes(
                filter: "${encodeURIComponent( JSON.stringify({updated_at: {$gt: doc.updated_at}}))}"
            ) {
                note_id
                title
                text
                created_at
                updated_at
                is_deleted
            }
        }`;
        console.log(query);
        return {
            query,
            variables: {}
        };
    };
};

const pushQueryBuilder = ( doc:any )=> {
    const query = `
        mutation InsertNotes($note: [notes_insert_input!]!) {
            insert_notes(
                objects: $note){
                  note_id
              }
       }
    `;
    const variables = {
        note: doc
    };

    return {
        query,
        variables
    };
};

export class GraphQLReplicator {
    db:any;
    replicationState:any;
    subscriptionClient:any;
    constructor(db: any) {
        this.db = db;
        this.replicationState = null;
        this.subscriptionClient = null;      
    }

    async restart() {
        if(this.replicationState) {
            this.replicationState.cancel();
        }

        if(this.subscriptionClient) {
            this.subscriptionClient.close();
        }

        this.replicationState = await this.setupGraphQLReplication();
        this.subscriptionClient = this.setupGraphQLSubscription(this.replicationState);
        // await this.replicationState.awaitInitialReplication();
    }

    async setupGraphQLReplication() {
        const replicationState = this.db.notes.syncGraphQL({
           url: getEndpoint("http"),
           pull: {
               queryBuilder: pullQueryBuilder()
           },
           push: {
               queryBuilder: pushQueryBuilder,
               bathSize: batchSize
           },
           live: true,
           /**
            * Because the websocket is used to inform the client
            * when something has changed,
            * we can set the liveIntervall to a high value
            */
           liveInterval: 1000*60*10, // 10 minutes
           deletedFlag: 'is_deleted'
       });
       console.log("run after");
       console.dir(replicationState);
       replicationState.error$.subscribe((err: any) => {
           console.error('replication error:');
           console.dir(err);
       });

       return replicationState;
    }
   
    setupGraphQLSubscription(replicationState: any) {
        const endpointUrl = getEndpoint("ws");
        const wsClient = new SubscriptionClient(endpointUrl, {
            reconnect: true,
            timeout: 1000 * 60,
            connectionCallback: () => {
                console.log('SubscriptionClient.connectionCallback:');
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
    
        const ret = wsClient.request({ query });
    
        ret.subscribe({
            next(data) {
                console.log('subscription emitted => trigger run');
                console.dir(data);
                replicationState.run();
            },
            error(error) {
                console.log('got error:');
                console.dir(error);
            }
        });
        return wsClient;
    }    
}
