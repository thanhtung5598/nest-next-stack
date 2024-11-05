import { UserDevices } from '@/components/Pages/Admin/Users/UserDevices';

type UserDevicesPageProps = {
  params: { userId: string };
};

const UserDevicesPage = ({ params }: UserDevicesPageProps) => {
  const { userId } = params;
  return <UserDevices userId={userId} />;
};

export default UserDevicesPage;
