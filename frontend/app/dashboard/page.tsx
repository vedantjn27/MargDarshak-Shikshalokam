"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useAppStore } from "@/lib/store"
import {
  BarChart3,
  Target,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Building2,
} from "lucide-react"
import Link from "next/link"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const progressData = [
  { name: "Organization", completed: 100, key: "organization_profile" },
  { name: "Problem", completed: 85, key: "problem_definition" },
  { name: "Outcomes", completed: 60, key: "outcomes" },
  { name: "Methodology", completed: 40, key: "methodology" },
  { name: "ToC", completed: 30, key: "theory_of_change" },
  { name: "Indicators", completed: 20, key: "measurement" },
]

const qualityData = [
  { name: "Clarity", value: 85, fill: "var(--color-chart-1)" },
  { name: "Alignment", value: 72, fill: "var(--color-chart-2)" },
  { name: "Measurability", value: 68, fill: "var(--color-chart-4)" },
  { name: "Logic", value: 90, fill: "var(--color-chart-3)" },
]

const workflowSteps = [
  {
    step: 1,
    title: "Organization Setup",
    titleHi: "संगठन सेटअप",
    href: "/dashboard/organization",
    icon: Building2,
    status: "complete",
  },
  {
    step: 2,
    title: "Problem Definition",
    titleHi: "समस्या परिभाषा",
    href: "/dashboard/problem",
    icon: AlertCircle,
    status: "in-progress",
  },
  {
    step: 3,
    title: "Student Outcomes",
    titleHi: "छात्र परिणाम",
    href: "/dashboard/outcomes",
    icon: Target,
    status: "pending",
  },
  {
    step: 4,
    title: "Theory of Change",
    titleHi: "परिवर्तन का सिद्धांत",
    href: "/dashboard/theory-of-change",
    icon: TrendingUp,
    status: "pending",
  },
  {
    step: 5,
    title: "Stakeholders",
    titleHi: "हितधारक",
    href: "/dashboard/stakeholders",
    icon: Users,
    status: "pending",
  },
  { step: 6, title: "Indicators", titleHi: "संकेतक", href: "/dashboard/indicators", icon: BarChart3, status: "pending" },
  {
    step: 7,
    title: "Quality Check",
    titleHi: "गुणवत्ता जांच",
    href: "/dashboard/quality",
    icon: CheckCircle2,
    status: "pending",
  },
  { step: 8, title: "Export", titleHi: "निर्यात", href: "/dashboard/export", icon: FileText, status: "pending" },
]

export default function DashboardPage() {
  const { t, language } = useLanguage()
  const { currentOrganization, lfaSnapshot } = useAppStore()
  const [completeness, setCompleteness] = useState(45)
  const [quality, setQuality] = useState(78)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.welcome")}</h1>
            <p className="text-muted-foreground mt-1">{t("dashboard.subtitle")}</p>
          </div>
          <Link href="/dashboard/organization">
            <Button>
              {currentOrganization ? t("common.edit") : t("dashboard.getStarted")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t("dashboard.completeness")}
            value={`${completeness}%`}
            trend="up"
            trendValue="+12%"
            icon={<FileText className="h-5 w-5" />}
          />
          <StatCard
            title={t("dashboard.quality")}
            value={`${quality}%`}
            trend="up"
            trendValue="+5%"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
          <StatCard
            title={language === "en" ? "Problem Statements" : "समस्या कथन"}
            value="3"
            description={language === "en" ? "2 refined" : "2 परिष्कृत"}
            icon={<AlertCircle className="h-5 w-5" />}
          />
          <StatCard
            title={language === "en" ? "Stakeholders" : "हितधारक"}
            value="5"
            description={language === "en" ? "Mapped" : "मैप किया गया"}
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "LFA Section Progress" : "LFA अनुभाग प्रगति"}</CardTitle>
              <CardDescription>
                {language === "en" ? "Completion status of each section" : "प्रत्येक अनुभाग की पूर्णता स्थिति"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  completed: { label: "Completed", color: "var(--chart-1)" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Quality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Design Quality Metrics" : "डिजाइन गुणवत्ता मेट्रिक्स"}</CardTitle>
              <CardDescription>
                {language === "en" ? "Quality scores across dimensions" : "आयामों में गुणवत्ता स्कोर"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "Score" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={qualityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {qualityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Steps */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Program Design Workflow" : "कार्यक्रम डिजाइन कार्यप्रवाह"}</CardTitle>
            <CardDescription>
              {language === "en"
                ? "Follow these steps to complete your LFA"
                : "अपना LFA पूरा करने के लिए इन चरणों का पालन करें"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {workflowSteps.map((step) => {
                const Icon = step.icon
                const isComplete = step.status === "complete"
                const isInProgress = step.status === "in-progress"

                return (
                  <Link key={step.step} href={step.href}>
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isComplete
                          ? "border-success/50 bg-success/5"
                          : isInProgress
                            ? "border-primary/50 bg-primary/5"
                            : "hover:border-primary/30"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              isComplete
                                ? "bg-success text-success-foreground"
                                : isInProgress
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <span className="text-sm font-semibold">{step.step}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{language === "en" ? step.title : step.titleHi}</p>
                            <p className="text-xs text-muted-foreground">
                              {isComplete
                                ? language === "en"
                                  ? "Completed"
                                  : "पूर्ण"
                                : isInProgress
                                  ? language === "en"
                                    ? "In Progress"
                                    : "प्रगति में"
                                  : language === "en"
                                    ? "Pending"
                                    : "लंबित"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">{language === "en" ? "Continue Building" : "निर्माण जारी रखें"}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {language === "en" ? "Pick up where you left off" : "जहां आपने छोड़ा था वहां से शुरू करें"}
              </p>
              <Link href="/dashboard/problem">
                <Button size="sm">
                  {language === "en" ? "Continue" : "जारी रखें"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 border-chart-2/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">{language === "en" ? "Use a Template" : "एक टेम्पलेट का उपयोग करें"}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {language === "en" ? "Start with a proven framework" : "एक सिद्ध ढांचे से शुरू करें"}
              </p>
              <Link href="/dashboard/templates">
                <Button size="sm" variant="secondary">
                  {language === "en" ? "Browse" : "ब्राउज़ करें"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">{language === "en" ? "Export Report" : "रिपोर्ट निर्यात करें"}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {language === "en" ? "Generate your LFA documents" : "अपने LFA दस्तावेज़ उत्पन्न करें"}
              </p>
              <Link href="/dashboard/export">
                <Button size="sm" variant="secondary">
                  {language === "en" ? "Export" : "निर्यात"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
