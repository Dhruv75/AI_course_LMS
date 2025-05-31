import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema"; // Although not used, keep for context

export async function POST(req) {
  const formData = await req.json();
  const user = await currentUser();

  // Check if user is authenticated
  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const PROMPT = `Generate Learning Course depends on following details. In which Make sure to add Course Name, Description, Chapter Name, Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format, Topic under each chapters, Duration for each chapters etc, in JSON format only
Schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": boolean,
    "noOfChapters": number,
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ],
        "imagePrompt": "string",
        "userInput": "string"
      }
    ],
    "courseBanner3DPrompt": "string"
  }
}
`;

  // Initialize Gemini AI correctly - pass API key directly as string
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // Generate course content
    const result = await model.generateContent(
      PROMPT + JSON.stringify(formData)
    );
    const response = await result.response;
    const geminiTextResponse = response.text();

    console.log("Response from Gemini:", geminiTextResponse);

    // Clean and parse JSON response
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = geminiTextResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\n/, "")
          .replace(/\n```$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse
          .replace(/^```\n/, "")
          .replace(/\n```$/, "");
      }

      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.warn("Response is not valid JSON:", parseError);
      return NextResponse.json({
        error: "Failed to parse AI response",
        details: parseError.message,
      }, { status: 500 });
    }

    // Generate unique course ID
    const generateCourseId = () => {
      return 'course_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    // Store the generated CID in a variable
    const newCourseCid = generateCourseId(); // Store the generated CID

    // Save to database
    try {
      const dbResult = await db.insert(coursesTable).values({
        cid: newCourseCid, // Use the stored CID
        name: parsedResponse.course.name,
        description: parsedResponse.course.description,
        category: parsedResponse.course.category,
        level: parsedResponse.course.level,
        includeVideo: parsedResponse.course.includeVideo,
        noOfChapters: parsedResponse.course.noOfChapters,
        courseJson: parsedResponse, // Store as JSON object (not string)
        userEmail: user.primaryEmailAddress?.emailAddress,
      });

      console.log("Course saved to database:", dbResult);

      // Return success response with the generated course ID
      return NextResponse.json({
        success: true,
        course: parsedResponse.course,
        cid: newCourseCid, // <-- Add the generated CID here
        dbResult: dbResult,
        message: "Course generated and saved successfully"
      });

    } catch (dbError) {
      console.error("Database save error:", dbError);

      // Return the generated course and the generated CID even if DB save fails
      // This allows the frontend to still try navigating if the CID is available.
      return NextResponse.json({
        success: true,
        course: parsedResponse.course,
        cid: newCourseCid, // <-- Add the generated CID here as a fallback
        warning: "Course generated but failed to save to database",
        dbError: dbError.message
      });
    }

  } catch (error) {
    console.error("Error generating course:", error);
    return NextResponse.json(
      {
        error: "Failed to generate course",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}