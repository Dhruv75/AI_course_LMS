import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import AddNewCourseDialog from './_components/AddNewCourseDialog'

const Workspace = () => {
  return (
    <>
    <WelcomeBanner/>
    <CourseList/>
    <AddNewCourseDialog/>
    </>

  )
}

export default Workspace