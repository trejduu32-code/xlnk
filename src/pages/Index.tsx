const Index = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <iframe
        className="w-full h-full border-none"
        src="https://gptchat.one/gpt-chat-free-2/"
        allowFullScreen
        title="Chat"
        style={{ marginTop: '-40px', height: 'calc(100% + 40px)' }}
      />
    </div>
  );
};

export default Index;
