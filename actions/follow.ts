"use server";

import {followUser, unFollowUser} from "@/lib/follow-service";
import {revalidatePath} from "next/cache";
import {getSelf} from "@/lib/auth-service";
import {db} from "@/lib/db";

export const onFollow = async (id: string) => {
    try {
        const followedUser = await followUser(id);

        revalidatePath("/")
        if(followedUser) {
            revalidatePath(`/${followedUser.following.username}`)
        }

        return followedUser;

    }catch(error) {
        throw new Error("Internal Error");
    }
}

export const onUnfollow = async (id: string) => {
    try {
        const unfollowedUser = await unFollowUser(id);

        revalidatePath("/")

        if(unfollowedUser) {
            revalidatePath(`/${unfollowedUser.following.username}`)
        }

        return unfollowedUser;

    } catch (err) {
        throw new Error("Internal Error");
    }
}

