import React from 'react';
import {getSelf} from "@/lib/auth-service";
import {getStreamByUserId} from "@/lib/stream-service";
import {Stream} from "@prisma/client";
import {ToggleCard} from "@/app/(dashboard)/u/[username]/chat/_components/toggle-card";

const ChatSettingsPage = async () => {
    const self = await getSelf();

    const stream: Stream = await getStreamByUserId(self.id)

    if(!stream) {
        throw new Error("Stream not found");
    }

    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Chat Settings
                </h1>
            </div>
            <div className="space-y-4">
                <ToggleCard
                    field="isChatEnabled"
                    label={"Enable Chat"}
                    value={stream.isChatEnabled}
                />
                <ToggleCard
                    field="isChatDelayed"
                    label={"Enable Slow Mode in Chats"}
                    value={stream.isChatDelayed}
                />
                <ToggleCard
                    field="isChatFollowersOnly"
                    label={"Allow only followers to comment on chat"}
                    value={stream.isChatFollowersOnly}
                />
            </div>
        </div>
    );
};

export default ChatSettingsPage;