import Navbar from '@/components/Application/Navbar'
import React from 'react'

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-4xl font-bold font-assistant">Welcome to Panda Bees</h1>
        <p className="mt-4 text-muted-foreground">Premium Online Shopping Experience</p>
      </div>
    </div>
  )
}

export default Home;