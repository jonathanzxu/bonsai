"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Sheet, SheetTrigger, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { createProject, editProject, deleteProject, createTask, editTask, deleteTask, getAllTasks, getFriends } from "./actions";
import { useState, useEffect, useRef, useMemo } from "react";
import { useCenteredTree } from "@/lib/helpers";
import Tree from "react-d3-tree";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, CaretSortIcon, CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { set } from "mongoose";
import { Router } from "next/router";


// 5 colors from red to green, pastel
const priorityColors = {
  5: "#ff3838",
  4: "#ff8838",
  3: "#c2bf30",
  2: "#8abd24",
  1: "#00d415",
};

const statusColors = {
  "todo": "#00bdd6",
  "in progress": "#d37aff",
  "completed": "#85ffcc",
  "backlog": "#828282",
}

const priorityTally = (num: number) => {
  let tally = "";
  for (let i = 0; i < num; i++) {
    tally += "I";
  }
  return tally;
};

const handleCreateProject = async (name: string, description: string, members: any[]) => {
  if (name == "") {
    toast("a project name is required");
    return;
  }
  if (members.length === 0) {
    toast("at least one member is required");
    return;
  }
  const result = await createProject(name, description, members.map((user: any) => {
    if (user._id) return user._id;
    if (user.id) return user.id;
    return null;
  }))
  .then((res) => {
    toast("project created successfully! 🎉");
  })
  .catch((err) => {
    console.log(err);
    toast("something went wrong! 😢");
  });
  return result;
};

const handleEditProject = (projectId: any, foreignObjectProps: any) => {
  if (foreignObjectProps.newTitle == "") {
    toast("a project name is required");
    return;
  }
  if (foreignObjectProps.newAssignees.length === 0) {
    toast("at least one member is required");
    return;
  }
  editProject(projectId, foreignObjectProps.newTitle, foreignObjectProps.newDescription, foreignObjectProps.newAssignees.map((user: any) => user._id))
  .then((res) => {
    toast("project edited successfully! 🎉");
  })
  .catch((err) => {
    console.log(err);
    toast("something went wrong! 😢");
  });
}

const handleDeleteProject = (projectId: any, foreignObjectProps: any) => {
  deleteProject(projectId)
  .then((res) => {
    const newProjectTrees = [...foreignObjectProps.projectTrees];
    newProjectTrees.splice(foreignObjectProps.currentProjectIndex, 1);
    foreignObjectProps.setProjectIndex("0");
    foreignObjectProps.setProjectTrees(newProjectTrees);
    foreignObjectProps.setDataKey(foreignObjectProps.dataKey + 1); // force a re-render
    toast("project deleted successfully! 🎉");
  })
  .catch((err) => {
    console.log(err);
    toast("something went wrong! 😢");
  });
}

const handleEditTask = (taskId: any, foreignObjectProps: any) => {
  editTask(taskId, foreignObjectProps.newTitle, foreignObjectProps.newDescription, foreignObjectProps.newDueDate, foreignObjectProps.newPriority, foreignObjectProps.newStatus, foreignObjectProps.newAssignees.map((user: any) => user._id))
  .then((res) => {
    const newProjectTrees = [...foreignObjectProps.projectTrees];
    // recurse through the tree to find the task and update it
    const findAndEditTask = (node: any) => {
      if (node._id === taskId) {
        node.title = foreignObjectProps.newTitle;
        node.description = foreignObjectProps.newDescription;
        node.dueDate = foreignObjectProps.newDueDate;
        node.priority = foreignObjectProps.newPriority;
        node.status = foreignObjectProps.newStatus;
        node.users = foreignObjectProps.newAssignees;
      } else if (node.children) {
        node.children.forEach(findAndEditTask);
      }
    };
    findAndEditTask(newProjectTrees[foreignObjectProps.currentProjectIndex].tree);
    foreignObjectProps.setProjectTrees(newProjectTrees);
    foreignObjectProps.setDataKey(foreignObjectProps.dataKey + 1); // force a re-render
    toast("task edited successfully! 🎉");
  })
  .catch((err) => {
    console.log(err);
    toast("something went wrong! 😢");
  });
}

