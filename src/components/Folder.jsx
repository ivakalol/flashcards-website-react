// unused file, but I will keep it for now
// for future reference and potential use in the study session feature
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const FolderContainer = styled.div`
  background-color: ${props => props.isDragging ? '#2980b9' : '#3498db'};
  color: white;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: ${props => props.isDragging ? '0' : '8px'};
  box-shadow: ${props => props.isDragging 
    ? '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)' 
    : '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'};
  
  &:hover {
    transform: ${props => props.isDragging ? 'none' : 'translateY(-5px)'};
    box-shadow: ${props => props.isDragging 
      ? '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)' 
      : '0 10px 20px rgba(0, 0, 0, 0.1)'};
  }
`;

const FolderName = styled.h3`
  margin: 0;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FolderIcon = styled.div`
  text-align: center;
  margin-bottom: 8px;
  font-size: 1.5rem;
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
  transition: background-color 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;

const Folder = ({ folder, index, onDelete, onSelect }) => {
  const handleClick = (e) => {
    // Prevent click from triggering if clicking delete button
    if (e.target.closest('button')) return;
    onSelect(folder.id);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(folder.id);
    }
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(folder.id);
  };
  
  return (
    <Draggable draggableId={folder.id} index={index}>
      {(provided, snapshot) => (
        <FolderContainer
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          aria-label={`Folder: ${folder.name}`}
          tabIndex={0}
          role="button"
        >
          <FolderIcon>📁</FolderIcon>
          <FolderName title={folder.name}>{folder.name}</FolderName>
          <DeleteButton 
            onClick={handleDelete}
            aria-label={`Delete folder ${folder.name}`}
            title="Delete folder"
          >
            ×
          </DeleteButton>
        </FolderContainer>
      )}
    </Draggable>
  );
};

Folder.propTypes = {
  folder: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default Folder;