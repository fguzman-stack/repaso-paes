import json
from collections import Counter

from generate_lectora_part1 import get_facil
from generate_lectora_part2 import get_normal
from generate_lectora_part3 import get_dificil
from generate_lectora_part4 import get_extremo

facil = get_facil()
normal = get_normal()
dificil = get_dificil()
extremo = get_extremo()

all_lectora = facil + normal + dificil + extremo
print(f"Total Lectora questions assembled: {len(all_lectora)}")

# Verify keys
keys = [q['correcta'] for q in all_lectora]
counts = Counter(keys)
print("Key counts in assembled Lectora:", counts)

# Verify no empty text
for q in all_lectora:
    for a in q['alternativas']:
        assert len(a['texto'].strip()) > 0, f"Empty text in {q['id']} alt {a['id']}"
    assert len(q['explicacionPasoAPaso']) >= 1, f"Missing paso a paso in {q['id']}"

ts_lines = [
    "import { Question } from '@/types';",
    "",
    "export const LECTORA_QUESTIONS: Question[] = ["
]

for q in all_lectora:
    ts_lines.append("  {")
    ts_lines.append(f"    id: {json.dumps(q['id'])},")
    ts_lines.append(f"    materia: {json.dumps(q['materia'])},")
    ts_lines.append(f"    ejeId: {json.dumps(q['ejeId'])},")
    ts_lines.append(f"    tema: {json.dumps(q['tema'])},")
    ts_lines.append(f"    dificultad: {q['dificultad']},")
    ts_lines.append(f"    nivel: {json.dumps(q['nivel'])},")
    if q.get('textoBase'):
        ts_lines.append(f"    textoBase: {json.dumps(q['textoBase'])},")
    ts_lines.append(f"    enunciado: {json.dumps(q['enunciado'])},")
    ts_lines.append("    alternativas: [")
    for alt in q['alternativas']:
        ts_lines.append(f"      {{ id: {json.dumps(alt['id'])}, texto: {json.dumps(alt['texto'])}, explicacionDistractor: {json.dumps(alt['explicacionDistractor'])} }},")
    ts_lines.append("    ],")
    ts_lines.append(f"    correcta: {json.dumps(q['correcta'])},")
    ts_lines.append("    explicacionPasoAPaso: [")
    for step in q['explicacionPasoAPaso']:
        ts_lines.append(f"      {json.dumps(step)},")
    ts_lines.append("    ],")
    ts_lines.append(f"    habilidad: {json.dumps(q['habilidad'])},")
    ts_lines.append(f"    origen: {json.dumps(q['origen'])},")
    ts_lines.append(f"    tags: {json.dumps(q['tags'])},")
    ts_lines.append("  },")

ts_lines.append("];")
ts_lines.append("")

with open('src/data/questions/lectora.data.ts', 'w', encoding='utf-8') as f:
    f.write("\n".join(ts_lines))

print("Successfully wrote full src/data/questions/lectora.data.ts!")
