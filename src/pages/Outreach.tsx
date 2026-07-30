import React from "react";
import EnterpriseHeader from "@/components/EnterpriseHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Users, Lightbulb, BookOpen } from "lucide-react";

const Outreach = () => {
  const languages = ["English", "Spanish", "Mandarin", "Hindi", "Arabic", "Portuguese", "French", "Japanese", "Swahili", "Russian"];

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Language, Education & Global Outreach</h1>
          <p className="text-lg text-muted-foreground">
            Multilingual dashboards, story-based impact, youth programs, and cultural metaphor integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">45+</p>
              <p className="text-xs text-muted-foreground">Supported languages</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Youth Engaged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">850K</p>
              <p className="text-xs text-muted-foreground">Students & young people</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Stories Shared
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12K+</p>
              <p className="text-xs text-muted-foreground">Community impact narratives</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Cultural Metaphors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">180</p>
              <p className="text-xs text-muted-foreground">Indigenous narratives integrated</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="languages" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="youth">Youth Programs</TabsTrigger>
            <TabsTrigger value="cultural">Cultural Metaphors</TabsTrigger>
          </TabsList>

          <TabsContent value="languages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Multilingual Accessibility</CardTitle>
                <CardDescription>Global platform in 45+ languages with regional cultural adaptation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {languages.map((lang, idx) => (
                    <div key={idx} className="p-3 border rounded-lg text-center hover:shadow-lg transition-shadow">
                      <p className="text-sm font-semibold">{lang}</p>
                      <p className="text-xs text-muted-foreground">✓ Full support</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Localization Features</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-semibold text-sm mb-2">Real-Time Translation</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>✓ Dashboard in user's language</li>
                        <li>✓ AI-powered neural translation</li>
                        <li>✓ Community correction crowdsourcing</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="font-semibold text-sm mb-2">Regional Adaptation</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>✓ Currency & date format localization</li>
                        <li>✓ Regional examples & case studies</li>
                        <li>✓ Local market pricing</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="font-semibold text-sm mb-2">Accessibility</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>✓ Screen reader compatibility</li>
                        <li>✓ High contrast modes</li>
                        <li>✓ Text-to-speech in all languages</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="font-semibold text-sm mb-2">Oral Traditions</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>✓ Audio content for non-readers</li>
                        <li>✓ Video storytelling format</li>
                        <li>✓ Elder knowledge integration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Story-Based Impact Communication</CardTitle>
                <CardDescription>People buy meaning, not credits. Every RIU tells a human story.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    <strong>Core Principle:</strong> Data alone doesn't move hearts. Stories do. Every RIU purchased connects a buyer directly to:
                  </p>
                  <ul className="text-sm text-emerald-800 mt-3 ml-4 space-y-1">
                    <li>✓ The farmer whose soil is healing</li>
                    <li>✓ The community whose water is cleaner</li>
                    <li>✓ The species being brought back</li>
                    <li>✓ The child with cleaner air to breathe</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold text-sm mb-3">Story Elements</p>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 border rounded bg-blue-50">
                        <p className="font-semibold text-blue-900">Documentary Videos</p>
                        <p className="text-blue-800">10-15 min per project, real people & places</p>
                      </div>
                      <div className="p-2 border rounded bg-purple-50">
                        <p className="font-semibold text-purple-900">Farmer Profiles</p>
                        <p className="text-purple-800">Weekly updates on restoration journey</p>
                      </div>
                      <div className="p-2 border rounded bg-emerald-50">
                        <p className="font-semibold text-emerald-900">Time-Lapse Recovery</p>
                        <p className="text-emerald-800">Visual transformation (year 1 to year 5)</p>
                      </div>
                      <div className="p-2 border rounded bg-pink-50">
                        <p className="font-semibold text-pink-900">Community Voices</p>
                        <p className="text-pink-800">Testimonials from people experiencing change</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold text-sm mb-3">Measurable Impact</p>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 border rounded bg-slate-50">
                        <p className="font-semibold mb-1">Real-Time Dashboard</p>
                        <p className="text-muted-foreground">See your RIU's impact meter update live as carbon is sequestered</p>
                      </div>
                      <div className="p-3 border rounded bg-slate-50">
                        <p className="font-semibold mb-1">Annual Report</p>
                        <p className="text-muted-foreground">Personal summary of impact you created (carbon, health, species)</p>
                      </div>
                      <div className="p-3 border rounded bg-slate-50">
                        <p className="font-semibold mb-1">Community Visits</p>
                        <p className="text-muted-foreground">Optional trips to see project firsthand</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="youth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Youth & Education Programs</CardTitle>
                <CardDescription>Engaging the next generation as regeneration leaders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-sm text-blue-900 mb-2">School Curriculum Integration</h4>
                    <p className="text-sm text-blue-800">
                      Free materials for K-12 science & social studies. Real carbon data from actual projects embedded in lessons.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-emerald-50">
                    <h4 className="font-semibold text-sm text-emerald-900 mb-2">Youth Councils</h4>
                    <p className="text-sm text-emerald-800">
                      Students (14-18) elected to local bioregional councils. Real voting power on project approvals. 850K+ active youth.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-purple-50">
                    <h4 className="font-semibold text-sm text-purple-900 mb-2">Summer Fellowships</h4>
                    <p className="text-sm text-purple-800">
                      $500-2000/student for 8-week placements working on regeneration projects. Hands-on science & community engagement.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-pink-50">
                    <h4 className="font-semibold text-sm text-pink-900 mb-2">University Partnerships</h4>
                    <p className="text-sm text-pink-800">
                      Research opportunities. Real data for dissertations. Published papers about regenerative marketplace dynamics.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-amber-50">
                    <h4 className="font-semibold text-sm text-amber-900 mb-2">Indigenous Youth Leadership</h4>
                    <p className="text-sm text-amber-800">
                      Special funding for indigenous youth. Cultural knowledge transmission through mentorship & council seats.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cultural" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Metaphor Integration</CardTitle>
                <CardDescription>Ancient wisdom meets modern science in communication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    The marketplace speaks in numbers. But human hearts respond to narratives. We weave cultural metaphors that honor indigenous knowledge while supporting regeneration.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold text-sm mb-3">Cultural Narratives in Use</p>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 border-l-4 border-l-emerald-500 bg-emerald-50 rounded">
                        <p className="font-semibold">Amazon: "Lungs of Mother Earth"</p>
                        <p className="text-xs">Framing forest regeneration as healing Pachamama</p>
                      </div>
                      <div className="p-2 border-l-4 border-l-blue-500 bg-blue-50 rounded">
                        <p className="font-semibold">Boreal: "Seven Generations Teaching"</p>
                        <p className="text-xs">Honoring Haudenosaunee principle of long-term thinking</p>
                      </div>
                      <div className="p-2 border-l-4 border-l-cyan-500 bg-cyan-50 rounded">
                        <p className="font-semibold">Coral Triangle: "Sacred Waters"</p>
                        <p className="text-xs">Integrating Polynesian ocean stewardship traditions</p>
                      </div>
                      <div className="p-2 border-l-4 border-l-pink-500 bg-pink-50 rounded">
                        <p className="font-semibold">Savanna: "Circle of Life Restored"</p>
                        <p className="text-xs">Ubuntu philosophy applied to ecosystem interconnection</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold text-sm mb-3">Integration Methods</p>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 border rounded bg-slate-50">
                        <p className="font-semibold text-sm">Artwork & Visual Design</p>
                        <p className="text-xs text-muted-foreground">Traditional artists create regeneration visuals</p>
                      </div>
                      <div className="p-2 border rounded bg-slate-50">
                        <p className="font-semibold text-sm">Oral Stories Recorded</p>
                        <p className="text-xs text-muted-foreground">Elders narrate in native languages</p>
                      </div>
                      <div className="p-2 border rounded bg-slate-50">
                        <p className="font-semibold text-sm">Festival Sponsorship</p>
                        <p className="text-xs text-muted-foreground">Support for traditional cultural celebrations</p>
                      </div>
                      <div className="p-2 border rounded bg-slate-50">
                        <p className="font-semibold text-sm">Knowledge Keeper Payment</p>
                        <p className="text-xs text-muted-foreground">Elders compensated for cultural IP sharing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Outreach;
