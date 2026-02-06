import type { AppMenuItem } from "./menu.model";

export const sidebarItems: AppMenuItem[] = [
  {
    id: 1,
    label: "Envios",
    direction: "/sswww",
    icon: "lotes",
    children: [
      {
        id: 21,
        label: "Envios Legacy",
        direction: "/lotes",
        icon: "lotes",
      },
      {
        id: 22,
        label: "Envios V2",
        direction: "/lotesV2",
        icon: "lotes",
      },
    ],
  },
  {
    id: 2,
    label: "Tareas",
    direction: "/tareas",
    icon: "tareas",
  },
  // {
  //   id: 3,
  //   label: "Reportes",
  //   direction: "/reportes",
  //   icon: "reportes",
  // },
  {
    id: 4,
    label: "Generacion Papel",
    direction: "/generacionPapel",
    icon: "generacionPapel",
  },
  {
    id: 6,
    label: "Servicios",
    direction: "/servicios/gestion",
    icon: "servicios",
  },
  {
    id: 5,
    label: "Portales",
    direction: "/portales",
    icon: "portales",
  },
];
