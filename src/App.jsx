import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [selectedEnglish, setSelectedEnglish] = useState(null);
  const [selectedFrench, setSelectedFrench] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false);
  const [correctTranslations, setCorrectTranslations] = useState([]);

  const englishWords = ['hello', 'goodbye', 'thank you'];
  const frenchWords = ['bonjour', 'au revoir', 'merci'];

  const translations = {
    hello: 'bonjour',
    goodbye: 'au revoir',
    'thank you': 'merci',
  };

  const handleCardClick = (language, word) => {
    if (language === 'english') {
      setSelectedEnglish(word);
    } else {
      setSelectedFrench(word);
    }
  };

  useEffect(() => {
    if (selectedEnglish && selectedFrench) {
      if (translations[selectedEnglish] === selectedFrench) {
        setCorrectTranslations([...correctTranslations, { english: selectedEnglish, french: selectedFrench }]);
        setSelectedEnglish(null);
        setSelectedFrench(null);
      } else {
        setShowIncorrectAnimation(true);
        setWrongAttempts(wrongAttempts + 1);
        setTimeout(() => {
          setShowIncorrectAnimation(false);
          setSelectedEnglish(null);
          setSelectedFrench(null);
        }, 1000);
      }
    }
  }, [selectedEnglish, selectedFrench]);

  const totalWords = englishWords.length; // Change here
  const progressPercentage = (correctTranslations.length / totalWords) * 100;

  return (
    <div className="App">
      <div className="columns">
        <div className="column">
          <h2>English</h2>
          {englishWords.map((word) => (
            <CardComponent
              key={word}
              word={word}
              selected={word === selectedEnglish}
              incorrect={showIncorrectAnimation && word === selectedEnglish}
              correct={correctTranslations.some((trans) => trans.english === word)}
              onClick={() => !correctTranslations.some((trans) => trans.english === word) && handleCardClick('english', word)}
            />
          ))}
        </div>
        <div className="column">
          <h2>French</h2>
          {frenchWords.map((word) => (
            <CardComponent
              key={word}
              word={word}
              selected={word === selectedFrench}
              incorrect={showIncorrectAnimation && word === selectedFrench}
              correct={correctTranslations.some((trans) => trans.french === word)}
              onClick={() => !correctTranslations.some((trans) => trans.french === word) && handleCardClick('french', word)}
            />
          ))}
        </div>
      </div>
      <div className="wrong-attempts">Wrong Attempts: {wrongAttempts}</div>
      <div className="progress-bar">
        <div className={`progress-bar-fill ${progressPercentage >= 75 ? 'on-fire' : ''}`} style={{ width: `${progressPercentage}%` }}></div>
      </div>
    </div>
  );
};

const CardComponent = ({ word, selected, incorrect, correct, onClick }) => {
  return (
    <div
      className={`card ${selected ? 'selected' : ''} ${incorrect ? 'incorrect' : ''} ${correct ? 'correct' : ''}`}
      onClick={onClick}
    >
      {word}
    </div>
  );
};

export default App;