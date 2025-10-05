'use client';

import React, { useTransition } from 'react';
import type { User } from '@/lib/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Edit, Image as ImageIcon, FileText } from 'lucide-react';
import { followUser, unfollowUser } from '@/lib/actions';
import { useAuth } from '@/hooks/use-auth';


function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="font-bold text-lg">{value.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function ProfileHeader({ user, postsCount }: { user: User, postsCount: number }) {
    const [isPending, startTransition] = useTransition();
    const { user: currentUser } = useAuth();

    const isOwnProfile = currentUser?.id === user.id;

    const isFollowing = React.useMemo(() => {
        if (!currentUser || !user.followers) return false;
        return user.followers.includes(currentUser.id);
    }, [user.followers, currentUser]);

    const handleFollowToggle = () => {
        if (!currentUser) return;
        startTransition(() => {
            if (isFollowing) {
                unfollowUser(user.id);
            } else {
                followUser(user.id);
            }
        });
    };

    return (
        <div className="relative">
            <div className="h-48 md:h-64 w-full relative">
                 <Image
                    src={user.coverImage.imageUrl}
                    alt={`${user.name}'s cover image`}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={user.coverImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-16 md:-mt-24 flex flex-col items-center md:items-end md:flex-row md:justify-between">
                     <div className="flex flex-col md:flex-row items-center gap-4">
                        <Avatar className="h-32 w-32 border-4 border-background">
                            <AvatarImage src={user.avatar.imageUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left mt-2 md:mt-12">
                            <h1 className="text-2xl md:text-3xl font-headline font-bold">{user.name}</h1>
                            <p className="text-muted-foreground">@{user.username}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-6 mt-4 md:mt-12">
                        <Stat label="Posts" value={postsCount} />
                        <Stat label="Followers" value={user.followers.length} />
                        <Stat label="Following" value={user.following.length} />
                        {currentUser && !isOwnProfile && (
                             <Button onClick={handleFollowToggle} disabled={isPending} variant={isFollowing ? 'secondary' : 'default'}>
                                {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                        )}
                        {currentUser && isOwnProfile && (
                             <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Edit Cover
                                </Button>
                                 <Button variant="outline" size="sm">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Edit Bio
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                 <div className="mt-6 text-center md:text-left max-w-2xl mx-auto md:mx-0">
                    <p className="text-foreground/90">{user.bio}</p>
                </div>
            </div>
             <div className="h-px bg-border mt-6" />
        </div>
    )
}
