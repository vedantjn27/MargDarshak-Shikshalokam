"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { useAppStore } from "@/lib/store"
import { lfaApi } from "@/lib/api"
import { toast } from "sonner"
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  BarChart3,
  FileText,
  Target,
  Lightbulb,
  AlertTriangle,
} from "lucide-react"

export default function QualityPage() {
  const { language, t } = useLanguage()
  const { currentOrganization, lfaSnapshot } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [completenessResult, setCompletenessResult] = useState<any>(null)
  const [qualityResult, setQualityResult] = useState<any>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const [completeness, quality] = await Promise.all([
        lfaApi.getCompleteness(
          {
            organization_id: currentOrganization?._id || "demo-org",
            lfa_snapshot: lfaSnapshot,
          },
          language,
        ),
        lfaApi.getQualityFeedback(
          {
            organization_id: currentOrganization?._id || "demo-org",
            lfa_snapshot: lfaSnapshot,
          },
          language,
        ),
      ])

      setCompletenessResult(completeness)
      setQualityResult(quality)
      toast.success(language === "en" ? "Analysis complete!" : "विश्लेषण पूर्ण!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getSectionIcon = (section: string) => {
    const icons: Record<string, any> = {
      organization_profile: FileText,
      problem_definition: AlertTriangle,
      problem_tree: AlertTriangle,
      outcomes: Target,
      methodology: BarChart3,
      theory_of_change: Lightbulb,
      measurement: BarChart3,
    }
    return icons[section] || FileText
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-primary" />
              {t("nav.quality")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === "en" ? "Check LFA completeness and design quality" : "LFA पूर्णता और डिज़ाइन गुणवत्ता की जांच करें"}
            </p>
          </div>
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "en" ? "Analyzing..." : "विश्लेषण हो रहा है..."}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {language === "en" ? "Run Analysis" : "विश्लेषण चलाएं"}
              </>
            )}
          </Button>
        </div>

        {completenessResult && qualityResult ? (
          <Tabs defaultValue="completeness">
            <TabsList>
              <TabsTrigger value="completeness">{language === "en" ? "Completeness" : "पूर्णता"}</TabsTrigger>
              <TabsTrigger value="quality">{language === "en" ? "Quality" : "गुणवत्ता"}</TabsTrigger>
            </TabsList>

            <TabsContent value="completeness" className="mt-6 space-y-6">
              {/* Overall Score */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {language === "en" ? "Overall Completeness" : "समग्र पूर्णता"}
                      <Badge
                        variant={
                          completenessResult.completion_percentage >= 80
                            ? "default"
                            : completenessResult.completion_percentage >= 50
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {completenessResult.completion_percentage}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={completenessResult.completion_percentage} className="h-4" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {completenessResult.missing_sections.length > 0
                        ? language === "en"
                          ? `Missing sections: ${completenessResult.missing_sections.join(", ")}`
                          : `लापता अनुभाग: ${completenessResult.missing_sections.join(", ")}`
                        : language === "en"
                          ? "All sections started!"
                          : "सभी अनुभाग शुरू हो गए!"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Section Breakdown */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completenessResult.section_breakdown.map((section: any) => {
                  const Icon = getSectionIcon(section.section)
                  const variant =
                    section.status === "complete" ? "success" : section.status === "partial" ? "warning" : "danger"

                  return (
                    <Card key={section.section}>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {section.section.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                          <Badge
                            variant={
                              section.status === "complete"
                                ? "default"
                                : section.status === "partial"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {section.score}/{section.weight}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Progress
                          value={(section.score / section.weight) * 100}
                          className={`h-2 ${variant === "success" ? "[&>div]:bg-success" : variant === "warning" ? "[&>div]:bg-warning" : "[&>div]:bg-destructive"}`}
                        />
                        {section.missing_fields && section.missing_fields.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {language === "en" ? "Missing: " : "लापता: "}
                            {section.missing_fields.join(", ")}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="quality" className="mt-6 space-y-6">
              {/* Quality Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {language === "en" ? "Design Quality Score" : "डिज़ाइन गुणवत्ता स्कोर"}
                    <Badge
                      variant={
                        qualityResult.quality_score >= 80
                          ? "default"
                          : qualityResult.quality_score >= 50
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {qualityResult.quality_score}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={qualityResult.quality_score}
                    className={`h-4 ${qualityResult.quality_score >= 80 ? "[&>div]:bg-success" : qualityResult.quality_score >= 50 ? "[&>div]:bg-warning" : "[&>div]:bg-destructive"}`}
                  />
                </CardContent>
              </Card>

              {/* Feedback Items */}
              {qualityResult.feedback_items.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {language === "en" ? "Improvement Suggestions" : "सुधार सुझाव"}
                  </h3>
                  {qualityResult.feedback_items.map((item: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{item.area}</Badge>
                            </div>
                            <p className="font-medium text-sm">{item.issue}</p>
                            {item.problems && (
                              <ul className="mt-1 text-sm text-muted-foreground">
                                {item.problems.map((problem: string, i: number) => (
                                  <li key={i}>• {problem}</li>
                                ))}
                              </ul>
                            )}
                            <div className="mt-2 flex items-start gap-2 text-sm text-primary">
                              <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                              <span>{item.suggestion}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-4" />
                    <h3 className="text-lg font-semibold">{language === "en" ? "Great job!" : "बढ़िया काम!"}</h3>
                    <p className="text-muted-foreground">
                      {language === "en"
                        ? "No quality issues detected in your design"
                        : "आपके डिज़ाइन में कोई गुणवत्ता समस्या नहीं पाई गई"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold">
                {language === "en" ? "Ready for Analysis" : "विश्लेषण के लिए तैयार"}
              </h3>
              <p className="text-muted-foreground mt-1 mb-6">
                {language === "en"
                  ? "Click the button above to analyze your LFA completeness and quality"
                  : "अपनी LFA पूर्णता और गुणवत्ता का विश्लेषण करने के लिए ऊपर दिए गए बटन पर क्लिक करें"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
