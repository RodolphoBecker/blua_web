import * as React from "react";

function ChatInput({
  sendChatMessage
}: {
  sendChatMessage: (text: string) => void;
}) {
  const [text, setText] = React.useState("");

  return (
    <form
      className={"input-wrapper"}
      onSubmit={(e) => {
        e.preventDefault();
        sendChatMessage(text);
        setText("");
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        type="text"
        placeholder="Type here..."
      />
      <button type="submit">Send message</button>
    </form>
  );
}

export default ChatInput;
