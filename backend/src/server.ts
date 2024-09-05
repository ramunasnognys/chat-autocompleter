import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/api/suggest', async (req, res) => {
  try {
    const { text } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert at Autocompleting Sentences. ALWAYS end your suggestions on a completed sentence. Do not use quotation marks in your responses." },
        { role: "user", content: `Complete this: ${text}` }
      ],
      max_tokens: 50,
    });

    const suggestion = completion.choices[0].message.content?.trim() || '';
    res.json({ suggestion });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the suggestion.' });
  }
});

app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert at summarizing a text in a concise format expressed in bulleted points in a list, seperate lines for each point." },
        { role: "user", content: `Summarize the following text in a few sentences: "${text}"` }
      ],
      max_tokens: 100,
    });

    const summary = completion.choices[0].message.content?.trim() || '';
    res.json({ summary });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the summary.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});