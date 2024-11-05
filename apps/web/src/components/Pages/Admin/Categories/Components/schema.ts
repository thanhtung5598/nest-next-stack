import * as yup from 'yup';

export const createCategorySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  code: yup.string().required('Code is required'),
});

export type CreateCategoryForm = yup.InferType<typeof createCategorySchema>;
