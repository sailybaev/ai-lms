import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage platform configuration and preferences</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Platform Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register on the platform</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Course Approval</Label>
                <p className="text-sm text-muted-foreground">Require admin approval for new courses</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Features</Label>
                <p className="text-sm text-muted-foreground">Enable AI-powered tools across the platform</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New User Registrations</Label>
                <p className="text-sm text-muted-foreground">Notify admins when new users register</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Course Submissions</Label>
                <p className="text-sm text-muted-foreground">Notify when teachers submit new courses</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive alerts for system issues</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Platform Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input id="platform-name" defaultValue="EduAI" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input id="support-email" type="email" defaultValue="support@eduai.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-students">Max Students per Course</Label>
              <Input id="max-students" type="number" defaultValue="100" />
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
