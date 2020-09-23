import { IResolvers, PubSub } from "apollo-server"
const pubsub = new PubSub();
const NOTE_ADDED = "NOTE_ADDED";
export const resolvers: IResolvers = {
    Query: {
        notes: async (_source, {filter}, ctx) => {
            let filterObj = {}
            if(filter) {
                filter = decodeURIComponent(filter);
                filterObj = JSON.parse(filter);
            }
            let notes = await ctx.db.models.Note.find(filterObj);
            notes = notes.map((note: any) => note.toJSON());
            return notes;
        }
    },
    Mutation: {
        insert_notes: async (_, {objects}, ctx) => {
            const data  = await ctx.db.models.Note.create(objects);
            pubsub.publish(NOTE_ADDED, {notes: data});
            return data;
        },
        delete_notes: async(_, {objects}, ctx)=>{
            const filter = {note_id: {$in: objects}};
            const notes = await ctx.db.models.Note.find(filter);
            await ctx.db.models.Note.deleteMany(filter);
            return notes;
        }
    },

    Subscription: {
        notes: {
            subscribe(){
                return pubsub.asyncIterator([NOTE_ADDED]);
            }
        }
    }
}