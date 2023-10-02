import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  // React variables
  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [images, setImages] = useState([]);
  const [numBreeds, setNumBreeds] = useState(5); // Default number of breeds

  useEffect(() => {
    // Gets the list of dog breeds for the user to select from the list
    fetch('https://dog.ceo/api/breeds/list/all')
      .then((res) => res.json())
      .then((data) => {
        const breedNames = Object.keys(data.message);
        setBreeds(breedNames);
      });
  }, []);

  useEffect(() => {
    // Fetch images of the selected breeds
    if (selectedBreeds.length > 0) {
      const breedImagesPromises = selectedBreeds.map((breed) => {
        return fetch(`https://dog.ceo/api/breed/${breed}/images/random/${numBreeds}`)
          .then((res) => res.json())
          .then((data) => data.message);
      });

      // This shows the selected images
      Promise.all(breedImagesPromises)
        .then((images) => {
          setImages(images.flat());
        });
    } else {
      setImages([]);
    }
  }, [selectedBreeds, numBreeds]);

  // This correctly sets all the chosen breeds that the user selected
  const toggleBreed = (breed) => {
    if (selectedBreeds.includes(breed)) {
      setSelectedBreeds(selectedBreeds.filter((selectedBreed) => selectedBreed !== breed));
    } else {
      setSelectedBreeds([...selectedBreeds, breed]);
    }
  };

  // Bonus update the number of breeds based on user input
  const handleNumBreedsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 10) {
      setNumBreeds(value);
    }
  };

  return (
    <div className="App">
      <h1>Welcome to the Dog Breeds Gallery</h1>
      <p>Click on the breeds found below to see what they look like!</p>
      <div className="num-breeds-input">
        <label htmlFor="numBreeds">Number of Dogs/Breed: </label>
        
        <input
          type="number"
          value={numBreeds}
          onChange={handleNumBreedsChange}
        />
      </div>
      <div className="breed-list">
        {breeds.map((breed) => (
          <button
            key={breed}
            className={`breed-button ${selectedBreeds.includes(breed) ? 'selected' : ''}`}
            onClick={() => toggleBreed(breed)}
          >
            {breed}
          </button>
        ))}
      </div>
      <div className="image-gallery">
        {images.map((image, idx) => (
          <img key={idx} src={image} alt={`Breed ${idx + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default App;

