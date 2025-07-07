import { clerkClient } from '@clerk/express';
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, updateUser, deleteUser } from "@/lib/actions/user.actions";
export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id =  (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`[Webhook Handler] Received event with ID: ${id} and type: ${evt.type}`);

  // CREATE User in mongodb
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;
    
      if (!id || !email_addresses || email_addresses.length === 0) {
        console.error("[Webhook Handler] Error: Missing id or email for user.created event.", evt.data);
        return NextResponse.json({ message: 'Error: Missing required user data' }, { status: 400 });
    }

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username || '',
      firstName: first_name ?? '',
      lastName: last_name ?? '',
      photo: image_url || '',
    };

    console.log('[Webhook Handler] Preparing to create user:', user);

    try {
      const newUser = await createUser(user);
      console.log('[Webhook Handler] User created successfully in DB:', newUser?._id);

      if (newUser?._id) {
          console.log(`[Webhook Handler] Updating Clerk metadata for user ${id} with DB ID ${newUser._id}`);
          try {
              await clerkClient.users.updateUserMetadata(id, {
                  publicMetadata: {
                      userId: newUser._id.toString(),
                  },
              });
              console.log(`[Webhook Handler] Clerk metadata updated successfully for user ${id}.`);
          } catch (metaError) {
              console.error(`[Webhook Handler] Error updating Clerk metadata for user ${id}:`, metaError);
          }
      } else {
          console.warn(`[Webhook Handler] DB user object or _id missing after creation for Clerk ID ${id}. Cannot update metadata.`);
      }

      return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
    } catch (error) {
      console.error('[Webhook Handler] Error calling createUser action:', error);
      return NextResponse.json({ message: 'Error creating user in database' }, { status: 500 });
    }
}


// USER UPDATED
  if (eventType === 'user.updated') {
    const { id, image_url, first_name, last_name, username } = evt.data;

     if (!id) {
        console.error("[Webhook Handler] Error: Missing id for user.updated event.", evt.data);
        return NextResponse.json({ message: 'Error: Missing required user data' }, { status: 400 });
    }

    const userToUpdate = {
      username: username || '',
      firstName: first_name ?? '',
      lastName: last_name ?? '',
      photo: image_url || '',
    };

    console.log(`[Webhook Handler] Preparing to update user ${id} with data:`, userToUpdate);

    try {
      const updatedUser = await updateUser(id, userToUpdate);
       if (!updatedUser) {
           console.warn(`[Webhook Handler] User with clerkId ${id} not found for update.`);
           return NextResponse.json({ message: 'User not found for update, webhook acknowledged.' }, { status: 200 });
       }
      console.log('[Webhook Handler] User updated successfully in DB:', updatedUser._id);
      return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 });
    } catch (error) {
      console.error(`[Webhook Handler] Error calling updateUser action for ${id}:`, error);
      return NextResponse.json({ message: 'Error updating user in database' }, { status: 500 });
    }
  }

  // USER DELETED
  if (eventType === 'user.deleted') {
    // Clerk's event payload for deleted might differ slightly, check their docs.
    // Often it includes { id: string, deleted: boolean }
    // We primarily need the 'id'.
    const { id } = evt.data;

    // Important: Check if ID exists in the deleted event payload
    if (!id) {
        console.error("[Webhook Handler] Error: Missing id for user.deleted event.", evt.data);
        // If ID is missing, we can't delete. Return 400.
        return NextResponse.json({ message: 'Error: Missing user ID for deletion' }, { status: 400 });
    }


    console.log(`[Webhook Handler] Preparing to delete user with Clerk ID: ${id}`);

    try {
      const deletedUser = await deleteUser(id);

      if (!deletedUser) {
           console.warn(`[Webhook Handler] User with clerkId ${id} not found for deletion (already deleted or never existed in DB?).`);
           return NextResponse.json({ message: 'User not found for deletion, webhook acknowledged.' }, { status: 200 });
      }

      console.log('[Webhook Handler] User deleted successfully from DB:', deletedUser._id);
      return NextResponse.json({ message: 'User deleted successfully', user: deletedUser }, { status: 200 });

    } catch (error) {
      console.error(`[Webhook Handler] Error calling deleteUser action for ${id}:`, error);
      return NextResponse.json({ message: 'Error deleting user from database' }, { status: 500 });
    }
  }

  // --- Fallback for Unhandled Events ---
  console.log(`[Webhook Handler] Unhandled event type: ${eventType}. ID: ${evt.data.id ?? 'N/A'}. Acknowledging receipt.`);
  return NextResponse.json({ message: 'Webhook received but event type not handled' }, { status: 200 });


}