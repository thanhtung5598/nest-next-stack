import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Form from '@/components/Common/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateDepartmentForm, createDepartmentSchema } from './schema';
import { departmentService, IDepartment } from '@/data/department';

type EditDepartmentModalProps = {
  onComplete: () => void;
  onClose: () => void;
  department?: IDepartment;
};

export function EditDepartmentModal({ department, onComplete, onClose }: EditDepartmentModalProps) {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateDepartmentForm>({
    resolver: yupResolver(createDepartmentSchema),
  });

  useEffect(() => {
    if (department) {
      setOpen(true);
      setValue('name', department.name);
      setValue('code', department.code);
    }
  }, [department]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const onHandleSubmit = async (data: CreateDepartmentForm) => {
    if (!data || !department) return;

    try {
      await departmentService.updateDepartment(department.id, {
        name: data.name,
        code: data.code,
      });
      onComplete();
      handleClose();
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Department</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit(onHandleSubmit)}>
          <Form.Input id="Name" name="name" label="Name" control={control} error={errors.name} />
          <Form.Input id="Code" name="code" label="Code" control={control} error={errors.code} />
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
