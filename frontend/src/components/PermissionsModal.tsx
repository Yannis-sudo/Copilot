import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import PermissionToggle from "./PermissionToggle";
import UITextInput from "./UITextInput";
import UIButton from "./UIButton";
import useTheme from "../hooks/useTheme";
import { getPermissions, updatePermissions } from "../api";
import type { UserPermission, PermissionData, ListInfo } from "../types/api";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: ListInfo;
  userEmail: string;
  userPassword: string;
}

export default function PermissionsModal({
  isOpen,
  onClose,
  list,
  userEmail,
  userPassword
}: PermissionsModalProps): React.ReactElement {
  const theme = useTheme();
  const [users, setUsers] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Load permissions when modal opens
  useEffect(() => {
    if (isOpen && list) {
      loadPermissions();
    }
  }, [isOpen, list]);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPermissions({
        email: userEmail,
        password: userPassword,
        list_id: list.list_id
      });

      setUsers(response.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (targetUserEmail: string, permissionType: keyof PermissionData, newValue: boolean) => {
    try {
      const user = users.find(u => u.email === targetUserEmail);
      if (!user) return;

      const updatedPermissions = {
        ...user.permissions,
        [permissionType]: newValue
      };

      await updatePermissions({
        email: userEmail, // Use authenticated user's email
        password: userPassword, // Use authenticated user's password
        list_id: list.list_id,
        target_user_email: targetUserEmail, // Use target user's email
        permissions: {
          [permissionType]: newValue
        }
      });

      // Update local state
      setUsers(prev => prev.map(u => 
        u.email === targetUserEmail 
          ? { ...u, permissions: updatedPermissions }
          : u
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update permission");
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail.trim()) {
      setSearchError("Please enter an email address");
      return;
    }

    try {
      setAddingUser(true);
      setSearchError(null);

      // Add default permissions for new user
      const defaultPermissions: PermissionData = {
        can_view: true,
        can_create: false,
        can_edit: false,
        can_delete: false
      };

      await updatePermissions({
        email: userEmail,
        password: userPassword,
        list_id: list.list_id,
        target_user_email: newUserEmail.trim(),
        permissions: defaultPermissions
      });

      // Add to local state
      setUsers(prev => [...prev, {
        email: newUserEmail.trim(),
        username: newUserEmail.split('@')[0], // Use email prefix as username
        permissions: defaultPermissions
      }]);

      setNewUserEmail("");
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Failed to add user");
    } finally {
      setAddingUser(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Permissions">
      <div className="w-full">
        {/* List Information Section */}
        <div 
          className="p-4 rounded-lg mb-6"
          style={{ 
            backgroundColor: theme.colors.alpha08,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: theme.colors.textPrimary }}
          >
            {list.list_name}
          </h3>
          {list.description && (
            <p 
              className="text-sm mb-3"
              style={{ color: theme.colors.textSecondary }}
            >
              {list.description}
            </p>
          )}
          <div className="flex gap-4 text-xs">
            {list.created_at && (
              <div style={{ color: theme.colors.textSecondary }}>
                Created: {new Date(list.created_at).toLocaleDateString()}
              </div>
            )}
            <div style={{ color: theme.colors.textSecondary }}>
              Admins: {list.admins?.length || 0}
            </div>
          </div>
        </div>

        {error && (
          <div 
            className="p-3 rounded-lg mb-4 text-sm"
            style={{ backgroundColor: `${theme.colors.primary}20`, color: '#dc2626' }}
          >
            {error}
          </div>
        )}

        {/* Add new user section */}
        <div className="mb-6">
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: theme.colors.textPrimary }}
          >
            Add User
          </h3>
          <div className="flex gap-2">
            <UITextInput
              placeholder="Enter email address"
              value={newUserEmail}
              onChange={(e) => {
                setNewUserEmail(e.target.value);
                setSearchError(null);
              }}
              error={searchError || undefined}
              className="flex-1"
            />
            <UIButton
              onClick={handleAddUser}
              disabled={addingUser || !newUserEmail.trim()}
              variant="primary"
              className="px-4"
            >
              {addingUser ? "Adding..." : "Add"}
            </UIButton>
          </div>
        </div>

        {/* Existing users permissions */}
        <div>
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: theme.colors.textPrimary }}
          >
            Current Permissions
          </h3>
          
          {loading ? (
            <div 
              className="text-center py-4"
              style={{ color: theme.colors.textSecondary }}
            >
              Loading permissions...
            </div>
          ) : users.length === 0 ? (
            <div 
              className="text-center py-4"
              style={{ color: theme.colors.textSecondary }}
            >
              No users have permissions for this list yet.
            </div>
          ) : (
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {/* Admins Section */}
              {(() => {
                const adminUsers = users.filter(user => list.admins?.includes(user.email));
                if (adminUsers.length === 0) return null;
                
                return (
                  <div>
                    <h4 
                      className="text-md font-semibold mb-3 flex items-center gap-2"
                      style={{ color: theme.colors.primary }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Admins ({adminUsers.length})
                    </h4>
                    <div className="space-y-2">
                      {adminUsers.map((user) => (
                        <div 
                          key={user.email}
                          className="p-3 rounded-lg border"
                          style={{ 
                            backgroundColor: `${theme.colors.primary}10`,
                            borderColor: `${theme.colors.primary}30`
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div 
                                className="font-medium"
                                style={{ color: theme.colors.primary }}
                              >
                                {user.username}
                              </div>
                              <div 
                                className="text-sm"
                                style={{ color: theme.colors.textSecondary }}
                              >
                                {user.email}
                              </div>
                            </div>
                            <div 
                              className="text-xs px-2 py-1 rounded-full"
                              style={{ 
                                backgroundColor: theme.colors.primary,
                                color: 'white'
                              }}
                            >
                              Full Access
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Regular Users Section */}
              {(() => {
                const regularUsers = users.filter(user => !list.admins?.includes(user.email));
                if (regularUsers.length === 0) return null;
                
                return (
                  <div>
                    <h4 
                      className="text-md font-semibold mb-3"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      Users with Permissions ({regularUsers.length})
                    </h4>
                    <div className="space-y-3">
                      {regularUsers.map((user) => (
                        <div 
                          key={user.email}
                          className="p-3 rounded-lg border"
                          style={{ 
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div 
                                className="font-medium"
                                style={{ color: theme.colors.textPrimary }}
                              >
                                {user.username}
                              </div>
                              <div 
                                className="text-sm"
                                style={{ color: theme.colors.textSecondary }}
                              >
                                {user.email}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <PermissionToggle
                              label="Can View"
                              checked={user.permissions.can_view}
                              onChange={(checked) => handlePermissionChange(user.email, 'can_view', checked)}
                            />
                            <PermissionToggle
                              label="Can Create"
                              checked={user.permissions.can_create}
                              onChange={(checked) => handlePermissionChange(user.email, 'can_create', checked)}
                            />
                            <PermissionToggle
                              label="Can Edit"
                              checked={user.permissions.can_edit}
                              onChange={(checked) => handlePermissionChange(user.email, 'can_edit', checked)}
                            />
                            <PermissionToggle
                              label="Can Delete"
                              checked={user.permissions.can_delete}
                              onChange={(checked) => handlePermissionChange(user.email, 'can_delete', checked)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <UIButton
            onClick={onClose}
            variant="secondary"
            className="px-6"
          >
            Close
          </UIButton>
        </div>
      </div>
    </Modal>
  );
}
