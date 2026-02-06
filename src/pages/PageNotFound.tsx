import React from "react";
import { Button, Layout, Result } from "antd";
import { useNavigate } from "react-router-dom";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ width: "100vw" }}>
      <Result
        style={{ alignContent: "center" }}
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate("/lotesV2")}>
            Back Home
          </Button>
        }
      />
    </Layout>
  );
};

export default PageNotFound;
