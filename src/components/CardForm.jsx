import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const SubmitButton = styled(Button)`
  background-color: #2ecc71;
  color: white;
  
  &:hover {
    background-color: #27ae60;
  }
`;

const CancelButton = styled(Button)`
  background-color: #e74c3c;
  color: white;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const CardForm = ({ onSubmit, onCancel }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      onSubmit(front.trim(), back.trim());
      setFront('');
      setBack('');
    }
  };
  
  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <h3>Create New Card</h3>
        <Input
          type="text"
          placeholder="Front (Question)"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          required
        />
        <TextArea
          placeholder="Back (Answer)"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          required
        />
        <ButtonGroup>
          <CancelButton type="button" onClick={onCancel}>Cancel</CancelButton>
          <SubmitButton type="submit">Create</SubmitButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default CardForm;