import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>;
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  const { serverId, channelId } = await params;

  if (!profile) {
    return redirect("/sign-in");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <div className="flex-1 overflow-y-auto">
        <ChatMessages
          member={member}
          name={channel.name}
          chatId={channel.id}
          type="channel"
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
          paramKey="channelId"
          paramValue={channel.id}
        />
      </div>
      <div className="sticky bottom-0 bg-white dark:bg-[#313338] z-[1000]">
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
        />
      </div>
    </div>
  );
};

export default ChannelIdPage;
