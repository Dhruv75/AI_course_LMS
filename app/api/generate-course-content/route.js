import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { course, courseTitle, courseId } = await req.json();
  const user = await currentUser();

  // Debug logging
  console.log('API called with:', { 
    courseExists: !!course, 
    courseTitle, 
    courseId,
    courseKeys: course ? Object.keys(course) : 'none'
  });

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

  // Validate required fields and extract chapters
  let chapters;
  if (course?.chapters && Array.isArray(course.chapters)) {
    chapters = course.chapters;
  } else if (course?.courseJson?.course?.chapters && Array.isArray(course.courseJson.course.chapters)) {
    chapters = course.courseJson.course.chapters;
  } else {
    console.error('Chapters validation failed:', { 
      courseChapters: course?.chapters, 
      nestedChapters: course?.courseJson?.course?.chapters 
    });
    return NextResponse.json(
      { error: "Invalid course data - chapters array is required" },
      { status: 400 }
    );
  }

  console.log(`Found ${chapters.length} chapters to process`);

  const PROMPT = `Generate detailed educational content for each topic based on the Chapter name and Topic. Create comprehensive, well-structured HTML content that is educational and engaging. Give response in JSON format only.

Schema:
{
  "chapterName": "string",
  "topics": [
    {
      "topic": "string",
      "content": "string (HTML formatted content)"
    }
  ]
}

User Input:`;

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // Generate content for each chapter
    const chapterPromises = chapters.map(async (chapter, index) => {
      try {
        console.log(`Processing chapter ${index + 1}: ${chapter.chapterName}`);
        
        const chapterInput = {
          chapterName: chapter.chapterName,
          topics: chapter.topics || [],
          duration: chapter.duration,
          courseTitle: courseTitle
        };

        const result = await model.generateContent(
          PROMPT + JSON.stringify(chapterInput)
        );
        const response = await result.response;
        const geminiTextResponse = response.text();

        console.log(`Response received for chapter ${chapter.chapterName}`);

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
          console.log(`Successfully parsed response for chapter ${chapter.chapterName}`);
        } catch (parseError) {
          console.warn(`Failed to parse response for chapter ${chapter.chapterName}:`, parseError);
          // Return a fallback structure if parsing fails
          return {
            chapterName: chapter.chapterName,
            topics: (chapter.topics || []).map(topic => ({
              topic: topic,
              content: `<h3>${topic}</h3><p>Content generation failed for this topic. Please try again.</p>`
            })),
            error: `Failed to parse AI response: ${parseError.message}`
          };
        }

        return parsedResponse;
      } catch (chapterError) {
        console.error(`Error generating content for chapter ${chapter.chapterName}:`, chapterError);
        return {
          chapterName: chapter.chapterName,
          topics: (chapter.topics || []).map(topic => ({
            topic: topic,
            content: `<h3>${topic}</h3><p>Error generating content for this topic.</p>`
          })),
          error: `Chapter generation failed: ${chapterError.message}`
        };
      }
    });

    // Wait for all chapters to be processed
    console.log('Waiting for all chapters to be processed...');
    const generatedChapters = await Promise.all(chapterPromises);

    // Check if any chapters were successfully generated
    const successfulChapters = generatedChapters.filter(chapter => !chapter.error);
    const failedChapters = generatedChapters.filter(chapter => chapter.error);

    console.log("Content generation completed:", {
      successful: successfulChapters.length,
      failed: failedChapters.length,
      total: generatedChapters.length
    });

    // Return success response
    return NextResponse.json({
      success: true,
      courseId: courseId,
      courseTitle: courseTitle,
      chapters: generatedChapters,
      summary: {
        totalChapters: generatedChapters.length,
        successfulChapters: successfulChapters.length,
        failedChapters: failedChapters.length
      },
      message: "Chapter content generated successfully"
    });

  } catch (error) {
    console.error("Error generating chapter content:", error);
    return NextResponse.json(
      {
        error: "Failed to generate chapter content",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}