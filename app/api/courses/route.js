// app/api/courses/route.js
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("userEmail");
        const cid = searchParams.get("cid");
        
        // If cid is provided, get specific course
        if (cid) {
            console.log("Course ID (cid):", cid);
            
            const result = await db.select().from(coursesTable).where(eq(coursesTable.cid, cid));
            
            console.log("Query result:", result);
            
            if (result.length === 0) {
                return NextResponse.json({ error: "Course not found" }, { status: 404 });
            }
            
            return NextResponse.json(result[0]);
        }
        
        // If userEmail is provided, get all courses for that user
        if (userEmail) {
            console.log("Fetching courses for user:", userEmail);
            
            const result = await db.select().from(coursesTable).where(eq(coursesTable.userEmail, userEmail));
            
            console.log("User courses query result:", result);
            
            return NextResponse.json(result);
        }
        
        // If no parameters provided, return error
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}