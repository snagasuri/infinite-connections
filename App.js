import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WordGrid from './components/WordGrid';
import GroupDisplay from './components/GroupDisplay';
import './App.css';

const App = () => {
  const [categories, setCategories] = useState({});
  const [words, setWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [lives, setLives] = useState(5);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/generate-groups');
      setCategories(response.data);
      setWords(Object.values(response.data).flat());
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const onSelectWord = (word) => {
    setSelectedWords((prevSelected) => prevSelected.includes(word) ? prevSelected.filter((w) => w !== word) : [...prevSelected, word]);
  };

  const handleSubmit = () => {
    if (selectedWords.length === 4) {
      const isGroupCorrect = Object.values(categories).some(category => category.sort().join(',') === selectedWords.sort().join(','));
      
      if (isGroupCorrect) {
        setGroups((prevGroups) => [...prevGroups, selectedWords]);
        setWords((prevWords) => prevWords.filter((word) => !selectedWords.includes(word)));
        setSelectedWords([]);
      } else {
        setLives((prevLives) => prevLives > 0 ? prevLives - 1 : 0);
        setSelectedWords([]);
      }

      if (lives - 1 <= 0) {
        alert('Game Over! Resetting...');
        resetGame();
      }
    }
  };

  const resetGame = async () => {
    setLives(5);
    setSelectedWords([]);
    setGroups([]);
    await fetchGroups();
  };
  return (
    <div className="App">
      <h1>Connections</h1>
      <WordGrid words={words} selectedWords={selectedWords} onSelectWord={onSelectWord} />
      <GroupDisplay groups={groups} />
      <div className="controls">
        <button onClick={handleSubmit} disabled={selectedWords.length !== 4} className="submit-btn">
          Submit
        </button>
      </div>
      <div className="lives">
        Lives: {lives}
      </div>
      {/* todo, add lives remaining and more UI/UX components */ }
    </div>
  );
};

export default App;
