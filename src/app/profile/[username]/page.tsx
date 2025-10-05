import { notFound } from 'next/navigation';
import { getUserByUsername, getPostsByUsername } from '@/lib/data';
import { AppLayout } from '@/components/layout/app-layout';
import { ProfileHeader } from '@/components/profile/profile-header';
import { UserPostFeed } from '@/components/profile/user-post-feed';

type ProfilePageProps = {
  params: {
    username: string;
  };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  const stories = await getPostsByUsername(params.username);

  return (
    <AppLayout>
      <div className="w-full">
        <ProfileHeader user={user} postsCount={stories.length} />
        <div className="p-4 md:p-6">
          <UserPostFeed stories={stories} />
        </div>
      </div>
    </AppLayout>
  );
}
