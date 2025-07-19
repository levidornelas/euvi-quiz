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
  const [isMobile, setIsMobile] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const bgImages = [
    '/frevo.png',
    '/rosa.png',
    '/artes.png'
  ]

  const dynamicBackgroundStyle = {
    backgroundImage: `url(${bgImages[currentBgIndex]})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex: number) => (prevIndex + 1) % bgImages.length);
    }, 4000);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearInterval(interval);
    };
  }, []);

  const {
    gameState,
    currentQuestionIndex,
    selectedAnswer,
    showResult,
    score,
    answers,
    currentQuestion,
    showVideo,
    videoFadeOut,
    videoFadeIn,
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
        <div
          className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 transition-all duration-2000 ease-in-out -z-10"
          style={isMobile ? dynamicBackgroundStyle : {}}
        />
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-300 ${startScreenFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}>
          <div className="w-full max-w-xl lg:max-w-3xl mb-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-center gap-6">
                <div className="flex-1 flex justify-center">
                  <Image
                    src="/logo_euvi.png"
                    alt="Logo Eu Vi"
                    width={120}
                    height={80}
                    priority
                  />
                </div>
                <div className="w-px h-12 md:h-16 lg:h-20 bg-blue-700"></div>
                <div className="flex-1 flex justify-center">
                  <Image
                    src="/logorecife.webp"
                    alt="Logo Prefeitura do Recife"
                    width={90}
                    height={70}
                  />
                </div>
              </div>
              <p className="text-lg md:text-xl lg:text-3xl text-blue-800 mt-4 font-bold text-center">
                Ciência também é memória, cultura e território
              </p>
            </div>
          </div>

          <Card className="w-full max-w-xl lg:max-w-3xl bg-white/95 backdrop-blur-sm shadow-2xl mb-12">
            <CardContent className="p-6 text-center w-full">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-800 mb-2">Você viu?</h1>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="md:text-lg lg:text-2xl text-blue-800">
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
                className="text-lg md:text-xl lg:text-2xl py-8 px-8 rounded-xl bg-blue-800 hover:bg-blue-700 text-white cursor-pointer min-w-[200px] md:min-w-[250px] lg:min-w-[300px]"
              >
                <Play className="mr-2 h-6 w-6" />
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
        <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${finishedScreenFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}>
          <Card className="w-full max-w-xl lg:max-w-3xl bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-800">Quiz Finalizado!</h1>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-4xl md:text-5xl font-bold text-blue-800 mb-2">{score}/3</div>
                <div className="text-lg md:text-xl lg:text-2xl text-blue-800 font-semibold">
                  <p>{getScoreMessage(score)}</p>
                </div>
              </div>
              <div className="text-center px-2">
                <p className="text-base md:text-lg lg:text-xl font-semibold text-blue-800 mb-4 leading-snug">
                  Valeu por embarcar com a gente nesse passeio pela arte e pela memória do Recife!
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {answers.map((correct, index) => (
                  <div key={index} className="flex items-center justify-center p-1 bg-white rounded-lg shadow-lg">
                    <span className="text-lg md:text-xl font-semibold mr-2">Q{index + 1}:</span>
                    {correct ? (
                      <CheckCircle className="h-7 w-7 md:h-9 md:w-9 text-green-500" />
                    ) : (
                      <XCircle className="h-7 w-7 md:h-9 md:w-9 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
              <Button
                onClick={resetQuiz}
                size="lg"
                className="text-lg md:text-xl lg:text-2xl px-8 py-8 rounded-xl bg-blue-800 hover:bg-blue-700 text-white min-w-[200px] md:min-w-[250px] lg:min-w-[300px]"
              >
                <RotateCcw className="mr-2 h-6 w-6" />
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
      <div className={`min-h-screen flex items-center justify-center p-4 relative transition-all duration-300 ${playingScreenFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
        }`}>
        {showVideo && currentQuestion.mediaAfter && (
          <div className={`fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center transition-opacity duration-500 ${videoFadeOut ? 'opacity-0' : (videoFadeIn ? 'opacity-100' : 'opacity-0')
            }`}>
            <div className={`bg-white rounded-lg overflow-hidden max-w-xl lg:max-w-3xl w-full transition-all duration-500 transform ${videoFadeOut ? 'opacity-0 scale-95' : videoFadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
              <video
                src={currentQuestion.mediaAfter}
                controls
                autoPlay
                className="w-full h-auto"
                onEnded={hideVideo}
              />
            </div>
          </div>
        )}

        <Card className={`w-full max-w-xl lg:max-w-3xl bg-white/95 backdrop-blur-sm shadow-2xl z-10 transition-all duration-300 ${questionFadeOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}>
          <CardContent className="p-6">
            <div className="w-full max-w-xl lg:max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-6">
                <div className="flex-1 flex justify-center">
                  <Image
                    src="/logo_euvi.png"
                    alt="Logo Eu Vi"
                    width={90}
                    height={60}
                  />
                </div>
                <div className="w-px h-12 md:h-16 lg:h-20 bg-blue-400"></div>
                <div className="flex-1 flex justify-center">
                  <Image
                    src="/logorecife.webp"
                    alt="Logo Prefeitura do Recife"
                    width={80}
                    height={70}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <Badge variant="secondary" className="text-sm md:text-base lg:text-lg px-3 py-1 md:px-4 md:py-2">
                Pergunta {currentQuestionIndex + 1} de 3
              </Badge>
              <div className="text-base md:text-lg lg:text-xl font-bold text-blue-800">
                Pontuação: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}
              </div>
            </div>

            <div className="w-full bg-blue-200 rounded-full h-2 md:h-3 mb-4">
              <div
                className="bg-blue-600 h-2 md:h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + (showResult ? 1 : 0)) / 3) * 100}%` }}
              />
            </div>

            {currentQuestion.image && (
              <div className="flex justify-center items-center">
                <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg h-40 md:h-56 lg:h-64 rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={currentQuestion.image}
                    alt="Imagem relacionada à pergunta"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div>
              <h2 className="text-sm md:text-xl lg:text-2xl sm:text-xl text-blue-800 font-semibold mt-1 leading-normal text-center">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="grid gap-3 mb-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={getButtonClass(index, currentQuestion.correct, selectedAnswer, showResult) + " text-sm md:text-base lg:text-lg py-2 px-3"}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="font-bold mr-2 text-base md:text-lg">{String.fromCharCode(65 + index)})</span>
                  <span className="flex-1 text-left">{option}</span>
                  {showResult && index === currentQuestion.correct && (
                    <CheckCircle className="ml-auto h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  )}
                  {showResult && index === selectedAnswer && index !== currentQuestion.correct && (
                    <XCircle className="ml-auto h-5 w-5 md:h-6 md:w-6 text-red-600" />
                  )}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="text-center">
                <Button
                  onClick={nextQuestion}
                  className="text-lg md:text-xl lg:text-2xl px-8 py-8 rounded-xl bg-blue-800 hover:bg-blue-700 text-white min-w-[200px] md:min-w-[250px] lg:min-w-[300px]"
                >
                  <ArrowBigRightDash className="mr-2 h-6 w-6" />
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