import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Form from '@/components/Common/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateUserForm, createUserSchema } from './schema';
import { useNotifications } from '@toolpad/core';
import { useFetchAllDepartments } from '@/data/department';
import { userService } from '@/data/user';
import { AvatarUpload } from './AvatarUpload';
import { MAX_FILE_SIZE, UPLOAD_AVATAR_ACCEPTED_FILE_TYPES } from '@/libs/constant';
import { uploadService } from '@/data/upload';

type CreateUserModalProps = {
  onComplete: () => void;
};

export function CreateUserModal({ onComplete }: CreateUserModalProps) {
  const notifications = useNotifications();
  const [avatarUpload, setAvatarUpload] = useState<File>();
  const { data: departmentList } = useFetchAllDepartments();

  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {},
  });

  const handleCreateUser = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onHandleSubmit = async (data: CreateUserForm) => {
    if (!data) return;
    const { email, name, departmentId } = data;

    try {
      const { url: avatarUrl } = avatarUpload ? await uploadService.uploadImage(avatarUpload) : {};

      await userService.createUser({
        email,
        name,
        departmentId,
        avatarUrl,
      });

      notifications.show('Create Success', {
        severity: 'success',
      });
      onComplete();
      handleClose();
    } catch (error) {
      notifications.show('Email Is Duplicate', {
        severity: 'error',
      });
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateUser}
        >
          Add User
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <Form onSubmit={handleSubmit(onHandleSubmit)}>
            <Form.Input
              id="Email"
              name="email"
              label="Email"
              control={control}
              error={errors.name}
            />

            <Form.Input id="Name" name="name" label="Name" control={control} error={errors.name} />

            <Form.Autocomplete
              id="Department"
              name="departmentId"
              label="Department"
              control={control}
              error={errors.departmentId}
              options={departmentList?.map((department) => ({
                value: department.id,
                label: department.name,
              }))}
            />

            <AvatarUpload
              acceptedFileTypes={UPLOAD_AVATAR_ACCEPTED_FILE_TYPES}
              maxSize={MAX_FILE_SIZE}
              onComplete={(file) => setAvatarUpload(file)}
            />

            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Create
              </Button>
            </DialogActions>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
