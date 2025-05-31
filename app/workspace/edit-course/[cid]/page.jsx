"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Make sure to import axios
import CourseInfo from "../_components/CourseInfo";

const EditCourse = () => {
  const params = useParams();
  const cid = params.cid;
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState();

  useEffect(() => {
    GetCourseInfo();
  }, []);

  const GetCourseInfo = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`/api/courses?cid=${cid}`);
      console.log("Course Info:", result.data);
      setCourse(result.data); 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course:", error);
      setLoading(false);
    }
  };

  console.log("Course ID (cid):", cid);
  
  return (
    <div>
     
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CourseInfo course={course} />
      )}
    </div>
  );
};

export default EditCourse;