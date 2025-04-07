import express from 'express'
import cors from 'cors'
import axios {isAxiosError} from 'axios';
import dotenv from 'dotenv'
import { isAxiosError } from 'axios'
dotenv.config();

const PORT = 3001
console.log(process.env.GITHUB_API_TOKEN)
  const Github_API = process.env.GITHUB_API_TOKEN
  const Gemini_API = process.env.GEMINI_API_TOKEN;
  const Gemini_API_URL: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Gemini_API}`;

  console.log(Github_API)
const app = express()
app.use(cors({
    origin: "*"
}))

app.use(express.json())

app.get('/api', async (req, res) => {
    const data1 = req.query.data1
    const data2 = req.query.data2
    try {
        const data =  await axios.get(Gemini_API_URL, {
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
          });
    } catch (error) {
        
    }
})

app.listen(PORT, ()=> {
    console.log(`App listening on Port ${PORT}`)
})