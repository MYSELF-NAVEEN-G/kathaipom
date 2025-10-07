"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { deleteUserAndPosts } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

type UserWithPostCount = User & { postCount: number };

export function UserList({ users }: { users: UserWithPostCount[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  
  const handleDeleteUser = (userId: string) => {
      startTransition(async () => {
          try {
              await deleteUserAndPosts(userId);
              toast({
                  title: "User Deleted",
                  description: "The user and all their posts have been removed.",
              });
          } catch(error: any) {
              toast({
                  variant: "destructive",
                  title: "Error",
                  description: error.message || "Failed to delete the user.",
              });
          }
      });
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Posts</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.avatar.imageUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">@{user.username}</TableCell>
              <TableCell className="font-mono text-xs">{user.id}</TableCell>
              <TableCell>{user.postCount}</TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" disabled={user.username === 'nafadmin'}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the user <strong>{user.name}</strong> (@{user.username}) and all of their posts. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteUser(user.id)} disabled={isPending}>
                        {isPending ? 'Deleting...' : 'Delete User'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
