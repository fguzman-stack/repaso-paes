import { describe, it, expect } from 'vitest';
import { ALL_QUESTIONS, getQuestionsByNivel } from './index';

describe('Banco de Preguntas PAES y 4 Niveles', () => {
  it('contiene al menos 15 preguntas en cada nivel de dificultad en M1', () => {
    const m1Facil = ALL_QUESTIONS.filter((q) => q.materia === 'm1' && q.dificultad === 1);
    const m1Normal = ALL_QUESTIONS.filter((q) => q.materia === 'm1' && q.dificultad === 2);
    const m1Dificil = ALL_QUESTIONS.filter((q) => q.materia === 'm1' && q.dificultad === 3);
    const m1Extremo = ALL_QUESTIONS.filter((q) => q.materia === 'm1' && q.dificultad === 4);

    expect(m1Facil.length).toBeGreaterThanOrEqual(15);
    expect(m1Normal.length).toBeGreaterThanOrEqual(15);
    expect(m1Dificil.length).toBeGreaterThanOrEqual(15);
    expect(m1Extremo.length).toBeGreaterThanOrEqual(15);
  });

  it('contiene al menos 15 preguntas en cada nivel de dificultad en Competencia Lectora', () => {
    const lecFacil = ALL_QUESTIONS.filter((q) => q.materia === 'lectora' && q.dificultad === 1);
    const lecNormal = ALL_QUESTIONS.filter((q) => q.materia === 'lectora' && q.dificultad === 2);
    const lecDificil = ALL_QUESTIONS.filter((q) => q.materia === 'lectora' && q.dificultad === 3);
    const lecExtremo = ALL_QUESTIONS.filter((q) => q.materia === 'lectora' && q.dificultad === 4);

    expect(lecFacil.length).toBeGreaterThanOrEqual(15);
    expect(lecNormal.length).toBeGreaterThanOrEqual(15);
    expect(lecDificil.length).toBeGreaterThanOrEqual(15);
    expect(lecExtremo.length).toBeGreaterThanOrEqual(15);
  });

  it('getQuestionsByNivel retorna preguntas para los 4 niveles solicitados', () => {
    const facil = getQuestionsByNivel('facil');
    const normal = getQuestionsByNivel('normal');
    const dificil = getQuestionsByNivel('dificil');
    const extremo = getQuestionsByNivel('extremo');

    expect(facil.length).toBeGreaterThanOrEqual(30);
    expect(normal.length).toBeGreaterThanOrEqual(30);
    expect(dificil.length).toBeGreaterThanOrEqual(30);
    expect(extremo.length).toBeGreaterThanOrEqual(30);
  });

  it('distribución equilibrada e impredecible de claves correctas (evita sesgo en A)', () => {
    const keyCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    ALL_QUESTIONS.forEach((q) => {
      keyCounts[q.correcta] = (keyCounts[q.correcta] || 0) + 1;
    });

    const total = ALL_QUESTIONS.length;
    // Cada alternativa debe concentrar entre el 15% y 35% del total para garantizar impredecibilidad profesional
    expect(keyCounts['A'] / total).toBeGreaterThanOrEqual(0.18);
    expect(keyCounts['A'] / total).toBeLessThanOrEqual(0.32);

    expect(keyCounts['B'] / total).toBeGreaterThanOrEqual(0.18);
    expect(keyCounts['B'] / total).toBeLessThanOrEqual(0.32);

    expect(keyCounts['C'] / total).toBeGreaterThanOrEqual(0.18);
    expect(keyCounts['C'] / total).toBeLessThanOrEqual(0.32);

    expect(keyCounts['D'] / total).toBeGreaterThanOrEqual(0.18);
    expect(keyCounts['D'] / total).toBeLessThanOrEqual(0.32);
  });

  it('todas las preguntas tienen alternativas válidas y paso a paso', () => {
    ALL_QUESTIONS.forEach((q) => {
      expect(q.alternativas.length).toBeGreaterThanOrEqual(4);
      expect(['A', 'B', 'C', 'D', 'E']).toContain(q.correcta);
      const match = q.alternativas.find((a) => a.id === q.correcta);
      expect(match).toBeDefined();
      expect(match!.texto.trim().length).toBeGreaterThan(0);
      expect(q.explicacionPasoAPaso.length).toBeGreaterThanOrEqual(1);
      expect(q.habilidad).toBeDefined();
    });
  });
});
