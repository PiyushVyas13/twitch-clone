import {cva, type VariantProps} from "class-variance-authority";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import {LiveBadge} from "@/app/(browse)/_components/live-badge";
import {Skeleton} from "@/components/ui/skeleton";

interface UserAvatar extends VariantProps<typeof avatarSizes>{
    username: string;
    isLive?: boolean;
    imageUrl: string;
    showBadge?: boolean;
}

const avatarSizes = cva(
    "",
    {
        variants: {
            size: {
                default: "h-8 w-8",
                lg: "h-14 w-14"
            }
        },
        defaultVariants: {
            size: "default"
        }
    }
)

export const UserAvatar = ({username, imageUrl, isLive , showBadge, size}: UserAvatar) => {
    const canShowBadge = showBadge && isLive;

    return (
        <div className="relative">
           <Avatar className={cn(isLive && "ring-2 ring-rose-500 border border-background", avatarSizes({ size }))}>
               <AvatarImage src={imageUrl} alt={`${username} avatar`} className="object-cover" />
               <AvatarFallback>
                   {username[0]}
                   {username[username.length - 1]}
               </AvatarFallback>
           </Avatar>
            {canShowBadge && (
                <div className="absolute -bottom-3 left-1/4 transform-translate-x-1/2">
                    <LiveBadge />
                </div>
            )}
        </div>
    );
};

interface UserAvatarSkeletonProps extends VariantProps<typeof avatarSizes> {
    // nothing here
}

export const UserAvatarSkeleton = ({size}: UserAvatarSkeletonProps) => {
    return (
        <Skeleton className={cn("rounded-full", avatarSizes({size}))} />
    );
};