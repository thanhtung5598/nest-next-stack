import * as yup from 'yup';

export const createBrandSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  code: yup.string().required('Code is required'),
});

export type CreateBrandForm = yup.InferType<typeof createBrandSchema>;
