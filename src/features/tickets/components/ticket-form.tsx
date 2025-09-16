import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldErrors } from 'react-hook-form';
import Input from '../../../shared/components/input';
import Button from '../../../shared/components/button';
import Select from '../../../shared/components/select';
import PaginatedDatalist from '../../../shared/components/paginated-datalist';
import useTicketSchema, { type TicketFormData } from '../schemas/ticket-schema';
import { getEmployees } from '../../users/services/get';
import useUser from '../../../shared/hooks/use-user';

interface TicketFormProps {
  defaultValues?: Partial<TicketFormData>;
  onSubmit: (data: TicketFormData) => void;
  onInvalid?: (errors: FieldErrors<TicketFormData>) => void;
  isPending?: boolean;
  submitLabel?: string;
  userValue?: any; // type according to PaginatedDatalist value
  type?: 'new' | 'edit';
}

const TicketForm: React.FC<TicketFormProps> = ({
  defaultValues,
  onSubmit,
  onInvalid,
  isPending,
  submitLabel,
  userValue,
  type,
}) => {
  const { t } = useTranslation();
  const { ticketSchema } = useTicketSchema();
  const { isPending: myPending, data: myData, isError: myError } = useUser();
  const isEmployee = myData?.type === 'employee';
  const id = myData?.id;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: '',
      state: null,
      user: null,
      ...defaultValues, // merge incoming defaults
    },
  });

  const watchedValues = watch();

  // Log whenever any value changes
  useEffect(() => {
    console.log('Form values changed:', watchedValues);
  }, [watchedValues]);

  console.log(defaultValues);

  const ticketStatus = [
    { label: t('tickets.text.completed'), value: 'completed' },
    { label: t('tickets.text.open'), value: 'open' },
    { label: t('tickets.text.pending'), value: 'pending' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      {/* <div className="grid gap-4 grid-cols-1 md:[grid-template-columns:repeat(auto-fit,minmax(400px,1fr))]"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <Input
          label={t('tickets.text.name')}
          placeholder={t('tickets.text.namePlaceholder')}
          type="text"
          {...register('name')}
          errors={errors}
          name="name"
          className="w-full"
          disabled={isPending || isEmployee}
        />

        {/* State */}
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Select
              label={t('tickets.text.state')}
              placeholder={t('tickets.text.statePlaceholder')}
              options={ticketStatus}
              value={
                field.value
                  ? {
                      label: t(`tickets.text.${field.value}`),
                      value: field.value,
                    }
                  : null
              }
              onChange={(opt) => field.onChange(opt?.value ?? null)}
              errors={errors}
              name="state"
            />
          )}
        />

        {/* User */}
        <Controller
          name="user"
          control={control}
          render={({ field }) => (
            <PaginatedDatalist
              label={t('tickets.text.user')}
              placeholder={t('tickets.text.userPlaceholder')}
              queryKey="employees"
              fetchFunction={getEmployees}
              itemKey="name"
              errors={errors}
              name="user"
              value={userValue}
              disabled={isEmployee}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <Button className="mt-[32px]" disabled={isPending || !isDirty}>
        {isPending
          ? type === 'new'
            ? t('general.pending.creating')
            : t('general.pending.editing')
          : type === 'new'
          ? t('general.text.create')
          : t('general.text.edit')}
      </Button>
    </form>
  );
};

export default TicketForm;

