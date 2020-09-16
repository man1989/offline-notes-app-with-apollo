import React, { useState, useEffect, useRef } from "react";
import {
    IonTextarea,
    IonInput,
    IonContent,
    IonButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTabBar,
    IonFooter
} from "@ionic/react"
import "./EditableCard.css";

interface CardProps {

    note?: { text: string, title: string };
    onChange?: (data: any) => void;
    onDismissModal(args: any): void;
}

export const EditableCard: React.FC<CardProps> = ({ note, onChange, onDismissModal }) => {
    const [autoGrow, setAutoGrow] = useState(true)

    const textareaRef: any = useRef(null);
    useEffect(() => {
        console.dir(textareaRef.current)
    },[]);
    const [title, setTitle] = useState(note?.title);
    const [text, setText] = useState(note?.text);

    const handleSave = () => {
        const data = { title: title, text: text};
        onDismissModal(data);
    }
    return (
        <>
            <IonContent className="ion-padding">
                <IonInput
                    type="text"
                    placeholder="Title"
                    inputmode="text"
                    value={title}
                    onIonChange={(e) => {
                        const title = e.detail.value!
                        setTitle(title);
                    }}
                />
                <IonTextarea
                    autoGrow={autoGrow}
                    ref={textareaRef}
                    placeholder="Note..."
                    value={text}
                    debounce={100}
                    onIonChange={e => {
                        setText(e.detail.value!);
                    }}
                />
            </IonContent>
            <IonButton onClick={handleSave}>Done</IonButton>
            <IonButton onClick={handleSave}>Delete</IonButton>
        </>
    )
};