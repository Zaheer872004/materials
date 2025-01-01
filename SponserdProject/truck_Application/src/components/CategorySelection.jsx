import React from 'react'

const CategorySelection = ({onSelectCategory,selectCategory}) => {

    const categories = ["StartUps","Security","AI","App","Tech"];



    return (
    <div className='px-4 mb-8 lg:space-x-16 flex-wrap items-center border-b-2 py-5 text-gray-900 font-semibold'>
        <button className=' hover:text-2xl hover:bg-slate-400 hover:rounded-lg px-5 py-2 hover:text-white'>All </button>
        {
            categories.map((category) => (
                <button
                    onClick={()=>onSelectCategory(null)}
                    className={`mr-5 space-x-16  hover:text-2xl hover:bg-slate-400 hover:rounded-lg px-5 py-2 hover:text-white ${selectCategory === category ? "active-button" : ""}`}
                    key={category}
                >
                    {category}
                </button>
            ))
        }
    </div>
  )
}

export default CategorySelection