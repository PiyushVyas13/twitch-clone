"use server"

import {getSelf} from "@/lib/auth-service";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {User} from "@prisma/client";

export const updateBio = async (values: Partial<User>) => {
    try {
        const self = await getSelf();

        const validData = {
            bio: values.bio,
        }

        const user = await db.user.update({
            where: {
                id: self.id
            },
            data:{
                ...validData
            }
        })

        revalidatePath(`/${self.username}`)
        revalidatePath(`/u/${self.username}`)

        return user;

    }catch {
        throw new Error("Something went wrong");
    }
}