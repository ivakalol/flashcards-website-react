import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const CardContainer = styled.div`
  background-color: ${props => props.flipped ? '#f1c40f' : 'white'};
  border-radius: 8px;
  height: 150px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  backface-visibility: hidden;
`;

const CardFront = styled(CardContent)`
  transform: rotateY(0);
`;

const CardBack = styled(CardContent)`
  transform: rotateY(180deg);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-weight: bold;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const Card = ({ card, index, onDelete }) => {
  const [flipped, setFlipped] = useState(false);
  
  const handleFlip = (e) => {
    // Prevent flip when clicking delete button
    if (e.target.closest('button')) return;
    setFlipped(!flipped);
  };
  
  return (
    <Draggable draggableId={card.id} index={index} type="CARD">
      {(provided) => (
        <CardContainer
          flipped={flipped}
          onClick={handleFlip}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <DeleteButton onClick={(e) => { e.stopPropagation(); onDelete(); }}>×</DeleteButton>
          <CardFront>
            <p>{card.front}</p>
          </CardFront>
          <CardBack>
            <p>{card.back}</p>
          </CardBack>
        </CardContainer>
      )}
    </Draggable>
  );
};

export default Card;