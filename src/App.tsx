import { useEffect, useState } from 'react'
import axios from 'axios'
import gitlogo from "./image/gitlogo.png"

function App() {
  const [userOneName, setUserOneName] = useState<string>("")
  const [userTwoName, setUserTwoName] = useState<string>("")
  const [avatarOne, setAvatarOne] = useState<string>("")
  const [avatarTwo, setAvatarTwo] = useState<string>("")


  const Github_API = import.meta.env.VITE_GITHUB_API_TOKEN

  const handleUserOne = (e: any) => {
    setUserOneName(e.target.value)
  }

  const handleUserTwo = (e: any) => {
    setUserTwoName(e.target.value)
  }

  const userOne = async () => {
    const obj1 = await axios.get(`https://api.github.com/users/${userOneName}`, {
      headers: {
        Authorization: `Bearer ${Github_API}`
      }
    })
    const res = obj1.data.avatar_url
    setAvatarOne(res)

    const pub_repos = obj1.data.public_repos
    const followers = obj1.data.followers
  }

  const userTwo = async () => {
    const obj2 = await axios.get(`https://api.github.com/users/${userTwoName}`, {
      headers: {
        Authorization: `Bearer ${Github_API}`
      }
    })
    const res = obj2.data.avatar_url
    setAvatarTwo(res)

    const pub_repos = obj2.data.public_repos
    const followers = obj2.data.followers


  }
useEffect(() => {
    if (!userOneName) return; // Don't fetch if inputs are empty
    const delaySearch = setTimeout(() => {
      userOne();
    }, 500); // 1-second delay after user stops typing

    return () => {
      clearTimeout(delaySearch); // Cleanup timeout on each change
    };
  }, [userOneName, userTwoName]);

  useEffect(() => {
    if (!userTwoName) return; // Don't fetch if inputs are empty
    const delaySearch = setTimeout(() => {
      userTwo();
    }, 500); // 1-second delay after user stops typing

    return () => {
      clearTimeout(delaySearch); // Cleanup timeout on each change
    };
  },[userTwoName])
  
  return (
    <>
      <div className="bg-[url('./image/bgimg.jpg')] bg-cover bg-center h-screen flex text-white text-center">
        <div className='mt-12 bg-transparent h-58 w-full'>
          <div className='h-56 bg-transparent mx-50 flex justify-center items-center'>
            <div className="relative">
              <img className="h-56 pr-36" src={gitlogo} alt="github logo" />
              <img className="h-56 rounded-full absolute top-1/2 left-28 transform -translate-x-1/2 -translate-y-1/2 text-transparent" src={avatarOne} alt="user one image" />
            </div>

            <div className="relative ">
              <img className="h-56 pl-36" src={gitlogo} alt="github logo" />
              <img className="h-56  rounded-full absolute top-1/2 left-64 transform -translate-x-1/2 -translate-y-1/2 text- text-transparent" src={avatarTwo} alt="user two image" />
            </div>


          </div>
          <div className='bg-transparent flex justify-center mt-6 h-12'>
            <input className="bg-fuchsia-100 mr-31 border-black border-3 rounded-4xl text-black text-xl p-4 focus:outline-none focus:ring-0"
              type='text'
              value={userOneName}
              onChange={handleUserOne} />
            <input className="bg-fuchsia-100 ml-31 border-black border-3 rounded-4xl text-black text-xl p-4 focus:outline-none focus:ring-0"
              type="text"
              value={userTwoName}
              onChange={handleUserTwo} />
          </div>
        </div>
      </div>

    </>
  )
}

export default App
