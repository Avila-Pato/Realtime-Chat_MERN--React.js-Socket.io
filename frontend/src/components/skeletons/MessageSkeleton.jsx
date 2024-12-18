const MessageSkeleton = () => {
    // Este array se utiliza para simular mensajes vacíos o "esqueletos" que sirven como indicadores de carga
  
    const skeletonMessages = Array(6).fill(null);
  
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Se usa el método map para recorrer el array skeletonMessages. */}
        {skeletonMessages.map((_, idx) => ( 
          <div
            key={idx}
          //   Dentro de cada iteración, se construye un mensaje esqueleto:
            className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full ">
                <div className="skeleton w-full rounded-full" />
              </div>
            </div>
  
            <div className="chat-header mb-1">
              <div className="skeleton h-4 w-16"/>
            </div>
  
            <div className="chat-bubble bg-transparent p-0">
              <div className="skeleton h-16 w-[200px]"/>
            </div>
  
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageSkeleton;
  