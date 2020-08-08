import React, { useState } from 'react';
import './ExploreContainer.css';
import {
  IonGrid,
  IonRow
} from '@ionic/react';
import {EditableCard} from "./EditableCard"

interface ContainerProps { }


const ExploreContainer: React.FC<ContainerProps> = () => {
  return (
    <IonGrid>
      <IonRow className="ion-justify-content-around">
        {/* <EditableCard defaultTitle="Long title long long ago"/>
        <EditableCard/>
        <EditableCard/> */}
      </IonRow>
    </IonGrid>
  );
};

export default ExploreContainer;