const handleCreateTask = (parentId: any, foreignObjectProps: any) => {
  if (foreignObjectProps.newTitle === "") {
    //error
    console.log("title is required");
    return;
  }
  createTask(parentId, foreignObjectProps.newTitle, foreignObjectProps.newDescription, foreignObjectProps.newDueDate, foreignObjectProps.newPriority, foreignObjectProps.newStatus, foreignObjectProps.newAssignees.map((user: any) => user._id))
  .then((res) => {
    console.log("task created, received: ", res);
    const newProjectTrees = [...foreignObjectProps.projectTrees];
    // recurse through the tree to find the parent and add the new task
    const findAndAddTask = (node: any) => {
      if (node._id === parentId) {
        node.children.push({
          _id: res._id,
          title: foreignObjectProps.newTitle,
          description: foreignObjectProps.newDescription,
          dueDate: foreignObjectProps.newDueDate,
          priority: foreignObjectProps.newPriority,
          status: foreignObjectProps.newStatus,
          users: foreignObjectProps.newAssignees,
          parent: parentId,
          children: [],
        });
      } else if (node.children) {
        node.children.forEach(findAndAddTask);
      }
    };
    findAndAddTask(newProjectTrees[foreignObjectProps.currentProjectIndex].tree);
    foreignObjectProps.setProjectTrees(newProjectTrees);
    foreignObjectProps.setDataKey(foreignObjectProps.dataKey + 1); // force a re-render
    toast("task created successfully! 🎉");
  })
  .catch((err) => {
    toast("something went wrong! 😢");
  });
}

const handleDeleteTask = (taskId: any, foreignObjectProps: any) => {
  deleteTask(taskId)
  .then((res) => {
    const newProjectTrees = [...foreignObjectProps.projectTrees];
    // recurse through the tree to find the task and delete it
    const findAndDeleteTask = (node: any, parent: any) => {
      if (node._id === taskId) {
        parent.children = parent.children.filter((child: any) => child._id !== taskId);
      } else if (node.children) {
        node.children.forEach((child: any) => findAndDeleteTask(child, node));
      }
    };
    newProjectTrees[foreignObjectProps.currentProjectIndex].tree.children.forEach((child: any) => findAndDeleteTask(child, newProjectTrees[foreignObjectProps.currentProjectIndex].tree));
    foreignObjectProps.setProjectTrees(newProjectTrees);
    foreignObjectProps.setDataKey(foreignObjectProps.dataKey + 1); // force a re-render
    toast("task deleted successfully! 🎉");
  })
  .catch((err) => {
    toast("something went wrong! 😢");
  });
}


