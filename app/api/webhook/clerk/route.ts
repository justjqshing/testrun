import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { UpdateUser, createUser } from '@/lib/actions/user.actions'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { get } from 'http'
import { GetidByclerk } from '@/lib/actions/user.actions'
 
export async function POST(req: Request) {
 
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
 
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
 
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }
 
  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);
 
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent
 
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
 
  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
 
  if(eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name!,
      lastName: last_name!,
      photo: image_url,
    }

    const newUser = await createUser(user);

    if(newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id
        }
      })
    }

    return NextResponse.json({ message: 'OK', user: newUser })
  }
  if(eventType === 'user.updated') {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name!,
      lastName: last_name!,

    }
    
    const iden = GetidByclerk(id)
    console.log(`the id is ${iden} `)
    // const updatedUser = await UpdateUser(id, user);
    


    return NextResponse.json({ message: 'OK', user: iden })


   

  }
}

export async function GET(request: NextRequest) {
  const { userId: clerkUserId } = getAuth(request); // Get Clerk's user ID

  if (!clerkUserId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 } // Unauthorized
    );
  }

  try {
    // Fetch user session from Clerk
    const user = await clerkClient.users.getUser(clerkUserId);
    const userId = user.publicMetadata.userId; // Get your app's user ID

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in Clerk metadata" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json({ userId });
  } catch (error) {
    console.error("Error fetching user from Clerk:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 } 
    );
  }
}
