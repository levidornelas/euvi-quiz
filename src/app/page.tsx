"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle, XCircle, RotateCcw, Play, ArrowBigRightDash
} from "lucide-react";
import { useQuiz } from "./hooks/useQuiz";
import { backgroundClasses } from "./utils/background-classes";
import { getButtonClass } from "./utils/get-button-class";
import { getScoreMessage } from "./utils/get-score-message";

export default function RecifeQuiz() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const bgImages = ["/frevo.png", "/rosa.png", "/artes.png"];
  const dynamicBackgroundStyle = {
    backgroundImage: `url(${bgImages[currentBgIndex]})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentBgIndex((i) => (i + 1) % bgImages.length),
      4000
    );
    return () => {
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

  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    if (selectedAnswer == null) return;
    const el = optionRefs.current[selectedAnswer];
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selectedAnswer]);

  if (gameState === "start") {
    return (
      <>
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 transition-all duration-2000 ease-in-out -z-10 bg-card"
          style={dynamicBackgroundStyle}
        />
        <div
          className={`min-h-screen flex flex-col items-center justify-center px-8 py-6 transition-all duration-300 ${startScreenFadeOut ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
            }`}
        >
          <div className="w-full max-w-5xl mb-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 flex justify-center">
                  <Image src="/logo_euvi.png" alt="Logo Eu Vi" width={110} height={110} priority />
                </div>
              </div>
              <p className="text-center text-xl text-blue-800 mt-3 font-bold">
                Ciência também é memória, cultura e território
              </p>
            </div>
          </div>

          <Card className="w-full max-w-5xl bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8 text-center w-full">
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-blue-800 mb-4">Você viu?</h1>
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <p className="text-2xl text-blue-800 leading-relaxed">
                    Chegou a hora de testar o quanto você conhece do Recife que vive nas artes! <br /><br />
                    <span className="font-semibold text-blue-900">
                      Cultura, memória e arte em forma de quiz.
                    </span>{" "}
                    <br /> <br />
                    Vai encarar? <span className="font-bold">Simbora!</span>
                  </p>
                </div>
              </div>
              <Button
                onClick={startQuiz}
                className="text-2xl py-6 px-10 rounded-2xl bg-blue-800 hover:bg-blue-700 text-white cursor-pointer min-w-[300px]"
              >
                <Play className="mr-3 h-8 w-8" />
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
        <div
          className={`min-h-screen flex items-center justify-center p-6 transition-all duration-300 ${finishedScreenFadeOut ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
            }`}
        >
          <Card className="w-full max-w-6xl bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6 text-center">
              <h1 className="text-5xl font-bold text-blue-800 mb-4">Quiz Finalizado!</h1>

              <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                <div className="text-3xl font-bold text-blue-800 mb-2">{score}/3</div>
                <div className="text-2xl text-blue-800 font-semibold">
                  <p>{getScoreMessage(score)}</p>
                </div>
              </div>

              <div className="px-8 py-4 mb-4">
                <h2 className="text-2xl font-semibold text-blue-800 mb-2">
                  Vem construir esse projeto com a gente!
                </h2>
                <p className="text-lg text-blue-900 mb-2">
                  Preencha esse formulário e nos ajude a mapear o Recife que vive nas artes.💙
                </p>
                <p className="text-xl text-blue-800 leading-snug font-semibold mb-1">
                  Quer continuar essa viagem?
                </p>
                <p className="text-xl text-blue-800 leading-snug mb-3">
                  Aponte a câmera pro <strong>QR Code</strong> e acompanhe o <strong>Eu Vi!</strong>
                </p>
                <Image
                  src="/insta_qrcode.png"
                  alt="QR Code para seguir o Eu Vi no Instagram"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
              <div className="grid grid-cols-3 gap-6 mb-6">
                {answers.map((correct, index) => (
                  <div key={index} className="flex items-center justify-center p-3 bg-white rounded-xl shadow-lg">
                    <span className="text-xl font-semibold mr-3">Q{index + 1}:</span>
                    {correct ? (
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    ) : (
                      <XCircle className="h-10 w-10 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
              <Button
                onClick={resetQuiz}
                size="lg"
                className="text-2xl px-10 py-6 rounded-2xl bg-blue-800 hover:bg-blue-700 text-white min-w-[300px]"
              >
                <RotateCcw className="mr-3 h-8 w-8" />
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
      <div
        className={`min-h-screen flex items-center justify-center p-4 relative transition-all duration-300 ${playingScreenFadeOut ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
          }`}
      >
        <Card
          className={`w-full max-w-[85vw] max-h-[92vh] bg-white/95 backdrop-blur-sm shadow-2xl z-10 transition-all duration-300 ${questionFadeOut ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
            }`}
        >
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-3">
              <Badge variant="secondary" className="text-base px-3 py-1.5">
                Pergunta {currentQuestionIndex + 1} de 3
              </Badge>
              <div className="text-base font-bold text-blue-800">
                Pontuação: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}
              </div>
            </div>

            <div className="w-full bg-blue-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + (showResult ? 1 : 0)) / 3) * 100}%` }}
              />
            </div>

            <div className="flex flex-row gap-5 items-center justify-center w-full">
              {currentQuestion.image && (
                <div className="flex justify-center items-center flex-1">
                  <div className="relative w-full max-w-md h-[280px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={currentQuestion.image}
                      alt="Imagem relacionada à pergunta"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col">
                <h2 className="text-xl text-blue-800 font-semibold mb-3 leading-normal">
                  {currentQuestion.question}
                </h2>

                <div className="grid gap-2.5 mb-3">
                  {currentQuestion.options.map((option: string, index: number) => {
                    const isFocused = !showResult && selectedAnswer === index;
                    return (
                      <Button
                        key={index}
                        ref={(el) => { optionRefs.current[index] = el as HTMLButtonElement | null; }}
                        variant="outline"
                        aria-selected={isFocused}
                        className={
                          getButtonClass(index, currentQuestion.correct, selectedAnswer, showResult) +
                          " text-sm py-3 px-4 transition-shadow " +
                          (isFocused
                            ? " ring-2 ring-blue-600 border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.15)] "
                            : "")
                        }
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + index)}) </span>
                        <span className="flex-1">{option}</span>
                        {showResult && index === currentQuestion.correct && (
                          <CheckCircle className="ml-auto h-4 w-4 text-green-600" />
                        )}
                        {showResult && index === selectedAnswer && index !== currentQuestion.correct && (
                          <XCircle className="ml-auto h-4 w-4 text-red-600" />
                        )}
                      </Button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className="text-center">
                    <Button
                      onClick={nextQuestion}
                      className="text-base px-7 py-5 mt-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white min-w-[220px]"
                    >
                      <ArrowBigRightDash className="mr-2 h-5 w-5" />
                      {currentQuestionIndex < 2 ? "Próxima Pergunta" : "Ver Resultado"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}