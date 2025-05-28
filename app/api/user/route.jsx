import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm"; 

export async function POST(req) {
    // Parse the JSON body once
    const body = await req.json();
    const { email, name } = body; // Destructure from the parsed body

    // You can now use 'email' and 'name' for your logic, e.g., saving to a database

    const users = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if(users.length ==0){
        const result = await db.insert(usersTable).values({
            email: email,
            name: name,
        }).returning(usersTable);

        console.log("User created:", result);
        return NextResponse.json(result);
       
    }

    return NextResponse.json(users[0]);
}