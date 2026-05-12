export type NavItem = {
  href: string;
  label: string;
};

export const homeNavItems: NavItem[] = [
  { href: "#works", label: "作品" },
  { href: "/archive/", label: "档案馆" },
  { href: "#video", label: "视频" },
  { href: "#panorama", label: "全景" },
  { href: "#about", label: "简介" },
  { href: "#contact", label: "联系" }
];

export const innerNavItems: NavItem[] = [
  { href: "/", label: "首页" },
  { href: "/archive/", label: "档案馆" },
  { href: "/#panorama", label: "全景" },
  { href: "/#contact", label: "联系" }
];
