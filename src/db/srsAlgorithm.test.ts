import { describe, it, expect } from 'vitest';
import { calculateSM2, booleanToSM2Quality } from './srsAlgorithm';

describe('calculateSM2 Algorithm', () => {
  const baseDate = new Date('2026-10-01T12:00:00Z');

  it('primer acierto (calidad 5) debe fijar intervalo en 1 día', () => {
    const res = calculateSM2(5, { repetitionNumber: 0, intervalDays: 1, easeFactor: 2.5 }, baseDate);
    expect(res.repetitionNumber).toBe(1);
    expect(res.intervalDays).toBe(1);
    expect(res.nextReviewDate).toBe('2026-10-02');
    expect(res.easeFactor).toBe(2.6); // 2.5 + (0.1 - 0) = 2.6
  });

  it('segundo acierto consecutivo debe fijar intervalo en 6 días', () => {
    const res = calculateSM2(4, { repetitionNumber: 1, intervalDays: 1, easeFactor: 2.6 }, baseDate);
    expect(res.repetitionNumber).toBe(2);
    expect(res.intervalDays).toBe(6);
    expect(res.nextReviewDate).toBe('2026-10-07');
  });

  it('tercer acierto consecutivo multiplica intervalo previo por el Ease Factor', () => {
    const res = calculateSM2(4, { repetitionNumber: 2, intervalDays: 6, easeFactor: 2.6 }, baseDate);
    expect(res.repetitionNumber).toBe(3);
    // 6 * 2.6 = 15.6 -> round = 16 días
    expect(res.intervalDays).toBe(16);
  });

  it('un fallo (calidad < 3) reinicia las repeticiones consecutivas a 0 y el intervalo a 1 día', () => {
    const res = calculateSM2(1, { repetitionNumber: 4, intervalDays: 30, easeFactor: 2.5 }, baseDate);
    expect(res.repetitionNumber).toBe(0);
    expect(res.intervalDays).toBe(1);
    expect(res.nextReviewDate).toBe('2026-10-02');
  });

  it('el Ease Factor nunca cae por debajo de 1.3 incluso con fallos repetidos', () => {
    let state = { repetitionNumber: 0, intervalDays: 1, easeFactor: 1.4 };
    // Múltiples fallos severos
    state = calculateSM2(0, state, baseDate);
    state = calculateSM2(0, state, baseDate);
    state = calculateSM2(0, state, baseDate);
    expect(state.easeFactor).toBe(1.3);
  });
});

describe('booleanToSM2Quality', () => {
  it('retorna 1 si la respuesta es incorrecta', () => {
    expect(booleanToSM2Quality(false, 10)).toBe(1);
    expect(booleanToSM2Quality(false, 60)).toBe(1);
  });

  it('retorna 5 si la respuesta es correcta y rápida (<= 45s)', () => {
    expect(booleanToSM2Quality(true, 20)).toBe(5);
  });

  it('retorna 4 si la respuesta es correcta pero tardó más de 45s', () => {
    expect(booleanToSM2Quality(true, 50)).toBe(4);
  });
});
