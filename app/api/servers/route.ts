import {v4 as uuidv4} from 'uuid'
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { MemberRole } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const {name, imageUrl} = await req.json()
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse("Unauthorize", {status: 401})
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        {name: 'general', profileId: profile.id}
                    ]
                },
                members: {
                    create: [
                        {profileId: profile.id, role: MemberRole.ADMIN}
                    ]
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('Server post error', error)
        return new NextResponse('Internal error', {status: 500})
    }
}