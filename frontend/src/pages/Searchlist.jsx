import BlogCard from '@/components/BlogCard';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'

function Searchlist() {

    // 🔹 Gives access to the current URL (pathname, search query, etc.)
    // Example URL: /search?q=react (query comes from search bar in Navbar.jsx)
    const location = useLocation()

    // 🔹 Extract query parameters from the URL
    // location.search = "?q=react"
    const params = new URLSearchParams(location.search)

    // 🔹 Get the value of 'q' from the URL
    // If URL is ?q=react → query = "react"
    const query = params.get('q')

    // 🔹 Get all blogs stored in Redux
    // These blogs usually come from backend and are already loaded
    const { blogs } = useSelector(store => store.blog)

    /*
        🔹 Filter blogs based on search query

        A blog will be included if:
        ✔ title contains the query
        ✔ subtitle contains the query
        ✔ OR category exactly matches the query

        toLowerCase() is used to make search case-insensitive
    */
    const filteredBlogs = blogs.filter((blog) => {
  if (!query) return false; // if query is null, return no results

  return (
    blog?.title?.toLowerCase().includes(query.toLowerCase()) ||
    blog?.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
    blog?.category?.toLowerCase() === query.toLowerCase()
  );
});


    /*
        🔹 Scroll page to top when search result page loads
        Improves UX so user always sees results from the top
    */
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='pt-32'>
            
            <div className='max-w-6xl mx-auto'>

             
                <h2 className='mb-5'>
                    Search result for: "{query}"
                </h2>

                
                <div className='grid grid-cols-3 gap-7 my-10'>

                   
                    {
                        filteredBlogs.length > 0 ? (
                            filteredBlogs.map((blog) => (
                                <BlogCard key={blog._id} blog={blog} />
                            ))
                        ) : (
                           
                            <p className="col-span-3 text-center text-gray-500">
                                No blogs found
                            </p>
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Searchlist
