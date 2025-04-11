import React, { useState } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Folder from './Folder';
import Card from './Card';
import FolderForm from './FolderForm';
import CardForm from './CardForm';

const ContentContainer = styled.main`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ContentTitle = styled.h2`
  margin: 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const ItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const MainContent = ({
  folders,
  cards,
  showingAllCards,
  currentFolder,
  createFolder,
  createCard,
  deleteFolder,
  deleteCard,
  showFolder,
  showAllCards
}) => {
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  
  const handleCreateFolder = (name) => {
    createFolder(name);
    setShowFolderForm(false);
  };
  
  const handleCreateCard = (front, back) => {
    createCard(front, back, currentFolder);
    setShowCardForm(false);
  };
  
  const getCurrentFolderName = () => {
    if (showingAllCards) return 'All Cards';
    if (currentFolder) {
      const folder = folders.find(f => f.id === currentFolder);
      return folder ? folder.name : 'Unknown Folder';
    }
    return '';
  };
  
  const visibleCards = showingAllCards 
    ? cards 
    : cards.filter(card => card.folderId === currentFolder);

  return (
    <ContentContainer>
      <ContentHeader>
        <ContentTitle>
          {showingAllCards ? 'Folders & Cards' : `Folder: ${getCurrentFolderName()}`}
        </ContentTitle>
        <ButtonsContainer>
          <Button onClick={() => setShowFolderForm(true)}>New Folder</Button>
          <Button onClick={() => setShowCardForm(true)}>New Card</Button>
          {!showingAllCards && (
            <Button onClick={showAllCards}>Back to All</Button>
          )}
        </ButtonsContainer>
      </ContentHeader>
      
      {showFolderForm && (
        <FolderForm onSubmit={handleCreateFolder} onCancel={() => setShowFolderForm(false)} />
      )}
      
      {showCardForm && (
        <CardForm onSubmit={handleCreateCard} onCancel={() => setShowCardForm(false)} />
      )}
      
      <Droppable droppableId="all-items" type="FOLDER">
        {(provided) => (
          <ItemsContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {showingAllCards && folders.map((folder, index) => (
              <Folder 
                key={folder.id}
                folder={folder}
                index={index}
                onDelete={() => deleteFolder(folder.id)}
                onSelect={() => showFolder(folder.id)}
              />
            ))}
            
            {visibleCards.map((card, index) => (
              <Card 
                key={card.id}
                card={card}
                index={index}
                onDelete={() => deleteCard(card.id)}
              />
            ))}
            {provided.placeholder}
          </ItemsContainer>
        )}
      </Droppable>
    </ContentContainer>
  );
};

export default MainContent;