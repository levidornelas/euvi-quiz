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
  const [showVideo, setShowVideo] = useState(false)
  const [videoFadeOut, setVideoFadeOut] = useState(false)
  const [videoFadeIn, setVideoFadeIn] = useState(false)
  const [questionFadeOut, setQuestionFadeOut] = useState(false)

  // Estados para controlar fade das telas principais
  const [startScreenFadeOut, setStartScreenFadeOut] = useState(false)
  const [finishedScreenFadeOut, setFinishedScreenFadeOut] = useState(false)
  const [playingScreenFadeOut, setPlayingScreenFadeOut] = useState(false)

  const selectRandomQuestions = () => {
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }

  const startQuiz = () => {
    setStartScreenFadeOut(true)

    setTimeout(() => {
      const questions = selectRandomQuestions()
      setSelectedQuestions(questions)
      setGameState("playing")
      setCurrentQuestionIndex(0)
      setScore(0)
      setAnswers([])
      setSelectedAnswer(null)
      setShowResult(false)
      setStartScreenFadeOut(false)
    }, 300)
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

    const current = selectedQuestions[currentQuestionIndex]
    if (current.mediaAfter) {
      setTimeout(() => {
        setShowVideo(true)
        setTimeout(() => {
          setVideoFadeIn(true)
        }, 50)
      }, 500)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setQuestionFadeOut(true)

      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setVideoFadeOut(false)
        setVideoFadeIn(false)
        setQuestionFadeOut(false)
      }, 300)
    } else {
      // Transição para tela final
      setPlayingScreenFadeOut(true)
      setTimeout(() => {
        setGameState("finished")
        setPlayingScreenFadeOut(false)
      }, 300)
    }
  }

  const resetQuiz = () => {
    setFinishedScreenFadeOut(true)
    setTimeout(() => {
      setGameState("start")
      setSelectedQuestions([])
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setShowResult(false)
      setScore(0)
      setAnswers([])
      setShowVideo(false)
      setVideoFadeIn(false)
      setQuestionFadeOut(false)
      setFinishedScreenFadeOut(false)
    }, 300)
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex]

  // Fundo fixo que sempre mantém o gradiente
  const backgroundClasses = "fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 -z-10"

  if (gameState === "start") {
    return (
      <>
        <div className={backgroundClasses} />
        <div className={`min-h-screen flex flex-col items-center justify-center p-8 transition-all duration-300 ${startScreenFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}>
          <div className="w-full max-w-4xl mb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
              <div className="flex items-center justify-center gap-12">
                <div className="flex-1 flex justify-center">
                  <img src="/logo_euvi.png" alt="Logo Eu Vi" className="h-40 object-contain" />
                </div>
                <div className="w-px h-24 bg-blue-200"></div>
                <div className="flex-1 flex justify-center">
                  <img src="/prefeitura_logo.jpg" alt="Logo Prefeitura do Recife" className="h-28 object-contain" />
                </div>
              </div>
              <p className="text-center text-3xl text-blue-900 mt-6 font-bold">
                Ciência também é memória, cultura e território
              </p>
            </div>
          </div>

          <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-12 text-center w-full">
              <div className="mb-8">
                <h1 className="text-7xl font-bold text-blue-800 mb-4">Você viu?</h1>
                <div className="bg-blue-50 p-10 rounded-2xl">
                  <p className="text-3xl text-blue-800">
                    Chegou a hora de testar o quanto você conhece do Recife que vive nas artes! <br /><br />
                    <span className="font-semibold text-blue-900">
                      Cultura, memória e arte em forma de quiz.
                    </span> <br /> <br />
                    Vai encarar? <span className="font-bold">Simbora!</span>
                  </p>
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
      </>
    )
  }

  if (gameState === "finished") {
    return (
      <>
        <div className={backgroundClasses} />
        <div className={`min-h-screen flex items-center justify-center p-8 transition-all duration-300 ${finishedScreenFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}>
          <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8 text-center">
              <h1 className="text-8xl font-bold text-blue-800 mb-12">Quiz Finalizado!</h1>
              <div className="bg-blue-50 p-8 rounded-2xl mb-12">
                <div className="text-9xl font-bold text-blue-800 mb-8">{score}/3</div>
                <p className="text-4xl text-blue-800 leading-relaxed">
                  {score === 3
                    ? "Parabéns! Tu é arretado e sabe tudo sobre o Recife!"
                    : score === 2
                      ? "Bateu na trave! Tu é rochedo e quase que gabarita!"
                      : score === 1
                        ? "Quase lá! Acompanha o Eu Vi para continuar aprendendo mais sobre nossa cidade!"
                        : "Quase lá! Acompanha o Eu Vi para continuar aprendendo mais sobre nossa cidade!"}
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
      </>
    )
  }

  return (
    <>
      <div className={backgroundClasses} />
      <div className={`min-h-screen flex items-center justify-center p-8 relative transition-all duration-300 ${playingScreenFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
        }`}>
        {showVideo && currentQuestion.mediaAfter && (
          <div className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center transition-opacity duration-500 ${videoFadeOut ? 'opacity-0' : (videoFadeIn ? 'opacity-100' : 'opacity-0')
            }`}>
            <div className={`bg-white rounded-xl overflow-hidden max-w-4xl w-full transition-all duration-500 transform ${videoFadeOut
              ? 'opacity-0 scale-95'
              : videoFadeIn
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
              }`}>
              <video
                src={currentQuestion.mediaAfter}
                controls
                autoPlay
                className="w-full h-full"
                onEnded={() => {
                  setVideoFadeOut(true)
                  setTimeout(() => {
                    setShowVideo(false)
                    setVideoFadeOut(false)
                    setVideoFadeIn(false)
                  }, 500)
                }}
              />
            </div>
          </div>
        )}

        <Card className={`w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl z-10 transition-all duration-300 ${questionFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}>
          <CardContent className="p-8">
            <div className="w-full max-w-6xl mx-auto">
              <div className="flex items-center justify-center gap-12">
                <div className="flex-1 flex justify-center">
                  <img src="/logo_euvi.png" alt="Logo Eu Vi" className="h-38 object-contain" />
                </div>
                <div className="w-px h-24 bg-blue-200"></div>
                <div className="flex-1 flex justify-center">
                  <img src="/prefeitura_logo.jpg" alt="Logo Prefeitura do Recife" className="h-24 object-contain" />
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
              <div className="flex justify-center items-center">
                <div className="relative w-full max-w-2xl h-65 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={currentQuestion.image || "/placeholder.svg"}
                    alt="Imagem relacionada à pergunta"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <h2 className="text-5xl font-bold text-blue-800 mb-8 leading-relaxed text-center">{currentQuestion.question}</h2>
            </div>

            <div className="grid gap-6 mb-4">
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
    </>
  )
}