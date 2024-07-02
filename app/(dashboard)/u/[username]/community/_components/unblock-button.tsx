"use client"

import {useTransition} from "react";
import {Button} from "@/components/ui/button";
import {onUnblock} from "@/actions/block";
import {toast} from "sonner";

interface UnblockButtonProps {
    userId: string;
}

export const UnblockButton = ({userId}: UnblockButtonProps) => {
    const [isPending, startTransition] = useTransition()

    const onClick = () => {
        startTransition(() => {
            onUnblock(userId)
                .then((data) => toast.success(`Unblocked ${data.blocked.username}`))
                .catch(() => toast.error("Something went wrong"));
        })
    }
    return (
        <Button className="text-blue-500 w-full" variant="link" size="sm" disabled={isPending} onClick={onClick}>
            Unblock
        </Button>
    );
};