import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from './components/Button';
import Input from './components/Input';
import sweetAlert from './helpers/alert';
import { motion } from 'motion/react';
import { useEnter } from './hooks/useEnter';
import Loader from './components/Loader';
import { prompt } from './helpers/prompt';

function App() {
  const [userOneName, setUserOneName] = useState<string>('');
  const [userTwoName, setUserTwoName] = useState<string>('');
  const [avatarOne, setAvatarOne] = useState<string>('');
  const [avatarTwo, setAvatarTwo] = useState<string>('');
  const [user1, setUser1] = useState<number[]>([]);
  const [user2, setUser2] = useState<number[]>([]);
  const [responseData, setResponseData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const handleUserChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (index === 0) setUserOneName(e.target.value);
    else setUserTwoName(e.target.value);
  };

  const fetchUser = async (index: number): Promise<void> => {
    const name = index === 0 ? userOneName : userTwoName;
    const setAvatar = index === 0 ? setAvatarOne : setAvatarTwo;
    const setStats = index === 0 ? setUser1 : setUser2;
    if (!name) return;
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/github/${name}`);
      setAvatar(data.avatar_url);
      setStats([data.public_repos, data.followers, data.id]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(`API Error: ${err.response?.status} - ${err.message}`);
      } else {
        console.error(`Unexpected Error for user ${index + 1}:`, err);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchUser(0), 500);
    return () => clearTimeout(timer);
  }, [userOneName]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUser(1), 500);
    return () => clearTimeout(timer);
  }, [userTwoName]);

  const handleCompare = async (): Promise<void> => {

    if (userOneName && userTwoName) {
      setLoading(true);
      const data1 = prompt({username: userOneName, repo: user1[0], followers: user1[1], id: user1[2]});
      const data2 = prompt({username: userTwoName, repo: user2[0], followers: user2[1], id: user2[2]});
      try {
        const result = await axios.post(
          'https://githubstats-backend.vercel.app/api',
          {
            data1,
            data2,
          }
        );

        const res = result.data;
        setLoading(false);
        setResponseData(res);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error(`The error occurred`, err.message);
        }
        console.error('Error occurred in API: ', err);
      }
    } else {
      sweetAlert();
    }
  };

  const compareRef = useEnter(() => handleCompare);

  return (
    <div className="min-h-screen w-full relative">
  <div
    className="absolute inset-0 z-0"
    style={{
      background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
    }}
  />

  <div className="relative lg:h-screen h-[688px] w-full overflow-hidden">
    <div className="relative z-10 p-4 bg-cover bg-center flex">
      <div className="h-[200px] lg:h-[220px] w-[400px] lg:w-full">
        <div className="lg:h-[224px] h-[220px] flex justify-center items-center">
          <div className="relative">
            <img
              className="lg:h-[220px] h-[140px] lg:mr-[140px] mr-[20px] rounded-full backdrop-blur-2xl"
              src='/github.png'
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
              src='/github.png'
              alt=""
            />
            <img
              className="lg:h-[190px] h-[120px] rounded-full absolute top-1/2 lg:left-63 left-23 transform -translate-x-1/2 -translate-y-1/2 text- text-transparent"
              src={avatarTwo}
              alt=""
            />
          </div>
        </div>
        <div className="bg-transparent lg:gap-[270px] gap-[60px] flex justify-center lg:mx-auto mx-auto lg:pl-[62px] pl-[24px] pr-8 lg:mt-[48px] mt-[10px] lg:h-[48px] h-[48px]">
          <Input value={userOneName} onChange={handleUserChange(0)} />
          <Input value={userTwoName} onChange={handleUserChange(1)} />
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
              setLoading(false)
            }}
          />
          <Button
            btnName="Compare"
            color="bg-blue-400"
            border="border-blue-600"
            onClick={handleCompare}
            disabled={responseData !== ''}
            ref={compareRef}
          />
        </div>
        {loading ? (
          <div className='lg:pt-[50px] pt-[60px]'>
            <Loader />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="lg:h-56 h-[288px] mx-auto lg:w-[1400px] w-[320px] lg:p-4 lg:text-[16px] text-[13px] text-justify mt-6 text-black overflow-hidden"
          >
            {responseData}
          </motion.div>
        )}
      </div>
    </div>
  </div>
</div>
  );
}

export default App;


