"use server"

import {
    type CreateIngressOptions, IngressAudioEncodingPreset, IngressClient,
    IngressInput,
    IngressVideoEncodingPreset,
    RoomServiceClient,
    TrackSource
} from "livekit-server-sdk";
import {getSelf} from "@/lib/auth-service";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";

const roomService = new RoomServiceClient(
    process.env.LIVEKIT_API_URL!,
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
)

const ingressClient = new IngressClient(
    process.env.LIVEKIT_API_URL!,
)

export const resetIngress = async (hostIdentity: string) => {
    const ingresses = await ingressClient.listIngress({
        roomName: hostIdentity
    })

    const rooms = await roomService.listRooms([hostIdentity])

    for(const room of rooms) {
        await roomService.deleteRoom(room.name)
    }

    for(const ingress of ingresses) {
        if(ingress.ingressId) {
            await ingressClient.deleteIngress(ingress.ingressId)
        }
    }
}

export const createIngress = async (ingressType: IngressInput) => {
    const self = await getSelf();

    await resetIngress(self.id)

    const options: CreateIngressOptions = {
        name: self.username,
        roomName: self.id,
        participantName: self.username,
        participantIdentity: self.id,
    }

    if(ingressType === IngressInput.WHIP_INPUT) {
        options.enableTranscoding = false
    }
    else {
        // @ts-ignore
        options.video = {
            name: "Ingress Video",
            source: TrackSource.CAMERA,
            encodingOptions: {
                case: 'preset',
                value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS
            },
        }

        // @ts-ignore
        options.audio = {
            name: "Ingress Audio",
            source: TrackSource.MICROPHONE,
            encodingOptions: {
                case: "preset",
                value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS
            }
        }
    }

    const ingress = await ingressClient.createIngress(ingressType, options)

    if(!ingress || !ingress.url || !ingress.streamKey) {
        throw new Error("Failed to create ingress")
    }

    await db.stream.update({
        where: {
            userId: self.id
        },
        data: {
            ingressId: ingress.ingressId,
            serverUrl: ingress.url,
            streamKey: ingress.streamKey
        }
    })

    revalidatePath(`/u/${self.username}/keys`)
    console.log(ingress);
    return JSON.stringify(ingress);
}