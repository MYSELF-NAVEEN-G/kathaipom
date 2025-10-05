import { notFound } from 'next/navigation';
import { getUserByUsername, getPostsByUsername, getLikedPostsByUserId } from '@/lib/data';
import { AppLayout } from '@/components/layout/app-layout';
import { ProfileHeader } from '@/components/profile/profile-header';
import { UserPostFeed } from '@/components/profile/user-post-feed';
import { LikedPostsFeed } from '@/components/profile/liked-posts-feed';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

type ProfilePageProps = {
  params: {
    username: string;
  };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { user: currentUser } = await auth();
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  const isOwnProfile = currentUser?.username === user.username;

  // For writers or when viewing another user's profile, show their own posts.
  const stories = await getPostsByUsername(user.username);
  
  // For the current user's own profile (if they are a reader), show liked posts.
  let likedStories = [];
  if (isOwnProfile && currentUser) {
    likedStories = await getLikedPostsByUserId(currentUser.id);
  }


  return (
    <AppLayout>
      <div className="w-full">
        <ProfileHeader user={user} postsCount={stories.length} />
        <div className="p-4 md:p-6">
            {isOwnProfile && user.isAdmin === false ? (
                 <LikedPostsFeed stories={likedStories} />
            ) : (
                <UserPostFeed stories={stories} />
            )}
        </div>
      </div>
    </AppLayout>
  );
}
