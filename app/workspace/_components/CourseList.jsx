'use client'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs' // Assuming you're using Clerk for auth

const CourseList = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useUser()

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchCourses()
    }
  }, [user])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/courses?userEmail=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }
      
      const data = await response.json()
      setCourses(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Course List</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Course List</h2>
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={fetchCourses}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Course List</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No courses found.</p>
          <p className="text-sm text-gray-500">It looks like you haven't added any courses yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Course List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
            </div>
            
            <div className="space-y-2 mb-4">
              {course.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {course.category}
                </span>
              )}
              {course.level && (
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
                  {course.level}
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>{course.noOfChapters || 0} chapters</span>
              {course.includeVideo && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Video
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => window.location.href = `/workspace/edit-course/${course.cid}`}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                View Course
              </button>
              <button 
                onClick={() => {
                  // Add any additional edit functionality here if needed
                  window.location.href = `/workspace/edit-course/${course.cid}`
                }}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseList