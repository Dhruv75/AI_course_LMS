import { Button } from '@/components/ui/button';
import axios from 'axios';
import { SparklesIcon, SpeakerIcon, Loader2 } from 'lucide-react';
import React from 'react';

const CourseInfo = ({ course, courseTitle, courseId }) => {
  const [loading, setLoading] = React.useState(false);
  const [generationStatus, setGenerationStatus] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [generatedContent, setGeneratedContent] = React.useState(null);

  const GenerateCourseContent = async () => {
    // Debug logging
    console.log('Generate button clicked');
    console.log('Course data:', course);
    console.log('Course ID:', courseId);
    console.log('Course Title:', courseTitle);

    // Check for course data and chapters
    const courseData = course?.courseJson?.course || course;
    const chapters = courseData?.chapters;

    if (!courseData || !chapters || !Array.isArray(chapters)) {
      setError('Missing course data or chapters. Please ensure the course has been properly created.');
      console.error('Course data validation failed:', { courseData, chapters });
      return;
    }

    if (!courseId && !course?.cid) {
      setError('Missing course ID');
      console.error('Course ID validation failed');
      return;
    }

    setLoading(true);
    setError(null);
    setGenerationStatus('Generating course content...');

    try {
      // Prepare the payload with the correct structure
      const payload = {
        course: courseData, // This should have the chapters array
        courseTitle: courseTitle || courseData.name || course.name,
        courseId: courseId || course.cid
      };

      console.log('API payload:', payload);

      const result = await axios.post('/api/generate-course-content', payload);

      console.log('Course content generation result:', result.data);
      
      if (result.data.success) {
        const successCount = result.data.summary?.successfulChapters || 0;
        const totalCount = result.data.summary?.totalChapters || 0;
        const failedCount = result.data.summary?.failedChapters || 0;
        
        if (failedCount > 0) {
          setGenerationStatus(`Generated content for ${successCount}/${totalCount} chapters (${failedCount} failed)`);
        } else {
          setGenerationStatus(`🎉 Successfully generated content for all ${successCount} chapters!`);
        }
        
        // Store the generated content (optional)
        setGeneratedContent(result.data.chapters);
        console.log('Generated chapters:', result.data.chapters);
        
        // Optional: You can handle the generated content here
        // For example, redirect to course view or update parent component
        // setTimeout(() => {
        //   router.push(`/course/${courseId}`);
        // }, 2000);
      } else {
        setError('Failed to generate course content');
      }
    } catch (err) {
      console.error('Error generating course content:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to generate course content';
      setError(errorMessage);
      console.error('Full error details:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {generationStatus && !error && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{generationStatus}</p>
        </div>
      )}

      {/* Course Chapters Preview */}
      {course.courseJson && course.courseJson.course && course.courseJson.course.chapters && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Chapters</h2>
          <div className="space-y-4">
            {course.courseJson.course.chapters.map((chapter, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Chapter {index + 1}: {chapter.chapterName}
                </h3>
                <p className="text-sm text-gray-600 mb-2">Duration: {chapter.duration}</p>
                {chapter.topics && chapter.topics.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Topics:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {chapter.topics.map((topic, topicIndex) => (
                        <li key={topicIndex}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Course Content</h2>
          <div className="space-y-6">
            {generatedContent.map((chapter, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  {chapter.chapterName}
                </h3>
                {chapter.error ? (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-700 text-sm">❌ {chapter.error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chapter.topics && chapter.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="border-l-4 border-blue-200 pl-4">
                        <h4 className="font-medium text-gray-800 mb-2">📚 {topic.topic}</h4>
                        <div 
                          className="prose prose-sm max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{ __html: topic.content }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Content JSON (collapsible) */}
      {course.courseJson && course.courseJson.course && (
        <details className="mt-8 bg-gray-50 rounded-lg">
          <summary className="p-4 cursor-pointer font-semibold text-gray-800 hover:bg-gray-100 rounded-lg">
            View Raw Course Data (JSON)
          </summary>
          <div className="p-4 pt-0">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto bg-white p-4 rounded border">
              {JSON.stringify(course.courseJson.course, null, 2)}
            </pre>
          </div>
        </details>
      )}

      {/* Generate Course Content Button */}
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={GenerateCourseContent}
          disabled={loading}
          className="w-full max-w-md h-12 text-lg font-semibold"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="mr-2 h-5 w-5" />
              Generate Course Content
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CourseInfo;