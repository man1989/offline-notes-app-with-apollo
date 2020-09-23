import { gql } from "apollo-server";

export const typeDefs = gql`
    input notes_insert_input {
        note_id: String!
        title: String!
        text: String!
        created_at: String
        updated_at: String
        is_deleted: Boolean        
    }

    type Note {
        note_id: String!
        title: String
        text: String
        created_at: String
        updated_at: String
        is_deleted: Boolean
    }

    type Query {
        notes(filter: String): [Note]
    }

    type Mutation {
        insert_notes(objects: [notes_insert_input!]!): [Note]
        delete_notes(objects: [String!]!): [Note]
    }

    type Subscription {
        notes : [Note]
    }  
`;