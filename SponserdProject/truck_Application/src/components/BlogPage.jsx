import React, { useEffect, useState } from 'react'
import { CgPullClear } from 'react-icons/cg';
import BlogCards from './BlogCards';
import Pagination from './Pagination';
import CategorySelection from './CategorySelection';
import SideBar from './SideBar';

const BlogPage = () => {

    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9; // number of blogs 9 per page
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(()=>{
        (
            async () => {
                let url = `http://localhost:5000/blogs?page=${currentPage}&limit=${pageSize}`
                
                // filter by category
                if(selectedCategory){
                    url += `&category=${selectedCategory}` 
                }

                const response = await fetch(url)
                const data = await response.json()
                setBlogs(data);
    
            }
        )();
        
        
    },[currentPage,pageSize,selectedCategory])
    // console.log(blogs);
    
    // page changing btn
    const handlePageChange = (pageNumber) =>{
        setCurrentPage(pageNumber);
    }

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setActiveCategory(category);
    }




  return (
    <div>
        {/* Category session is here */}
        <div>
            <CategorySelection 
                onSelectCategory={handleCategoryChange}
                selectedCategory ={selectedCategory}
            />
        </div>


        {/* Blogs is here */}
        <div className='flex flex-col lg:flex-row gap-12'>
            <BlogCards
            blogs={blogs}
            currentPage={currentPage} selectedCategory={selectedCategory} pageSize={pageSize}/>
            {/* SideBar components */}
            <div>
                <SideBar/>
            </div>
        </div>



        {/* Pagination is here */}
        <div>
            <Pagination 
            onPageChange = {handlePageChange}
            blogs = {blogs}
            currentPage = {currentPage}
            pageSize = {pageSize}
            />
        </div>
    </div>
  )
}

export default BlogPage