import * as yup from 'yup';

export const createDepartmentSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  code: yup.string().required('Code is required'),
});

export type CreateDepartmentForm = yup.InferType<typeof createDepartmentSchema>;
