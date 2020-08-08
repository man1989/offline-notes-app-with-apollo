import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonIcon, IonButton, IonFabButton, IonModal } from '@ionic/react';
import React, { useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import {add as addIcon} from "ionicons/icons";
import './Home.css';
import {EditableCard} from "../components/EditableCard";
const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Todo App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
      </IonContent>
      <IonModal 
      isOpen={showModal} 
      cssClass='my-custom-class' 
      swipeToClose={true}
      onDidDismiss={() => setShowModal(false)}>
        <EditableCard/>
        <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
      </IonModal>      
      <IonFab vertical="bottom" horizontal="end">
        <IonFabButton onClick = {()=>{setShowModal(true)}}>
          <IonIcon icon={addIcon}/>
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default Home;
