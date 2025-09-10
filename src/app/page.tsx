"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle, XCircle, RotateCcw, Play, ArrowBigRightDash, ClipboardPaste
} from "lucide-react";
import { useQuiz } from "./hooks/useQuiz";
import { backgroundClasses } from "./utils/background-classes";
import { getButtonClass } from "./utils/get-button-class";
import { getScoreMessage } from "./utils/get-score-message";

export default function RecifeQuiz() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const bgImages = ["/frevo.png", "/rosa.png", "/artes.png"];
  const dynamicBackgroundStyle = {
    backgroundImage: `url(${bgImages[currentBgIndex]})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 640);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    const interval = setInterval(
      () => setCurrentBgIndex((i) => (i + 1) % bgImages.length),
      4000
    );
    return () => {
      window.removeEventListener("resize", checkScreenSize);
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

  // ==== refs para rolar a alternativa focada ao centro ====
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
          className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-300 ${startScreenFadeOut ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
            }`}
        >
          <div className="w-full 4k:max-w-[2300px] mb-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-center gap-2">
                <div className="flex-1 flex justify-center ">
                  <Image src="/logo_euvi.png" alt="Logo Eu Vi" width={400} height={300} priority />
                </div>
                <div className="w-px h-12 4k:h-80 bg-blue-700"></div>
                <div className="flex-1 flex justify-center">
                  <Image src="/logorecife.webp" alt="Logo Prefeitura do Recife" width={340} height={300} />
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
                    </span>{" "}
                    <br /> <br />
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
        <div
          className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${finishedScreenFadeOut ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
            }`}
        >
          <Card className="w-full 4k:max-w-[2300px] bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6 text-center">
              <h1 className="4k:text-[100px] font-bold text-blue-800">Quiz Finalizado!</h1>

              <div className="bg-blue-50 p-6 rounded-3xl">
                <div className="4k:text-[85px] font-bold text-blue-800 mb-2">{score}/3</div>
                <div className="4k:text-[70px] text-blue-800 font-semibold">
                  <p>{getScoreMessage(score)}</p>
                </div>
              </div>

              <div className="mb-15 px-20 py-10">
                <h2 className="4k:text-[70px] font-semibold text-blue-800 mb-2">
                  Vem construir esse projeto com a gente!
                </h2>
                <p className="4k:text-[65px] text-blue-900 mb-4 flex align-middle justify-center">
                  Preencha esse formulário e nos ajude a mapear o Recife que vive nas artes.💙
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
      <div
        className={`min-h-screen flex items-center justify-center p-4 relative transition-all duration-300 ${playingScreenFadeOut ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
          }`}
      >
        <Card
          className={`w-full min-h-screen bg-white/95 backdrop-blur-sm shadow-2xl z-10 transition-all duration-300 ${questionFadeOut ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
            }`}
        >
          <CardContent className="p-8">
            <div className="w-full max-w-xl 4k:max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-15">
                <div className="flex-1 flex justify-center ">
                  <Image src="/logo_euvi.png" alt="Logo Eu Vi" width={600} height={500} />
                </div>
                <div className="w-px 4k:h-90  bg-blue-400"></div>
                <div className="flex-1 flex justify-center">
                  <Image src="/logorecife.webp" alt="Logo Prefeitura do Recife" width={700} height={700} />
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

            <div className="flex flex-row gap-10 items-center justify-center w-full">
              {currentQuestion.image && (
                <div className="flex justify-center items-center flex-1">
                  <div className="relative w-full 4k:max-w-[2400px] 4k:h-[2000px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={currentQuestion.image}
                      alt="Imagem relacionada à pergunta"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col ">
                <h2 className="4k:text-[75px] text-blue-800 font-semibold mb-4 leading-normal">
                  {currentQuestion.question}
                </h2>

                <div className="grid gap-5 mb-4">
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
                          " text-sm 4k:text-[65px] py-7 px-9 transition-shadow " +
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
                          <CheckCircle className="ml-auto h-6 w-6 4k:h-[32px] 4k:w-[32px] text-green-600" />
                        )}
                        {showResult && index === selectedAnswer && index !== currentQuestion.correct && (
                          <XCircle className="ml-auto h-6 w-6 4k:h-[32px] 4k:w-[32px] text-red-600" />
                        )}
                      </Button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className="text-center">
                    <Button
                      onClick={nextQuestion}
                      className=" 4k:text-[70px] px-13 py-13 mt-10 rounded-2xl bg-blue-800 hover:bg-blue-700 text-white 4k:min-w-[500px]"
                    >
                      <ArrowBigRightDash className="mr-2 ml-5 h-10 w- 4k:h-[32px] 4k:w-[40px]" />
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
