export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "INTV-DEMO",
  description: "The interview demo project.",
  navItems: [
    {
      label: "Home",
      href: "/"
    },
    {
      label: "Profile",
      href: "/profile"
    },
    {
      label: "Dashboard",
      href: "/dashboard"
    }
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile"
    },
    {
      label: "Dashboard",
      href: "/dashboard"
    }
  ],
  links: {
    github: "https://github.com/duranteau-l-i/intv-demo"
  }
};
