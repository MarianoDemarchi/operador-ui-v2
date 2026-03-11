import { useMemo, useState } from "react";
import { LogLotesSearch } from "../components/LogSearch";
import { LogLotesTable } from "../components/LogsTable";
import type { LogLote } from "../models/log.model";
import { useLogsQuery } from "../hooks/useLogsQuery";
import QueryErrorResult from "../../feedback/QueryErrorResult";
import { LogsHeader } from "../components/LogsHeader";
import { LogsProgress } from "../components/LogsProgress";
import { Skeleton } from "antd";

interface Props {
  openLogs: boolean; 
}

 const LogsV2: React.FC<Props> = ({ openLogs }) => {
  const {
    logs,
    isError,
    error,
    isLoading,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useLogsQuery(openLogs);

  const [searchValue, setSearchValue] = useState("");

  if (isError) {
    return <QueryErrorResult error={error} onRetry={refetch} />;
  }

  const filteredData = useMemo<LogLote[]>(() => {
    if (!logs) return [];

    const v = searchValue.toLowerCase();
    if (!v) return logs;

    return logs.filter(
      (row) =>
        String(row.id_lote).toLowerCase().includes(v) ||
        row.texto.toLowerCase().includes(v),
    );
  }, [logs, searchValue]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleRefresh = () => refetch();

  return (
    <div >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <LogsHeader />

        <LogLotesSearch onSearch={handleSearch} onRefresh={handleRefresh} />
      </div>

      {!isLoading ? (
        <>
          <div className="panel-actividad" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12, color: "#888" }}>
              Actualización automática
            </span>

            <LogsProgress
              isFetching={isFetching}
              dataUpdatedAt={dataUpdatedAt}
              interval={60000}
            />
          </div>

          <LogLotesTable data={filteredData} loading={isFetching} />
        </>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};
export default LogsV2;
