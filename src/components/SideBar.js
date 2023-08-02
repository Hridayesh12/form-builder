import React from 'react'
import { Link } from 'react-router-dom'

const SideBar = ({ children }) => {
    return (
        <div className='flex w-[100vw] min-h-[100vh]'>
            <div className='min-h-[100vh] w-2/12 bg-gray-700 text-white'>
                <h1 className='text-2xl text-center my-2'>Form Builder</h1>
                <div className='flex flex-col'>
                    <Link to='/' className='p-2 hover:bg-gray-600'>Home</Link>
                    <Link to='/new_form' className='p-2 hover:bg-gray-600'>Create Form</Link>
                    <Link to='/view_form' className='p-2 hover:bg-gray-600'>View Forms</Link>
                </div>
            </div>
            <main className='w-full h-full'>{children}</main>
        </div>
    )
}

export default SideBar