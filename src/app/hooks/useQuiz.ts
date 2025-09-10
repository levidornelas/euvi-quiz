import { useState, useCallback, useMemo } from "react";
import { Question } from "../types/question";
import { QUESTIONS } from "../data/questions";
import { useVercelAnalytics } from "./useAnalytics";
import { useGamepad } from "./gamepad";

export type GameState = "start" | "playing" | "finished";

export const useQuiz = () => {
  const analytics = useVercelAnalytics();

  // Estados do jogo
  const [gameState, setGameState] = useState<GameState>("start");
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  // Estados visuais
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

  const startQuiz = useCallback(() => {
    analytics.trackQuizStart();
    setStartScreenFadeOut(true);
    setTimeout(() => {
      const questions = selectRandomQuestions();
      setSelectedQuestions(questions);
      setGameState("playing");
      setCurrentQuestionIndex(0);
      setScore(0);
      setAnswers([]);
      setSelectedAnswer(0);       // já inicia focando a primeira alternativa
      setShowResult(false);
      setStartScreenFadeOut(false);
    }, 300);
  }, [analytics]);

  const handleAnswerSelect = useCallback((indexResposta: number) => {
    if (showResult) return; // já respondido

    setSelectedAnswer(indexResposta);
    setShowResult(true);

    const isCorrect =
      indexResposta === selectedQuestions[currentQuestionIndex].correct;

    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, isCorrect]);

    const current = selectedQuestions[currentQuestionIndex];
    if (current.mediaAfter) {
      setTimeout(() => {
        setShowVideo(true);
        setTimeout(() => setVideoFadeIn(true), 50);
      }, 500);
    }
  }, [showResult, selectedQuestions, currentQuestionIndex]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setQuestionFadeOut(true);
      setTimeout(() => {
        setCurrentQuestionIndex(i => i + 1);
        setSelectedAnswer(0);
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
  }, [currentQuestionIndex, selectedQuestions.length]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex === 0) return;
    setQuestionFadeOut(true);
    setTimeout(() => {
      setCurrentQuestionIndex(i => i - 1);
      setSelectedAnswer(0);
      setShowResult(false);
      setVideoFadeOut(false);
      setVideoFadeIn(false);
      setQuestionFadeOut(false);
    }, 300);
  }, [currentQuestionIndex]);

  const resetQuiz = useCallback(() => {
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
  }, []);

  const hideVideo = useCallback(() => {
    setVideoFadeOut(true);
    setTimeout(() => {
      setShowVideo(false);
      setVideoFadeOut(false);
      setVideoFadeIn(false);
    }, 500);
  }, []);

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  // quantidade de alternativas (options ou answers)
  const optionsCount = useMemo(() => {
    const q = currentQuestion as any;
    return q?.options?.length ?? q?.answers?.length ?? 0;
  }, [currentQuestion]);

  // ======== Navegação via controle ========
  const moveUp = useCallback(() => {
    if (gameState !== "playing" || !optionsCount || showResult) return;
    setSelectedAnswer(prev => {
      const cur = prev ?? 0;
      return (cur - 1 + optionsCount) % optionsCount;
    });
  }, [gameState, optionsCount, showResult]);

  const moveDown = useCallback(() => {
    if (gameState !== "playing" || !optionsCount || showResult) return;
    setSelectedAnswer(prev => {
      const cur = prev ?? -1;
      return (cur + 1 + optionsCount) % optionsCount;
    });
  }, [gameState, optionsCount, showResult]);

  const confirm = useCallback(() => {
    if (gameState === "start") { startQuiz(); return; }
    if (gameState === "playing") {
      if (!showResult) {
        handleAnswerSelect(selectedAnswer ?? 0);
      } else {
        if (showVideo) hideVideo();
        else nextQuestion();
      }
      return;
    }
    if (gameState === "finished") resetQuiz();
  }, [gameState, showResult, selectedAnswer, startQuiz, handleAnswerSelect, nextQuestion, resetQuiz, showVideo, hideVideo]);

  const next = useCallback(() => {
    if (gameState === "playing" && showResult) {
      if (showVideo) hideVideo(); else nextQuestion();
    }
  }, [gameState, showResult, showVideo, hideVideo, nextQuestion]);

  const back = useCallback(() => {
    if (showVideo) { hideVideo(); return; }
    if (gameState === "playing" && !showResult) prevQuestion();
  }, [showVideo, hideVideo, gameState, showResult, prevQuestion]);

  const prev = useCallback(() => {
    if (gameState === "playing" && !showResult) prevQuestion();
  }, [gameState, showResult, prevQuestion]);

  // Conecta o controle
  useGamepad({ confirm, back, next, prev, moveUp, moveDown });

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

    // Estados visuais
    showVideo,
    videoFadeOut,
    videoFadeIn,
    questionFadeOut,
    startScreenFadeOut,
    finishedScreenFadeOut,
    playingScreenFadeOut,

    // Ações
    startQuiz,
    handleAnswerSelect,
    nextQuestion,
    resetQuiz,
    hideVideo,
  };
};
