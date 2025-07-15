import { useState } from "react";
import { Question } from "../types/question";
import { QUESTIONS } from "../data/questions";

export type GameState = "start" | "playing" | "finished";

export const useQuiz = () => {
  // Estados do jogo
  const [gameState, setGameState] = useState<GameState>("start");
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  // Estados de animação
  const [showVideo, setShowVideo] = useState(false);
  const [videoFadeOut, setVideoFadeOut] = useState(false);
  const [videoFadeIn, setVideoFadeIn] = useState(false);
  const [questionFadeOut, setQuestionFadeOut] = useState(false);
  const [startScreenFadeOut, setStartScreenFadeOut] = useState(false);
  const [finishedScreenFadeOut, setFinishedScreenFadeOut] = useState(false);
  const [playingScreenFadeOut, setPlayingScreenFadeOut] = useState(false);

  const selectRandomQuestions = (): Question[] => {
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const startQuiz = () => {
    setStartScreenFadeOut(true);
    setTimeout(() => {
      const questions = selectRandomQuestions();
      setSelectedQuestions(questions);
      setGameState("playing");
      setCurrentQuestionIndex(0);
      setScore(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setShowResult(false);
      setStartScreenFadeOut(false);
    }, 300);
  };

  const handleAnswerSelect = (indexResposta: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(indexResposta);
    setShowResult(true);

    const isCorrect = indexResposta === selectedQuestions[currentQuestionIndex].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnswers([...answers, isCorrect]);

    const current = selectedQuestions[currentQuestionIndex];
    if (current.mediaAfter) {
      setTimeout(() => {
        setShowVideo(true);
        setTimeout(() => {
          setVideoFadeIn(true);
        }, 50);
      }, 500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setQuestionFadeOut(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setVideoFadeOut(false);
        setVideoFadeIn(false);
        setQuestionFadeOut(false);
      }, 300);
    } else {
      setPlayingScreenFadeOut(true);
      setTimeout(() => {
        setGameState("finished");
        setPlayingScreenFadeOut(false);
      }, 300);
    }
  };

  const resetQuiz = () => {
    setFinishedScreenFadeOut(true);
    setTimeout(() => {
      setGameState("start");
      setSelectedQuestions([]);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
      setAnswers([]);
      setShowVideo(false);
      setVideoFadeIn(false);
      setQuestionFadeOut(false);
      setFinishedScreenFadeOut(false);
    }, 300);
  };

  const hideVideo = () => {
    setVideoFadeOut(true);
    setTimeout(() => {
      setShowVideo(false);
      setVideoFadeOut(false);
      setVideoFadeIn(false);
    }, 500);
  };

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  return {
    // Estados do jogo
    gameState,
    selectedQuestions,
    currentQuestionIndex,
    selectedAnswer,
    showResult,
    score,
    answers,
    currentQuestion,

    // Estados de animação
    showVideo,
    videoFadeOut,
    videoFadeIn,
    questionFadeOut,
    startScreenFadeOut,
    finishedScreenFadeOut,
    playingScreenFadeOut,

    // Funções
    startQuiz,
    handleAnswerSelect,
    nextQuestion,
    resetQuiz,
    hideVideo,
  };
};