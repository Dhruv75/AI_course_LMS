import { Button } from '@/components/ui/button';
import { SparklesIcon, SpeakerIcon } from 'lucide-react';
import React from 'react';

const CourseInfo = ({ course }) => {
  if (!course) {
    return (
      <div className="p-4">
        <p className="text-gray-500">No course data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Course Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.name}</h1>
        <p className="text-gray-600 text-lg leading-relaxed">{course.description}</p>
      </div>

      {/* Course Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Level</h3>
          <p className="text-blue-600">{course.level}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Category</h3>
          <p className="text-green-600">{course.category}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">Chapters</h3>
          <p className="text-purple-600">{course.noOfChapters} chapters</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-semibold text-orange-800 mb-2">Video Content</h3>
          <p className="text-orange-600">{course.includeVideo ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Course ID</h3>
          <p className="text-gray-600 text-sm font-mono">{course.cid}</p>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-semibold text-indigo-800 mb-2">Created By</h3>
          <p className="text-indigo-600 text-sm">{course.userEmail}</p>
        </div>
      </div>

      {/* Course Content */}
      {course.courseJson && course.courseJson.course && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Content</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(course.courseJson.course, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Edit Actions */}
      
       <Button className='w-1/2 ml-30 mt-30' > <SparklesIcon/>  Generate this course</Button>
     
    </div>
  );
};

export default CourseInfo;