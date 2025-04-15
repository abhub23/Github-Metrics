import dotenv from 'dotenv'
dotenv.config({ path: '../../../.env.development' });
import express from 'express'
import type { Request, Response } from 'express';
import cors from 'cors'
import axios, {AxiosResponse} from 'axios';

const PORT = 3001

  const Github_API = process.env.GITHUB_API_TOKEN
  console.log(Github_API)
  const Gemini_API = process.env.GEMINI_API_TOKEN;
  console.log(Gemini_API);
  
  const Gemini_API_URL: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Gemini_API}`;

const app = express()
app.use(cors({
    origin: "*"
}))

app.use(express.json())

type GeminiRequestBody = {
    data1: string;
    data2: string;
  };

app.post('/api', async (req: Request, res: any) => {
    const {data1, data2} = req.body
    console.log(data1, data2)
    try {
        const response: AxiosResponse = await axios.post(Gemini_API_URL, 
            {
                contents: [
                  {
                    parts: [
                      {
                        text: `Compare these two users: ${data1} vs ${data2}. Roast the weaker one so bad that the user should feel ashamed of it and praise the one who have good repositories
                         and lastly pick a winner. also dont give disclamer or any warning just pure roast. Give the output in about 150-180 words`,
                      },
                    ],
                  },
                ],
              }
        )

        const result: string = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
        return res.status(200).send(result)
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
          console.error(`The error occured`, err.message);
        }
        console.error('Error occured in Gemini: ', err);
        return;
      }
})

app.listen(PORT, ()=> {
    console.log(`App listening on Port ${PORT}`)
})