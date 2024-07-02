"use client"

import {Stream, User} from "@prisma/client";
import {useViewerToken} from "@/hooks/use-viewer-token";
import {LiveKitRoom} from "@livekit/components-react";
import {Video, VideoSkeleton} from "@/components/stream-player/video";
import {useChatSidebar} from "@/store/use-chat-sidebar";
import {cn} from "@/lib/utils";
import {Chat, ChatSkeleton} from "@/components/stream-player/chat";
import {ChatToggle} from "@/components/stream-player/chat-toggle";
import {Header, HeaderSkeleton} from "@/components/stream-player/header";
import {InfoCard} from "@/components/stream-player/info-card";
import {AboutCard} from "@/components/stream-player/about-card";

type CustomStream = {
    id: string;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
    isLive: boolean;
    thumbnailUrl: string | null;
    name: string;
}

type CustomUser = {
    id: string;
    username: string;
    bio: string | null;
    stream: CustomStream | null;
    imageUrl: string;
    _count: {followedBy: number}

}

interface StreamPlayerProps {
    user: CustomUser;
    stream: CustomStream;
    isFollowing: boolean;
}

export const StreamPlayer = ({user, stream, isFollowing} : StreamPlayerProps) => {

    const {token, name, identity} = useViewerToken(user.id)
    const {collapsed} = useChatSidebar(state => state)


    console.log("Token: ", token)
    console.log("Name: ", name)
    console.log("Identity: ", identity)

    if(!token || !name || !identity) {
        return (
            <StreamPlayerSkeleton />
        )
    }

    return (
        <>
            {collapsed && (
                <div className="hidden lg:block fixed top-[100px] right-2 z-50">
                    <ChatToggle />
                </div>
            )}
            <LiveKitRoom serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL} token={token} className={cn("grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 h-full", collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2")}>
                <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-2 lg:overflow-y-auto hidden-scrollbar pb-10">
                    <Video hostname={user.username} hostIdentity={user.id} />
                    <Header
                        hostname={user.username}
                        hostIdentity={user.id}
                        viewerIdentity={identity}
                        imageUrl={user.imageUrl}
                        isFollowing={isFollowing}
                        name={stream.name}
                    />
                    <InfoCard
                        hostIdentity={user.id}
                        viewerIdentity={identity}
                        name={stream.name}
                        thumbnailUrl={stream.thumbnailUrl}
                    />
                    <AboutCard
                        hostname={user.username}
                        hostIdentity={user.id}
                        viewerIdentity={identity}
                        bio={user.bio}
                        followedByCount={user._count.followedBy}
                    />
                </div>
                <div className={cn("col-span-1", collapsed && "hidden")}>
                    <Chat
                        viewerName={name}
                        hostname={user.username}
                        hostIdentity={user.id}
                        isFollowing={isFollowing}
                        isChatEnabled={stream.isChatEnabled}
                        isChatDelayed={stream.isChatDelayed}
                        isChatFollowersOnly={stream.isChatFollowersOnly}
                    />
                </div>
            </LiveKitRoom>
        </>
    );
};

export const StreamPlayerSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-col-3 2xl:grid-cols-3 h-full">
            <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-2 lg:overflow-y-auto hidden-scrollbar pb-10">
                <VideoSkeleton />
                <HeaderSkeleton />
            </div>
            <div className="col-span-1 bg-background">
                <ChatSkeleton />
            </div>
        </div>
    )
}