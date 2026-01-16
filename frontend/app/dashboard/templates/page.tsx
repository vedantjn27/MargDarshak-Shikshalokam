"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useLanguage } from "@/components/language-provider"
import { useAppStore } from "@/lib/store"
import { lfaApi, type LFATemplate } from "@/lib/api"
import { toast } from "sonner"
import { BookTemplate, Loader2, Star, GitFork, Share2, MapPin, Building, Filter, Search } from "lucide-react"

export default function TemplatesPage() {
  const { language, t } = useLanguage()
  const { currentOrganization } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [forkLoading, setForkLoading] = useState<string | null>(null)
  const [shareLoading, setShareLoading] = useState<string | null>(null)
  const [ratingLoading, setRatingLoading] = useState<string | null>(null)

  const [templates, setTemplates] = useState<LFATemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<LFATemplate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    theme: "",
    system_level: "",
    geography_type: "",
  })

  const [forkDialog, setForkDialog] = useState<{ open: boolean; template: LFATemplate | null }>({
    open: false,
    template: null,
  })
  const [newName, setNewName] = useState("")

  const [ratingDialog, setRatingDialog] = useState<{ open: boolean; template: LFATemplate | null }>({
    open: false,
    template: null,
  })
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    fetchTemplates()
  }, [])

  useEffect(() => {
    let result = templates
    if (searchQuery) {
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    if (filters.theme) {
      result = result.filter((t) => t.theme === filters.theme)
    }
    if (filters.system_level) {
      result = result.filter((t) => t.system_level === filters.system_level)
    }
    if (filters.geography_type) {
      result = result.filter((t) => t.geography_type === filters.geography_type)
    }
    setFilteredTemplates(result)
  }, [templates, searchQuery, filters])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const result = await lfaApi.getTemplates(
        filters.theme || filters.system_level || filters.geography_type
          ? {
              theme: filters.theme || undefined,
              system_level: filters.system_level || undefined,
              geography_type: filters.geography_type || undefined,
            }
          : undefined,
        language,
      )
      setTemplates(result.templates)
      setFilteredTemplates(result.templates)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFork = async () => {
    if (!forkDialog.template || !newName.trim()) return

    setForkLoading(forkDialog.template.template_id)
    try {
      await lfaApi.forkTemplate(
        {
          organization_id: currentOrganization?._id || "demo-org",
          template_id: forkDialog.template.template_id,
          new_name: newName,
        },
        language,
      )
      toast.success(language === "en" ? "Template forked successfully!" : "टेम्पलेट सफलतापूर्वक फोर्क किया गया!")
      setForkDialog({ open: false, template: null })
      setNewName("")
      fetchTemplates()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setForkLoading(null)
    }
  }

  const handleShare = async (templateId: string) => {
    setShareLoading(templateId)
    try {
      await lfaApi.shareTemplate(templateId, language)
      toast.success(language === "en" ? "Template shared!" : "टेम्पलेट साझा किया गया!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setShareLoading(null)
    }
  }

  const handleRate = async () => {
    if (!ratingDialog.template || selectedRating === 0) return

    setRatingLoading(ratingDialog.template.template_id)
    try {
      await lfaApi.rateTemplate(
        {
          template_id: ratingDialog.template.template_id,
          organization_id: currentOrganization?._id || "demo-org",
          rating: selectedRating,
        },
        language,
      )
      toast.success(language === "en" ? "Rating submitted!" : "रेटिंग सबमिट की गई!")
      setRatingDialog({ open: false, template: null })
      setSelectedRating(0)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setRatingLoading(null)
    }
  }

  const StarRating = ({
    rating,
    onRate,
    onHover,
    interactive = true,
  }: {
    rating: number
    onRate?: (r: number) => void
    onHover?: (r: number) => void
    interactive?: boolean
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate?.(star)}
            onMouseEnter={() => interactive && onHover?.(star)}
            onMouseLeave={() => interactive && onHover?.(0)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookTemplate className="h-8 w-8 text-primary" />
            {t("nav.templates")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en"
              ? "Browse and fork LFA templates from the community"
              : "समुदाय से LFA टेम्पलेट ब्राउज़ करें और फोर्क करें"}
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === "en" ? "Search templates..." : "टेम्पलेट खोजें..."}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filters.theme} onValueChange={(v) => setFilters({ ...filters, theme: v })}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={language === "en" ? "Theme" : "विषय"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === "en" ? "All Themes" : "सभी विषय"}</SelectItem>
                    <SelectItem value="fln">FLN</SelectItem>
                    <SelectItem value="stem">STEM</SelectItem>
                    <SelectItem value="life_skills">Life Skills</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.system_level} onValueChange={(v) => setFilters({ ...filters, system_level: v })}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={language === "en" ? "Level" : "स्तर"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === "en" ? "All Levels" : "सभी स्तर"}</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="block">Block</SelectItem>
                    <SelectItem value="district">District</SelectItem>
                    <SelectItem value="state">State</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={fetchTemplates}>
                  <Filter className="h-4 w-4 mr-2" />
                  {language === "en" ? "Apply" : "लागू करें"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookTemplate className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                {language === "en" ? "No templates found" : "कोई टेम्पलेट नहीं मिला"}
              </h3>
              <p className="text-muted-foreground text-center">
                {language === "en"
                  ? "Try adjusting your filters or search query"
                  : "अपने फ़िल्टर या खोज क्वेरी को समायोजित करने का प्रयास करें"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.template_id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">{template.description}</CardDescription>
                    </div>
                    {template.is_public && (
                      <Badge variant="secondary">{language === "en" ? "Public" : "सार्वजनिक"}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{template.theme}</Badge>
                      <Badge variant="outline">
                        <Building className="h-3 w-3 mr-1" />
                        {template.system_level}
                      </Badge>
                      <Badge variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        {template.geography_type}
                      </Badge>
                    </div>
                    {template.applicable_states && template.applicable_states.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "States:" : "राज्य:"} {template.applicable_states.join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {language === "en" ? "By" : "द्वारा"} {template.created_by}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 border-t pt-4">
                  <Dialog
                    open={forkDialog.open && forkDialog.template?.template_id === template.template_id}
                    onOpenChange={(open) => {
                      if (!open) setForkDialog({ open: false, template: null })
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setForkDialog({ open: true, template })}
                      >
                        <GitFork className="h-4 w-4 mr-1" />
                        {language === "en" ? "Fork" : "फोर्क"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{language === "en" ? "Fork Template" : "टेम्पलेट फोर्क करें"}</DialogTitle>
                        <DialogDescription>
                          {language === "en"
                            ? "Create a copy of this template for your organization"
                            : "अपने संगठन के लिए इस टेम्पलेट की एक प्रति बनाएं"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>{language === "en" ? "New Template Name" : "नया टेम्पलेट नाम"}</Label>
                          <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={template.name + " (Copy)"}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleFork} disabled={forkLoading === template.template_id}>
                          {forkLoading === template.template_id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <GitFork className="h-4 w-4 mr-2" />
                          )}
                          {language === "en" ? "Fork Template" : "टेम्पलेट फोर्क करें"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(template.template_id)}
                    disabled={shareLoading === template.template_id}
                  >
                    {shareLoading === template.template_id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                  </Button>

                  <Dialog
                    open={ratingDialog.open && ratingDialog.template?.template_id === template.template_id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setRatingDialog({ open: false, template: null })
                        setSelectedRating(0)
                        setHoverRating(0)
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setRatingDialog({ open: true, template })}>
                        <Star className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{language === "en" ? "Rate Template" : "टेम्पलेट को रेट करें"}</DialogTitle>
                        <DialogDescription>
                          {language === "en"
                            ? `Rate "${template.name}" out of 5 stars`
                            : `"${template.name}" को 5 में से रेट करें`}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col items-center gap-4 py-6">
                        <StarRating
                          rating={hoverRating || selectedRating}
                          onRate={setSelectedRating}
                          onHover={setHoverRating}
                        />
                        <p className="text-sm text-muted-foreground">
                          {selectedRating > 0
                            ? language === "en"
                              ? `You selected ${selectedRating} star${selectedRating > 1 ? "s" : ""}`
                              : `आपने ${selectedRating} स्टार चुना`
                            : language === "en"
                              ? "Click to select rating"
                              : "रेटिंग चुनने के लिए क्लिक करें"}
                        </p>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={handleRate}
                          disabled={selectedRating === 0 || ratingLoading === template.template_id}
                        >
                          {ratingLoading === template.template_id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Star className="h-4 w-4 mr-2" />
                          )}
                          {language === "en" ? "Submit Rating" : "रेटिंग सबमिट करें"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
