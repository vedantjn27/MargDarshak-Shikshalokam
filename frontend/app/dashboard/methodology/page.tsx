"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { useAppStore } from "@/lib/store"
import { methodologyApi } from "@/lib/api"
import { toast } from "sonner"
import {
  Workflow,
  Sparkles,
  Loader2,
  CheckCircle2,
  MapPin,
  IndianRupee,
  School,
  Lightbulb,
  Library,
} from "lucide-react"

export default function MethodologyPage() {
  const { language, t } = useLanguage()
  const { currentOrganization, updateLFASnapshot } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [selectLoading, setSelectLoading] = useState(false)
  const [allMethodologiesLoading, setAllMethodologiesLoading] = useState(false)
  const [allMethodologies, setAllMethodologies] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("browse")

  const [filters, setFilters] = useState({
    theme: currentOrganization?.thematic_focus[0] || "fln",
    state: currentOrganization?.geography.state || "Rajasthan",
    scale_schools: currentOrganization?.reach_metrics?.schools || 50,
    budget_lakhs: 10,
  })

  const [methodologies, setMethodologies] = useState<any[]>([])
  const [selectedMethodologies, setSelectedMethodologies] = useState<string[]>([])
  const [customComponents, setCustomComponents] = useState<string[]>([])
  const [newComponent, setNewComponent] = useState("")

  useEffect(() => {
    fetchAllMethodologies()
  }, [])

  const fetchAllMethodologies = async () => {
    setAllMethodologiesLoading(true)
    try {
      const result = await methodologyApi.getAll(language)
      setAllMethodologies(result.methodologies)
    } catch (error: any) {
      console.error("Failed to fetch methodologies:", error)
    } finally {
      setAllMethodologiesLoading(false)
    }
  }

  const handleFetchMethodologies = async () => {
    setLoading(true)
    try {
      const result = await methodologyApi.filter(filters, language)
      setMethodologies(result.methodologies)
      toast.success(language === "en" ? "Methodologies loaded!" : "पद्धतियां लोड हो गईं!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMethodology = (name: string) => {
    setSelectedMethodologies((prev) => (prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]))
  }

  const addCustomComponent = () => {
    if (newComponent.trim() && !customComponents.includes(newComponent.trim())) {
      setCustomComponents([...customComponents, newComponent.trim()])
      setNewComponent("")
    }
  }

  const removeCustomComponent = (component: string) => {
    setCustomComponents(customComponents.filter((c) => c !== component))
  }

  const handleSelectMethodologies = async () => {
    if (selectedMethodologies.length === 0) {
      toast.error(language === "en" ? "Please select at least one methodology" : "कृपया कम से कम एक पद्धति चुनें")
      return
    }

    setSelectLoading(true)
    try {
      await methodologyApi.select(
        {
          organization_id: currentOrganization?._id || "demo-org",
          selected_methodology_ids: selectedMethodologies,
          custom_components: customComponents,
        },
        language,
      )

      updateLFASnapshot("methodology", {
        selected: selectedMethodologies,
        custom_components: customComponents,
      })

      toast.success(language === "en" ? "Methodologies saved!" : "पद्धतियां सहेज दी गईं!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSelectLoading(false)
    }
  }

  const MethodologyCard = ({
    methodology,
    index,
    showCheckbox = true,
  }: { methodology: any; index: number; showCheckbox?: boolean }) => {
    const isSelected = selectedMethodologies.includes(methodology.name)

    return (
      <Card
        key={index}
        className={`cursor-pointer transition-all ${
          isSelected ? "border-primary bg-primary/5 shadow-md" : "hover:border-primary/30"
        }`}
        onClick={() => showCheckbox && toggleMethodology(methodology.name)}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{methodology.name}</CardTitle>
            {showCheckbox && <Checkbox checked={isSelected} />}
          </div>
          <CardDescription>{methodology.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Components */}
          {methodology.components && (
            <div>
              <p className="text-sm font-medium mb-2">{language === "en" ? "Components:" : "घटक:"}</p>
              <div className="flex flex-wrap gap-2">
                {methodology.components.map((component: string, i: number) => (
                  <Badge key={i} variant="secondary">
                    {component}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Geographies */}
          {methodology.geographies && (
            <div>
              <p className="text-sm font-medium mb-2">{language === "en" ? "Used in:" : "में उपयोग किया गया:"}</p>
              <div className="flex flex-wrap gap-2">
                {methodology.geographies.map((geo: string, i: number) => (
                  <Badge key={i} variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    {geo}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Budget Range */}
          {methodology.budget_range_lakhs && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IndianRupee className="h-4 w-4" />
              {language === "en" ? "Budget:" : "बजट:"} ₹{methodology.budget_range_lakhs[0]}L - ₹
              {methodology.budget_range_lakhs[1]}L
            </div>
          )}

          {/* Theme */}
          {methodology.theme && (
            <Badge variant="outline" className="bg-primary/10">
              {methodology.theme}
            </Badge>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Workflow className="h-8 w-8 text-primary" />
            {t("nav.methodology")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en"
              ? "Browse all methodologies or filter based on your context"
              : "सभी पद्धतियां ब्राउज़ करें या अपने संदर्भ के आधार पर फ़िल्टर करें"}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">
              <Library className="h-4 w-4 mr-2" />
              {language === "en" ? "Browse All" : "सभी ब्राउज़ करें"}
            </TabsTrigger>
            <TabsTrigger value="filter">
              <Sparkles className="h-4 w-4 mr-2" />
              {language === "en" ? "Filter & Select" : "फ़िल्टर और चुनें"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6 space-y-6">
            {allMethodologiesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : allMethodologies.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Library className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    {language === "en" ? "No methodologies available" : "कोई पद्धति उपलब्ध नहीं"}
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {language === "en"
                      ? "Methodologies will appear here once added to the library"
                      : "लाइब्रेरी में जोड़े जाने के बाद पद्धतियां यहां दिखाई देंगी"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? `${allMethodologies.length} methodologies available`
                      : `${allMethodologies.length} पद्धतियां उपलब्ध`}
                  </p>
                  <Button variant="outline" onClick={fetchAllMethodologies}>
                    <Loader2 className={`h-4 w-4 mr-2 ${allMethodologiesLoading ? "animate-spin" : ""}`} />
                    {language === "en" ? "Refresh" : "रीफ्रेश"}
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {allMethodologies.map((methodology, index) => (
                    <MethodologyCard key={index} methodology={methodology} index={index} showCheckbox={true} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Filter Tab - existing functionality */}
          <TabsContent value="filter" className="mt-6 space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Filter Methodologies" : "पद्धतियां फ़िल्टर करें"}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Set your parameters to find relevant approaches"
                    : "प्रासंगिक दृष्टिकोण खोजने के लिए अपने पैरामीटर सेट करें"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      {language === "en" ? "Theme" : "विषय"}
                    </Label>
                    <Input
                      value={filters.theme}
                      onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
                      placeholder="e.g., FLN, STEM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {language === "en" ? "State" : "राज्य"}
                    </Label>
                    <Input
                      value={filters.state}
                      onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                      placeholder="e.g., Rajasthan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <School className="h-4 w-4" />
                      {language === "en" ? "Number of Schools" : "स्कूलों की संख्या"}
                    </Label>
                    <Input
                      type="number"
                      value={filters.scale_schools}
                      onChange={(e) => setFilters({ ...filters, scale_schools: Number(e.target.value) })}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" />
                      {language === "en" ? "Budget (Lakhs)" : "बजट (लाख)"}
                    </Label>
                    <Input
                      type="number"
                      value={filters.budget_lakhs}
                      onChange={(e) => setFilters({ ...filters, budget_lakhs: Number(e.target.value) })}
                      placeholder="10"
                    />
                  </div>
                </div>
                <Button onClick={handleFetchMethodologies} disabled={loading} className="mt-4">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === "en" ? "Searching..." : "खोज रहा है..."}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {language === "en" ? "Find Methodologies" : "पद्धतियां खोजें"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Methodologies Grid */}
            {methodologies.length > 0 && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {methodologies.map((methodology, index) => (
                    <MethodologyCard key={index} methodology={methodology} index={index} />
                  ))}
                </div>

                {/* Custom Components */}
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "en" ? "Custom Components" : "कस्टम घटक"}</CardTitle>
                    <CardDescription>
                      {language === "en"
                        ? "Add any additional components specific to your program"
                        : "अपने कार्यक्रम के लिए विशिष्ट कोई अतिरिक्त घटक जोड़ें"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Input
                        value={newComponent}
                        onChange={(e) => setNewComponent(e.target.value)}
                        placeholder={language === "en" ? "Enter component name..." : "घटक का नाम दर्ज करें..."}
                        onKeyDown={(e) => e.key === "Enter" && addCustomComponent()}
                      />
                      <Button onClick={addCustomComponent} variant="outline">
                        {language === "en" ? "Add" : "जोड़ें"}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {customComponents.map((component, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {component}
                          <button
                            onClick={() => removeCustomComponent(component)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Save Button - show when methodologies are selected */}
        {selectedMethodologies.length > 0 && (
          <div className="flex justify-end">
            <Button onClick={handleSelectMethodologies} disabled={selectLoading}>
              {selectLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === "en" ? "Saving..." : "सहेज रहा है..."}
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {language === "en"
                    ? `Save ${selectedMethodologies.length} Methodologies`
                    : `${selectedMethodologies.length} पद्धतियां सहेजें`}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
