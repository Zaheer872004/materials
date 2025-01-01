import React from 'react'

const Footer = () => {
  return (
    <div className='bg-gray-900'>
        <div className='px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-4'>
            <div className='grid mb-8 lg:grid-cols-6'>
                <div className='grid grid-cols-2 gap-5 lg:col-span-4 md:grid-cols-4'>
                    {/* Category */}
                    <div>
                        <p className='font-medium tracking-wide text-gray-300'>Category</p>
                        <ul className='mt-2 space-y-3'>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>News</a>
                            </li>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>World</a>
                            </li>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>Games</a>
                            </li>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>Developer</a>
                            </li>
                        </ul>
                    </div>

                    {/* Coder */}
                    <div>
                        <p className='font-medium tracking-wide text-gray-300'> Coder </p>
                        <ul className='mt-2 space-y-3'>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>Java</a>
                            </li>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>JavaScript</a>
                            </li>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>Spring Boot</a>
                            </li>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>Node.js</a>
                            </li>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>React.js</a>
                            </li>
                        </ul>
                    </div>

                    {/* Developer */}
                    <div>
                        <p className='font-medium tracking-wide text-gray-300'> Skills </p>
                        <ul className='mt-2 space-y-3'>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>Java Full Stack Developer</a>
                            </li>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>MERN Stack Developer</a>
                            </li>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>DevOps Engineer</a>
                            </li>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>Little Bit of AI/ML Engineer</a>
                            </li>
                        </ul>
                    </div>

                    {/* Information & Knowledge */}
                    <div>
                        <p className='font-medium tracking-wide text-gray-300'> Information & Knowledge </p>
                        <ul className='mt-2 space-y-3'>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>Entrepreneur</a>
                            </li>
                            <li>
                                <a href="/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>Personal</a>
                            </li>
                            <li>
                                <a href="https://react.dev/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>React docs</a>
                            </li>
                            <li>
                                <a href="https://app.daily.dev/" 
                                className='text-gray-500 transition-color duration-300 hover:text-orange-500'>Daily Tech</a>
                            </li>
                        </ul>
                    </div>

                   

                </div>


                 {/* Subscribe and updates */}
                 <div className='lg:col-span-2'>
                        <p className='font-medium tracking-wide text-gray-300 mb-5'> Subscribe for updates </p>
                        <form className='mt-4 flex flex-col md:flex-row gap-5'>

                            <input 
                                type="email" 
                                name='email' 
                                id='email'
                                className='w-full h-16 px-4 mb-3 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-purple-400 focus:outline-none'
                                placeholder='Enter your email'
                            />
                            <button type='submit'
                                className='inline-flex items-end justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md hover:bg-orange-500 focus:outline-none border'
                            >Subscribed</button>
                        </form>
                        <p className='mt-4 text-sm text-gray-500'>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat quisquam iusto doloremque delectus nisi autem, natus praesentium ducimus ratione magnam reprehenderit eaque labore assumenda cumque. Eius, ipsum at. Aut delectus provident officia pariatur quidem velit facere ratione consequuntur totam facilis!
                        </p>
                    </div>



            </div>
        </div>
    </div>
  )
}

export default Footer
