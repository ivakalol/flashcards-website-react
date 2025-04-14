import React from 'react';
import '../styles/ColorSelector.css';

// Available color options - ordered by color spectrum
const colorOptions = [
  // Reds and pinks
  { id: 'red', value: '#ff7f7f', label: 'Red' },
  { id: 'coral', value: '#ff8a65', label: 'Coral' },
  { id: 'pink', value: '#ffb6c1', label: 'Pink' },
  { id: 'dustyrose', value: '#d8a7b1', label: 'Dusty Rose' },
  
  // Oranges and peaches
  { id: 'peach', value: '#ffb997', label: 'Peach' },
  { id: 'folder', value: '#ffcb91', label: 'Folder' },
  
  // Yellows
  { id: 'mustard', value: '#e3b448', label: 'Mustard' },
  { id: 'yellow', value: '#ffd868', label: 'Yellow' },
  
  // Greens
  { id: 'lightgreen', value: '#b5e48c', label: 'Light Green' },
  { id: 'sage', value: '#bcccb4', label: 'Sage Green' },
  
  // Blues and teals
  { id: 'teal', value: '#006d77', label: 'Teal' },
  { id: 'babyblue', value: '#a8dadc', label: 'Baby Blue' },
  { id: 'skyblue', value: '#87ceeb', label: 'Sky Blue' },
  
  // Purples
  { id: 'lavender', value: '#e0b1cb', label: 'Lavender' },
  { id: 'lilac', value: '#c8a2c8', label: 'Lilac' }
];

function ColorSelector({ selectedColor, onChange }) {
  return (
    <div className="color-selector">
      <div className="color-options">
        {colorOptions.map((color) => (
          <button
            key={color.id}
            type="button" 
            className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
            style={{ backgroundColor: color.value }}
            onClick={() => onChange(color.value)}
            aria-label={`Select ${color.label} color`}
            title={color.label}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorSelector;

// Export color options for use in other components
export { colorOptions };