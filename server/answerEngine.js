import fs from 'fs'; //fs for file ystem opeations
import path from 'path';
import { fileURLToPath } from 'url';
//URL turns into file path string

const __filename = fileURLToPath(import.meta.url);
//get name of directory from the path, assigned to filename
const __dirname = path.dirname(__filename);
//directory name from the file path
const data_Path = path.join(__dirname, 'dummyQuestions.json');
let QA = [];
//Q/A array
try {
  const raw = fs.readFileSync(data_Path, 'utf8');
  //read the file synchronously, utf8 is the encoding
  QA = JSON.parse(raw);
} catch {
  QA = [];
}

export async function answerFor(input) {
    //function to find the answer based on input question from prompt
  const question = (input || '').trim().toLowerCase();
  if (!question) return "I am unable to answer that currently, please try again.";

  // if exact answer based on
  const exact = QA.find(x => (x.question || '').toLowerCase() === question);
  if (exact) return exact.answer;

  // loose contains
  const loose = QA.find(x => (x.question || '').toLowerCase().includes(question) || question.includes((x.question || '').toLowerCase()));
  if (loose) return loose.answer;

  return "I cannot answer that. Please try asking something else.";
}