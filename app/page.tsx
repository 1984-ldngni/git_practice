"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BKCApp from "./BKC"
import SARKApp from "./SARK"
import WISERApp from "./WISER"

export default function AgencyComputationApp() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold">Informal Calc & Invoice</h1>
        <p className="text-xs mt-1">Calculate and analyze agency operational metrics</p>
      </div>

      <Tabs defaultValue="bkc" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="bkc">BKC</TabsTrigger>
          <TabsTrigger value="sark">SARK</TabsTrigger>
          <TabsTrigger value="wiser">WISER</TabsTrigger>
        </TabsList>

        <TabsContent value="bkc">
          <BKCApp />
        </TabsContent>

        <TabsContent value="sark">
          <SARKApp />
        </TabsContent>

        <TabsContent value="wiser">
          <WISERApp />
        </TabsContent>
      </Tabs>
    </div>
  )
}
