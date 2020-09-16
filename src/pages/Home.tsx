import {
  IonContent, IonHeader, IonPage, IonTitle,
  IonToolbar, IonFab, IonIcon, IonButton,
  IonFabButton, IonModal, IonLoading
} from '@ionic/react';
import React, { useState, useEffect, useRef } from 'react';
import { add as addIcon } from "ionicons/icons";
import './Home.css';
import ExploreContainer from '../components/ExploreContainer';
import { EditableCard } from "../components/EditableCard";
import { useDatabase } from "../data/useDatabase";

type note = {
  note_id: string;
  text: string;
  title: string
}

const Home: React.FC = () => {
  const {isReady, insertNote, notes} = useDatabase();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [note, setOngoingNote] = useState<note>({ note_id: "", title: "", text: "" });
  // const [notes, setNote] = useState<Array<note>>([]);
  // const [untitledCount, setUntitledCount] = useState(1);
  if(!isReady) {
    return <IonLoading isOpen/>
  }
  console.log("rendered: Home");
  const handleSave = (data: note) => {
    console.log("handleSave: ", data);
    insertNote && insertNote(data);
    setShowModal(false);
    // setUntitledCount((prevCount) => {
    //   if (!note.title) {
    //     return prevCount + 1;
    //   }
    //   return prevCount;
    // });
    // setNote((prevState) => {
    //   const customNote = { title: note.title || `untitled ${untitledCount}`, text: note.text };
    //   return [...prevState, customNote]
    // });
  }
  const onEditHandler = (data: any) => {
    console.log(data);
    setOngoingNote(data);
    setShowModal(true);
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ExploreContainer notes={notes} onEdit={onEditHandler}/>
        <IonModal
          isOpen={showModal}
          cssClass='my-custom-class'
          swipeToClose={true}
          onDidDismiss={() => setShowModal(false)}
        >
          <EditableCard
          onDismissModal={handleSave}
          onChange={setOngoingNote}
          note={note}/>
        </IonModal>
        <IonFab vertical="bottom" horizontal="end"  slot="fixed">
          <IonFabButton onClick={() => { setShowModal(true) }} color="primary tint">
            <IonIcon icon={addIcon} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
