import { notFound, redirect } from "next/navigation";
import { getSettings, getSettingPage, settingPages } from "@/lib/settings";
import { getAdmin } from "@/lib/session";
import { SettingsTabs } from "@/components/admin/settings-tabs";
import { SettingsForm } from "@/components/admin/settings-form";
import { LabelsForm } from "@/components/admin/labels-form";

export default async function SettingsPage({ params }: { params: { page: string } }) {
  // Hiding the sidebar link is not enough — block the route itself.
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.role !== "owner") redirect("/admin/dashboard");

  const isLabels = params.page === "labels";
  const page = isLabels ? undefined : getSettingPage(params.page);
  if (!isLabels && !page) notFound();

  const settings = await getSettings();
  const tabs = [
    ...settingPages.map((p) => ({ slug: p.slug, title: p.title })),
    { slug: "labels", title: "Labels & Translations" },
  ];

  return (
    <div className={isLabels ? "max-w-5xl" : "max-w-[1500px]"}>
      <h1 className="mb-1 text-2xl font-bold">Site Settings</h1>
      <p className="mb-5 text-sm text-muted-foreground">
        Everything on the public website is edited here. Leave a field blank and the part of the
        page that uses it disappears — nothing falls back to text baked into the code.
      </p>

      <SettingsTabs tabs={tabs} />

      {isLabels ? (
        <>
          <div className="mb-5">
            <h2 className="text-lg font-bold">Labels &amp; Translations</h2>
            <p className="text-sm text-muted-foreground">
              Menu names, button text and form field names in all three languages. These are
              seeded in the database; the value shown under each field is the built-in safety
              fallback used only if you clear a box entirely.
            </p>
          </div>
          <LabelsForm settings={settings} />
        </>
      ) : (
        <>
          <div className="mb-5">
            <h2 className="text-lg font-bold">{page!.title}</h2>
            <p className="text-sm text-muted-foreground">{page!.description}</p>
          </div>
          <SettingsForm page={page!} settings={settings} />
        </>
      )}
    </div>
  );
}
