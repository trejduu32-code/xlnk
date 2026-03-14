const Index = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black flex justify-center items-center">
      <iframe
        className="absolute border-none w-[1400px] h-[1000px] left-1/2 top-1/2 origin-center
          -translate-x-1/2 -translate-y-[55%] scale-[1.2]
          max-[900px]:w-[1200px] max-[900px]:h-[1000px] max-[900px]:-translate-y-[58%] max-[900px]:scale-[1.35]
          max-[500px]:w-[1100px] max-[500px]:h-[1000px] max-[500px]:-translate-y-[60%] max-[500px]:scale-[1.45]"
        src="https://gptchat.one/gpt-chat-free-2/"
        allowFullScreen
        title="Chat"
      />
    </div>
  );
};

export default Index;
