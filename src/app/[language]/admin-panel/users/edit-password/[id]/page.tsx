import type { Metadata } from "next";
import EditUserPassword from "./page-content";
import { getServerTranslation } from "@/services/i18n";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(
    params.language,
    "admin-panel-users-edit"
  );
  return {
    title: t("title2"),
  };
}

export default function Page() {
  return <EditUserPassword />;
}
