import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Award, BookOpen, Clock } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
            AJ
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" defaultValue="Alice" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" defaultValue="Johnson" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="alice.johnson@student.edu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                defaultValue="Computer Science student passionate about AI and machine learning."
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Learning Stats</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Courses Enrolled</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">47h</p>
                <p className="text-sm text-muted-foreground">Total Study Time</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your courses</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Study Reminders</Label>
                <p className="text-sm text-muted-foreground">Get daily reminders to study</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Suggestions</Label>
                <p className="text-sm text-muted-foreground">Receive personalized study recommendations</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
