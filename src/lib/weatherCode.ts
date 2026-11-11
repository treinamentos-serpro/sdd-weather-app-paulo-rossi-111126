interface WeatherCondition {
  description: string;
  icon: string;
}

const conditions: Record<number, WeatherCondition> = {
  0: { description: 'Céu limpo', icon: '☀' },
  1: { description: 'Predominantemente limpo', icon: '🌤' },
  2: { description: 'Parcialmente nublado', icon: '⛅' },
  3: { description: 'Nublado', icon: '☁' },
  45: { description: 'Neblina', icon: '🌫' },
  48: { description: 'Neblina com geada', icon: '🌫' },
  51: { description: 'Garoa leve', icon: '🌦' },
  53: { description: 'Garoa moderada', icon: '🌦' },
  55: { description: 'Garoa intensa', icon: '🌧' },
  56: { description: 'Garoa congelante leve', icon: '🌧' },
  57: { description: 'Garoa congelante intensa', icon: '🌧' },
  61: { description: 'Chuva leve', icon: '🌦' },
  63: { description: 'Chuva moderada', icon: '🌧' },
  65: { description: 'Chuva intensa', icon: '🌧' },
  66: { description: 'Chuva congelante leve', icon: '🌧' },
  67: { description: 'Chuva congelante intensa', icon: '🌧' },
  71: { description: 'Neve leve', icon: '🌨' },
  73: { description: 'Neve moderada', icon: '🌨' },
  75: { description: 'Neve intensa', icon: '❄' },
  77: { description: 'Grãos de neve', icon: '❄' },
  80: { description: 'Pancadas de chuva leves', icon: '🌦' },
  81: { description: 'Pancadas de chuva moderadas', icon: '🌧' },
  82: { description: 'Pancadas de chuva intensas', icon: '🌧' },
  85: { description: 'Pancadas de neve leves', icon: '🌨' },
  86: { description: 'Pancadas de neve intensas', icon: '❄' },
  95: { description: 'Trovoada', icon: '⛈' },
  96: { description: 'Trovoada com granizo leve', icon: '⛈' },
  99: { description: 'Trovoada com granizo intenso', icon: '⛈' },
};

const unavailableCondition: WeatherCondition = {
  description: 'Condição indisponível',
  icon: '—',
};

const unknownCondition: WeatherCondition = {
  description: 'Condição não reconhecida',
  icon: '?',
};

export function getWeatherDescription(code: number | null): string {
  if (code === null) return unavailableCondition.description;
  return conditions[code]?.description ?? unknownCondition.description;
}

export function getWeatherIcon(code: number | null): string {
  if (code === null) return unavailableCondition.icon;
  return conditions[code]?.icon ?? unknownCondition.icon;
}
