import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const formData = await req.json();
  const user = await currentUser();
  
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
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use updated model

  try {
    const result = await model.generateContent(PROMPT + JSON.stringify(formData));
    const response = await result.response;
    const geminiTextResponse = response.text();
    
    console.log("Response from Gemini:", geminiTextResponse);
    
    // Try to parse JSON response
    try {
      const parsedResponse = JSON.parse(geminiTextResponse);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.warn("Response is not valid JSON, returning as text:", parseError);
      return NextResponse.json({ 
        success: true, 
        data: geminiTextResponse,
        note: "Response received but not in JSON format"
      });
    }
    
  } catch (error) {
    console.error("Error generating course:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate course", 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}