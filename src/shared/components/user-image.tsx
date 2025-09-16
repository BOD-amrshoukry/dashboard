import type { UseMutationResult } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { queryClient } from '../../lib/tanstackquery';
import Button from './button';
import Modal from './modal';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/use-socket';
import useSendNotification from '../../features/notifications/hooks/use-send-notification';

interface UserImageProps {
  id: number;
  type: string; // e.g., 'employees' or 'managers'
  imageUrl: string | null;
  name: string;
  updateMutation?: UseMutationResult<any, Error, { id: number; file: File }>;
  deleteMutation?: UseMutationResult<any, Error, number>;
  viewOnly?: boolean;
}

const UserImage: React.FC<UserImageProps> = ({
  viewOnly = false,
  id,
  type,
  imageUrl,
  name,
  updateMutation,
  deleteMutation,
}) => {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { socket } = useSocket();
  const { mutate: sendNotification } = useSendNotification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowUpdateModal(true);
    }
    e.target.value = '';
  };

  const handleConfirmUpdate = () => {
    if (!selectedFile) return;

    if (updateMutation) {
      updateMutation.mutate(
        { id, file: selectedFile },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [type] });
            setShowUpdateModal(false);
            setSelectedFile(null);
            setPreviewUrl(null);
            toast.success(t('profile.success.imageUpdate'));

            if (type === 'employees') {
              sendNotification({
                userId: id,
                title: t('notifications.text.editHead'),
                message: t('notifications.text.editDescription'),
              });

              socket?.emit('sendNotification', {
                recipientId: id,
                data: {
                  title: t('notifications.text.editHead'),
                  message: t('notifications.text.editDescription'),
                },
              });
            }
          },
          onError: () => {
            toast.error(t('profile.errors.imageUpdate'));
          },
        },
      );
    }
  };

  const handleConfirmDelete = () => {
    if (deleteMutation) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [type] });
          setShowDeleteModal(false);
          toast.success(t('profile.success.imageDelete'));

          sendNotification({
            userId: id,
            title: t('notifications.text.editHead'),
            message: t('notifications.text.editDescription'),
          });

          socket?.emit('sendNotification', {
            recipientId: id,
            data: {
              title: t('notifications.text.editHead'),
              message: t('notifications.text.editDescription'),
            },
          });
        },
        onError: () => {
          toast.error(t('profile.errors.imageDelete'));
        },
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Profile Image */}
      <div className="w-[100px] h-[100px] rounded-level1 overflow-hidden bg-main text-second-background flex justify-center items-center font-bold text-[32px]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="User"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {`${name.split(' ')[0][0]}${
              name.split(' ')[1]?.[0] ?? ''
            }`.toUpperCase()}
          </div>
        )}
      </div>

      {!viewOnly && (
        <div className="flex gap-4 flex-col">
          {/* Delete / Update Buttons */}
          <Button
            variant="inverse"
            onClick={() => setShowDeleteModal(true)}
            disabled={!imageUrl}>
            {t('profile.text.deleteImage')}
          </Button>
          <Button type="label">
            {t('profile.text.updateImage')}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </Button>

          {/* Delete Modal */}
          {showDeleteModal && (
            <Modal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}>
              <h2 className="text-lg font-semibold mb-4">
                {t('profile.text.deleteImageHead')}
              </h2>
              <p className="mb-6">{t('profile.text.deleteImageDescription')}</p>
              <div className="flex justify-center gap-3 flex-col sm:flex-row">
                <Button
                  variant="inverse"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteMutation && deleteMutation.isPending}>
                  {t('general.text.cancel')}
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation && deleteMutation.isPending}>
                  {deleteMutation && deleteMutation.isPending
                    ? t('general.pending.deleting')
                    : t('general.text.delete')}
                </Button>
              </div>
            </Modal>
          )}

          {/* Update Modal */}
          {showUpdateModal && previewUrl && (
            <Modal
              isOpen={showUpdateModal}
              onClose={() => {
                setShowUpdateModal(false);
                setSelectedFile(null);
                setPreviewUrl(null);
              }}>
              <h2 className="text-lg font-semibold mb-4">
                {t('profile.text.previewImage')}
              </h2>
              <div className="w-32 h-32 rounded-full overflow-hidden border mb-6">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3 flex-col sm:flex-row">
                <Button
                  variant="inverse"
                  disabled={updateMutation && updateMutation.isPending}
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}>
                  {t('general.text.cancel')}
                </Button>
                <Button
                  onClick={handleConfirmUpdate}
                  disabled={updateMutation && updateMutation.isPending}>
                  {updateMutation && updateMutation.isPending
                    ? t('general.pending.confirming')
                    : t('general.text.confirm')}
                </Button>
              </div>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default UserImage;

