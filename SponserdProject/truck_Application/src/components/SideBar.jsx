import React, { useEffect, useState }
 from 'react'
import {FaArrowRight} from 'react-icons/fa6'
import { Link } from 'react-router-dom';

const SideBar = () => {
    
    const [popularBlog, setPopularBlog] = useState([]);

    useEffect(()=>{
        fetch("http://localhost:5000/blogs")
        .then(res => res.json())
        .then(data => setPopularBlog(data.slice(0,15)))
    },[])





    return (
    <div className=' md:ml-5'>
        <div className='sm:mr-3'>
            <h3 className='text-2xl font-semibold my-8 text-center
            '>Latest Blogs</h3>

            <div>
                {
                    popularBlog.slice(0,4).map(data => 
                    <div 
                    className='my-5 border-b-4' 
                    key={data.id}>
                        <h4 className='mb-2 text-gray-600 '>{data.title}</h4>
                        <Link to="/blogs" className='inline-flex mb-3 text-lg font-primary hover:bg-gray-500 hover:text-white px-4 py-2 hover:rounded-lg text-wrap '> Learn More <FaArrowRight className='ml-3 mt-1' />
                </Link>
                    </div>)
                }
            </div>

        </div>


        {/* popular Blog */}

        <div>
            <h3 className='text-2xl font-semibold my-8 text-center
            '>Popular Blogs</h3>

            <div>
                {
                    popularBlog.slice(6,9).map(data => 
                    <div 
                    className='my-5 border-b-4' 
                    key={data.id}>
                        <h4 className='mb-2 text-lg  text-gray-600 '>{data.title}</h4>
                        <Link to="/blogs" className='inline-flex mb-3 text-lg font-primary hover:bg-gray-500 hover:text-white px-4 py-2 hover:rounded-lg text-wrap '> Learn More <FaArrowRight className='ml-3 mt-1' />
                </Link>
                    </div>)
                }
            </div>

        </div>

    </div>
  )
}

export default SideBar