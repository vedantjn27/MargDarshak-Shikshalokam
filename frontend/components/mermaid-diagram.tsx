"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Download, Maximize2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface MermaidDiagramProps {
  title: string
  diagram: string
  previewUrl: string
  pngUrl: string
  svgUrl: string
}

export function MermaidDiagram({ title, diagram, previewUrl, pngUrl, svgUrl }: MermaidDiagramProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Maximize2 className="mr-2 h-4 w-4" />
                Expand
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {!imageError ? (
                  <img
                    src={pngUrl || "/placeholder.svg"}
                    alt={title}
                    className="w-full h-auto rounded-lg"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">{diagram}</pre>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <div className="relative bg-muted/50 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
              {!imageError ? (
                <img
                  src={pngUrl || "/placeholder.svg"}
                  alt={title}
                  className="max-w-full h-auto rounded-lg"
                  onError={() => setImageError(true)}
                />
              ) : (
                <p className="text-muted-foreground">Failed to load diagram preview</p>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <a href={pngUrl} download>
                <Button variant="secondary" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  PNG
                </Button>
              </a>
              <a href={svgUrl} download>
                <Button variant="secondary" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  SVG
                </Button>
              </a>
            </div>
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono">{diagram}</pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
