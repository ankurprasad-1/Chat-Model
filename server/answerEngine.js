// server/answerEngine.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Fuse from 'fuse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'dummyQuestions.json');
let QA = [];
try {
  const raw = fs.readFileSync(dataPath, 'utf8');
  QA = JSON.parse(raw);
} catch {
  QA = [];
}

//replace w/ fuse from utils/answerEngine.js
const fuse = new Fuse(QA, {
  keys: ['question'],
  includeScore: true,
  threshold: 0.5,
  ignoreLocation: true,
  distance: 100,
});

const CUTOFF = 0.4;
//const CUTOFF = 0.7
const DEFAULT = "I cannot answer that. If this is working then, fuse.js is working. Please try asking something else";

export async function answerFor(input) {
  const q = (input || '').trim().toLowerCase();
  if (!q) return DEFAULT;

  const results = fuse.search(q);
  const hit = results[0];
  if (hit && hit.score <= CUTOFF) {
    return hit.item.answer;
  }
  return DEFAULT;
}
