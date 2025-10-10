'use client';

import { AppLayout } from "@/components/layout/app-layout";
import { UserList } from "@/components/admin/user-list";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import React from "react";
import type { User } from "@/lib/types";
import { getUsers } from "@/lib/data";

export default function UserManagementPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = React.useState<User[]>([]);

    React.useEffect(() => {
        if (currentUser && !currentUser.isAdmin) {
            redirect('/feed');
        }

        async function fetchUsers() {
            try {
                // This is a server function, but we can call it from a client component
                // if we were to wrap it in a client-callable server action.
                // For simplicity here, we'll pretend we can get it.
                // In a real app, this would be an API call or server action.
                // const userList = await getUsers();
                // setUsers(userList);
                
                // Temp fetch until API exists
                 const res = await fetch('/api/users');
                 const data = await res.json();
                 setUsers(data);

            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
            }
        }
        
        if (currentUser?.isAdmin) {
            fetchUsers();
        }

    }, [currentUser]);
    
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
