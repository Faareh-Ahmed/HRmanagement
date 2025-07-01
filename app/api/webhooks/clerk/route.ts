
// // Correct import for App Router webhooks helper
// import { WebhookEvent } from '@clerk/nextjs/server';
// // Import the verification function
// import { verifyWebhook } from '@clerk/nextjs/webhooks'; // Or '@clerk/nextjs/webhooks' if using Pages Router style

// import { NextResponse } from 'next/server';
// import { clerkClient } from '@clerk/clerk-sdk-node';

// // Import your user actions
// import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions';

// export async function POST(req: Request) {
//   console.log('[Webhook Handler] Received POST request.');

//   let evt: WebhookEvent;

//   // --- Verification using Clerk's verifyWebhook ---
//   try {
//     console.log('[Webhook Handler] Verifying webhook using verifyWebhook...');
//     // verifyWebhook handles reading headers and body, and signature verification.
//     // It requires the raw Request object.
//     // Note: verifyWebhook consumes the request body, so if you needed to read it
//     // *before* verification for some other reason, you'd need to clone the request.
//     // Here, we only need the verified event payload afterwards.
//     evt = await verifyWebhook(req);
//     console.log('[Webhook Handler] Webhook verified successfully.');

//   } catch (err: unknown) { // Catch specific error type if known, otherwise any/unknown
//     const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//     console.error('[Webhook Handler] Error verifying webhook:', errorMessage);
//     console.error('[Webhook Handler] Full Error Object:', err); // Log the full error for more details
//     // It's helpful to return the specific error message from Clerk if available
//     return new Response(`Error verifying webhook: ${errorMessage}`, {
//       status: 400,
//     });
//   }
//   // --- End Verification ---

//   const eventType = evt.type;
//   console.log(`[Webhook Handler] Processing verified event type: ${eventType}`);

//   // --- Handle Specific Event Types (Logic remains the same) ---

//   // USER CREATED
//   if (eventType === 'user.created') {
//     const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

//     if (!id || !email_addresses || email_addresses.length === 0) {
//         console.error("[Webhook Handler] Error: Missing id or email for user.created event.", evt.data);
//         return NextResponse.json({ message: 'Error: Missing required user data' }, { status: 400 });
//     }

//     const userToCreate = {
//       clerkId: id,
//       email: email_addresses[0].email_address,
//       username: username || '',
//       firstName: first_name ?? '',
//       lastName: last_name ?? '',
//       photo: image_url || '',
//     };

//     console.log('[Webhook Handler] Preparing to create user:', userToCreate);

//     try {
//       const newUser = await createUser(userToCreate);
//       console.log('[Webhook Handler] User created successfully in DB:', newUser?._id);

//       if (newUser?._id) {
//           console.log(`[Webhook Handler] Updating Clerk metadata for user ${id} with DB ID ${newUser._id}`);
//           try {
//               await clerkClient.users.updateUserMetadata(id, {
//                   publicMetadata: {
//                       userId: newUser._id.toString(),
//                   },
//               });
//               console.log(`[Webhook Handler] Clerk metadata updated successfully for user ${id}.`);
//           } catch (metaError) {
//               console.error(`[Webhook Handler] Error updating Clerk metadata for user ${id}:`, metaError);
//           }
//       } else {
//           console.warn(`[Webhook Handler] DB user object or _id missing after creation for Clerk ID ${id}. Cannot update metadata.`);
//       }

//       return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
//     } catch (error) {
//       console.error('[Webhook Handler] Error calling createUser action:', error);
//       return NextResponse.json({ message: 'Error creating user in database' }, { status: 500 });
//     }
//   }

//   // USER UPDATED
//   if (eventType === 'user.updated') {
//     const { id, image_url, first_name, last_name, username } = evt.data;

//      if (!id) {
//         console.error("[Webhook Handler] Error: Missing id for user.updated event.", evt.data);
//         return NextResponse.json({ message: 'Error: Missing required user data' }, { status: 400 });
//     }

//     const userToUpdate = {
//       username: username || '',
//       firstName: first_name ?? '',
//       lastName: last_name ?? '',
//       photo: image_url || '',
//     };

//     console.log(`[Webhook Handler] Preparing to update user ${id} with data:`, userToUpdate);

//     try {
//       const updatedUser = await updateUser(id, userToUpdate);
//        if (!updatedUser) {
//            console.warn(`[Webhook Handler] User with clerkId ${id} not found for update.`);
//            return NextResponse.json({ message: 'User not found for update, webhook acknowledged.' }, { status: 200 });
//        }
//       console.log('[Webhook Handler] User updated successfully in DB:', updatedUser._id);
//       return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 });
//     } catch (error) {
//       console.error(`[Webhook Handler] Error calling updateUser action for ${id}:`, error);
//       return NextResponse.json({ message: 'Error updating user in database' }, { status: 500 });
//     }
//   }

//   // USER DELETED
//   if (eventType === 'user.deleted') {
//     // Clerk's event payload for deleted might differ slightly, check their docs.
//     // Often it includes { id: string, deleted: boolean }
//     // We primarily need the 'id'.
//     const { id } = evt.data;

//     // Important: Check if ID exists in the deleted event payload
//     if (!id) {
//         console.error("[Webhook Handler] Error: Missing id for user.deleted event.", evt.data);
//         // If ID is missing, we can't delete. Return 400.
//         return NextResponse.json({ message: 'Error: Missing user ID for deletion' }, { status: 400 });
//     }


//     console.log(`[Webhook Handler] Preparing to delete user with Clerk ID: ${id}`);

//     try {
//       const deletedUser = await deleteUser(id);

//       if (!deletedUser) {
//            console.warn(`[Webhook Handler] User with clerkId ${id} not found for deletion (already deleted or never existed in DB?).`);
//            return NextResponse.json({ message: 'User not found for deletion, webhook acknowledged.' }, { status: 200 });
//       }

//       console.log('[Webhook Handler] User deleted successfully from DB:', deletedUser._id);
//       return NextResponse.json({ message: 'User deleted successfully', user: deletedUser }, { status: 200 });

//     } catch (error) {
//       console.error(`[Webhook Handler] Error calling deleteUser action for ${id}:`, error);
//       return NextResponse.json({ message: 'Error deleting user from database' }, { status: 500 });
//     }
//   }

//   // --- Fallback for Unhandled Events ---
//   console.log(`[Webhook Handler] Unhandled event type: ${eventType}. ID: ${evt.data.id ?? 'N/A'}. Acknowledging receipt.`);
//   return NextResponse.json({ message: 'Webhook received but event type not handled' }, { status: 200 });
// }

// // GET handler can remain the same for basic checks
// export async function GET() {
//     console.log("[Webhook Handler] Received GET request.");
//     return Response.json({ message: 'Clerk Webhook Endpoint Active' });
// }