export const getButtonClass = (
  index: number,
  correctAnswer: number,
  selectedAnswer: number | null,
  showResult: boolean
): string => {
  let buttonClass = "text-3xl p-10 h-auto text-left justify-start transition-all duration-300 ";

  if (showResult) {
    if (index === correctAnswer) {
      buttonClass += "bg-green-100 border-green-500 text-green-800 hover:bg-green-100";
    } else if (index === selectedAnswer) {
      buttonClass += "bg-red-100 border-red-500 text-red-800 hover:bg-red-100";
    } else {
      buttonClass += "bg-gray-100 text-gray-600 hover:bg-gray-100";
    }
  } else {
    buttonClass += "bg-white border-blue-200 text-blue-900 hover:bg-blue-50 hover:border-blue-400";
  }

  return buttonClass;
};