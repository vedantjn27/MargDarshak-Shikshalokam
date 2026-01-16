"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/components/language-provider"
import { useAppStore } from "@/lib/store"
import { tocApi } from "@/lib/api"
import { toast } from "sonner"
import {
  Network,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Plus,
  X,
  ArrowDown,
  Zap,
  FileOutput,
  Target,
  TrendingUp,
} from "lucide-react"

interface ToCNode {
  id: string
  type: "activity" | "output" | "outcome" | "impact"
  label: string
}

interface ToCEdge {
  source: string
  target: string
}

interface NodeSectionProps {
  type: ToCNode["type"]
  title: string
  titleHi: string
  icon: any
  color: string
  nodes: ToCNode[]
  language: string
  onAddNode: (type: ToCNode["type"]) => void
  onRemoveNode: (id: string) => void
  onUpdateLabel: (id: string, label: string) => void
}

function NodeSection({
  type,
  title,
  titleHi,
  icon: Icon,
  color,
  nodes,
  language,
  onAddNode,
  onRemoveNode,
  onUpdateLabel,
}: NodeSectionProps) {
  const sectionNodes = nodes.filter((n) => n.type === type)

  return (
    <Card className={`border-l-4 ${color}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {language === "en" ? title : titleHi}
          </span>
          <Button variant="ghost" size="sm" onClick={() => onAddNode(type)}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sectionNodes.map((node) => (
          <div key={node.id} className="flex items-start gap-2">
            <Textarea
              value={node.label}
              onChange={(e) => onUpdateLabel(node.id, e.target.value)}
              placeholder={
                language === "en"
                  ? `Enter ${type}... (You can type full sentences here)`
                  : `${type === "activity" ? "गतिविधि" : type === "output" ? "आउटपुट" : type === "outcome" ? "परिणाम" : "प्रभाव"} दर्ज करें... (आप यहां पूर्ण वाक्य टाइप कर सकते हैं)`
              }
              className="flex-1 min-h-[80px] resize-y"
            />
            {sectionNodes.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => onRemoveNode(node.id)} className="mt-1">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function TheoryOfChangePage() {
  const { language, t } = useLanguage()
  const { currentOrganization, theoryOfChange, setTheoryOfChange, updateLFASnapshot } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("build")

  const [nodes, setNodes] = useState<ToCNode[]>([
    { id: "A1", type: "activity", label: "" },
    { id: "O1", type: "output", label: "" },
    { id: "OC1", type: "outcome", label: "" },
    { id: "I1", type: "impact", label: "" },
  ])

  const [edges, setEdges] = useState<ToCEdge[]>([
    { source: "A1", target: "O1" },
    { source: "O1", target: "OC1" },
    { source: "OC1", target: "I1" },
  ])

  const addNode = (type: ToCNode["type"]) => {
    const prefix = type === "activity" ? "A" : type === "output" ? "O" : type === "outcome" ? "OC" : "I"
    const existingCount = nodes.filter((n) => n.type === type).length
    const newId = `${prefix}${existingCount + 1}`
    setNodes([...nodes, { id: newId, type, label: "" }])
  }

  const removeNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id))
    setEdges(edges.filter((e) => e.source !== id && e.target !== id))
  }

  const updateNodeLabel = (id: string, label: string) => {
    setNodes((prevNodes) => prevNodes.map((n) => (n.id === id ? { ...n, label } : n)))
  }

  const addEdge = (source: string, target: string) => {
    if (!edges.find((e) => e.source === source && e.target === target)) {
      setEdges([...edges, { source, target }])
    }
  }

  const handleSubmit = async () => {
    const filledNodes = nodes.filter((n) => n.label.trim())
    if (filledNodes.length < 4) {
      toast.error(
        language === "en" ? "Please add at least one item for each level" : "कृपया प्रत्येक स्तर के लिए कम से कम एक आइटम जोड़ें",
      )
      return
    }

    setLoading(true)
    try {
      const payload = {
        organization_id: currentOrganization?._id || "demo-org",
        theme: currentOrganization?.thematic_focus[0] || "fln",
        nodes: filledNodes.map((n) => ({ id: n.id, type: n.type, label: n.label })),
        edges: edges.filter(
          (e) => filledNodes.find((n) => n.id === e.source) && filledNodes.find((n) => n.id === e.target),
        ),
      }

      const result = await tocApi.build(payload, language)
      setTheoryOfChange(result)
      updateLFASnapshot("theory_of_change", {
        activities: filledNodes.filter((n) => n.type === "activity").map((n) => n.label),
        outputs: filledNodes.filter((n) => n.type === "output").map((n) => n.label),
        outcomes: filledNodes.filter((n) => n.type === "outcome").map((n) => n.label),
        impact: filledNodes.filter((n) => n.type === "impact").map((n) => n.label),
      })

      toast.success(language === "en" ? "Theory of Change validated!" : "परिवर्तन का सिद्धांत मान्य!")
      setActiveTab("preview")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Network className="h-8 w-8 text-primary" />
            {t("nav.toc")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en"
              ? "Build your Theory of Change with visual logic validation"
              : "दृश्य तर्क मान्यता के साथ अपना परिवर्तन का सिद्धांत बनाएं"}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="build">{language === "en" ? "Build" : "निर्माण"}</TabsTrigger>
            <TabsTrigger value="preview" disabled={!theoryOfChange}>
              {language === "en" ? "Preview & Validate" : "पूर्वावलोकन और मान्य"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="mt-6 space-y-6">
            <div className="grid gap-4">
              {/* Visual Flow Indicator */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4">
                <Badge variant="outline" className="bg-chart-1/10 border-chart-1">
                  {t("toc.activities")}
                </Badge>
                <ArrowDown className="h-4 w-4" />
                <Badge variant="outline" className="bg-chart-2/10 border-chart-2">
                  {t("toc.outputs")}
                </Badge>
                <ArrowDown className="h-4 w-4" />
                <Badge variant="outline" className="bg-chart-3/10 border-chart-3">
                  {t("toc.outcomes")}
                </Badge>
                <ArrowDown className="h-4 w-4" />
                <Badge variant="outline" className="bg-chart-4/10 border-chart-4">
                  {t("toc.impact")}
                </Badge>
              </div>

              <NodeSection
                type="activity"
                title="Activities"
                titleHi="गतिविधियां"
                icon={Zap}
                color="border-l-chart-1"
                nodes={nodes}
                language={language}
                onAddNode={addNode}
                onRemoveNode={removeNode}
                onUpdateLabel={updateNodeLabel}
              />

              <NodeSection
                type="output"
                title="Outputs"
                titleHi="आउटपुट"
                icon={FileOutput}
                color="border-l-chart-2"
                nodes={nodes}
                language={language}
                onAddNode={addNode}
                onRemoveNode={removeNode}
                onUpdateLabel={updateNodeLabel}
              />

              <NodeSection
                type="outcome"
                title="Outcomes"
                titleHi="परिणाम"
                icon={Target}
                color="border-l-chart-3"
                nodes={nodes}
                language={language}
                onAddNode={addNode}
                onRemoveNode={removeNode}
                onUpdateLabel={updateNodeLabel}
              />

              <NodeSection
                type="impact"
                title="Impact"
                titleHi="प्रभाव"
                icon={TrendingUp}
                color="border-l-chart-4"
                nodes={nodes}
                language={language}
                onAddNode={addNode}
                onRemoveNode={removeNode}
                onUpdateLabel={updateNodeLabel}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === "en" ? "Validating..." : "मान्य हो रहा है..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t("toc.validate")}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6 space-y-6">
            {theoryOfChange && (
              <>
                {/* Validation Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {theoryOfChange.is_valid ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-warning" />
                      )}
                      {language === "en" ? "Logic Validation" : "तर्क मान्यता"}
                      <Badge variant={theoryOfChange.is_valid ? "default" : "secondary"}>
                        {theoryOfChange.is_valid
                          ? language === "en"
                            ? "Valid"
                            : "मान्य"
                          : language === "en"
                            ? "Needs Review"
                            : "समीक्षा आवश्यक"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  {theoryOfChange.logic_issues.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        {theoryOfChange.logic_issues.map((issue, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm p-3 bg-warning/10 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* AI Suggestions */}
                {theoryOfChange.ai_suggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        {language === "en" ? "AI Suggestions" : "AI सुझाव"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {theoryOfChange.ai_suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm p-3 bg-primary/10 rounded-lg">
                            <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Diagram */}
                <MermaidDiagram
                  title={t("nav.toc")}
                  diagram={theoryOfChange.mermaid_diagram}
                  previewUrl={theoryOfChange.mermaid_preview_url}
                  pngUrl={theoryOfChange.mermaid_png_url}
                  svgUrl={theoryOfChange.mermaid_svg_url}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
