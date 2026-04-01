import { useQuery } from "@tanstack/react-query";
import { Row, Col, Button, Card, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import Splitter from "antd/es/splitter";
import MonitoreoAnomalias from "../components/MonitoreoAnomalias";
import { MonitoreoApi } from "../../../api/monitoreo";
import MonitoreoTablero from "../components/MonitoreoTablero";
const { Title, Text } = Typography;

/**
 * Tipos
 */

interface Lote {
  descripcion?: string;
  [key: string]: any; // si no conocés toda la estructura
}

type RawData = Record<string, Lote[]>;

interface ApiResponse {
  data?: {
    body?: string; // viene doble stringify
  };
}

function Monitoreo() {
  const { data, refetch, isFetching } = useQuery<ApiResponse>({
    queryKey: ["lotes"],
    queryFn: MonitoreoApi.getAll,
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  /**
   * Parse seguro del response
   */
  const rawData: RawData = (() => {
    try {
      if (!data?.data?.body) return {};
      const parsed = JSON.parse(JSON.parse(data.data.body));
      return parsed?.data || {};
    } catch (e) {
      console.error("Error parsing data", e);
      return {};
    }
  })();

  const sortedBaseNames = Object.keys(rawData).sort((a, b) =>
    a.localeCompare(b),
  );

  return (
    <>
      <div style={{ marginBottom: 15 }}>
        <Title level={4}>
          Monitoreo de servicios
          <Button
            type="text"
            icon={<ReloadOutlined spin={isFetching} />}
            onClick={() => refetch()}
          />
        </Title>

        <Text type="secondary">
          A continuación se listan los lotes de envío digital que presentaron
          valores fuera de lo esperado y los tableros de generacion de
          documentos y envios via api Por favor, revisá cada caso.
        </Text>
      </div>

      <Row justify="center" className="layout-row">
        <Col />
      </Row>

      <Splitter>
        {sortedBaseNames.length !== 0 && (
          <Splitter.Panel min={300}>
            {sortedBaseNames.map((baseName) => {
              const lotesOrdenados = [...rawData[baseName]].sort((a, b) =>
                (a.descripcion || "").localeCompare(b.descripcion || ""),
              );

              return (
                <Card
                  key={baseName}
                  title={`Cliente: ${baseName?.split("-")[1]}`}
                  className="layout-card"
                  classNames={{ body: "layout-card-body" }}
                  bordered={false}
                  style={{ marginBottom: 16 }}
                >
                  <MonitoreoAnomalias lotes={lotesOrdenados} />
                </Card>
              );
            })}
          </Splitter.Panel>
        )}
        <Splitter.Panel min={1000}>
          <Splitter layout="horizontal">
            <Splitter.Panel>
              <MonitoreoTablero url="https://grafana.docsend.ar/public-dashboards/1c193adc4cdc415ead0e937a798c1fd5" />
            </Splitter.Panel>

            <Splitter.Panel>
              <MonitoreoTablero url="https://grafana.docsend.ar/public-dashboards/112fd31a3afb46998b18a3b8a0e3ac94" />
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>
    </>
  );
}

export default Monitoreo;
