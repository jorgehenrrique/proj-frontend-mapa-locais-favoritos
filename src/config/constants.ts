/** Constantes da aplicação */

/** Delay (ms) antes de fechar o dialog de confirmação após animação de saída */
export const CONFIRM_DIALOG_CLOSE_DELAY_MS = 200;

/** Duração (ms) padrão do toast na tela antes de sumir */
export const TOAST_DEFAULT_DURATION_MS = 4000;

/** Delay (ms) antes de remover o toast do DOM após animação de saída */
export const TOAST_EXIT_DELAY_MS = 300;

/** Tempo (ms) que os dados da query ficam "frescos" antes de refetch (5 min) */
export const QUERY_STALE_TIME_MS = 1000 * 60 * 5;

/** Número de tentativas de retry em queries que falham */
export const QUERY_RETRY_COUNT = 1;

/** Tempo (ms) que o resultado de geocode fica em cache (10 min) */
export const GEOCODE_STALE_TIME_MS = 1000 * 60 * 10;

/** Quantidade máxima de resultados retornados na busca de endereço */
export const GEOCODE_MAX_RESULTS = 3;

/** Mínimo de caracteres no input para habilitar busca de endereço */
export const GEOCODE_MIN_INPUT_LENGTH = 3;

/** Zoom do mapa ao focar em um endereço ou marcador de busca */
export const MAP_ZOOM_ON_FOCUS = 15;
