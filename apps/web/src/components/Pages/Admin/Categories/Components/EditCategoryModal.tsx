import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Form from '@/components/Common/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateCategoryForm, createCategorySchema } from './schema';
import { categoryService, ICategory } from '@/data/category';

type EditCategoryModalProps = {
  category?: ICategory;
  onClose?: () => void;
  onComplete: () => void;
};

export function EditCategoryModal({ category, onComplete, onClose }: EditCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateCategoryForm>({
    resolver: yupResolver(createCategorySchema),
  });

  useEffect(() => {
    if (category) {
      setOpen(true);
      setValue('name', category.name);
      setValue('code', category.code);
    }
  }, [category]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const onHandleSubmit = async (data: CreateCategoryForm) => {
    if (!data || !category) return;

    try {
      await categoryService.updateCategory(category.id, {
        name: data.name,
        code: data.code,
      });
      onComplete();
      handleClose();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Category</DialogTitle>
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
