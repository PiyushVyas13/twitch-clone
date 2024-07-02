import {headers} from "next/headers";
import {Webhook} from "svix";
import {WebhookEvent} from "@clerk/backend";
import {db} from "@/lib/db";
import {resetIngress} from "@/actions/ingress";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
    if(!WEBHOOK_SECRET) {
        throw new Error("Add webhook secret to .env")
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    if(!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {status: 400})
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const webhook =  new Webhook(WEBHOOK_SECRET)

    let evt: WebhookEvent

    try {
        evt = webhook.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        }) as WebhookEvent
    }catch (err) {
        console.error("Error verifying request", err)
        return new Response('Error occured -- verification failed', {status: 400})
    }


    const eventType = evt.type;

    if(eventType === 'user.created') {
        await db.user.create({
            data: {
                externalUserId: payload.data.id,
                username: payload.data.username,
                imageUrl: payload.data.image_url,
                stream: {
                    create: {
                        name: `${payload.data.username}'s stream`,
                    }
                }
            }
        })
    }

    if(eventType === "user.updated") {
        await db.user.update({
            where: {
                externalUserId: payload.data.id,
            },
            data: {
                username: payload.data.username,
                imageUrl: payload.data.image_url,
            }
        })
    }

    if(eventType === 'user.deleted') {
        await resetIngress(payload.data.id);

        await db.user.delete({
            where: {
                externalUserId: payload.data.id
            }
        })
    }

    return new Response('This is it', {status: 200})

}