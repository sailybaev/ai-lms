"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, UserPlus, MoreVertical, Mail, Shield } from "lucide-react"

const mockUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Student", status: "Active", joined: "2024-01-15" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Teacher", status: "Active", joined: "2024-02-20" },
  { id: 3, name: "Carol White", email: "carol@example.com", role: "Student", status: "Active", joined: "2024-03-10" },
  { id: 4, name: "David Brown", email: "david@example.com", role: "Admin", status: "Active", joined: "2024-01-05" },
  { id: 5, name: "Emma Davis", email: "emma@example.com", role: "Teacher", status: "Suspended", joined: "2024-02-28" },
  { id: 6, name: "Frank Miller", email: "frank@example.com", role: "Student", status: "Active", joined: "2024-03-15" },
]

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRole && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all users across the platform</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account for the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Joined</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="gap-1">
                        {user.role === "Admin" && <Shield className="w-3 h-3" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{user.joined}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
