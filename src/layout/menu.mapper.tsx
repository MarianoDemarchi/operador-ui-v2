import type { MenuProps } from "antd";
import { menuIconMap } from "./menu.icons";
import type { AppMenuItem } from "./menu.model";

export const mapMenuToAntdItems = (
  menu: AppMenuItem[]
): MenuProps["items"] => {
  return menu.map((item) => ({
    key: item.direction,
    label: item.label,
    icon: menuIconMap[item.icon],
    children: item.children
      ? mapMenuToAntdItems(item.children)
      : undefined,
  }));
};
