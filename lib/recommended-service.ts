import {db} from "@/lib/db";
import {getSelf} from "@/lib/auth-service";

export const getRecommended = async () => {
    let userId;

    try {
        const self = await getSelf();
        userId = self.id;
    }catch(err) {
        userId = null;
    }

    let users = [];

    if(userId) {
        users = await db.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                AND: [
                    {
                        NOT: {
                            id: userId
                        }
                    },
                    {
                        NOT: {
                            followedBy: {
                                some: {
                                    followerId: userId
                                }
                            }
                        }
                    },
                    {
                        NOT: {
                            blocking: {
                                some: {
                                    blockedId: userId
                                }
                            }
                        }
                    }
                ]

            },
            include: {
                stream: {
                    select: {
                        isLive: true
                    }
                }
            }
        })

    } else {
        users = await db.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                stream: true
            }
        })
    }

    return users;
}