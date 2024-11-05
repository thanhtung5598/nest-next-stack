import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Form from '@/components/Common/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateBrandForm, createBrandSchema } from './schema';
import { brandsService } from '@/data/brand';
import { useNotifications } from '@toolpad/core';

type CreateBrandModalProps = {
  onComplete: () => void;
};

export function CreateBrandModal({ onComplete }: CreateBrandModalProps) {
  const notifications = useNotifications();

  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBrandForm>({
    resolver: yupResolver(createBrandSchema),
    defaultValues: {},
  });

  const handleCreateBrand = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onHandleSubmit = async (data: CreateBrandForm) => {
    if (!data) return;

    try {
      await brandsService.createBrand({
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
          onClick={handleCreateBrand}
        >
          Add Brand
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Brand</DialogTitle>
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
