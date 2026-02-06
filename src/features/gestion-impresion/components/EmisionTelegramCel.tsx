// components/TelegramPhoneEditable.tsx
import { useEffect, useRef, useState } from "react";
import "../styles/telegram-phone.css";
import { Button } from "antd";

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSendMessage: (mensaje: string) => void;
}

const TelegramPhoneEditable: React.FC<Props> = ({
  value,
  onChange,
  onSendMessage,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // setea SOLO cuando cambia la fila (no al tipear)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);
  const handleSend = () => {
    const text = value.trim();
    if (!text) return;
    onSendMessage(text);
  };

  return (
    <div className="phone">
      <div className="phone-header">Telegram</div>

      <div className="phone-screen">
        <div
          ref={ref}
          className="bubble outgoing editable"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) =>
            onChange((e.currentTarget as HTMLDivElement).innerText)
          }
        />

        <div className="message-date">
          {" "}
          {formatDate(now)}
          <span> {formatTime(now)}</span>
        </div>
      </div>

      <div className="phone-footer">
        <Button
          onClick={handleSend}
          disabled={!value?.trim()}
          size="large"
          shape="round"
          variant="dashed"
          type="primary"
        >
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default TelegramPhoneEditable;
