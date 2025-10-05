'use client';

import React from 'react';
import type { User } from '@/lib/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="font-bold text-lg">{value.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function ProfileHeader({ user, postsCount }: { user: User, postsCount: number }) {
    const [isFollowing, setIsFollowing] = React.useState(false);
    const [isClient, setIsClient] = React.useState(false);
    const [isOwnProfile, setIsOwnProfile] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
        const currentUsername = localStorage.getItem('userUsername');
        setIsOwnProfile(currentUsername === user.username);
    }, [user.username]);

    // TODO: Implement follow/unfollow logic
    const handleFollow = () => {
        setIsFollowing(!isFollowing);
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
                        {isClient && !isOwnProfile && (
                             <Button onClick={handleFollow}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}
                        {isClient && isOwnProfile && (
                            <Button variant="outline">
                                Edit Profile
                            </Button>
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
