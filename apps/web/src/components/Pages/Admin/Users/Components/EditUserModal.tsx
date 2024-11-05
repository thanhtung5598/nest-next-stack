import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Form from '@/components/Common/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UpdateUserForm, createUserSchema } from './schema';
import { brandsService, IBrand } from '@/data/brand';
import { AvatarUpload } from './AvatarUpload';
import { useFetchAllDepartments } from '@/data/department';
import { MAX_FILE_SIZE, UPLOAD_AVATAR_ACCEPTED_FILE_TYPES } from '@/libs/constant';
import { useNotifications } from '@toolpad/core';
import { IUserProfile, userService } from '@/data/user';
import { uploadService } from '@/data/upload';

type EditUserModalProps = {
  user?: IUserProfile;
  onClose?: () => void;
  onComplete: () => void;
};

export function EditUserModal({ user, onComplete, onClose }: EditUserModalProps) {
  const notifications = useNotifications();
  const [avatarUpload, setAvatarUpload] = useState<File>();
  const { data: departmentList } = useFetchAllDepartments();
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    resolver: yupResolver(createUserSchema),
  });

  useEffect(() => {
    if (user) {
      setOpen(true);
      setValue('email', user.email);
      setValue('name', user.name);
      setValue('departmentId', user.department.id);
      setValue('avatarUrl', user.avatarUrl);
    }
  }, [user]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const onHandleSubmit = async (data: UpdateUserForm) => {
    if (!data || !user) return;
    const { email, name, departmentId } = data;

    try {
      const { url: avatarUrl } = avatarUpload ? await uploadService.uploadImage(avatarUpload) : {};

      await userService.updateUser(user.id, {
        email,
        name,
        departmentId,
        avatarUrl: avatarUrl || user.avatarUrl,
      });

      notifications.show('Update Success', {
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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit(onHandleSubmit)}>
          <Form.Input id="Email" name="email" label="Email" control={control} error={errors.name} />

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
            avatar={user?.avatarUrl}
          />

          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Update
            </Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
