import React from 'react';
import {columns} from "@/app/(dashboard)/u/[username]/community/_components/columns";
import {DataTable} from "@/app/(dashboard)/u/[username]/community/_components/data-table";
import {getBlockedUsers} from "@/lib/block-service";
import {format} from "date-fns";





const CommunityPage = async () => {
    const blockedUsers = await getBlockedUsers();

    // @ts-ignore
    const formattedData = blockedUsers.map((blockedUser) => ({
        ...blockedUser,
        userId: blockedUser.blocked.id,
        imageUrl: blockedUser.blocked.image_url,
        username: blockedUser.blocked.username,
        createdAt: format(new Date(blockedUser.blocked.createdAt), "dd/MM/yyyy"),
    }))

    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Community Settings
                </h1>
            </div>
            <DataTable columns={columns} data={formattedData} />
        </div>
    );
};

export default CommunityPage;