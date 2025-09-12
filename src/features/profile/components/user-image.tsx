import type { UseMutationResult } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { queryClient } from '../../../lib/tanstackquery';
import Button from '../../../shared/components/button';
import Modal from '../../../shared/components/modal';
import { useTranslation } from 'react-i18next';

interface UserImageProps {
  imageUrl: string | null;
  name: string;
  updateMutation: UseMutationResult<any, Error, File>; // mutation with File input
  deleteMutation: UseMutationResult<any, Error, void>; // mutation with no input
}

const UserImage: React.FC<UserImageProps> = ({
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

  // handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowUpdateModal(true);
    }
    e.target.value = '';
  };

  const handleConfirmUpdate = async () => {
    if (selectedFile) {
      updateMutation.mutate(selectedFile, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ['me'] });
          setShowUpdateModal(false);
          setSelectedFile(null);
          setPreviewUrl(null);
          toast.success(t('profile.success.imageUpdate'));
        },
        onError: () => {
          toast.success(t('profile.errors.imageUpdate'));
        },
      });
    }
  };

  const handleConfirmDelete = async () => {
    deleteMutation.mutate(undefined, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['me'] });
        setShowDeleteModal(false);
        toast.success(t('profile.success.imageDelete'));
      },
      onError: () => {
        toast.success(t('profile.errors.imageDelete'));
      },
    });
  };

  return (
    <div className="flex  items-center gap-4">
      {/* Profile Image */}
      <div className="w-[100px] h-[100px] rounded-level1 overflow-hidden bg-main text-second-background flex justify-center items-center font-bold text-[32px] ">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="User"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center ">
            {`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-col">
        <Button
          variant="inverse"
          onClick={() => setShowDeleteModal(true)}
          className=""
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
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}>
          <div className="">
            <h2 className="text-lg font-semibold mb-4">
              {t('profile.text.deleteImageHead')}
            </h2>
            <p className="mb-6">{t('profile.text.deleteImageDescription')}</p>
            <div className="flex justify-center gap-3 flex-col sm:flex-row">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="inverse"
                disabled={deleteMutation.isPending}>
                {t('general.text.cancel')}
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}>
                {deleteMutation.isPending
                  ? t('general.pending.deleting')
                  : t('general.text.delete')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Modal */}
      {showUpdateModal && previewUrl && (
        <Modal
          isOpen={showUpdateModal && !!previewUrl}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedFile(null);
            setPreviewUrl(null);
          }}>
          <div className="flex flex-col items-center">
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
                disabled={updateMutation.isPending}
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}>
                {t('general.text.cancel')}
              </Button>
              <Button
                onClick={handleConfirmUpdate}
                disabled={updateMutation.isPending}>
                {updateMutation.isPending
                  ? t('general.pending.confirming')
                  : t('general.text.confirm')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserImage;

