const Index = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <iframe
        className="w-full border-none absolute left-0"
        src="https://gptchat.one/gpt-chat-free-2/"
        allowFullScreen
        title="Chat"
        style={{ top: '-50px', height: 'calc(100% + 50px)' }}
      />
    </div>
  );
};

export default Index;
