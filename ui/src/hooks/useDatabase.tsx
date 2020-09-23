import React, {useState, useEffect} from "react";
import {createDb, GraphQLReplicator} from "../data/database";
import { RxDatabase } from "rxdb";
interface Note{
    note_id: string;
    title: string
    text: string;
}
export const useDatabase = () => {
    const [db, setDBInstance] = useState<RxDatabase>();
    const [notes, setNotes] = useState<Array<Note>>([]);
    useEffect(() => {
        console.log("init DB");
        (async() => {
            const db = await createDb();
            const grpqlReplicator = new GraphQLReplicator(db);
            await grpqlReplicator.restart();
            // await grpqlReplicator.replicationState.awaitInitialReplication();
            // const db = await Database.get();
            // console.log("database created", db);
            await db.notes.find().$.subscribe((notes) => {
                console.log("you babay", notes);    
                setNotes(notes);
            });
            setDBInstance(db);
            // console.log("setup finished");
        })()
    }, []);
    if(!db){
        return {
            isReady: false,
            notes
        }
    }
    const insertNote = async (note: Note) => {
        db.notes.insert(note);
    }
    return {
        isReady: true,
        insertNote,
        notes
    }
}