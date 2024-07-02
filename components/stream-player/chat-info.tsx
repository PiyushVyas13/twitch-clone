import {useMemo} from "react";
import {Hint} from "@/components/hint";
import {Info} from "lucide-react";

interface ChatInfoProps {
    isDelayed: boolean;
    isFollowersOnly: boolean;
}

export const ChatInfo = ({isFollowersOnly, isDelayed}: ChatInfoProps) => {
    const hint = useMemo(() => {
        if(isFollowersOnly && !isDelayed) {
            return "Only followers can chat"
        }

        if(isDelayed && !isFollowersOnly) {
            return "Slow mode is enabled"
        }

        if(isDelayed && isFollowersOnly) {
            return "Slow mode is enabled. Only followers can chat"
        }

        return ""

    }, [isDelayed, isFollowersOnly])

    const label = useMemo(() => {
        if(isFollowersOnly && !isDelayed) {
            return "Followers only"
        }

        if(isDelayed && !isFollowersOnly) {
            return "Slow mode"
        }

        if(isDelayed && isFollowersOnly) {
            return "Followers only and Slow mode"
        }

        return ""

    }, [isDelayed, isFollowersOnly])

    if(!isFollowersOnly && !isDelayed) {
        return null;
    }

    return (
        <div className="p-2 text-muted-foreground bg-white/5 border border-white/10 w-full rounded-t-md flex items-center gap-x-2">
            <Hint label={hint}>
                <Info className="h-4 w-4" />
            </Hint>
            <p className="text-xs font-semibold">
                {label}
            </p>
        </div>
    );
};