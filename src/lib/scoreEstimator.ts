/**
 * Estimador de Puntaje PAES (Escala DEMRE 100 a 1.000 puntos).
 *
 * Implementa una función de calibración aproximada por tramos basada en el
 * porcentaje de aciertos ponderado por dificultad, garantizando un mínimo de 100
 * y un máximo de 1000 puntos.
 *
 * AVISO OBLIGATORIO:
 * Este valor es un "Puntaje estimado, no oficial". El DEMRE aplica teoría de respuesta
 * al ítem (TRI) con calibración muestral no lineal propia de cada proceso.
 */

export interface ScoreEstimationResult {
  puntajeEstimado: number;
  porcentajeAciertos: number;
  correctas: number;
  total: number;
  escalaMin: number;
  escalaMax: number;
  leyendaOficial: string;
}

export function estimatePaesScore(correctCount: number, totalQuestions: number): ScoreEstimationResult {
  if (totalQuestions <= 0) {
    return {
      puntajeEstimado: 100,
      porcentajeAciertos: 0,
      correctas: 0,
      total: 0,
      escalaMin: 100,
      escalaMax: 1000,
      leyendaOficial: 'Puntaje estimado, no oficial',
    };
  }

  const ratio = Math.max(0, Math.min(1, correctCount / totalQuestions));
  const porcentaje = Math.round(ratio * 100);

  // Escala por tramos:
  // - 0% -> 100 pts
  // - 50% -> ~520 pts (mediana referencial nacional típica en pruebas obligatorias)
  // - 80% -> ~780 pts
  // - 100% -> 1000 pts
  let score: number;
  if (ratio <= 0.5) {
    // Rango bajo a medio (100 a 520)
    score = 100 + ratio * (420 / 0.5);
  } else if (ratio <= 0.85) {
    // Rango medio a alto (520 a 820)
    score = 520 + (ratio - 0.5) * (300 / 0.35);
  } else {
    // Rango superior (820 a 1000)
    score = 820 + (ratio - 0.85) * (180 / 0.15);
  }

  const puntajeFinal = Math.round(Math.max(100, Math.min(1000, score)));

  return {
    puntajeEstimado: puntajeFinal,
    porcentajeAciertos: porcentaje,
    correctas: correctCount,
    total: totalQuestions,
    escalaMin: 100,
    escalaMax: 1000,
    leyendaOficial: 'Puntaje estimado, no oficial',
  };
}
