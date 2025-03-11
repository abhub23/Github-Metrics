import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import githublogo from './Components/Images/github-logo.png';
import Button from './Components/Button';
import Input from './Components/Input';
import { div } from 'framer-motion/client';

function App() {
  const [userOneName, setUserOneName] = useState<string>('');
  const [userTwoName, setUserTwoName] = useState<string>('');
  const [avatarOne, setAvatarOne] = useState<string>('');
  const [avatarTwo, setAvatarTwo] = useState<string>('');
  const [user1, setUser1] = useState<number[]>([]);
  const [user2, setUser2] = useState<number[]>([]);
  const [responseData, setResponseData] = useState<string>('');

  const Github_API: string = import.meta.env.VITE_GITHUB_API_TOKEN;
  const Gemini_API: string = import.meta.env.VITE_GEMINI_API_TOKEN;
  const Gemini_API_URL: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Gemini_API}`;

  const handleUserOne = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserOneName(e.target.value);
  };

  const handleUserTwo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserTwoName(e.target.value);
  };

  const userOne: Function = async (): Promise<void> => {
    try {
      const obj1: AxiosResponse = await axios.get(
        `https://api.github.com/users/${userOneName}`,
        {
          headers: {
            Authorization: `Bearer ${Github_API}`,
          },
        }
      );
      const res: string = obj1.data.avatar_url;
      setAvatarOne(res);

      const userData: object = {
        public_repos: obj1.data.public_repos,
        followers: obj1.data.followers,
        created: obj1.data.id,
      };
      /*
      setUser1(Object.values(userData).map((value) => Number(value)));
      console.log(user1); // ❌ Logs old state (React has not updated user1 yet) 
      it schedules the re-render coz its asynchronous and dont do it immediately
       */
      setUser1((): number[] => {
        const dataArr: number[] = Object.values(userData).map((value) => Number(value));
        console.log('User 1 data: ', dataArr); // ✅ Correct Updated Value
        return dataArr;
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(`API Error: ${err.response?.status} - ${err.message}`);
        console.error('Response Data:', err.response?.data);
      } else {
        console.error('Unexpected Error for user 1:', err);
      }
    }
  };

  const userTwo: Function = async (): Promise<void> => {
    try {
      const obj2: AxiosResponse = await axios.get(
        `https://api.github.com/users/${userTwoName}`,
        {
          headers: {
            Authorization: `Bearer ${Github_API}`,
          },
        }
      );
      const res: string = obj2.data.avatar_url;
      setAvatarTwo(res);

      const userData: object = {
        public_repos: obj2.data.public_repos,
        followers: obj2.data.followers,
        created: obj2.data.id,
      };

      setUser2((): number[] => {
        const dataArr2: number[] = Object.values(userData).map((values) => Number(values)
        );
        console.log('User 2 data: ', dataArr2);
        return dataArr2;
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(`API Error: ${err.response?.status} - ${err.message}`);
        console.error('Response Data:', err.response?.data);
      } else {
        console.error('Unexpected Error for user 2:', err);
      }
    }
  };

  useEffect(() => {
    if (!userOneName) return; // Don't fetch if inputs are empty
    const delaySearch = setTimeout(() => {
      userOne();
    }, 500); // 500-ms delay after user stops typing

    return () => {
      clearTimeout(delaySearch); // Cleanup timeout on each change
    };
  }, [userOneName]);

  useEffect(() => {
    if (!userTwoName) return; // Don't fetch if inputs are empty
    const delaySearch = setTimeout(() => {
      userTwo();
    }, 500); // 500-ms delay after user stops typing

    return () => {
      clearTimeout(delaySearch); // Cleanup timeout on each change
    };
  }, [userTwoName]);

  const handleCompare: Function = async (): Promise<void> => {
    if (userOneName && userTwoName) {
      let data1: string = `${userOneName} who have ${user1[0]} github repositories and have ${user1[1]} followers on github and ${userOneName}'s github id is ${user1[2]}`;
      let data2: string = `${userTwoName} who have ${user2[0]} github repositories and have ${user2[1]} followers on github and ${userTwoName}'s github id is ${user2[2]}`;
      try {
        const response: AxiosResponse = await axios.post(Gemini_API_URL, {
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

        const result: string = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
        setResponseData(result)

      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          console.error(`The error occured`, err.message);
        }
        console.error('Error occured in Gemini: ', err);
      }
    }
  };
  useEffect(() => {
    console.log(responseData); // Logs after state update
  }, [responseData]);

  return (
    <>
      <div className=" bg-[radial-gradient(circle_at_left,_purple_10%,_pink_50%,_yellow_90%)] p-4 bg-cover bg-center h-screen flex text-white">
        <div className="bg-transparent h-56 w-full">
          <div className="h-56 bg-transparent mx-80 flex justify-center items-center">
            <div className="relative">
              <img
                className="h-56 mr-36 rounded-full"
                src={githublogo}
                alt="github logo"
              />
              <img
                className="h-56 rounded-full absolute top-1/2 left-28 transform -translate-x-1/2 -translate-y-1/2 text-transparent"
                src={avatarOne}
                alt="user one image"
              />
            </div>

            <div className="relative ">
              <img
                className="h-56 ml-36 rounded-full"
                src={githublogo}
                alt="github logo"
              />
              <img
                className="h-56  rounded-full absolute top-1/2 left-64 transform -translate-x-1/2 -translate-y-1/2 text- text-transparent"
                src={avatarTwo}
                alt="user two image"
              />
            </div>
          </div>
          <div className="bg-transparent gap-70 flex justify-around mx-90 pl-6 pr-8 mt-12 h-12">
            <Input value={userOneName} onChange={handleUserOne} />
            <Input value={userTwoName} onChange={handleUserTwo} />
          </div>
          <div className="h-14 mt-4 gap-10 flex justify-center bg-transparent">
            <Button
              btnName="Reset"
              color="bg-red-400"
              border="border-red-600"
              onClick={() => {
                setUserOneName('');
                setUserTwoName('');
                setAvatarOne('');
                setAvatarTwo('');
                setResponseData('');
              }}
            />
            <Button
              btnName="Compare"
              color="bg-blue-400"
              border='border-blue-600'
              onClick={handleCompare}
            />
          </div>
          {responseData != "" ? (
            <div className='h-56 bg-white mx-32 p-4 text-md text-md mt-6 rounded-3xl text-black font-mono'>
              {responseData}
            </div>
          ) :
            <div className='h-56 bg-transparent mx-32 p-4 text-md rounded-3xl text-black font-mono'>
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default App;
