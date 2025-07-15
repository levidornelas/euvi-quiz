export const getScoreMessage = (score: number): string => {
  switch (score) {
    case 3:
      return "Parabéns! Tu é arretado e sabe tudo sobre o Recife!";
    case 2:
      return "Bateu na trave! Tu é rochedo e quase que gabarita!";
    case 1:
      return "Quase lá! Acompanha o Eu Vi para continuar aprendendo mais sobre nossa cidade!";
    default:
      return "Quase lá! Acompanha o Eu Vi para continuar aprendendo mais sobre nossa cidade!";
  }
};