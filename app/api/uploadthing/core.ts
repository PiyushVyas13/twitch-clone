import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {getSelf} from "@/lib/auth-service";
import {User} from "@prisma/client";
import {db} from "@/lib/db";

const f = createUploadthing();

export const ourFileRouter = {
    thumbnailUploader: f({
        image: {maxFileCount: 1, maxFileSize: "4MB"
        }
    })
        .middleware(async () => {
            const self:User = await getSelf();

            return {user: self}
        })
        .onUploadComplete(async ({metadata, file}) => {
            await db.stream.update({
                where: {
                    userId: metadata.user.id
                },
                data: {
                    thumbnailUrl: file.url
                }
            })

            return {fileUrl: file.url}
        })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;