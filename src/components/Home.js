import React from 'react'

const Home = () => {
    return (
        <div className='mx-auto my-32 min-h-10/12 h-72 rounded-lg flex flex-col items-center justify-center w-10/12 bg-white'>
            <h1 className='text-4xl'>Welcome to Form Builder</h1>
            <div className='flex flex-col items-center justify-center'>
                <p className='text-2xl'>Click on Create Form to create a new form</p>
                <p className='text-2xl'>Click on View Form to view all created forms</p>
            </div>
        </div>
    )
}

export default Home