const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
}: any) => {
  const isRoot = nodeDatum.parent === undefined;
return (<g className="cursor-default pointer-events-none">
  <foreignObject {...foreignObjectProps}>
    <Card className="mx-2 pointer-events-auto">
      <CardHeader>
        <CardTitle className={"flex items-center w-full " + (isRoot ? "text-3xl" : "")}>
          {nodeDatum.title}
          {!isRoot && <>
          <Badge tooltip={"priority: " + nodeDatum.priority} className="ml-2 pointer-events-none cursor-default" style={{backgroundColor: priorityColors[nodeDatum.priority]}}>{priorityTally(nodeDatum.priority)}</Badge>
          <Badge className="ml-2 pointer-events-none cursor-default" style={{backgroundColor: statusColors[nodeDatum.status]}}>{nodeDatum.status}</Badge>
          </>}
          </CardTitle>
        <CardDescription>{nodeDatum.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 my-4 items-start">
          <Label>Due Date</Label>
          <Button
            variant={"outline"}
            className={
              "cursor-default " + (!nodeDatum.dueDate ? "text-muted-foreground" : "")
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {nodeDatum.dueDate ? format(nodeDatum.dueDate, "PPP") : <span>None set</span>}
          </Button>
        </div>
        <div className="flex flex-col gap-2 my-4 items-start">
          <Label>{isRoot? "Members" : "Assignees"}</Label>
          <div className="flex flex-row gap-2">
            {nodeDatum.users.map((user: any, index: number) => {
            return (
              <Avatar tooltip={"@" + (user as any).username}>
                <AvatarImage src={(user as any).picture} alt={(user as any).username} />
                <AvatarFallback>{(user as any).username.substring(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
            )})}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Sheet>
          <SheetTrigger>
            <Button onClick={() => {
                foreignObjectProps.setNewTitle("");
                foreignObjectProps.setNewDescription("");
                foreignObjectProps.setNewPriority(3);
                foreignObjectProps.setNewStatus("todo");
                foreignObjectProps.setNewAssignees([]);
                foreignObjectProps.setNewDueDate(new Date());
            }}>{isRoot ? "create task" : "create subtask"}</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create new task</SheetTitle>
              <SheetDescription>Create a new task, set priority, and add assignees.</SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Title</Label>
              <Input id="title" value={foreignObjectProps.newTitle} onChange={(e) => foreignObjectProps.setNewTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Description</Label>
              <Textarea id="description" value={foreignObjectProps.newDescription} onChange={(e) => foreignObjectProps.setNewDescription(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      (!foreignObjectProps.newDueDate ? "text-muted-foreground" : "")
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {foreignObjectProps.newDueDate ? format(foreignObjectProps.newDueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar className="mx-auto" id="description" mode="single" selected={foreignObjectProps.newDueDate} onSelect={foreignObjectProps.setNewDueDate} initialFocus />
                </PopoverContent>
              </Popover>
              
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Status</Label>
              <Select value={foreignObjectProps.newStatus} onValueChange={foreignObjectProps.setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="todo">todo</SelectItem>
                    <SelectItem value="in progress">in progress</SelectItem>
                    <SelectItem value="completed">completed</SelectItem>
                    <SelectItem value="backlog">backlog</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Priority</Label>
              <Select value={(foreignObjectProps.newPriority ? foreignObjectProps.newPriority.toString() : "")} onValueChange={(p) => foreignObjectProps.setNewPriority(parseInt(p))}>
                <SelectTrigger>
                  <SelectValue placeholder="priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Assignees <span className="opacity-50">(click to remove)</span></Label>
              <div className="flex flex-row gap-2">
                {foreignObjectProps.newAssignees.map((user: any, index: number) => {
                return (
                  <Avatar key={index} tooltip={"@" + (user as any).username} className="cursor-pointer hover:opacity-50 transition-opacity" onClick={() => {
                    foreignObjectProps.setNewAssignees(foreignObjectProps.newAssignees.filter((u: any) => u.username != (user as any).username));
                  }}>
                    <AvatarImage src={(user as any).picture} alt={(user as any).username} />
                    <AvatarFallback>{(user as any).username.substring(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                )}
              </div>
              <Popover open={foreignObjectProps.open} onOpenChange={foreignObjectProps.setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {"Add friend..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search friends..." className="h-9" />
                    <CommandEmpty>No friends found.</CommandEmpty>
                    <CommandGroup>
                      {foreignObjectProps.friends && foreignObjectProps.friends.map((friend: any) => {
                        return (
                        <CommandItem
                          key={friend.username}
                          value={friend.username}
                          onSelect={(currentValue) => {
                            if (foreignObjectProps.newAssignees.some((u: any) => u.username == friend.username)) {
                              foreignObjectProps.setNewAssignees(foreignObjectProps.newAssignees.filter((u: any) => u.username != friend.username));
                            } else {
                              foreignObjectProps.setNewAssignees([...foreignObjectProps.newAssignees, friend]);
                            }
                          }}
                        >
                          {friend.username}
                          <CheckIcon
                            className={
                              "ml-auto h-4 w-4 " +
                              ((foreignObjectProps.newAssignees.some((u: any) => u.username == friend.username)) ? "opacity-100" : "opacity-0")
                            }
                          />
                        </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">cancel</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button onClick={() => handleCreateTask(nodeDatum._id, foreignObjectProps)}>create</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger>
            <Button onClick={() => {
              foreignObjectProps.setNewTitle(nodeDatum.title);
              foreignObjectProps.setNewDescription(nodeDatum.description);
              foreignObjectProps.setNewDueDate(nodeDatum.dueDate);
              foreignObjectProps.setNewStatus(nodeDatum.status);
              foreignObjectProps.setNewPriority(nodeDatum.priority);
              foreignObjectProps.setNewAssignees(nodeDatum.users);
            }} className="ml-2" variant="outline">edit</Button>
          </SheetTrigger>
          <SheetContent>
            { isRoot ? <>
            <SheetHeader>
              <SheetTitle>Edit project</SheetTitle>
              <SheetDescription>Edit the name, description, due date, and members of an existing project.</SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Name</Label>
              <Input id="name" value={foreignObjectProps.newTitle} onChange={(e) => foreignObjectProps.setNewTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Description</Label>
              <Textarea id="description" value={foreignObjectProps.newDescription} onChange={(e) => foreignObjectProps.setNewDescription(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      (!foreignObjectProps.newDueDate ? "text-muted-foreground" : "")
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {foreignObjectProps.newDueDate ? format(foreignObjectProps.newDueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar className="mx-auto" id="description" mode="single" selected={foreignObjectProps.newDueDate} onSelect={foreignObjectProps.setNewDueDate} initialFocus />
                </PopoverContent>
              </Popover>
              
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Members <span className="opacity-50">(click to remove)</span></Label>
              <div className="flex flex-row gap-2">
                {foreignObjectProps.newAssignees.map((user: any, index: number) => {
                return (
                  <Avatar key={index} tooltip={"@" + (user as any).username} className="cursor-pointer hover:opacity-50 transition-opacity" onClick={() => {
                    if (foreignObjectProps.newAssignees.length == 1) {
                      toast("you can't remove the last member from the project! if you want to delete the project, use the delete button.");
                      return;
                    }
                    if (foreignObjectProps.user.username != (user as any).username) {
                      toast("you can't remove someone else from the project! time for a tough talk... 😬");
                      return;
                    }
                    foreignObjectProps.setNewAssignees(foreignObjectProps.newAssignees.filter((u: any) => u.username != (user as any).username));
                  }}>
                    <AvatarImage src={(user as any).picture} alt={(user as any).username} />
                    <AvatarFallback>{(user as any).username.substring(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                )}
              </div>
              <Popover open={foreignObjectProps.open} onOpenChange={foreignObjectProps.setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {"Add friend..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search friends..." className="h-9" />
                    <CommandEmpty>No friends found.</CommandEmpty>
                    <CommandGroup>
                      {foreignObjectProps.friends && foreignObjectProps.friends.map((friend: any) => {
                        return (
                        <CommandItem
                          key={friend.username}
                          value={friend.username}
                          onSelect={(currentValue) => {
                            if (foreignObjectProps.newAssignees.some((u: any) => u.username == friend.username)) {
                              if (foreignObjectProps.newAssignees.length == 1) {
                                toast("you can't remove the last member from the project! if you want to delete the project, use the delete button.");
                                return;
                              }
                              if (foreignObjectProps.user.username != currentValue) {
                                toast("you can't remove someone else from the project! time for a tough talk... 😬");
                                return;
                              }
                              foreignObjectProps.setNewAssignees(foreignObjectProps.newAssignees.filter((u: any) => u.username != friend.username));
                            } else {
                              foreignObjectProps.setNewAssignees([...foreignObjectProps.newAssignees, friend]);
                            }
                          }}
                        >
                          {friend.username}
                          <CheckIcon
                            className={
                              "ml-auto h-4 w-4 " +
                              ((foreignObjectProps.newAssignees.some((u: any) => u.username == friend.username)) ? "opacity-100" : "opacity-0")
                            }
                          />
                        </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">cancel</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button onClick={() => {
                  handleEditTask(nodeDatum._id, foreignObjectProps);
                  handleEditProject(nodeDatum.project, foreignObjectProps);
                }}>save changes</Button>
              </SheetClose>
            </SheetFooter>
            </> : <>
            <SheetHeader>
              <SheetTitle>Edit task</SheetTitle>
              <SheetDescription>Edit the name, description, status, priority, and assignees of an existing task.</SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Title</Label>
              <Input id="title" value={foreignObjectProps.newTitle} onChange={(e) => foreignObjectProps.setNewTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Description</Label>
              <Textarea id="description" value={foreignObjectProps.newDescription} onChange={(e) => foreignObjectProps.setNewDescription(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      (!foreignObjectProps.newDueDate ? "text-muted-foreground" : "")
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {foreignObjectProps.newDueDate ? format(foreignObjectProps.newDueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar className="mx-auto" id="description" mode="single" selected={foreignObjectProps.newDueDate} onSelect={foreignObjectProps.setNewDueDate} initialFocus />
                </PopoverContent>
              </Popover>
              
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Status</Label>
              <Select value={foreignObjectProps.newStatus} onValueChange={foreignObjectProps.setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="todo">todo</SelectItem>
                    <SelectItem value="in progress">in progress</SelectItem>
                    <SelectItem value="completed">completed</SelectItem>
                    <SelectItem value="backlog">backlog</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Priority</Label>
              <Select value={(foreignObjectProps.newPriority ? foreignObjectProps.newPriority.toString() : "")} onValueChange={(p) => foreignObjectProps.setNewPriority(parseInt(p))}>
                <SelectTrigger>
                  <SelectValue placeholder="priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Assignees <span className="opacity-50">(click to remove)</span></Label>
              <div className="flex flex-row gap-2">
                {foreignObjectProps.newAssignees.map((user: any, index: number) => {
                return (
                  <Avatar key={index} tooltip={"@" + (user as any).username} className="cursor-pointer hover:opacity-50 transition-opacity" onClick={() => {
                    foreignObjectProps.setNewAssignees(foreignObjectProps.newAssignees.filter((u: any) => u.username != (user as any).username));
                  }}>
                    <AvatarImage src={(user as any).picture} alt={(user as any).username} />
                    <AvatarFallback>{(user as any).username.substring(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                )}
              </div>
              <Popover open={foreignObjectProps.open} onOpenChange={foreignObjectProps.setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {"Add friend..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search friends..." className="h-9" />
                    <CommandEmpty>No friends found.</CommandEmpty>
                    <CommandGroup>
                      {foreignObjectProps.friends && foreignObjectProps.friends.map((friend: any) => {
                        return (
                        <CommandItem
                          key={friend.username}
                          value={friend.username}
                          onSelect={(currentValue) => {
                            if (foreignObjectProps.newAssignees.some((u: any) => u.username == friend.username)) {
                              foreignObjectProps.setNewAssignees(foreignObjectProps.newAssignees.filter((u: any) => u.username != friend.username));
                            } else {
                              foreignObjectProps.setNewAssignees([...foreignObjectProps.newAssignees, friend]);
                            }
                          }}
                        >
                          {friend.username}
                          <CheckIcon
                            className={
                              "ml-auto h-4 w-4 " +
                              ((foreignObjectProps.newAssignees.some((u: any) => u.username == friend.username)) ? "opacity-100" : "opacity-0")
                            }
                          />
                        </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">cancel</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button onClick={() => handleEditTask(nodeDatum._id, foreignObjectProps)}>save changes</Button>
              </SheetClose>
            </SheetFooter>
          </>}
          </SheetContent>
        </Sheet>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive" className="ml-2">delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {isRoot ? 
                "This action cannot be undone. The project and all tasks will be permanently lost." :
                "This action cannot be undone. The task and all subtasks will be permanently lost."
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (isRoot) {
                  handleDeleteProject(nodeDatum.project, foreignObjectProps);
                } else {
                  handleDeleteTask(nodeDatum._id, foreignObjectProps)
                }}}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  </foreignObject>
</g>)};

export default function Home() {
  const router = useRouter();

  const [projectTrees, setProjectTrees] = useState<any[]>([]);
  const [dataKey, setDataKey] = useState(0);
  const [projectIndex, setProjectIndex] = useState<string | undefined>();
  const initialLoaded = useRef(false);
  const currentZoom = useRef(1);
  const currentTranslate = useRef({ x: 0, y: 0 });

  // task edit/creation state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState(0);
  const [newAssignees, setNewAssignees] = useState([]);
  const [friendValue, setFriendValue] = useState("");
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [newDueDate, setNewDueDate] = useState(new Date());

  // project edit/creation state
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [projectOpen, setProjectOpen] = useState(false);
  const [user, setUser] = useState({} as any);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    getAllTasks().then((res) => {
      console.log("projectTrees:", res);
      if (res.length > 0) {
        setProjectIndex("0");
      }
      setProjectTrees(res);
    }).then(() => {
      // hacky workaround to prevent zoom/translate snapping on first edit
      setTimeout(() => {
        initialLoaded.current = true;
      }, 3000);
    });
    getFriends(true).then((res) => {
      setFriends(res || []);
    });
    getSession().then((res) => {
      if (!res || !res.user) {
        router.push("/login");
        return;
      };
      setUser(res.user);
      setProjectMembers([res.user]);
    });
  }, []);
  const nodeSize = { x: 400, y: 400 };
  const foreignObjectProps = { 
    width: 400, 
    height: 400, 
    x: -200,
    user: user,
    newTitle: newTitle,
    setNewTitle: setNewTitle,
    newDescription: newDescription,
    setNewDescription: setNewDescription,
    newStatus: newStatus,
    setNewStatus: setNewStatus,
    newPriority: newPriority,
    setNewPriority: setNewPriority,
    newAssignees: newAssignees,
    setNewAssignees: setNewAssignees,
    newDueDate: newDueDate,
    setNewDueDate: setNewDueDate,
    friendValue: friendValue,
    setFriendValue: setFriendValue,
    open: open,
    setOpen: setOpen,
    friends: friends,
    projectTrees: projectTrees,
    setProjectTrees: setProjectTrees,
    currentProjectIndex: projectIndex,
    setProjectIndex: setProjectIndex,
    dataKey: dataKey,
    setDataKey: setDataKey
  };

  const [translate, containerRef] : any[] = useCenteredTree();

  return (
    <main className="relative flex h-full flex-col" ref={containerRef as any}>
      <div className="absolute flex flex-row gap-4 items-center top-4 left-4">
        <Label>project: </Label>
        <Select value={projectIndex} onValueChange={(index) => {
            console.log("index:", index)
            setProjectIndex(index);
            currentZoom.current = 1;
            currentTranslate.current = translate;
            setDataKey(0);
        }}>
          <SelectTrigger className="mr-4">
            <SelectValue placeholder="select project..." />
          </SelectTrigger>
          <SelectContent>
            {projectTrees.map((projectTree: any, index: number) => {
              return (
                <SelectItem key={index} value={index.toString()} >
                  {projectTree.tree.title}
                </SelectItem>
              )
            })}
            <Dialog>
              <DialogTrigger>
                <Button variant="ghost" className="flex min-w-full w-full items-start justify-between px-2">
                  <span className="mr-4">New Project</span>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create new project</DialogTitle>
                  <DialogDescription>Create a new project and add your friends as collaborators.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 my-4 items-start">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2 my-4 items-start">
                  <Label>Description</Label>
                  <Textarea id="description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2 my-4 items-start">
                  <Label>Assignees <span className="opacity-50">(click to remove)</span></Label>
                  <div className="flex flex-row gap-2">
                    {projectMembers.map((newUser: any, index: number) => {
                    return (
                      <Avatar key={index} tooltip={"@" + (newUser as any).username} className="cursor-pointer hover:opacity-50 transition-opacity" onClick={() => {
                        if ((newUser as any).username == user.username) {
                          toast("you can't remove yourself from your own project! 😅");
                          return;
                        }
                        setProjectMembers(projectMembers.filter((u: any) => u.username != (newUser as any).username));
                      }}>
                        <AvatarImage src={(newUser as any).picture} alt={(newUser as any).username} />
                        <AvatarFallback>{(newUser as any).username && ((newUser as any).username.substring(0, 1).toUpperCase())}</AvatarFallback>
                      </Avatar>
                    )}
                    )}
                  </div>
                  <Popover open={projectOpen} onOpenChange={setProjectOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {"Add friend..."}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search friends..." className="h-9" />
                        <CommandEmpty>No friends found.</CommandEmpty>
                        <CommandGroup>
                          {friends && friends.map((friend: any) => {
                            return (
                            <CommandItem
                              key={friend.username}
                              value={friend.username}
                              onSelect={(currentValue) => {
                                if (friend.username == user.username) return;
                                if (projectMembers.some((u: any) => u.username == friend.username)) {
                                  setProjectMembers(projectMembers.filter((u: any) => u.username != friend.username));
                                } else {
                                  setProjectMembers([...projectMembers, friend] as any);
                                }
                              }}
                            >
                              {friend.username}
                              <CheckIcon
                                className={
                                  "ml-auto h-4 w-4 " +
                                  ((projectMembers.some((u: any) => u.username == friend.username)) ? "opacity-100" : "opacity-0")
                                }
                              />
                            </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <DialogFooter>
                  <DialogClose>
                    <Button variant="secondary" onClick={() => {
                      setProjectOpen(false);
                      setProjectMembers([user])
                      setProjectName("");
                    }}>cancel</Button>
                  </DialogClose>
                  <DialogClose>
                    <Button variant="default" onClick={() => {
                      handleCreateProject(projectName, projectDescription, projectMembers)
                      .then((res) => {
                        if (res === null) return;
                        console.log("res:", res);
                        setProjectTrees([...projectTrees, {
                          project: res,
                          tree: {
                            name: projectName,
                            description: projectDescription,
                            children: [],
                            users: projectMembers
                          }
                        }])
                        setProjectIndex((projectTrees.length - 1).toString());
                        currentZoom.current = 1;
                        currentTranslate.current = translate;
                        setDataKey(0);
                      });
                    }}>create</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SelectContent>
        </Select>
      </div>
      {projectTrees.length > 0 ?
      <Tree 
        key={dataKey + 3 * parseInt(projectIndex || "0")}
        data={(projectTrees[parseInt(projectIndex || "0")] as any).tree} 
        translate={(!initialLoaded.current ? translate : currentTranslate.current)} // initial values on render
        zoom={currentZoom.current} // initial values on render
        orientation="vertical" 
        nodeSize={nodeSize} 
        pathClassFunc={() => resolvedTheme == "light" ? "link-dark" : "link-light"}
        renderCustomNodeElement={(props) => renderForeignObjectNode({...props, foreignObjectProps})} 
        onUpdate={(event) => {
          currentZoom.current = event.zoom;
          currentTranslate.current = event.translate;
        }}
      /> :
      <div className="flex flex-col gap-4 h-full w-full items-center justify-center">
        <h1 className="text-3xl">No projects yet! </h1>
        <h2 className="text-xl">create a new project to get started.</h2>
        <Dialog>
          <DialogTrigger>
            <Button variant="outline" className="flex w-fit h-fit py-2 px-4">
              <span className="mr-4 text-xl">New Project</span>
              <PlusIcon className="h-8 w-8" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new project</DialogTitle>
              <DialogDescription>Create a new project and add your friends as collaborators.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Description</Label>
              <Textarea id="description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 my-4 items-start">
              <Label>Assignees <span className="opacity-50">(click to remove)</span></Label>
              <div className="flex flex-row gap-2">
                {projectMembers.map((newUser: any, index: number) => {
                return (
                  <Avatar key={index} tooltip={"@" + (newUser as any).username} className="cursor-pointer hover:opacity-50 transition-opacity" onClick={() => {
                    if ((newUser as any).username == user.username) {
                      toast("you can't remove yourself from your own project! 😅");
                      return;
                    }
                    setProjectMembers(projectMembers.filter((u: any) => u.username != (newUser as any).username));
                  }}>
                    <AvatarImage src={(newUser as any).picture} alt={(newUser as any).username} />
                    <AvatarFallback>{(newUser as any).username && ((newUser as any).username.substring(0, 1).toUpperCase())}</AvatarFallback>
                  </Avatar>
                )}
                )}
              </div>
              <Popover open={projectOpen} onOpenChange={setProjectOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {"Add friend..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search friends..." className="h-9" />
                    <CommandEmpty>No friends found.</CommandEmpty>
                    <CommandGroup>
                      {friends && friends.map((friend: any) => {
                        return (
                        <CommandItem
                          key={friend.username}
                          value={friend.username}
                          onSelect={(currentValue) => {
                            if (friend.username == user.username) return;
                            if (projectMembers.some((u: any) => u.username == friend.username)) {
                              setProjectMembers(projectMembers.filter((u: any) => u.username != friend.username));
                            } else {
                              setProjectMembers([...projectMembers, friend] as any);
                            }
                          }}
                        >
                          {friend.username}
                          <CheckIcon
                            className={
                              "ml-auto h-4 w-4 " +
                              ((projectMembers.some((u: any) => u.username == friend.username)) ? "opacity-100" : "opacity-0")
                            }
                          />
                        </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button variant="secondary" onClick={() => {
                  setProjectOpen(false);
                  setProjectMembers([user])
                  setProjectName("");
                }}>cancel</Button>
              </DialogClose>
              <DialogClose>
                <Button variant="default" onClick={() => {
                  handleCreateProject(projectName, projectDescription, projectMembers)
                  .then((res) => {
                    if (res === null) return;
                    console.log("res:", res);
                    setProjectTrees([...projectTrees, {
                      project: res,
                      tree: {
                        name: projectName,
                        description: projectDescription,
                        children: [],
                        users: projectMembers
                      }
                    }])
                    setProjectIndex((projectTrees.length - 1).toString());
                    currentZoom.current = 1;
                    currentTranslate.current = translate;
                    setDataKey(0);
                  });
                }}>create</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      }
    </main>
  );
}
