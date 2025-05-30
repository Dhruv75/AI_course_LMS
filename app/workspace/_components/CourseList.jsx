"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import AddNewCourseDialog from "./AddNewCourseDialog";

const CourseList = () => {
  const [courseList, setCourseList] = useState([]);

  return (
    <div className="pt-8 ">
      <h2 className="font-bold text-2xl flex justify-center">Course List</h2>
      <div className="bg-secondary mt-4 rounded-lg shadow-md">
        {courseList?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-700">
            <p className="text-xl font-semibold mb-2">No courses found.</p>
            <p className="text-base text-gray-500">
              It looks like you haven't added any courses yet.
            </p>
            <AddNewCourseDialog>
            <Button className="mt-2">+ Create course </Button></AddNewCourseDialog>
          </div>
        ) : (
          <div className="p-4">
            {/* This is where you would typically render your actual list of courses */}
            <p className="text-xl font-semibold text-blue-700">
              Displaying Your Courses:
            </p>
            {/* Example of how you might render courses if courseList had data: */}
            {/* <ul>
            {courseList.map((course) => (
              <li key={course.id} className="p-2 border-b border-gray-200">
                {course.title} - {course.instructor}
              </li>
            ))}
          </ul>
          */}
            <p className="mt-2 text-gray-500">
              (Placeholder: Course data would go here. The `courseList` state is
              currently empty.)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
