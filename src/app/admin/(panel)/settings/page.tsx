import { getSettings, settingGroups } from "@/lib/settings";
import { saveSettings } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const langs = [
  { code: "en", label: "English" },
  { code: "si", label: "සිංහල" },
  { code: "ta", label: "தமிழ்" },
] as const;

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const settings = await getSettings();

  return (
    <div className="max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold">Site Settings</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Every text shown on the public website can be edited here or under Content.
      </p>
      {searchParams.saved && (
        <p className="mb-4 rounded-md border border-teal-300 bg-teal-50 p-3 text-sm text-teal-800">
          ✓ Settings saved.
        </p>
      )}
      <form action={saveSettings} className="space-y-6">
        {settingGroups.map((group) => (
          <Card key={group.group}>
            <CardHeader>
              <CardTitle className="text-lg">{group.group}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {group.items.map((item) => {
                const row = settings[item.key];
                return (
                  <div key={item.key}>
                    <Label className="mb-2 block font-semibold">{item.label}</Label>
                    {item.i18n ? (
                      <div className="grid gap-3 lg:grid-cols-3">
                        {langs.map((lang) => {
                          const value =
                            lang.code === "en"
                              ? row?.valueEn
                              : lang.code === "si"
                                ? row?.valueSi
                                : row?.valueTa;
                          const name = `${item.key}__${lang.code}`;
                          return (
                            <div key={lang.code} className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground">{lang.label}</p>
                              {item.type === "textarea" ? (
                                <Textarea name={name} rows={4} defaultValue={value ?? ""} />
                              ) : (
                                <Input name={name} defaultValue={value ?? ""} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : item.type === "textarea" ? (
                      <Textarea name={`${item.key}__en`} rows={4} defaultValue={row?.valueEn ?? ""} />
                    ) : (
                      <Input name={`${item.key}__en`} defaultValue={row?.valueEn ?? ""} />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
        <Button type="submit" size="lg">
          Save All Settings
        </Button>
      </form>
    </div>
  );
}
