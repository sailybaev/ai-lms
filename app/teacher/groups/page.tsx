"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Plus, Edit, Trash2, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const students = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", course: "ML Advanced" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", course: "Web Dev" },
  { id: 3, name: "Carol White", email: "carol@example.com", course: "Data Science" },
  { id: 4, name: "David Brown", email: "david@example.com", course: "ML Advanced" },
  { id: 5, name: "Emma Davis", email: "emma@example.com", course: "Web Dev" },
  { id: 6, name: "Frank Miller", email: "frank@example.com", course: "Data Science" },
  { id: 7, name: "Grace Lee", email: "grace@example.com", course: "ML Advanced" },
  { id: 8, name: "Henry Wilson", email: "henry@example.com", course: "Web Dev" },
]

type Group = {
  id: number
  name: string
  description: string
  course: string
  members: number[]
  createdAt: string
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "Team Alpha",
      description: "Advanced ML project group",
      course: "ML Advanced",
      members: [1, 4, 7],
      createdAt: "2025-01-10",
    },
    {
      id: 2,
      name: "Web Warriors",
      description: "Full-stack development team",
      course: "Web Dev",
      members: [2, 5, 8],
      createdAt: "2025-01-12",
    },
    {
      id: 3,
      name: "Data Explorers",
      description: "Data analysis and visualization",
      course: "Data Science",
      members: [3, 6],
      createdAt: "2025-01-14",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    course: "",
    members: [] as number[],
  })

  const filteredGroups = groups.filter((group) => {
    const matchesCourse = courseFilter === "all" || group.course === courseFilter
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCourse && matchesSearch
  })

  const handleCreateGroup = () => {
    if (newGroup.name && newGroup.course) {
      const group: Group = {
        id: groups.length + 1,
        ...newGroup,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setGroups([...groups, group])
      setNewGroup({ name: "", description: "", course: "", members: [] })
      setIsCreateOpen(false)
    }
  }

  const handleUpdateGroup = () => {
    if (editingGroup) {
      setGroups(groups.map((g) => (g.id === editingGroup.id ? editingGroup : g)))
      setEditingGroup(null)
    }
  }

  const handleDeleteGroup = (id: number) => {
    setGroups(groups.filter((g) => g.id !== id))
  }

  const toggleMember = (studentId: number, isEditing: boolean) => {
    if (isEditing && editingGroup) {
      const members = editingGroup.members.includes(studentId)
        ? editingGroup.members.filter((id) => id !== studentId)
        : [...editingGroup.members, studentId]
      setEditingGroup({ ...editingGroup, members })
    } else {
      const members = newGroup.members.includes(studentId)
        ? newGroup.members.filter((id) => id !== studentId)
        : [...newGroup.members, studentId]
      setNewGroup({ ...newGroup, members })
    }
  }

  const getStudentsByIds = (ids: number[]) => {
    return students.filter((s) => ids.includes(s.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Groups</h1>
          <p className="text-muted-foreground mt-1">Organize students into collaborative groups</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  placeholder="Enter group name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter group description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select value={newGroup.course} onValueChange={(value) => setNewGroup({ ...newGroup, course: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ML Advanced">ML Advanced</SelectItem>
                    <SelectItem value="Web Dev">Web Dev</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Members</Label>
                <div className="border rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto">
                  {students
                    .filter((s) => !newGroup.course || s.course === newGroup.course)
                    .map((student) => (
                      <div key={student.id} className="flex items-center gap-3 p-2 hover:bg-accent rounded-md">
                        <Checkbox
                          checked={newGroup.members.includes(student.id)}
                          onCheckedChange={() => toggleMember(student.id, false)}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                        <Badge variant="outline">{student.course}</Badge>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Groups</p>
            <p className="text-3xl font-bold">{groups.length}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Members</p>
            <p className="text-3xl font-bold">{groups.reduce((acc, g) => acc + g.members.length, 0)}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Avg. Group Size</p>
            <p className="text-3xl font-bold">
              {groups.length > 0 ? Math.round(groups.reduce((acc, g) => acc + g.members.length, 0) / groups.length) : 0}
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="ML Advanced">ML Advanced</SelectItem>
                <SelectItem value="Web Dev">Web Dev</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="p-4 hover:border-primary/50 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {group.course}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Members</span>
                      <span className="font-medium">{group.members.length} students</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {getStudentsByIds(group.members)
                        .slice(0, 3)
                        .map((student) => (
                          <div
                            key={student.id}
                            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary"
                          >
                            {student.name.charAt(0)}
                          </div>
                        ))}
                      {group.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          +{group.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 bg-transparent"
                          onClick={() => setEditingGroup(group)}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Group</DialogTitle>
                        </DialogHeader>
                        {editingGroup && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Group Name</Label>
                              <Input
                                id="edit-name"
                                value={editingGroup.name}
                                onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-description">Description</Label>
                              <Textarea
                                id="edit-description"
                                value={editingGroup.description}
                                onChange={(e) => setEditingGroup({ ...editingGroup, description: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-course">Course</Label>
                              <Select
                                value={editingGroup.course}
                                onValueChange={(value) => setEditingGroup({ ...editingGroup, course: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ML Advanced">ML Advanced</SelectItem>
                                  <SelectItem value="Web Dev">Web Dev</SelectItem>
                                  <SelectItem value="Data Science">Data Science</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Select Members</Label>
                              <div className="border rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto">
                                {students
                                  .filter((s) => s.course === editingGroup.course)
                                  .map((student) => (
                                    <div
                                      key={student.id}
                                      className="flex items-center gap-3 p-2 hover:bg-accent rounded-md"
                                    >
                                      <Checkbox
                                        checked={editingGroup.members.includes(student.id)}
                                        onCheckedChange={() => toggleMember(student.id, true)}
                                      />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">{student.name}</p>
                                        <p className="text-xs text-muted-foreground">{student.email}</p>
                                      </div>
                                      <Badge variant="outline">{student.course}</Badge>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setEditingGroup(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateGroup}>Save Changes</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent text-destructive hover:text-destructive"
                      onClick={() => handleDeleteGroup(group.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
