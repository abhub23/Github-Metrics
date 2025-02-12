import { useEffect, useState } from 'react';
import axios from 'axios';
import gitlogo from './image/gitlogo.png';
import Navbar from './Navbar';

function App() {
  const [userOneName, setUserOneName] = useState<string>('');
  const [userTwoName, setUserTwoName] = useState<string>('');
  const [avatarOne, setAvatarOne] = useState<string>('');
  const [avatarTwo, setAvatarTwo] = useState<string>('');
  const [winner, setWinner] = useState<string>('');
  const [user1, setUser1] = useState<number[]>([]);
  const [user2, setUser2] = useState<number[]>([]);

  const Github_API = import.meta.env.VITE_GITHUB_API_TOKEN;

  const handleUserOne = (e: any) => {
    setUserOneName(e.target.value);
  };

  const handleUserTwo = (e: any) => {
    setUserTwoName(e.target.value);
  };

  const userOne: Function = async () => {
    try {
      const obj1 = await axios.get(
        `https://api.github.com/users/${userOneName}`,
        {
          headers: {
            Authorization: `Bearer ${Github_API}`,
          },
        }
      );
      const res = obj1.data.avatar_url;
      setAvatarOne(res);

      const userData = {
        public_repos: obj1.data.public_repos,
        followers: obj1.data.followers,
        created: obj1.data.id,
      };

      setUser1(Object.values(userData).map((values) => Number(values)));
      console.log(user1);
    } catch (err) {
      console.log('Error while fetching User one', err);
    }
  }

    const userTwo: Function = async () => {
      try {
        const obj2 = await axios.get(
          `https://api.github.com/users/${userTwoName}`,
          {
            headers: {
              Authorization: `Bearer ${Github_API}`,
            },
          }
        );
        const res = obj2.data.avatar_url;
        setAvatarTwo(res);

        const userData = {
          public_repos: obj2.data.public_repos,
          followers: obj2.data.followers,
          created: obj2.data.id,
        };

        setUser2(Object.values(userData).map((values) => Number(values)));
        console.log(user2);
      } catch (err) {
        console.log('Error while fetching user two', err);
      }
    };
  

  useEffect(() => {
    if (!userOneName) return; // Don't fetch if inputs are empty
    const delaySearch = setTimeout(() => {
      userOne()
    }, 500); // 1-second delay after user stops typing

    return () => {
      clearTimeout(delaySearch); // Cleanup timeout on each change
    };
  }, [userOneName]);

  useEffect(() => {
    if (!userTwoName) return; // Don't fetch if inputs are empty
    const delaySearch = setTimeout(() => {
      userTwo()
    }, 500); // 1-second delay after user stops typing

    return () => {
      clearTimeout(delaySearch); // Cleanup timeout on each change
    };
  }, [userTwoName]);

  const Compare = () => {
    let userOneScore: number = 0
    let userTwoScore: number = 0

    let arr1 = [...user1]
    let arr2 = [...user2]

    arr1[0] > arr1[0]? userOneScore += 1 : userTwoScore += 1
    arr1[1] > arr1[1]? userOneScore += 1 : userTwoScore += 1
    arr1[2] > arr1[2]? userOneScore += 1 : userTwoScore += 1

    console.log(userOneScore>userTwoScore ? userOneName:userTwoName)
  };

  Compare()

  return (
    <>
      <div className="bg-radial-[at_25%_25%] from-blue-500 to-transparent p-20 bg-cover bg-center h-screen flex text-white text-center">
        <div className="mt-12 bg-transparent h-58 w-full">
          <div className="h-56 bg-transparent mx-50 flex justify-center items-center">
            <div className="relative">
              <img className="h-56 pr-36" src={gitlogo} alt="github logo" />
              <img
                className="h-56 rounded-full absolute top-1/2 left-28 transform -translate-x-1/2 -translate-y-1/2 text-transparent"
                src={avatarOne}
                alt="user one image"
              />
            </div>

            <div className="relative ">
              <img className="h-56 pl-36" src={gitlogo} alt="github logo" />
              <img
                className="h-56  rounded-full absolute top-1/2 left-64 transform -translate-x-1/2 -translate-y-1/2 text- text-transparent"
                src={avatarTwo}
                alt="user two image"
              />
            </div>
          </div>
          <div className="bg-transparent flex justify-center mt-6 h-12">
            <input
              className="bg-fuchsia-100 mr-31 border-black border-3 rounded-4xl text-black text-xl p-4 focus:outline-none focus:ring-0"
              type="text"
              value={userOneName}
              onChange={handleUserOne}
              placeholder="Enter github username"
            />
            <input
              className="bg-fuchsia-100 ml-31 border-black border-3 rounded-4xl text-black text-xl p-4 focus:outline-none focus:ring-0"
              type="text"
              value={userTwoName}
              onChange={handleUserTwo}
              placeholder="Enter github username"
            />
          </div>
        </div>
        <Navbar/>
      </div>
    </>
  );
}

export default App;
