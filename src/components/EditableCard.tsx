import React, {useState, useEffect} from "react";
import {
    IonCard,
    IonCardContent,
    IonTextarea,
    IonText
} from "@ionic/react"
import "./EditableCard.css";

interface CardProps {
    defaultTitle?: string
}

export const EditableCard: React.FC<CardProps> = ({defaultTitle}) => {
    // const [title, setTitle] = useState(defaultTitle || "Add Title");
    const [note, setNote] = useState("some dummy text");
    useEffect(() => {

    },[])
    return (
            /* <IonInput
            type="text" 
            placeholder="Title"
            inputmode="text"/> */
            <IonTextarea
            placeholder="Note..."
            // autoGrow={true}
            value={note}
            onIonChange={e => setNote(e.detail.value!)}/>
    )
  };