import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req :NextRequest, {params}: {params: Promise<{memberId: string}>}) {
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const {memberId} = await params
        const serverId = searchParams.get("serverId")

        if(!profile) {
            return new NextResponse('Unauthorize', {status: 401})
        }

        if(!serverId) {
            return new NextResponse('server id missing', {status: 400})
        }

        if(!memberId){
            return new NextResponse('Member Id Missing', {status: 400})
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            }, 
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            }, 
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(server)
        
    } catch (error) {
        console.log('[MEMBER_ID_DELETE]', error)
        return new NextResponse('Internal Error', {status: 500})
    }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { memberId } = await params;
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("unauthorize", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("server Id missing", { status: 400 });
    }

    if (!memberId) {
      return new NextResponse("member id missing", { status: 400 });
    }

    const server = await db.server.update({
        where: {
            id: serverId,
            profileId: profile.id
        },
        data: {
            members: {
                update: {
                    where: {
                        id: memberId,
                        profileId: {
                            not: profile.id
                        }
                    },
                    data: {
                        role
                    }
                }
            }
        },
        include: {
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: 'asc'
                }
            }
        }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[MEMBER_ID]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

