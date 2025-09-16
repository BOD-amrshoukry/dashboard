import { useForm, type FieldErrors } from 'react-hook-form';
import type { EmployeeFormData } from '../schemas/employee-schema';
import { useTranslation } from 'react-i18next';
import useEmployeeSchema from '../schemas/employee-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import Input from '../../../shared/components/input';
import Button from '../../../shared/components/button';

interface ManagerFormProps {
  defaultValues?: Partial<EmployeeFormData>;
  onSubmit: (data: EmployeeFormData) => void;
  onInvalid?: (errors: FieldErrors) => void;
  isPending?: boolean;
  submitLabel?: string;
  type: 'edit' | 'new';
}

const EmployeeForm: React.FC<ManagerFormProps> = ({
  defaultValues,
  onSubmit,
  onInvalid,
  isPending,
  type,
}) => {
  const { t } = useTranslation();
  const { employeeSchema } = useEmployeeSchema();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      ...defaultValues, // merge incoming defaults
    },
  });

  const watchedValues = watch();

  // Log whenever any value changes
  useEffect(() => {
    console.log('Form values changed:', watchedValues);
  }, [watchedValues]);

  console.log(defaultValues);

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      {/* <div className="grid gap-4 grid-cols-1 md:[grid-template-columns:repeat(auto-fit,minmax(400px,1fr))]"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <Input
          label={t('users.text.name')}
          placeholder={t('users.text.namePlaceholder')}
          type="text"
          {...register('name', {
            setValueAs: (value) => value.trim(),
          })}
          errors={errors}
          name="name"
          className="w-full"
          disabled={isPending}
        />

        <Input
          label={t('users.text.username')}
          placeholder={t('users.text.usernamePlaceholder')}
          type="text"
          {...register('username', {
            setValueAs: (value) => value.trim(),
          })}
          errors={errors}
          name="username"
          className="w-full"
          disabled={isPending || type === 'edit'}
        />
        <Input
          label={t('users.text.email')}
          placeholder={t('users.text.emailPlaceholder')}
          type="email"
          {...register('email', {
            setValueAs: (value) => value.trim().toLowerCase(),
          })}
          errors={errors}
          name="email"
          className="w-full"
          disabled={isPending || type === 'edit'}
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

export default EmployeeForm;

