"use server"

import {Stream} from "@prisma/client";
import {getSelf} from "@/lib/auth-service";
import {getStreamByUserId} from "@/lib/stream-service";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";

export const updateStream = async (values: Partial<Stream>) => {
    try {
        const self = await getSelf()
        const selfStream = await getStreamByUserId(self.id)

        if(!selfStream) {
            throw new Error("Stream not found")
        }

        const validData = {
            name: values.name,
            thumbnailUrl: values.thumbnailUrl,
            isChatEnabled: values.isChatEnabled,
            isChatDelayed: values.isChatDelayed,
            isChatFollowersOnly: values.isChatFollowersOnly
        }

        const stream = await db.stream.update({
            where: {
                id: selfStream.id,
            },
            data: {
                ...validData
            }
        })

        revalidatePath(`/u/${self.username}/chat`)
        revalidatePath(`/u/${self.username}`)
        revalidatePath(`/${self.username}`)

        return stream;

    }catch (err) {
        throw new Error("Unable to update stream");
    }
}