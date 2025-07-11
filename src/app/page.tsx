'use client'

import { useState } from "react";
import { Question } from "./types/question";
import { QUESTIONS } from "./data/questions";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Play, ArrowBigRightDash } from "lucide-react"

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
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 flex flex-col items-center justify-center p-8">
        {/* Header com logos dos patrocinadores */}
        <div className="w-full max-w-5xl mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
            <div className="flex items-center justify-center gap-12">
              <div className="flex-1 flex justify-center">
                <img
                  src="/logo_euvi.png"
                  alt="Logo Prefeitura do Recife"
                  className="h-32 object-contain"
                />
              </div>
              <div className="w-px h-24 bg-blue-200"></div>
              <div className="flex-1 flex justify-center">
                <img src="/prefeitura_logo.jpg" alt="Logo Eu Vi" className="h-32 object-contain" />
              </div>
            </div>
            <p className="text-center text-3xl text-blue-900 mt-6 font-bold">
              Ciência também é memória, cultura e território
            </p>
          </div>
        </div>

        {/* Conteúdo principal do quiz */}
        <Card className="w-full max-w-5xl bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-16 text-center w-full">
            <div className="mb-12">
              <h1 className="text-7xl font-bold text-blue-800 mb-6">Quiz sobre a cultura Recifense</h1>
              <p className="text-3xl text-blue-800 mb-8">
                Teste seus conhecimentos sobre a cultura e história do Recife
              </p>
              <div className="bg-blue-50 p-10 rounded-2xl">
                <p className="text-3xl text-blue-800 mb-6">
                  Você responderá <strong>3 perguntas aleatórias</strong> de um total de 11 questões sobre:
                </p>
                <div className="grid grid-cols-1 gap-4 text-3xl text-blue-800 mt-8">
                  <div>• Cinema e Arte</div>
                  <div>• Música e Cultura</div>
                  <div>• Literatura e Poesia</div>
                </div>
              </div>
            </div>
            <Button
              onClick={startQuiz}
              className="text-3xl py-12 px-16 rounded-3xl bg-blue-800 hover:bg-blue-700 text-white cursor-pointer min-w-[400px]"
            >
              <Play className="mr-4 h-12 w-12" />
              Começar Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "finished") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-8">
        <Card className="w-full max-w-6xl bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-16 text-center">
            <h1 className="text-8xl font-bold text-blue-800 mb-12">Quiz Finalizado!</h1>

            <div className="bg-blue-50 p-12 rounded-2xl mb-12">
              <div className="text-9xl font-bold text-blue-800 mb-8">{score}/3</div>
              <p className="text-4xl text-blue-800 leading-relaxed">
                {score === 3
                  ? "Parabéns! Tu é arretado e sabe tudo sobre o Recife!"
                  : score === 2
                    ? "Bateu na trave! Tu é rochedo e quase que gabarita!"
                    : score === 1
                      ? "Quase lá! Continue aprendendo mais sobre o Recife!"
                      : "Que tal conhecer um pouco mais a nossa bela cidade?"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-12">
              {answers.map((correct, index) => (
                <div key={index} className="flex items-center justify-center p-8 bg-white rounded-xl shadow-lg">
                  <span className="text-4xl font-semibold mr-4">Q{index + 1}:</span>
                  {correct ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500" />
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={resetQuiz}
              size="lg"
              className="text-3xl px-16 py-12 rounded-3xl bg-blue-800 hover:bg-blue-700 text-white min-w-[400px]"
            >
              <RotateCcw className="mr-4 h-12 w-12" />
              Jogar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-8">
      <Card className="w-full max-w-7xl bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-12">
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-12">
              <div className="flex-1 flex justify-center">
                <img
                  src="/logo_euvi.png"
                  alt="Logo Eu Vi"
                  className="h-32 object-contain"
                />
              </div>
              <div className="w-px h-24 bg-blue-200"></div>
              <div className="flex-1 flex justify-center">
                <img
                  src="/prefeitura_logo.jpg"
                  alt="Logo Prefeitura do Recife"
                  className="h-28 object-contain"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="text-3xl px-8 py-4">
              Pergunta {currentQuestionIndex + 1} de 3
            </Badge>
            <div className="text-4xl font-bold text-blue-800">
              Pontuação: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}
            </div>
          </div>

          <div className="w-full bg-blue-200 rounded-full h-6 mb-12">
            <div
              className="bg-blue-600 h-6 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + (showResult ? 1 : 0)) / 3) * 100}%` }}
            />
          </div>

          {currentQuestion.image && (
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl h-80 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={currentQuestion.image || "/placeholder.svg"}
                  alt="Imagem relacionada à pergunta"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="mb-12">
            <h2 className="text-5xl font-bold text-blue-800 mb-8 leading-relaxed text-center">{currentQuestion.question}</h2>
          </div>

          <div className="grid gap-6 mb-12">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "text-3xl p-10 h-auto text-left justify-start transition-all duration-300 "

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
                  <span className="font-bold mr-6 text-4xl">{String.fromCharCode(65 + index)})</span>
                  <span className="flex-1">{option}</span>
                  {showResult && index === currentQuestion.correct && (
                    <CheckCircle className="ml-auto h-12 w-12 text-green-600" />
                  )}
                  {showResult && index === selectedAnswer && index !== currentQuestion.correct && (
                    <XCircle className="ml-auto h-12 w-12 text-red-600" />
                  )}
                </Button>
              )
            })}
          </div>

          {showResult && (
            <div className="text-center">
              <Button
                onClick={nextQuestion}
                className="text-3xl px-16 py-12 rounded-3xl bg-blue-800 hover:bg-blue-700 text-white min-w-[400px]"
              >
                <ArrowBigRightDash className="mr-4 h-12 w-12" />
                {currentQuestionIndex < selectedQuestions.length - 1 ? "Próxima Pergunta" : "Ver Resultado"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}