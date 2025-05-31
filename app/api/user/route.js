import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server"; // Import currentUser

export async function POST(req) {
  try {
    // Get the authenticated user from Clerk
    const user = await currentUser();

    // If no user is authenticated, return an unauthorized response
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get email and name from Clerk's user object
    // Clerk provides a primary email address. You might need to adjust if you use multiple.
    const email = user.emailAddresses[0]?.emailAddress;
    const name = user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.username || email; // Fallback to username or email if name not available

    if (!email) {
      return new NextResponse("Email not found for the authenticated user.", { status: 400 });
    }

    // Check if the user already exists in your database using the email from Clerk
    const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (existingUsers.length === 0) {
      // User does not exist, create a new entry
      const result = await db.insert(usersTable).values({
        email: email,
        name: name,
        clerkId: user.id, // Store Clerk's user ID for easier lookup and syncing
      }).returning(); // .returning() is important to get the inserted data back

      console.log("User created:", result);
      return NextResponse.json(result[0]); // Return the first element of the result array
    } else {
      // User already exists, return the existing user data
      console.log("User already exists:", existingUsers[0]);
      return NextResponse.json(existingUsers[0]);
    }
  } catch (error) {
    console.error("Error in POST API route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}