"use client"

import {Button} from "@/components/ui/button";
import {useAuth} from "@clerk/nextjs";
import {Heart} from "lucide-react";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {onFollow, onUnfollow} from "@/actions/follow";
import {toast} from "sonner";
import {Skeleton} from "@/components/ui/skeleton";

interface ActionsProps {
    isFollowing: boolean;
    hostIdentity: string;
    isHost: boolean;
}



export const Actions = ({isHost, hostIdentity, isFollowing}:ActionsProps) => {
    const {userId} = useAuth()
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleFollow = () => {
        startTransition(() => {
            onFollow(hostIdentity)
                .then((data) => toast.success(`You are now following ${data.following.username}!`))
                .catch(() => toast.error("Something went wrong"))
        })
    }

    const handleUnFollow = () => {
        startTransition(() => {
            onUnfollow(hostIdentity)
                .then((data) => toast.success(`Unfollowed ${data.following.username}`))
                .catch(() => toast.error("Something went wrong"))
        })
    }

    const toggleFollow = () => {
        if(!userId) {
            return router.push("/sign-in")
        }

        if(isHost) return ;

        if(isFollowing) {
            handleUnFollow()
        }
        else {
            handleFollow()
        }

    }

    return (
        <Button disabled={isPending || isHost} onClick={toggleFollow} variant="primary" size="sm" className="w-full lg:w-auto">
            <Heart className={cn("h-4 w-4 mr-2", isFollowing ? "fill-white" : "fill-none")}/>
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    );
};

export const ActionsSkeleton = () => {
    return (
        <Skeleton className="h-10 w-full lg:w-24" />
    )
}