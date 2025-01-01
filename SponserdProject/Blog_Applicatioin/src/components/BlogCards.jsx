import { Link } from "react-router-dom";
import { FaUser} from 'react-icons/fa'


const BlogCards = ({ blogs , currentPage, selectedCategory, pageSize }) => {
  // console.log(blogs);
  // Check if blogs is an array and not undefined
  const filterBlogData = blogs.
  filter((blogs) => !selectedCategory || blogs.category === selectedCategory)
  .slice((currentPage -1)*pageSize, currentPage*pageSize);
  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
      {
        filterBlogData.map((blog) => (
          <Link key={blog.id} className="p-5 ml-4 mr-4 shadow-xl hover:border-gray-600 hover:ring-4 rounded cursor-pointer">
            <div className="">
              <img src={blog.image} alt="" className="w-auto h-120 rounded-2xl "/>
              <h3 className="text-lg ml-2 mt-4 mb-2 font-bold hover:text-blue-600 cursor-pointer">{blog.title}</h3>
              <p className="mb-2 ml-2 text-gray-600"><FaUser className="inline-flex items-center mr-2" />{blog.author}</p>
              <p className="text-gray-900 ml-2 mb-2">Published : {blog.published_date}</p>
            </div>
          </Link>
        ))
      }
    </div>
  );
};

export default BlogCards;