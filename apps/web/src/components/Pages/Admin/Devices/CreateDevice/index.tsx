'use client';

import React from 'react';
import { Button, DialogActions } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Form from '@/components/Common/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateDeviceForm, createDeviceSchema } from './schema';
import { PageContainer } from '@toolpad/core';
import { ROUTE } from '@/libs/enum';
import { useRouter } from 'next/navigation';
import { useFetchAllCategories } from '@/data/category';
import { deviceService } from '@/data/device';

export function CreateDevice() {
  const router = useRouter();
  const { data: categoryList } = useFetchAllCategories();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDeviceForm>({
    resolver: yupResolver(createDeviceSchema),
    defaultValues: {},
  });

  const onHandleSubmit = async (data: CreateDeviceForm) => {
    if (!data) return;

    const { name, sku, status, note, categoryId, buyAt, price, priceVat, serialNumber } = data;

    const payload: CreateDeviceForm = {
      name,
      sku,
      note: note || '',
      serialNumber,
      status,
      categoryId: categoryId,
      buyAt,
      price,
      priceVat,
    };

    try {
      await deviceService.createDevice(payload);
      router.replace(ROUTE.DEVICES);
    } catch (error) {
      console.error('Error creating device:', error);
    }
  };

  return (
    <PageContainer
      style={{ maxWidth: 600, marginLeft: 'unset' }}
      breadcrumbs={[{ title: 'Create Device', path: ROUTE.DEVICES }]}
    >
      <Form onSubmit={handleSubmit(onHandleSubmit)}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Form.Input id="SKU" name="sku" label="SKU" control={control} error={errors.sku} />
          </Grid>
          <Grid size={6}>
            <Form.Input id="Name" name="name" label="Name" control={control} error={errors.name} />
          </Grid>
        </Grid>
        <Form.Input
          id="SerialNumber"
          name="serialNumber"
          label="SerialNumber"
          control={control}
          error={errors.serialNumber}
        />
        <Form.Input
          id="Buy At"
          type="date"
          name="buyAt"
          label="Buy At"
          control={control}
          error={errors.buyAt}
        />
        <Grid container spacing={2}>
          <Grid size={6}>
            <Form.Input
              id="Price"
              type="number"
              name="price"
              label="Price"
              control={control}
              error={errors.price}
            />
          </Grid>
          <Grid size={6}>
            <Form.Input
              id="Price VAT"
              type="number"
              name="priceVat"
              label="Price VAT"
              control={control}
              error={errors.priceVat}
            />
          </Grid>
        </Grid>
        <Form.Autocomplete
          id="Category"
          name="categoryId"
          label="Category"
          control={control}
          error={errors.categoryId}
          options={categoryList?.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />
        <Form.Autocomplete
          id="Status"
          name="status"
          label="Status"
          control={control}
          error={errors.status}
          options={[
            {
              label: 'In Stock',
              value: 'in_stock',
            },
            {
              label: 'Maintenance',
              value: 'maintenance',
            },
            {
              label: 'Retired',
              value: 'retired',
            },
          ]}
        />
        <DialogActions>
          <Button onClick={() => router.replace(ROUTE.DEVICES)} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Create
          </Button>
        </DialogActions>
      </Form>
    </PageContainer>
  );
}
