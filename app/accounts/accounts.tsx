import { useContext, useState } from 'react'
import {
  VpButton,
  VpIcon,
  VpModal,
  VpModalTriggerButton,
  VpModalDialog,
  VpModalHeader,
  VpModalCloseButton,
  VpModalBody,
  VpModalFooter,
} from '@vtmn-play/react'
import { UsersContext } from '~/contexts/users'
import type { User } from '~/types/auth'
import AccountCard from '~/accounts/components/Card'
import FormAccount, {
  type AccountFormData,
} from '~/accounts/components/FormAccount'

export default function Accounts() {
  const { users, addUser, updateUser } = useContext(UsersContext)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User>()

  const openCreateModal = () => {
    setEditingUser(undefined)
    setIsUserModalOpen(true)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setIsUserModalOpen(true)
  }

  const closeUserModal = () => {
    setIsUserModalOpen(false)
    setEditingUser(undefined)
  }

  const saveUser = (data: AccountFormData) => {
    const user = { roles: [data.role], username: data.username }

    if (editingUser) {
      updateUser(editingUser.username, user)
    } else {
      addUser(user)
    }

    closeUserModal()
  }

  const formId = editingUser ? 'edit-user-form' : 'new-user-form'

  return (
    <main className="flex max-w-7xl w-full flex-col min-h-svh p-16 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="vp-title-m">Comptes</h1>
          <p className="vp-typography-body opacity-60">
            {users.length} comptes enregistrés.
          </p>
        </div>

        <VpModal open={isUserModalOpen} onClose={closeUserModal}>
          <VpModalTriggerButton onClick={openCreateModal}>
            <VpIcon name="add" />
            Ajouter un compte
          </VpModalTriggerButton>
          <VpModalDialog
            aria-label={editingUser ? 'Modifier un compte' : 'Créer un compte'}
          >
            <VpModalHeader>
              <h2>{editingUser ? 'Modifier le compte' : 'Créer un compte'}</h2>
              <VpModalCloseButton aria-label="Fermer le formulaire de compte" />
            </VpModalHeader>
            <VpModalBody className="p-8">
              <FormAccount
                key={editingUser?.username ?? 'new'}
                user={editingUser}
                onSubmit={saveUser}
              />
            </VpModalBody>
            <VpModalFooter className="flex justify-end gap-2">
              <VpButton type="submit" form={formId}>
                {editingUser ? 'Enregistrer' : 'Créer le compte'}
              </VpButton>
            </VpModalFooter>
          </VpModalDialog>
        </VpModal>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4">
        {users.map((user) => (
          <li key={user.username}>
            <AccountCard
              username={user.username}
              roles={user.roles}
              onEdit={() => openEditModal(user)}
            />
          </li>
        ))}
      </ul>
    </main>
  )
}
