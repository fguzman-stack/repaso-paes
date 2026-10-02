import { describe, it, expect } from 'vitest';
import { getLevelFromXP, getXPForNextLevel } from './useUserStore';

describe('useUserStore calculations', () => {
  it('nivel 1 parte en 0 XP', () => {
    expect(getLevelFromXP(0)).toBe(1);
    expect(getLevelFromXP(50)).toBe(1);
  });

  it('sube de nivel cuando el XP supera el umbral matemático', () => {
    // 100 * 1^1.4 = 100 XP
    expect(getLevelFromXP(100)).toBe(2);
    // 100 * 2^1.4 = 100 * 2.639 = 263 XP
    expect(getLevelFromXP(270)).toBe(3);
  });

  it('calcula correctamente el requerimiento de XP para el siguiente nivel', () => {
    const nextReq1 = getXPForNextLevel(1);
    const nextReq2 = getXPForNextLevel(2);
    expect(nextReq2).toBeGreaterThan(nextReq1);
  });
});
