'use client';

import { AppLayout } from "@/components/layout/app-layout";
import { UserList } from "@/components/admin/user-list";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import React from "react";
import type { User } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function UserManagementPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = React.useState<User[]>([]);
    const supabase = createClient();

    React.useEffect(() => {
        if (currentUser && !currentUser.isAdmin) {
            redirect('/feed');
        }

        async function fetchUsers() {
            try {
                const { data, error } = await supabase.from('users').select('*');
                if (error) throw error;
                // We need to map the Supabase user to our App user type.
                const userList: User[] = data.map((u: any) => ({
                    id: u.id,
                    name: u.name,
                    username: u.username,
                    avatar: { imageUrl: u.avatar_url, id: 'avatar-1', description: '', imageHint: '' },
                    bio: u.bio,
                    coverImage: { imageUrl: u.cover_image_url, id: 'cover-1', description: '', imageHint: '' },
                    followers: [], // In a real app, this would be another query
                    following: [],
                    isAdmin: u.is_admin
                }));
                setUsers(userList);
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
            }
        }
        
        if (currentUser?.isAdmin) {
            fetchUsers();
        }

    }, [currentUser, supabase]);
    
    if (!currentUser) {
        return (
             <main>
                <AppLayout>
                    <div className="p-4 md:p-6">
                        <h2 className="text-3xl font-headline font-bold mb-6">
                            User Management
                        </h2>
                        <p>Loading...</p>
                    </div>
                </AppLayout>
            </main>
        )
    }

  return (
    <main>
      <AppLayout>
        <div className="p-4 md:p-6">
          <h2 className="text-3xl font-headline font-bold mb-6">
            User Management
          </h2>
          <UserList users={users} />
        </div>
      </AppLayout>
    </main>
  );
}
