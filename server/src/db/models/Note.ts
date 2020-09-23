import {Schema, model, Document} from "mongoose";
interface INote extends Document {
    note_id: String,
    title: String,
    text: String,
    created_at: Date,
    updated_at: Date,
    is_deleted: Boolean
}

export const NoteSchema = new Schema({
    note_id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        transform: (date: Date) => {
            return date.toISOString();
        }        
    },
    updated_at: {
        type: Date,
        transform: (date: Date) => {
            return date.toISOString();
        },        
        default: Date.now
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

export const Note = model<INote>("Note", NoteSchema);