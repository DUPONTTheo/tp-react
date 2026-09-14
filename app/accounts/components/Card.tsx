import { useContext } from 'react'
import { UsersContext } from '~/contexts/users'
import {
  VpDivider,
  VpBadge,
  VpIcon,
  VpIconButton,
  VpModal,
  VpModalDialog,
  VpModalHeader,
  VpModalCloseButton,
  VpModalBody,
  VpModalFooter,
  VpButton,
} from '@vtmn-play/react'
import { useState } from 'react'

export default function AccountCard({
  username,
  roles,
  onEdit,
}: {
  username: string
  roles?: string[]
  onEdit: () => void
}) {
  const { deleteUser } = useContext(UsersContext)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  return (
    <div className="border border-vp-rock-100 rounded-lg p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="inline-flex items-center gap-2">
          <VpIcon name="user" />
          <p>{username}</p>
        </div>

        <div className="inline-flex items-center gap-1">
          <VpIconButton size="small" onClick={onEdit}>
            <VpIcon name="edit" />
          </VpIconButton>
          <VpIconButton
            variant="negative"
            size="small"
            onClick={() => setIsDeleteOpen(true)}
          >
            <VpIcon name="delete-bin" />
          </VpIconButton>

          <VpModal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
            <VpModalDialog aria-label="Modal de dialogue de suppression de compte">
              <VpModalHeader>
                <h2>Supprimer le compte</h2>
                <VpModalCloseButton aria-label="Fermer le modal de suppression de compte" />
              </VpModalHeader>
              <VpModalBody className="p-8">
                <p>Êtes-vous sûr de vouloir supprimer ce compte ?</p>
              </VpModalBody>
              <VpModalFooter className="flex justify-end gap-2">
                <VpButton
                  variant="secondary"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Annuler
                </VpButton>
                <VpButton
                  variant="negative"
                  onClick={() => {
                    deleteUser(username)
                    setIsDeleteOpen(false)
                  }}
                >
                  Supprimer
                </VpButton>
              </VpModalFooter>
            </VpModalDialog>
          </VpModal>
        </div>
      </div>

      <VpDivider />

      <div className="flex flex-wrap gap-2">
        {roles?.map((role) => (
          <VpBadge key={role}>{role}</VpBadge>
        ))}
      </div>
    </div>
  )
}
