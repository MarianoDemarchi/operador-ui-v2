import React from "react";

interface Props {
  url: string;
}

const MonitoreoTablero: React.FC<Props> = ({ url }) => {
  return (
    <div style={{ height: "80vh" }}>
      <iframe
        src={url}
        width="100%"
        height="100%"
        frameBorder={0}
        title="Dashboard de Grafana"
      />
    </div>
  );
};

export default MonitoreoTablero;
