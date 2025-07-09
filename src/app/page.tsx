'use client'

import { useState, useEffect } from "react";
import { Question } from "./types/question";
import { QUESTIONS } from "./data/questions";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Play } from "lucide-react"

export default function RecifeQuiz() {
  const [gameState, setGameState] = useState<"start" | "playing" | "finished">("start")
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])

  const selectRandomQuestions = () => {
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }

  const startQuiz = () => {
    const questions = selectRandomQuestions()
    setSelectedQuestions(questions)
    setGameState("playing")
    setCurrentQuestionIndex(0)
    setScore(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswerSelect = (indexResposta: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(indexResposta)
    setShowResult(true)

    const isCorrect = indexResposta === selectedQuestions[currentQuestionIndex].correct
    if (isCorrect) {
      setScore(score + 1)
    }
    setAnswers([...answers, isCorrect])
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setGameState("finished")
    }
  }

  const resetQuiz = () => {
    setGameState("start")
    setSelectedQuestions([])
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex]

  if (gameState === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 flex flex-col items-center justify-between p-6">
        {/* Header com logos dos patrocinadores */}
        <div className="w-full max-w-2xl">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl mb-6">
            <div className="flex items-center justify-center gap-8">
              <div className="flex-1 flex justify-center">
                <img
                  src="/prefeitura_logo.jpg"
                  alt="Logo Prefeitura do Recife"
                  className="h-45 object-contain"
                />
              </div>
              <div className="w-px h-16 bg-blue-200"></div>
              <div className="flex-1 flex justify-center">
                <img src="/logo_euvi.png" alt="Logo Eu Vi" className="h-45 object-contain" />
              </div>
            </div>
            <p className="text-center text-lg font-semibold text-blue-900 mt-2">
              Oferecido pela Prefeitura do Recife e pelo Eu Vi
            </p>
          </div>
        </div>

        {/* Conteúdo principal do quiz */}
        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl flex-1 flex items-center">
          <CardContent className="p-8 text-center w-full">
            <div className="mb-6">
              <h1 className="text-5xl font-bold text-blue-900 mb-3">Quiz do Recife</h1>
              <p className="text-xl text-blue-700 mt-6">
                Teste seus conhecimentos sobre a cultura e história do Recife
              </p>
              <div className="bg-blue-50 p-5 rounded-lg mb-6">
                <p className="text-xl text-blue-800 mb-8">
                  Você responderá <strong>3 perguntas aleatórias</strong> de um total de 11 questões sobre:
                </p>
                <div className="grid grid-cols-1 gap-2 text-xl text-blue-700">
                  <div>• Cinema e Arte</div>
                  <div>• Música e Cultura</div>
                  <div>• História e Geografia</div>
                  <div>• Literatura e Poesia</div>
                </div>
              </div>
            </div>
            <Button
              onClick={startQuiz}
              size="lg"
              className="text-xl px-10 py-8 bg-blue-600 hover:bg-blue-700 text-white mt-4"
            >
              <Play className="mr-3 h-7 w-7" />
              Começar Quiz
            </Button>
          </CardContent>
        </Card>

        {/* Footer com informações adicionais */}
        <div className="w-full max-w-2xl mt-4">
          <div className="text-center text-white/80 text-xl">
            <p>Uma iniciativa para promover a cultura recifense</p>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "finished") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-8">
        <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-12 text-center">
            <h1 className="text-5xl font-bold text-blue-900 mb-8">Quiz Finalizado!</h1>

            <div className="bg-blue-50 p-8 rounded-lg mb-8">
              <div className="text-6xl font-bold text-blue-600 mb-4">{score}/3</div>
              <p className="text-2xl text-blue-800">
                {score === 3
                  ? "Parabéns! Você é um expert em Recife!"
                  : score === 2
                    ? "Muito bem! Você conhece bastante sobre Recife!"
                    : score === 1
                      ? "Bom trabalho! Continue aprendendo sobre Recife!"
                      : "Que tal estudar mais sobre nossa bela cidade?"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {answers.map((correct, index) => (
                <div key={index} className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
                  <span className="text-xl font-semibold mr-2">Q{index + 1}:</span>
                  {correct ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-500" />
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={resetQuiz}
              size="lg"
              className="text-2xl px-10 py-8 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RotateCcw className="mr-3 h-8 w-8" />
              Jogar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-8">
      <Card className="w-full max-w-6xl bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Badge variant="secondary" className="text-xl px-4 py-2">
              Pergunta {currentQuestionIndex + 1} de 3
            </Badge>
            <div className="text-2xl font-bold text-blue-900">
              Pontuação: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-blue-200 rounded-full h-3 mb-8">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + (showResult ? 1 : 0)) / 3) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-6 leading-relaxed">{currentQuestion.question}</h2>
          </div>

          {/* Options */}
          <div className="grid gap-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "text-xl p-6 h-auto text-left justify-start transition-all duration-300 "

              if (showResult) {
                if (index === currentQuestion.correct) {
                  buttonClass += "bg-green-100 border-green-500 text-green-800 hover:bg-green-100"
                } else if (index === selectedAnswer) {
                  buttonClass += "bg-red-100 border-red-500 text-red-800 hover:bg-red-100"
                } else {
                  buttonClass += "bg-gray-100 text-gray-600 hover:bg-gray-100"
                }
              } else {
                buttonClass += "bg-white border-blue-200 text-blue-900 hover:bg-blue-50 hover:border-blue-400"
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="font-bold mr-4 text-2xl">{String.fromCharCode(65 + index)})</span>
                  {option}
                  {showResult && index === currentQuestion.correct && (
                    <CheckCircle className="ml-auto h-8 w-8 text-green-600" />
                  )}
                  {showResult && index === selectedAnswer && index !== currentQuestion.correct && (
                    <XCircle className="ml-auto h-8 w-8 text-red-600" />
                  )}
                </Button>
              )
            })}
          </div>
          
          {showResult && (
            <div className="text-center">
              <Button
                onClick={nextQuestion}
                size="lg"
                className="text-xl px-10 py-8 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {currentQuestionIndex < selectedQuestions.length - 1 ? "Próxima Pergunta" : "Ver Resultado"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

