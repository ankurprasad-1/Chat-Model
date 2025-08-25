import { Router } from 'express';
import { answerFor } from '../answerEngine.js';
//answerqa for handling question and answer logic

const router = Router();//creating new router instance

router.get('/health', (_req, res) => {
  res.json({ message: "The server is running, no error" });
});
//verify if server is running, and shows up in browser

router.post('/ask', async (req, res) => {
    //req for request & res for response
  const { question } = req.body || {};
  //question from request if there is no request then it is empty
  const answer = await answerFor(typeof question === 'string' ? question : '');
  //answer for question basedd on the JSON file in dummyQuestions.json
  res.json({ answer });
});

export default router;