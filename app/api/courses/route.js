import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const cid = searchParams.get("cid");
        
        console.log("Course ID (cid):", cid);
        
        // Add await here - this was missing!
        const result = await db.select().from(coursesTable).where(eq(coursesTable.cid, cid));
        
        console.log("Query result:", result);
        
        if (result.length === 0) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }
        
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}