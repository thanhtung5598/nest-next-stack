import * as yup from 'yup';

export const createDeviceSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  sku: yup.string().required('Sku is required'),
  status: yup.string().required('Category is required'),
  categoryId: yup.number().required('Category is required'),
  note: yup.string(),
  serialNumber: yup.string(),
  buyAt: yup.date(),
  price: yup.number(),
  priceVat: yup.number(),
});

export type CreateDeviceForm = yup.InferType<typeof createDeviceSchema>;
