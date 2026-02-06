import QueryErrorResult from "../../feedback/QueryErrorResult";
import { LotesHeader } from "../components/LotesHeader";
import { LotesTable } from "../components/LotesTable";
import { useLotesQuery } from "../hooks/useLotesQuery";

export const ListaLotesV2: React.FC = () => {
  const { data, isError, isLoading, error, isFetching, refetch } =
    useLotesQuery();

  if (isError) {
    return <QueryErrorResult error={error} onRetry={refetch} />;
  }

  return (
    <div style={{ width: "100%", padding: 16 }}>
      <LotesHeader onReload={refetch} />

      <LotesTable data={data ?? []} isFetching={isFetching || isLoading} />
    </div>
  );
};
