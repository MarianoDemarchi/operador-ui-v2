import { Layout, Row, Col } from "antd";

import logoAcsa from "../../../assets/images/LogoAguasGrande.png";
import logoEcog from "../../../assets/images/ecogas-dd.png";
import logoMando from "../../../assets/logo_mando_transp.png";
import { PortalCard } from "../components/CardPortal";
import "../styles/portales.css";
const { Content } = Layout;

export const ListaPortales = () => {
  return (
    <Content
      style={{
        marginTop: 90,
        marginLeft: 60,
      }}
    >
      <Row gutter={16} wrap={false}>
        <Col>
          <PortalCard
            href="http://docsend.ar/ECOG/estadistica"
            logo={logoEcog}
            className="divEcog"
            imageStyle={{ width: 300 }}
          />
        </Col>

        <Col>
          <PortalCard
            href="http://docsend.ar/ACSA/estadistica"
            logo={logoAcsa}
            className="divAcsa"
            imageStyle={{ width: 300 }}
          />
        </Col>

        <Col>
          <PortalCard
            href="https://portal.mando.ar/"
            logo={logoMando}
            className="divMando"
            imageStyle={{ width: 300 }}
          />
        </Col>
      </Row>
    </Content>
  );
};
