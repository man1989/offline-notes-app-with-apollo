import React, { SyntheticEvent } from 'react';
import './ExploreContainer.css';
import {
  IonGrid,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonIcon,
  IonText
} from '@ionic/react';

import { checkmarkCircle as checkIcon, card } from "ionicons/icons";

interface note {
  note_id: string
  title: string;
  text: string
}
interface ContainerProps {
  notes: Array<note>
  onEdit(args: any): void
}

const Card: React.FC<{ note: note, onEdit(args: any):  void }> = ({ note, onEdit }) => {
  const handleClick = (event: SyntheticEvent) => {
    const elem = event.nativeEvent.target as HTMLElement;
    const cardElem = elem.closest(".explore-containr-card");
    const title = cardElem?.querySelector("ion-card-title")?.innerText;
    const text = cardElem?.querySelector("ion-card-content")?.innerText;
    onEdit({title: title, text: text});
  }
  return (
    <IonCard 
    color="tertiary" 
    className="explore-containr-card" 
    style={{"maxHeight": "200px"}}
    onClick={handleClick}>
      <IonCardHeader>
        <IonCardTitle>{note.title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonText>
          {note.text}
        </IonText>
      </IonCardContent>
    </IonCard>
  )
}
const ExploreContainer: React.FC<ContainerProps> = ({ notes, onEdit }) => {
  console.log("notes");
  return (
    <IonGrid>
      <IonRow>
        {
          notes.map((note) => {
            return (
              <IonCol key={note.note_id} className="col col-25">
                <Card note={note} onEdit={onEdit}/>
              </IonCol>
            );
          })
        }
      </IonRow>
    </IonGrid>
  );
};

export default ExploreContainer;
