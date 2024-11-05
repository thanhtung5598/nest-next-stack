import { UserDetail } from '@/components/Pages/Admin/Users/UserDetail';

type UserDetailPageProps = {
  params: { userId: string };
};

const UserDetailPage = ({ params }: UserDetailPageProps) => {
  const { userId } = params;
  return <UserDetail userId={userId} />;
};

export default UserDetailPage;
