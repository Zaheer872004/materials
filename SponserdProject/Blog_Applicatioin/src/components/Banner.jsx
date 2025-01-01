import React from 'react'
import { Link } from 'react-router-dom'
import {FaArrowRight} from 'react-icons/fa6'

const Banner = () => {
  return (
    <div className='px-4 py-32 bg-gray-200 text-slate-700 mx-auto'>
        <div className=' text-center'>
            <h1 className='text-5xl text-text-align-content-center lg:text-7xl leading-snug font-bold mb-5'>Welcome to Our Blogs</h1>
            <p className='text-slate-600 lg:w-1/2 mx-auto text-wrap mb-7 text-[18px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea dicta non, eligendi quaerat tempore alias repudiandae dignissimos rem aperiam unde provident cum cupiditate voluptatum quod assumenda officiis nulla inventore consequatur!</p>
            <div className='flex justify-center '>
                <Link to="/" className='text-black  font-primary font-normal text-2xl  hover:rounded-xl hover:ring-4 hover:p-2 hover:bg-orange-300 hover:text-blue-50 hover:font-extrabold hover:px-4 flex '> Learn More <FaArrowRight className='ml-3 mt-1' />
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Banner