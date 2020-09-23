export const NotesSchema = {
    "title": "Notes Schema",
    "version": 0,
    "description": "Notes Schems which will store notes data",
    "type": "object",
    "properties": {
        "note_id": {
            "type": "string",
            "primary": true
        },
        "title": {
            "type": "string"
        },
        "text": {
            "type": "string"
        },
        "created_at": {
            "type": "string",
            "format": "date-time"
        },
        "updated_at": {
            "type": "string",
            "format": "date-time"
        },
        "is_deleted": {
            "type": "boolean",
            "default": false
        }
    },
    "required": ["note_id", "title", "text", "created_at", "updated_at"]
}