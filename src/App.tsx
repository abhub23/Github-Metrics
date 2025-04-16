import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import github from './lib/github.png';
import Button from './components/Button';
import Input from './components/Input';
import { Particles } from './components/magicui/particles';
import { TypewriterEffectSmooth } from './components/ui/typewriter-effect';
import sweetalert from './helpers/alert';

function App() {
  const [userOneName, setUserOneName] = useState<string>('');
  const [userTwoName, setUserTwoName] = useState<string>('');
  const [avatarOne, setAvatarOne] = useState<string>('');
  const [avatarTwo, setAvatarTwo] = useState<string>('');
  const [user1, setUser1] = useState<number[]>([]);
  const [user2, setUser2] = useState<number[]>([]);
  const [responseData, setResponseData] = useState<string>('');

  const Github_API: string = import.meta.env.VITE_GITHUB_API_TOKEN;

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
        const dataArr: number[] = Object.values(userData).map((value) =>
          Number(value)
        );
        //console.log('User 1 data: ', dataArr); // ✅ Correct Updated Value
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
        const dataArr2: number[] = Object.values(userData).map((values) =>
          Number(values)
        );
        //console.log('User 2 data: ', dataArr2);
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

  const handleCompare = async (): Promise<void> => {
    if (userOneName && userTwoName) {
      let data1: string = `${userOneName} who have ${user1[0]} github repositories and have ${user1[1]} followers on github and ${userOneName}'s github id is ${user1[2]}`;
      let data2: string = `${userTwoName} who have ${user2[0]} github repositories and have ${user2[1]} followers on github and ${userTwoName}'s github id is ${user2[2]}`;
      try {
        const result: any = await axios.post('http://localhost:3001/api',{
          data1, data2
        } );

        const res = result.data
        console.log(res)
        setResponseData(res);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(`The error occured`, err.message);
        }
        console.error('Error occured in API: ', err);
      }
    } else {
      sweetalert();
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Particles />
      </div>

      <div className="relative z-10 p-4 bg-cover bg-center flex">
        <div className="bg-transparent h-56 w-full">
          <div className="h-56 bg-transparent flex justify-center items-center">
            <div className="relative">
              <img
                className="h-56 mr-36 rounded-full"
                src={github}
                alt="github logo"
              />
              <img
                className="h-48 rounded-full absolute top-1/2 left-28 transform -translate-x-1/2 -translate-y-1/2 text-transparent"
                src={avatarOne}
                alt="user one image"
              />
            </div>

            <div className="relative ">
              <img
                className="h-56 bg-transparent ml-36 rounded-full"
                src={github}
                alt="github logo"
              />
              <img
                className="h-48  rounded-full absolute top-1/2 left-64 transform -translate-x-1/2 -translate-y-1/2 text- text-transparent"
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
              border="border-blue-600"
              onClick={handleCompare}
            />
          </div>
          {responseData != '' ? (
            <div className="fixed h-56 bg-white/50 mx-32 p-4 text-justify mt-6 rounded-3xl text-black font-mono overflow-auto">
            <TypewriterEffectSmooth
              words={responseData.split(' ').map((word) => ({ text: word }))}
              className="text-blue-500 w-full"
            />
          </div>
          
          ) : (
            <div className="h-56 bg-transparent mx-32 p-4 text-md rounded-3xl text-black font-mono"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
