'use client'
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Play, ArrowBigRightDash } from "lucide-react"
import { useQuiz } from "./hooks/useQuiz";
import { backgroundClasses } from "./utils/background-classes";
import { getButtonClass } from "./utils/get-button-class";
import { getScoreMessage } from "./utils/get-score-message";
import { useEffect, useState } from "react";

export default function RecifeQuiz() {
  const bgImages = [
    '/frevo.png',
    '/rosa.png',
    '/artes.png'
  ]
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex: number) => (prevIndex + 1) % bgImages.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  const dynamicBackgroundStyle = {
    backgroundImage: `url(${bgImages[currentBgIndex]})`,
    backgroundPosition: 'center',
    backgroundSize: 'contain',
  };

  const {
    gameState,
    currentQuestionIndex,
    selectedAnswer,
    showResult,
    score,
    answers,
    currentQuestion,
    questionFadeOut,
    startScreenFadeOut,
    finishedScreenFadeOut,
    playingScreenFadeOut,
    startQuiz,
    handleAnswerSelect,
    nextQuestion,
    resetQuiz,
    hideVideo,
  } = useQuiz();

  if (gameState === "start") {
    return (
      <>
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 transition-all duration-2000 ease-in-out -z-10 bg-card"
          style={dynamicBackgroundStyle}
        />
        <div className={`min-h-screen flex flex-col items-center justify-center p-8 transition-all duration-300 ${startScreenFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}>
          <div className="w-full max-w-4xl mb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
              <div className="flex items-center justify-center gap-12">
                <div className="flex-1 flex justify-center">
                  <Image
                    src="/logo_euvi.png"
                    alt="Logo Eu Vi"
                    width={200}
                    height={160}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <p className="text-center text-6xl text-blue-800 mt-6 font-bold">
                Ciência também é memória, cultura e território
              </p>
            </div>
          </div>

          <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl mb-18">
            <CardContent className="p-12 text-center w-full">
              <div className="mb-8">
                <h1 className="text-7xl font-bold text-blue-800 mb-4">Você viu?</h1>
                <div className="bg-blue-50 p-10 rounded-2xl">
                  <p className="text-4xl text-blue-800">
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
    );
  }

  if (gameState === "finished") {
    return (
      <>
        <div className={backgroundClasses} />
        <div className={`min-h-screen flex items-center justify-center p-8 transition-all duration-300 ${finishedScreenFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}>
          <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8 text-center">
              <h1 className="text-5xl font-bold text-blue-800">Quiz Finalizado!</h1>
              <div className="bg-blue-50 p-8 rounded-2xl">
                <div className="text-5xl font-bold text-blue-800 mb-8">{score}/3</div>
                <div className="text-3xl text-blue-800 font-semibold">
                  <p>{getScoreMessage(score)}</p>
                </div>
              </div>
              <div className="text-center px-4 mb-10">
                <p className="text-3xl text-blue-800 mb-4 leading-snug">
                  Valeu por embarcar com a gente nesse passeio pela arte e pela memória do Recife!
                </p>
                <p className="text-3xl text-blue-800 mb-4 leading-snug font-semibold">
                  Quer continuar essa viagem?
                </p>
                <p className="text-3xl text-blue-800 mb-4 leading-snug">
                  Aponte a câmera pro <strong>QR Code</strong> e acompanhe o <strong>Eu Vi!</strong>
                </p>
                <Image
                  src="/insta_qrcode.png"
                  alt="QR Code para seguir o Eu Vi no Instagram"
                  width={300}
                  height={300}
                  className="mx-auto"
                />
              </div>
              <div className="grid grid-cols-3 gap-8 mb-12">
                {answers.map((correct, index) => (
                  <div key={index} className="flex items-center justify-center p-2 bg-white rounded-xl shadow-lg">
                    <span className="text-3xl font-semibold mr-4">Q{index + 1}:</span>
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
    );
  }

  return (
    <>
      <div className={backgroundClasses} />
      <div className={`min-h-screen flex items-center justify-center p-8 relative transition-all duration-300 ${playingScreenFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
        }`}>
        <Card className={`w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl z-10 transition-all duration-300 ${questionFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}>
          <CardContent className="p-8">
            <div className="w-full max-w-6xl mx-auto">
              <div className="flex items-center justify-center gap-12">
                <div className="flex-1 flex justify-center">
                  <Image
                    src="/logo_euvi.png"
                    alt="Logo Eu Vi"
                    width={200}
                    height={160}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="text-3xl px-8 py-4">
                Pergunta {currentQuestionIndex + 1} de 3
              </Badge>
              <div className="text-3xl font-bold text-blue-800">
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
                <div className="relative w-full max-w-3xl h-78 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={currentQuestion.image}
                    alt="Imagem relacionada à pergunta"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            )}

            <div>
              <h2 className="text-3xl text-blue-800 font-semibold mt-4 mb-4 leading-10 text-center">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="grid gap-6 mb-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={getButtonClass(index, currentQuestion.correct, selectedAnswer, showResult)}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="font-bold mr-6 text-3xl">{String.fromCharCode(65 + index)})</span>
                  <span className="flex-1">{option}</span>
                  {showResult && index === currentQuestion.correct && (
                    <CheckCircle className="ml-auto h-12 w-12 text-green-600" />
                  )}
                  {showResult && index === selectedAnswer && index !== currentQuestion.correct && (
                    <XCircle className="ml-auto h-12 w-12 text-red-600" />
                  )}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="text-center">
                <Button
                  onClick={nextQuestion}
                  className="text-3xl px-16 py-12 rounded-3xl bg-blue-800 hover:bg-blue-700 text-white min-w-[400px]"
                >
                  <ArrowBigRightDash className="mr-4 h-12 w-12" />
                  {currentQuestionIndex < 2 ? "Próxima Pergunta" : "Ver Resultado"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}