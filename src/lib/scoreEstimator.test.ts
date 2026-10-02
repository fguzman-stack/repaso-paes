import { describe, it, expect } from 'vitest';
import { estimatePaesScore } from './scoreEstimator';

describe('estimatePaesScore', () => {
  it('debe retornar 100 puntos mínimos si hay 0 aciertos', () => {
    const res = estimatePaesScore(0, 30);
    expect(res.puntajeEstimado).toBe(100);
    expect(res.porcentajeAciertos).toBe(0);
    expect(res.leyendaOficial).toBe('Puntaje estimado, no oficial');
  });

  it('debe retornar 1000 puntos máximos con 100% de aciertos', () => {
    const res = estimatePaesScore(30, 30);
    expect(res.puntajeEstimado).toBe(1000);
    expect(res.porcentajeAciertos).toBe(100);
  });

  it('debe situar el 50% de aciertos en aproximadamente 520 puntos referenciales', () => {
    const res = estimatePaesScore(15, 30);
    expect(res.puntajeEstimado).toBe(520);
    expect(res.porcentajeAciertos).toBe(50);
  });

  it('debe mantenerse monótonamente creciente con más respuestas correctas', () => {
    const score10 = estimatePaesScore(10, 30).puntajeEstimado;
    const score15 = estimatePaesScore(15, 30).puntajeEstimado;
    const score25 = estimatePaesScore(25, 30).puntajeEstimado;

    expect(score15).toBeGreaterThan(score10);
    expect(score25).toBeGreaterThan(score15);
  });

  it('maneja casos borde con 0 preguntas totales sin arrojar división por cero', () => {
    const res = estimatePaesScore(0, 0);
    expect(res.puntajeEstimado).toBe(100);
    expect(res.porcentajeAciertos).toBe(0);
  });
});
