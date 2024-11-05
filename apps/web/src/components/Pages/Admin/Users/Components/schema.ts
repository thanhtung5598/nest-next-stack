import * as yup from 'yup';

export const createUserSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  name: yup.string().required('Name is required'),
  avatarUrl: yup.string(),
  departmentId: yup.number(),
});

export type CreateUserForm = yup.InferType<typeof createUserSchema>;

export type UpdateUserForm = CreateUserForm;
