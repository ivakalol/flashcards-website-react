import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Header from './components/Header';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [folders, setFolders] = useState([]);
  const [cards, setCards] = useState([]);
  const [showingAllCards, setShowingAllCards] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null);
  
  // Load folders and cards from localStorage on component mount
  useEffect(() => {
    const storedFolders = JSON.parse(localStorage.getItem('folders')) || [];
    const storedCards = JSON.parse(localStorage.getItem('cards')) || [];
    setFolders(storedFolders);
    setCards(storedCards);
  }, []);
  
  // Save folders and cards to localStorage when they change
  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);
  
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);
  
  // Handle drag end for folders and cards
  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    
    // If no destination or dropped in the same place, do nothing
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    
    if (type === 'FOLDER') {
      // Handle folder reordering
      const newFolderOrder = Array.from(folders);
      const [movedFolder] = newFolderOrder.splice(source.index, 1);
      newFolderOrder.splice(destination.index, 0, movedFolder);
      setFolders(newFolderOrder);
    } else if (type === 'CARD') {
      // Handle card reordering
      const newCards = Array.from(cards);
      const [movedCard] = newCards.splice(source.index, 1);
      
      // If moving between folders
      if (source.droppableId !== destination.droppableId) {
        movedCard.folderId = destination.droppableId === 'all-cards' ? null : destination.droppableId;
      }
      
      newCards.splice(destination.index, 0, movedCard);
      setCards(newCards);
    }
  };
  
  // Create a new folder
  const createFolder = (name) => {
    const newFolder = {
      id: Date.now().toString(),
      name,
      timestamp: new Date().toISOString()
    };
    setFolders([...folders, newFolder]);
  };
  
  // Create a new card
  const createCard = (front, back, folderId = null) => {
    const newCard = {
      id: Date.now().toString(),
      front,
      back,
      folderId,
      timestamp: new Date().toISOString()
    };
    setCards([...cards, newCard]);
  };
  
  // Delete folder
  const deleteFolder = (id) => {
    // Update cards that were in this folder
    const updatedCards = cards.map(card => 
      card.folderId === id ? { ...card, folderId: null } : card
    );
    setCards(updatedCards);
    setFolders(folders.filter(folder => folder.id !== id));
  };
  
  // Delete card
  const deleteCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };
  
  // Show cards in a specific folder
  const showFolder = (folderId) => {
    setCurrentFolder(folderId);
    setShowingAllCards(false);
  };
  
  // Show all cards
  const showAllCards = () => {
    setShowingAllCards(true);
    setCurrentFolder(null);
  };

  return (
    <div className="App">
      <Header />
      <DragDropContext onDragEnd={handleDragEnd}>
        <MainContent 
          folders={folders}
          cards={cards}
          showingAllCards={showingAllCards}
          currentFolder={currentFolder}
          createFolder={createFolder}
          createCard={createCard}
          deleteFolder={deleteFolder}
          deleteCard={deleteCard}
          showFolder={showFolder}
          showAllCards={showAllCards}
        />
      </DragDropContext>
    </div>
  );
}

export default App;