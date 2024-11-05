import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Form from '@/components/Common/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateDepartmentForm, createDepartmentSchema } from './schema';
import { useNotifications } from '@toolpad/core';
import { departmentService } from '@/data/department';

type CreateDepartmentModalProps = {
  onComplete: () => void;
};

export function CreateDepartmentModal({ onComplete }: CreateDepartmentModalProps) {
  const notifications = useNotifications();

  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDepartmentForm>({
    resolver: yupResolver(createDepartmentSchema),
    defaultValues: {},
  });

  const handleCreateDepartment = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onHandleSubmit = async (data: CreateDepartmentForm) => {
    if (!data) return;

    try {
      await departmentService.createDepartment({
        name: data.name,
        code: data.code,
      });
      notifications.show('Create Success', {
        severity: 'success',
      });
      onComplete();
      handleClose();
    } catch (error) {
      notifications.show('Code Is Duplicate', {
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
          onClick={handleCreateDepartment}
        >
          Add Department
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Department</DialogTitle>
        <DialogContent>
          <Form onSubmit={handleSubmit(onHandleSubmit)}>
            <Form.Input id="Name" name="name" label="Name" control={control} error={errors.name} />
            <Form.Input id="Code" name="code" label="Code" control={control} error={errors.code} />
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
