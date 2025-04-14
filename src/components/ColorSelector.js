import React from 'react';
import '../styles/ColorSelector.css';

// Available color options
const colorOptions = [
  { id: 'pink', value: '#ffb6c1', label: 'Pink' },
  { id: 'red', value: '#ff7f7f', label: 'Red' },
  { id: 'babyblue', value: '#a8dadc', label: 'Baby Blue' },
  { id: 'lightgreen', value: '#b5e48c', label: 'Light Green' },
  { id: 'yellow', value: '#ffd868', label: 'Yellow' },
  { id: 'folder', value: '#ffcb91', label: 'Folder' }, // Typical folder color
  { id: 'lavender', value: '#e0b1cb', label: 'Lavender' },
  { id: 'teal', value: '#006d77', label: 'Teal' }
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