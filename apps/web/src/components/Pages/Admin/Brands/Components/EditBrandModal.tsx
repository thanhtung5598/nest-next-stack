import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Form from '@/components/Common/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateBrandForm, createBrandSchema } from './schema';
import { brandsService, IBrand } from '@/data/brand';

type EditBrandModalProps = {
  brand?: IBrand;
  onClose?: () => void;
  onComplete: () => void;
};

export function EditBrandModal({ brand, onComplete, onClose }: EditBrandModalProps) {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateBrandForm>({
    resolver: yupResolver(createBrandSchema),
  });

  useEffect(() => {
    if (brand) {
      setOpen(true);
      setValue('name', brand.name);
      setValue('code', brand.code);
    }
  }, [brand]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const onHandleSubmit = async (data: CreateBrandForm) => {
    if (!data || !brand) return;

    try {
      await brandsService.updateBrand(brand.id, {
        name: data.name,
        code: data.code,
      });
      onComplete();
      handleClose();
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Brand</DialogTitle>
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
