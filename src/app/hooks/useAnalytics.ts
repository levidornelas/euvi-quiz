import { track } from '@vercel/analytics';

export const useVercelAnalytics = () => {
  const trackQuizStart = () => {
    track('Vezes que o Quiz foi feito', {
      quiz_name: 'Recife Quiz'
    });
  };

  return {
    trackQuizStart,
  };
};