import appConfig from '../../app.config.json';

type AppConfig = {
  calculatorApiUrl?: string;
};

const cleanUrl = (url?: string) => {
  if (!url) {
    return undefined;
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const env: Required<AppConfig> = {
  calculatorApiUrl:
    cleanUrl(appConfig.calculatorApiUrl) ??
    'https://your-heroku-calculator-app.herokuapp.com',
};
