import { Button, Drawer } from "antd";
import { EmisionFormPorciones } from "./EmisionFormPorciones";
import { EmisionPorcionesTable } from "./EmisionFormTablePorciones";
import type { Porcion } from "../models/porciones-.model";
import type { PorcionesPayload } from "../models/porciones-add.models";

interface Props {
  open: boolean;
  loadingValidacionPorciones: boolean;
  onClose: () => void;
  dataPorciones: Porcion[];
  setDataPorciones: React.Dispatch<React.SetStateAction<Porcion[]>>;
  onSubmit: (payload: PorcionesPayload) => void;
}

export const EmisionDrawerPorciones: React.FC<Props> = ({
  open,
  loadingValidacionPorciones,
  onClose,
  dataPorciones,
  setDataPorciones,
  onSubmit,
}) => {
  const handleDelete = (porcion: string) => {
    setDataPorciones((prev) => prev.filter((p) => p.porcion !== porcion));
  };

  const handleAddPorcion = (nueva: Porcion) => {
    setDataPorciones((prev) => [...prev, nueva]);
  };

  const handleUpdate = (porcion: string, value: boolean) => {
    setDataPorciones((prev) =>
      prev.map((p) => (p.porcion === porcion ? { ...p, update: value } : p)),
    );
  };

  const handleValidar = async () => {
    try {
      const res = await onSubmit({
        id_usuario: localStorage.getItem("usuario") ?? "",
        lista_porciones: dataPorciones,
        validar: true,
      });

      const porcionesBackend: Porcion[] = res ?? [];

      setDataPorciones((prev) =>
        prev.map((p) => {
          const match = porcionesBackend.find(
            (bp: any) => bp.porcion === p.porcion,
          );

          return match ? { ...p, estado: match?.estado } : p;
        }),
      );
    } catch (e) {
      // el error ya lo maneja el hook
    }
  };

  const handleEnviar = async () => {
    try {
      await onSubmit({
        id_usuario: localStorage?.getItem("usuario") ?? "",
        lista_porciones: dataPorciones,
        validar: false,
      });
      setDataPorciones([]);
      onClose();
    } catch (error) {}
  };
  const puedeEnviar =
    dataPorciones.length > 0 &&
    dataPorciones.every((el) => el.estado === "ok" || el.update === true);

  return (
    <Drawer
      title="Cargar Porciones"
      open={open}
      onClose={() => {
        (setDataPorciones([]), onClose());
      }}
      width={720}
      destroyOnClose
      maskClosable={false}
      mask={{ blur: false }}
    >
      <EmisionFormPorciones onAdd={handleAddPorcion}  />

      <EmisionPorcionesTable
        onUpdate={handleUpdate}
        data={dataPorciones}
        onDelete={handleDelete}
      />

      <Button
        loading={loadingValidacionPorciones}
        type="primary"
        block
        disabled={!dataPorciones.length}
        onClick={handleValidar}
      >
        Validar porciones
      </Button>
      {puedeEnviar && (
        <Button
          type="primary"
          block
          disabled={!puedeEnviar}
          onClick={handleEnviar}
        >
          Enviar porciones
        </Button>
      )}
    </Drawer>
  );
};
