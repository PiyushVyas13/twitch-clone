"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Button} from "@/components/ui/button";
import {UserAvatar} from "@/app/(browse)/_components/user-avatar";
import {ArrowUpDown} from "lucide-react";
import {UnblockButton} from "@/app/(dashboard)/u/[username]/community/_components/unblock-button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BlockedUser = {
    id: string
    userId: string
    imageUrl: string
    username: string
    createdAt: string
}

export const columns: ColumnDef<BlockedUser>[] = [
    {
        accessorKey: "username",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                    Username
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => (
            <div className="flex items-center gap-x-4">
                <UserAvatar username={row.original.username} imageUrl={row.original.imageUrl} />
                <span>{row.original.username}</span>
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Date Blocked
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "actions",
        cell: ({row}) => <UnblockButton userId={row.original.userId}/>,
    },
]
