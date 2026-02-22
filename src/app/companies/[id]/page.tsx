import CompanyProfileClient from "./CompanyProfileClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CompanyProfileClient id={id} />;
}