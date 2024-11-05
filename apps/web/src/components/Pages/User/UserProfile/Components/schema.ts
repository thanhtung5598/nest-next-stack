import * as yup from 'yup';

export const createBorrowSchema = yup.object().shape({
  deviceId: yup.number().required('Device Id is required'),
  borrowedAt: yup.string().required('Borrow at is Required'),
  note: yup.string(),
});

export type CreateBorrowForm = yup.InferType<typeof createBorrowSchema>;
