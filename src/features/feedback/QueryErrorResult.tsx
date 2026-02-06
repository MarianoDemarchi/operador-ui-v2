import { Result, Button } from "antd";
import { ApiError } from "../../api/client/ApiError";

interface Props {
  error: unknown;
  onRetry?: () => void;
}

const QueryErrorResult: React.FC<Props> = ({ error, onRetry }) => {
  const apiError = error as ApiError;

  return (
    <Result
      status="error"
      title="Error al cargar la información"
      subTitle={apiError?.message || "Ocurrió un error inesperado"}
      extra={
        onRetry && (
          <Button type="primary" onClick={onRetry}>
            Reintentar
          </Button>
        )
      }
    />
  );
};

export default QueryErrorResult;
