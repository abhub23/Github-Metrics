import dotenv from 'dotenv'
dotenv.config({ path: '../../.env.development' });
import express from 'express'
import type { Request } from 'express';
import cors from 'cors'
import axios, { AxiosResponse } from 'axios';

const PORT = 3001

const Gemini_API = process.env.GEMINI_API_TOKEN;
const Gemini_API_URL: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${Gemini_API}`;

const app = express()
app.use(cors({
  origin: "*"
}))

app.use(express.json())

//server check
app.get('/', (_, res) => {
  res.json({ message: 'Server is alive' })
})

app.post('/api', async (req: Request, res: any) => {
  const { data1, data2 } = req.body
  try {
    const response: AxiosResponse = await axios.post(Gemini_API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: `Compare these two persons: ${data1} vs ${data2}. Roast the weaker one so bad that he should feel ashamed of it and praise the one who have good repositories
                         and lastly pick a winner. Give the output in about 150-180 words and dont refer to any of them as a user. Just use their names.`,
              },
            ],
          },
        ],
      }
    )

    const result: string = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    return res.status(200).send(result)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(`Error occured in Axios `, err.message);
    }
    console.error('Error occured in Gemini: ', err);
    return;
  }
})

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Running locally on ${PORT}`));
}

export default app;