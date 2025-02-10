import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";

const Conversations = () => {
  const { loading, conversations } = useGetConversations();
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {loading ? (
        <span className="loading loading-spinner mx-auto" />
      ) : (
        <>
          {conversations.map((conversation) => (
            <Conversation
              key={conversation.id}
              conversation={conversation}
              emoji=""
            />
          ))}
        </>
      )}
    </div>
  );
};
export default Conversations;
