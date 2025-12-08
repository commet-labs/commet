import { HomeLayout } from "@/components/layout/home";
import { baseOptions } from "@/lib/layout.shared";

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  return (
    <HomeLayout
      {...baseOptions(lang)}
      i18n={false}
      searchToggle={{ enabled: false }}
      themeSwitch={{ enabled: false }}
    >
      {children}
    </HomeLayout>
  );
}
