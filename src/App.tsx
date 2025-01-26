import { useState } from 'react'
function App() {
  const [count, setCount] = useState(10)

  const handleIncrease = () => {
    setCount(count + 1)
  }
  
  const handleDecrease = () => {
    setCount(count - 1)
  }
  return (
    <>
      <div className='text-4xl h-screen bg-amber-50'>
        <div className='flex justify-center '>Current count is {count}</div>
        <div className='flex justify-center p-6'>
        <button type='button' className='mr-4 cursor-pointer hover:text-5xl border-2 rounded-2xl px-3' onClick={handleIncrease}>Increase</button>       
        <button type='button' className='ml-4 cursor-pointer hover:text-5xl border-2 rounded-2xl px-3' onClick={handleDecrease}>Decrease</button>       
        <br /><br /></div>
      </div>
    </>
  )
}

export default App
