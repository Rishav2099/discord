import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export  async function POST (req :NextRequest) {
    try {
        const profile = await currentProfile()
        const {name, type} = await req.json();
        const {searchParams} = new URL(req.url);

        const serverId = searchParams.get('serverId')

        if (!profile) {
            return new NextResponse('Unauthorize', {status: 401})
        }

        if (!serverId) {
            return new NextResponse('Missing', {status: 400})
        }

        if(name === 'general') {
            return new NextResponse('name cannot be general', {status: 400})
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('CHANNEL_POST', error);
        return new NextResponse('internal error', {status: 500})
    }
}