import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import github from './lib/github.png';
import Button from './components/Button';
import Input from './components/Input';
import sweetalert from './helpers/alert';
import { motion } from 'motion/react';

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
        const result: any = await axios.post('http://192.168.0.105:3001/api', {
          data1, data2
        });

        const res = result.data
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
    <div className="relative lg:h-screen bg-white h-[688px] w-full overflow-hidden">
      <div className="relative z-10 p-4 bg-cover bg-center flex">
        <div className="h-[200px] lg:h-[220px] w-[400px] lg:w-full">
          <div className="lg:h-[224px] h-[220px] flex justify-center items-center">
            <div className="relative">
              <img
                className="lg:h-[220px] h-[140px] lg:mr-[140px] mr-[20px] rounded-full"
                src={github}
                alt=""
              />
              <img
                className=" lg:h-[190px] h-[120px] rounded-full absolute top-1/2 lg:left-28 left-18 transform -translate-x-1/2 -translate-y-1/2 text-transparent"
                src={avatarOne}
                alt=""
              />
            </div>

            <div className="relative ">
              <img
                className="lg:h-[220px] h-[140px] lg:ml-[140px] ml-[20px] rounded-full"
                src={github}
                alt=""
              />
              <img
                className="lg:h-[190px] h-[120px] rounded-full absolute top-1/2 lg:left-63 left-23 transform -translate-x-1/2 -translate-y-1/2 text- text-transparent"
                src={avatarTwo}
                alt=""
              />
            </div>
          </div>
          <div className="bg-transparent lg:gap-[260px] gap-[60px] flex justify-center lg:mx-auto mx-auto lg:pl-[50px] pl-[24px] pr-8 lg:mt-[48px] mt-[10px] lg:h-[48px] h-[48px]">
            <Input value={userOneName} onChange={handleUserOne} />
            <Input value={userTwoName} onChange={handleUserTwo} />
          </div>
          <div className="lg:h-[56px] h-[40px] lg:mt-[40px] lg:gap-10 gap-5 mx-auto flex justify-center">
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
              disabled={responseData != '' ? true : false}

            />
          </div>
          {responseData != '' && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="lg:h-56 h-[288px] mx-auto lg:w-[1400px] w-[320px] lg:p-4 lg:text-[16px] text-[13px] text-justify mt-6 text-black font-mono overflow-hidden"
            >
              {responseData}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
