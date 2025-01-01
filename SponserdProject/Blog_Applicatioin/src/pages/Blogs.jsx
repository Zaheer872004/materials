import React from 'react'
import BlogPage from '../components/BlogPage'

const Blogs = () => {
  return (
    <div>
       <div className='px-10 py-40 mx-auto bg-black '>
          <h1 className='text-5xl text-center lg:text-7xl leading-snug font-bold text-white mb-5'>The Blogs Page</h1>

       </div>

      {/* All Blogs container here */}
      
      <div className='max-w-7xl mx-auto'>
            <BlogPage/>
      </div>
      

    </div>


  )
}

export default Blogs