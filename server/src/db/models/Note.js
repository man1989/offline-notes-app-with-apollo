"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = exports.NoteSchema = void 0;
const mongoose_1 = require("mongoose");
exports.NoteSchema = new mongoose_1.Schema({
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
        transform: (date) => {
            return date.toISOString();
        }
    },
    updated_at: {
        type: Date,
        transform: (date) => {
            return date.toISOString();
        },
        default: Date.now
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});
exports.Note = mongoose_1.model("Note", exports.NoteSchema);
