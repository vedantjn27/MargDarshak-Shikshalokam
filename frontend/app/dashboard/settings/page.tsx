"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "next-themes"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { Settings, User, Globe, Bell, Shield, Palette, Save, Loader2, Moon, Sun, Monitor } from "lucide-react"

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { currentOrganization } = useAppStore()
  const [saving, setSaving] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    displayName: currentOrganization?.organization_name || "",
    email: "",
    notifications: {
      emailUpdates: true,
      programAlerts: true,
      weeklyDigest: false,
    },
    privacy: {
      shareAnalytics: true,
      publicProfile: false,
    },
  })

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success(language === "en" ? "Settings saved successfully!" : "सेटिंग्स सफलतापूर्वक सहेजी गईं!")
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            {language === "en" ? "Settings" : "सेटिंग्स"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en"
              ? "Manage your account settings and preferences"
              : "अपनी खाता सेटिंग्स और प्राथमिकताएं प्रबंधित करें"}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {language === "en" ? "Profile" : "प्रोफ़ाइल"}
              </CardTitle>
              <CardDescription>
                {language === "en" ? "Update your profile information" : "अपनी प्रोफ़ाइल जानकारी अपडेट करें"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{language === "en" ? "Display Name" : "प्रदर्शन नाम"}</Label>
                  <Input
                    value={settings.displayName}
                    onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                    placeholder={language === "en" ? "Your organization name" : "आपके संगठन का नाम"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === "en" ? "Email" : "ईमेल"}</Label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="contact@organization.org"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {language === "en" ? "Appearance" : "दिखावट"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Customize the look and feel of the application"
                  : "एप्लिकेशन के रूप और अनुभव को अनुकूलित करें"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>{language === "en" ? "Theme" : "थीम"}</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="flex-1"
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    {language === "en" ? "Light" : "लाइट"}
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="flex-1"
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    {language === "en" ? "Dark" : "डार्क"}
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    onClick={() => setTheme("system")}
                    className="flex-1"
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    {language === "en" ? "System" : "सिस्टम"}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {language === "en" ? "Language" : "भाषा"}
                </Label>
                <Select value={language} onValueChange={(v: "en" | "hi") => setLanguage(v)}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {language === "en" ? "Notifications" : "सूचनाएं"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Configure how you receive notifications"
                  : "कॉन्फ़िगर करें कि आप सूचनाएं कैसे प्राप्त करते हैं"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === "en" ? "Email Updates" : "ईमेल अपडेट"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Receive updates about your programs via email"
                      : "ईमेल के माध्यम से अपने कार्यक्रमों के बारे में अपडेट प्राप्त करें"}
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emailUpdates}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailUpdates: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === "en" ? "Program Alerts" : "कार्यक्रम अलर्ट"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Get notified about important program milestones"
                      : "महत्वपूर्ण कार्यक्रम मील के पत्थर के बारे में सूचित हों"}
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.programAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, programAlerts: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === "en" ? "Weekly Digest" : "साप्ताहिक डाइजेस्ट"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Receive a weekly summary of your activities"
                      : "अपनी गतिविधियों का साप्ताहिक सारांश प्राप्त करें"}
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyDigest}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, weeklyDigest: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {language === "en" ? "Privacy" : "गोपनीयता"}
              </CardTitle>
              <CardDescription>
                {language === "en" ? "Manage your privacy settings" : "अपनी गोपनीयता सेटिंग्स प्रबंधित करें"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === "en" ? "Share Analytics" : "एनालिटिक्स साझा करें"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Help us improve by sharing anonymous usage data"
                      : "अनाम उपयोग डेटा साझा करके हमें सुधारने में मदद करें"}
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareAnalytics}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, shareAnalytics: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === "en" ? "Public Profile" : "सार्वजनिक प्रोफ़ाइल"}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Make your organization profile visible to others"
                      : "अपने संगठन की प्रोफ़ाइल दूसरों को दिखाई दें"}
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.publicProfile}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, publicProfile: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === "en" ? "Saving..." : "सहेज रहा है..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {language === "en" ? "Save Settings" : "सेटिंग्स सहेजें"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
