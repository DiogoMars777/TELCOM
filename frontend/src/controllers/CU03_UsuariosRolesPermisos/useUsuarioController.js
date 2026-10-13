import { useState, useEffect } from 'react';
import { usuarioService } from '../../models/CU03_UsuariosRolesPermisos/usuarioModel';
import { describeApiError } from '../../services/apiClient';

const emptyNewUser = { name: '', email: '', password: '', role: 'Cajero / Cobranzas' };

export function useUsuarioController() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);         // Error de carga del listado
  const [formError, setFormError] = useState(null);  // Error al crear un usuario
  const [actionError, setActionError] = useState(null); // Error al activar/desactivar o cambiar rol
  const [actingId, setActingId] = useState(null);       // Usuario con una acción en curso
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState(emptyNewUser);

  const loadUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const { usuarios: data, roles: rolesData } = await usuarioService.fetchUsuariosYRoles();
      setUsuarios(data);
      setRoles(rolesData);
    } catch (e) {
      setUsuarios([]);
      setRoles([]);
      setError(describeApiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    try {
      await usuarioService.createUsuario(newUser);
      // Solo se cierra el modal y se recarga cuando el backend confirmó.
      setShowModal(false);
      setNewUser(emptyNewUser);
      await loadUsuarios();
    } catch (err) {
      setFormError(describeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Activar / desactivar un usuario (PUT /cu03/usuarios/{id}).
  const toggleActivo = async (usuario) => {
    setActionError(null);
    setLoading(true);
    setActingId(usuario.id);
    try {
      await usuarioService.actualizarUsuario(usuario.id, { activo: !usuario.activo });
      await loadUsuarios();
    } catch (err) {
      setActionError(describeApiError(err));
    } finally {
      setLoading(false);
      setActingId(null);
    }
  };

  // Cambiar el rol de un usuario (PUT /cu03/usuarios/{id}/rol).
  const cambiarRol = async (usuario, rolId) => {
    if (!rolId || Number(rolId) === Number(usuario.rol_id ?? usuario.rol?.id)) return;
    setActionError(null);
    setLoading(true);
    setActingId(usuario.id);
    try {
      await usuarioService.cambiarRol(usuario.id, Number(rolId));
      await loadUsuarios();
    } catch (err) {
      setActionError(describeApiError(err));
    } finally {
      setLoading(false);
      setActingId(null);
    }
  };

  return {
    usuarios,
    roles,
    loading,
    error,
    formError,
    actionError,
    actingId,
    showModal,
    setShowModal,
    newUser,
    setNewUser,
    handleCreate,
    toggleActivo,
    cambiarRol,
    reload: loadUsuarios,
  };
}
