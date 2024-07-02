import {WebhookReceiver} from "livekit-server-sdk";
import {headers} from "next/headers";
import {db} from "@/lib/db";

const receiver = new WebhookReceiver(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
)

export async function POST(req:Request) {
    console.log("HGISNDGON");
    const body = await req.text();

    const headerPayload = headers();
    const authorization = headerPayload.get("Authorization");

    if(!authorization) {
        return new Response("No authorization provided", {status: 400});
    }

    const event = await receiver.receive(body, authorization);

    if(event.event === "ingress_ended") {
        await db.stream.update({
            where: {
                ingressId: event.ingressInfo?.ingressId,
            },
            data: {
                isLive: false
            }
        })
    }
    if(event.event === "ingress_started") {
        console.log("HELLO WORLD")
        await db.stream.update({
            where: {
                ingressId: event.ingressInfo?.ingressId,
            },
            data: {
                isLive: true
            }
        })
    }

    return new Response("Updated", {status: 200});

}