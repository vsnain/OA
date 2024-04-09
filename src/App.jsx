import React, { useState, useEffect } from 'react';
import './App.css';
import { englishWords, frenchWords, translations } from './translations';

const App = () => {
  const [selectedEnglish, setSelectedEnglish] = useState(null);
  const [selectedFrench, setSelectedFrench] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false);
  const [correctTranslations, setCorrectTranslations] = useState([]);
  const [showWinningMessage, setShowWinningMessage] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [shuffledWords, setShuffledWords] = useState({
    english: [],
    french: [],
  });
  const [showScore, setShowScore] = useState(false);

  

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    setShuffledWords({
      english: shuffleArray([...englishWords]),
      french: shuffleArray([...frenchWords]),
    });
  }, []);

  const handleCardClick = (language, word) => {
    if (language === 'english') {
      setSelectedEnglish(word);
    } else {
      setSelectedFrench(word);
    }
  };

  const totalWords = englishWords.length;
  const progressPercentage = (correctTranslations.length / totalWords) * 100;

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

    if (progressPercentage === 100) {
      setShowWinningMessage(true);
    }
  }, [selectedEnglish, selectedFrench, correctTranslations.length]);

  const WinningMessage = () => {
    const handleNewGame = () => {
      setCorrectTranslations([]);
      setWrongAttempts(0);
      setShowWinningMessage(false);
      setShuffledWords({
        english: shuffleArray([...englishWords]),
        french: shuffleArray([...frenchWords]),
      });
    };

    return (
      <>
        <div className="winning-message">
          Congratulations! You have mastered all the translations!
        </div>
        <button className="new-game-btn" onClick={handleNewGame}>
          NEW GAME
        </button>
      </>
    );
  };

  const SplashScreen = () => {
    const handleStartGame = () => {
      setShowSplashScreen(false);
    };

    return (
      <div className="splash-screen">
        <h1>Word Translation Game</h1>
        <button className="start-game-btn" onClick={handleStartGame}>
          GO
        </button>
      </div>
    );
  };

  return (
    <div className="App">
      {showSplashScreen ? (
        <SplashScreen />
      ) : (
        <>
          {showWinningMessage ? (
            <WinningMessage />
          ) : (
            <>
              <div className="columns">
                <div className="column">
                  <h2>English</h2>
                  {shuffledWords.english.map((word) => (
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
                  {shuffledWords.french.map((word) => (
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
              
              <div className="controls">
                <div className="wrong-attempts">Wrong Attempts: {wrongAttempts}</div>
                <button className="grade-btn" onClick={() => setShowScore(true)}>
                  Grade Me
                </button>
                {showScore && <ScoreDisplay correctTranslations={correctTranslations} totalWords={totalWords} />}
              </div>
              <div className="progress-bar">
                <div className={`progress-bar-fill ${progressPercentage >= 75 ? 'on-fire' : ''}`} style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </>
          )}
        </>
      )}
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

const ScoreDisplay = ({ correctTranslations, totalWords }) => {
  const score = correctTranslations.length;
  const percentage = ((score / totalWords) * 100).toFixed(2); // Calculate percentage and round to 2 decimal places
  return (
    <div className="score-display">
      {percentage}%
    </div>
  );
};

export default App;
