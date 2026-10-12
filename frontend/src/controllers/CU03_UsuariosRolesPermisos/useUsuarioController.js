import { useState, useEffect } from 'react';
import { usuarioService, mockUsuarios } from '../../models/CU03_UsuariosRolesPermisos/usuarioModel';

export function useUsuarioController() {
  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Cajero / Cobranzas' });

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const data = await usuarioService.fetchUsuarios();
      setUsuarios(data);
    } catch (e) {
      console.error(e);
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
    try {
      await usuarioService.createUsuario(newUser);
      setUsuarios(prev => [...prev, { ...newUser, id: Date.now(), activo: true }]);
      setShowModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'Cajero / Cobranzas' });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarios,
    loading,
    showModal,
    setShowModal,
    newUser,
    setNewUser,
    handleCreate,
    reload: loadUsuarios,
  };
}
