import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";

// Props for the useChatSocket hook
type ChatSocketProps = {
  addKey: string;      // Socket event name for adding messages
  updateKey: string;   // Socket event name for updating messages
  queryKey: string;    // React Query key for chat messages
};

// Extended message type including related member and profile
type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

// Main custom hook
export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    // Handler for updated message
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData?.pages?.length) return oldData;

        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          items: page.items.map((item: MessageWithMemberWithProfile) =>
            item.id === message.id ? message : item
          ),
        }));

        return {
          ...oldData,
          pages: newPages,
        };
      });
    });

    // Handler for new message
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueriesData([queryKey], (oldData: any) => {
        if (!oldData?.pages?.length) {
          return {
            pages: [{ items: [message] }],
          };
        }

        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          items: [message, ...newPages[0].items],
        };

        return {
          ...oldData,
          pages: newPages,
        };
      });
    });

    // Cleanup when component unmounts
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [socket, queryClient, addKey, updateKey, queryKey]);
};
