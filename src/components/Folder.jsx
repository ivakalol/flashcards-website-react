import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const FolderContainer = styled.div`
  background-color: #3498db;
  color: white;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FolderName = styled.h3`
  margin: 0;
  text-align: center;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const Folder = ({ folder, index, onDelete, onSelect }) => {
  const handleClick = (e) => {
    // Prevent click from triggering if clicking delete button
    if (e.target.closest('button')) return;
    onSelect();
  };
  
  return (
    <Draggable draggableId={folder.id} index={index} type="FOLDER">
      {(provided) => (
        <FolderContainer
          onClick={handleClick}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <FolderName>{folder.name}</FolderName>
          <DeleteButton onClick={(e) => { e.stopPropagation(); onDelete(); }}>×</DeleteButton>
        </FolderContainer>
      )}
    </Draggable>
  );
};

export default Folder;