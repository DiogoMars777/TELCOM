<?php

namespace Database\Seeders;

use App\Models\CU03_UsuariosRolesPermisos\Permiso;
use App\Models\CU03_UsuariosRolesPermisos\Rol;
use App\Models\CU04_ZonasCobertura\ZonaCobertura;
use App\Models\CU05_RegistrarCliente\Cliente;
use App\Models\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear Usuario Administrador Principal
        $admin = User::firstOrCreate(
            ['email' => 'admin@telcom.com'],
            [
                'name'     => 'Administrador Senior TELCOM',
                'password' => Hash::make('password123'),
            ]
        );

        // 2. Roles y Permisos (CU03)
        $rolAdmin = Rol::firstOrCreate(
            ['slug' => 'admin'],
            ['nombre' => 'Administrador de Sistema', 'descripcion' => 'Acceso total a todos los CUs']
        );
        $rolCajero = Rol::firstOrCreate(
            ['slug' => 'cajero'],
            ['nombre' => 'Cajero / Cobranzas', 'descripcion' => 'Gestión de pagos y mensualidades']
        );
        $rolTecnico = Rol::firstOrCreate(
            ['slug' => 'tecnico'],
            ['nombre' => 'Soporte Técnico', 'descripcion' => 'Instalaciones, cortes y reactivaciones']
        );

        $permisos = [
            ['slug' => 'auth.login', 'nombre' => 'Iniciar Sesión', 'modulo' => 'CU01'],
            ['slug' => 'auditoria.view', 'nombre' => 'Consultar Bitácora', 'modulo' => 'CU02'],
            ['slug' => 'usuarios.manage', 'nombre' => 'Gestionar Usuarios', 'modulo' => 'CU03'],
            ['slug' => 'zonas.manage', 'nombre' => 'Gestionar Zonas', 'modulo' => 'CU04'],
            ['slug' => 'clientes.create', 'nombre' => 'Registrar Cliente', 'modulo' => 'CU05'],
            ['slug' => 'clientes.view', 'nombre' => 'Consultar Clientes', 'modulo' => 'CU06'],
            ['slug' => 'clientes.update', 'nombre' => 'Actualizar y Baja Cliente', 'modulo' => 'CU07'],
            ['slug' => 'servicios.manage', 'nombre' => 'Registrar/Activar Servicio', 'modulo' => 'CU08'],
            ['slug' => 'mensualidades.generate', 'nombre' => 'Generar Mensualidades', 'modulo' => 'CU09'],
            ['slug' => 'pagos.register', 'nombre' => 'Gestionar Pagos', 'modulo' => 'CU10'],
            ['slug' => 'pagos.history', 'nombre' => 'Historial de Pagos', 'modulo' => 'CU11'],
            ['slug' => 'alertas.view', 'nombre' => 'Alertas de Vencimiento', 'modulo' => 'CU12'],
            ['slug' => 'cortes.list', 'nombre' => 'Listado Servicios Corte', 'modulo' => 'CU13'],
            ['slug' => 'cortes.register', 'nombre' => 'Registrar Corte', 'modulo' => 'CU14'],
            ['slug' => 'reactivaciones.manage', 'nombre' => 'Gestionar Reactivaciones', 'modulo' => 'CU15'],
        ];

        foreach ($permisos as $p) {
            $perm = Permiso::firstOrCreate(['slug' => $p['slug']], $p);
            $rolAdmin->permisos()->syncWithoutDetaching([$perm->id]);
        }

        // 3. Zonas de Cobertura iniciales (CU04)
        $zonaNorte = ZonaCobertura::firstOrCreate(
            ['codigo' => 'ZON-NORTE'],
            [
                'nombre'          => 'Zona Norte - Fibra Óptica Troncal',
                'ciudad'          => 'La Paz / El Alto',
                'tecnologia'      => 'FTTH GPON',
                'capacidad_nodos' => 500,
                'activo'          => true,
            ]
        );
        $zonaSur = ZonaCobertura::firstOrCreate(
            ['codigo' => 'ZON-SUR'],
            [
                'nombre'          => 'Zona Sur - Anillo Metropolitano',
                'ciudad'          => 'Santa Cruz de la Sierra',
                'tecnologia'      => 'FTTH GPON',
                'capacidad_nodos' => 800,
                'activo'          => true,
            ]
        );

        // 4. Clientes iniciales (CU05)
        $cliente1 = Cliente::firstOrCreate(
            ['documento_identidad' => '8492019'],
            [
                'codigo_cliente'      => 'CLI-10001',
                'tipo_documento'      => 'CI',
                'nombres'             => 'Carlos Andrés',
                'apellidos'           => 'Mendoza Paredes',
                'telefono'            => '+591 76543210',
                'email'               => 'carlos.mendoza@email.com',
                'direccion'           => 'Av. Siempre Viva #742',
                'zona_id'             => $zonaNorte->id,
                'estado'              => 'ACTIVO',
            ]
        );

        // 5. Servicio de Internet inicial (CU08)
        ServicioInternet::firstOrCreate(
            ['codigo_servicio' => 'SRV-88201'],
            [
                'cliente_id'            => $cliente1->id,
                'plan_nombre'           => 'Plan Fibra Ultra 100 Mbps',
                'velocidad_mbps'        => 100,
                'precio_mensual'        => 220.00,
                'ip_asignada'           => '192.168.10.45',
                'mac_router'            => 'E4:8D:8C:1A:2B:3C',
                'direccion_instalacion' => 'Av. Siempre Viva #742',
                'fecha_instalacion'     => now()->subMonths(2),
                'fecha_activacion'      => now()->subMonths(2),
                'estado_servicio'       => 'ACTIVO',
                'dia_corte'             => 10,
            ]
        );
    }
}
