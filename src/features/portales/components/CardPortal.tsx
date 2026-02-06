import { Card, Image } from "antd";

export const PortalCard = ({
  href,
  logo,
  className,
  imageStyle,
}: {
  href: string;
  logo: string;
  className?: string;
  imageStyle?: React.CSSProperties;
}) => (
  <Card
    className={className}
    hoverable
    style={{
      height: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <a href={href} target="_blank" rel="noreferrer">
      <Image src={logo} preview={false} style={imageStyle} />
    </a>
  </Card>
);
