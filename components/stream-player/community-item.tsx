"use client"

import {cn, stringToColor} from "@/lib/utils";
import {Hint} from "@/components/hint";
import {Button} from "@/components/ui/button";
import {MinusCircle} from "lucide-react";
import {useTransition} from "react";
import {onBlock} from "@/actions/block";
import {toast} from "sonner";

interface CommunityItemProps {
    hostname: string;
    viewerName: string;
    participantName?: string;
    participantIdentity: string;
}

export const CommunityItem = ({hostname, participantName, viewerName, participantIdentity}: CommunityItemProps) => {
    const color = stringToColor(participantName || "")
    const isSelf = participantName === viewerName;
    const isHost = viewerName === hostname
    const [isPending, startTransition] = useTransition();

    const handleBlock = () => {
        if(!participantName || isSelf || !isHost) return;

        startTransition(() => {
            onBlock(participantIdentity)
                .then(() => toast.success(`Blocked ${participantName}`))
                .catch(() => toast.error(`Something went wrong`))
        })
    }

    return (
        <div className={cn("group flex items-center justify-between w-full p-2 rounded-md text-sm hover:bg-white/5", isPending && "opacity-50 pointer-events-none")}>
            <p style={{color: color}}>
                {participantName}
            </p>
            {isHost && !isSelf && (
                <Hint label="Block">
                    <Button variant="ghost" disabled={isPending} onClick={handleBlock} className="h-auto w-auto p-1 opacity-0 group-hover:opacity-100 transition">
                        <MinusCircle className="h-4 w-4 text-muted-foreground"/>
                    </Button>
                </Hint>
            )}
        </div>
    );
};