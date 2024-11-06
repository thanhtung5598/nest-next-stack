import { CreateDeviceForm } from '@/components/Pages/Admin/Devices/CreateDevice/schema';
import { useFetchPagination } from '@/hooks/useFetchPagination';
import { env } from '@/libs/constant';
import { fetcher } from '@/libs/fetcher';
import { ICategory } from './category';
import { useFetchList } from '@/hooks/useFetchList';

export type DeviceStatus = 'in_stock' | 'maintenance' | 'retired';

export type IDevice = {
  id: number;
  name: string;
  sku: string;
  serialNumber: string;
  price: number;
  priceVat: number;
  buyAt: string;
  category: ICategory;
  status: DeviceStatus;
};

class DeviceService {
  public baseUrl = `${env?.basePath}/api/devices`;

  public createDevice(payload: CreateDeviceForm) {
    return fetcher(`${this.baseUrl}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export const deviceService = new DeviceService();

export const useFetchAllBorrowAbleDevice = () => {
  return useFetchList<IDevice>({
    endpoint: `${deviceService.baseUrl}/borrowable`,
  });
};

export const useFetchDevices = () => {
  return useFetchPagination<IDevice>({
    endpoint: deviceService.baseUrl,
  });
};
