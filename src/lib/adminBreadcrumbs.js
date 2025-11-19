// Convert sidebar menu into a flat lookup table for fast breadcrumb generation
export function buildRouteMap(menu) {
  const map = {};

  menu.forEach((item) => {
    map[item.url] = item.title;

    if (item.submenu) {
      item.submenu.forEach((sub) => {
        map[sub.url] = `${item.title} > ${sub.title}`;
      });
    }
  });

  return map;
}
