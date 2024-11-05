import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Form from '@/components/Common/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateBorrowForm, createBorrowSchema } from './schema';
import { useNotifications } from '@toolpad/core';
import { IDevice, useFetchAllBorrowAbleDevice } from '@/data/device';
import { borrowService } from '@/data/borrow';

type CreateBorrowModalProps = {
  onComplete: () => void;
};

export function CreateBorrowModal({ onComplete }: CreateBorrowModalProps) {
  const notifications = useNotifications();
  const { data: borrowAbleList } = useFetchAllBorrowAbleDevice();

  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBorrowForm>({
    resolver: yupResolver(createBorrowSchema),
    defaultValues: {},
  });

  const handleCreateBorrow = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onHandleSubmit = async (data: CreateBorrowForm) => {
    if (!data) return;

    try {
      await borrowService.createBorrow({
        deviceId: data.deviceId,
        borrowedAt: data.borrowedAt,
        note: data.note,
      });
      notifications.show('Create Success', {
        severity: 'success',
      });
      onComplete();
      handleClose();
    } catch (error) {
      notifications.show('Can not borrow', {
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
          onClick={handleCreateBorrow}
        >
          Create Borrow
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <Form onSubmit={handleSubmit(onHandleSubmit)}>
            <Form.Autocomplete
              id="DeviceId"
              name="deviceId"
              label="Device"
              control={control}
              error={errors.deviceId}
              options={(borrowAbleList?.data ?? [])?.map((device: IDevice) => ({
                value: device.id,
                label: device.name,
              }))}
            />

            <Form.Input id="Note" name="note" label="Node" control={control} error={errors.note} />

            <Form.Input
              id="Borrow At"
              type="date"
              name="borrowedAt"
              label="Borrow At"
              control={control}
              error={errors.borrowedAt}
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
