"use client";

import {Button} from "@/components/ui/button";
import {useTransition} from "react";
import {onFollow, onUnfollow} from "@/actions/follow";
import {toast} from "sonner";
import {onBlock, onUnblock} from "@/actions/block";

interface ActionProps {
    isFollowing: boolean;
    userId: string;
}

export const Actions = ({isFollowing, userId}: ActionProps) => {
    const [isPending, startTransition] = useTransition();

    const handleFollow = () => {
        startTransition(() => {
            onFollow(userId)
                .then((data) => toast.success(`You are now following ${data.following.username}!`)
                )
                .catch((err) => {
                        console.log(err);
                        toast.error("Something went wrong")
                    }
                )
        })
    }

    const handleUnFollow = () => {
        startTransition(() => {
            onUnfollow(userId)
                .then((data) => toast.success(`Unfollowed ${data.following.username}!`)
                )
                .catch((err) => {
                        console.log(err);
                        toast.error("Something went wrong")
                    }
                )
        })
    }

    const onClick = () => {
        if(isFollowing) {
            handleUnFollow()
        }
        else {
            handleFollow()
        }
    }

    const handleBlock = () => {
        startTransition(() => {
            onBlock(userId)
                .then((data) => toast.success(`Blocked ${data.blocked.username}`))
                .catch((err) => {
                    console.error(err)
                    toast.error("Something went wrong")
                });
        })
    }

    const handleUnBlock = () => {
        startTransition(() => {
            onUnblock(userId)
                .then((data) => toast.success(`Unblocked ${data.blocked.username}`))
                .catch((err) => {
                    console.error(err)
                    toast.error("Something went wrong")
                });
        })
    }

    console.log(isPending, isFollowing)

    return (
        <>
            <Button onClick={onClick} disabled={isPending} variant="primary">
                {isFollowing ? "Unfollow" : "Follow"}
            </Button>
            <Button onClick={handleUnBlock} disabled={isPending} variant="destructive">
                Block user
            </Button>
        </>

    );
};