<?php

namespace Database\Seeders;

use App\Models\Paquetes\SeguridadAdministracion\CU03_UsuariosRolesPermisos\Permiso;
use App\Models\Paquetes\SeguridadAdministracion\CU03_UsuariosRolesPermisos\Rol;
use App\Models\Paquetes\GestionClientesZonas\CU04_ZonasCobertura\ZonaCobertura;
use App\Models\Paquetes\GestionClientesZonas\CU05_RegistrarCliente\Cliente;
use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\EstadoServicio;
use App\Models\Paquetes\ServiciosPlanes\CU08_RegistrarActivarServicio\ServicioInternet;
use App\Models\Paquetes\ServiciosPlanes\Planes\AsignacionPlan;
use App\Models\Paquetes\ServiciosPlanes\Planes\PlanInternet;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Roles internos oficiales: admin, secretaria, tecnico.
     * El Cliente, el Sistema, el Servicio IA y la Pasarela de Pago NO son
     * cuentas de empleados y no se crean como roles de esta tabla.
     */
    public function run(): void
    {
        // 1. Roles internos (CU03)
        $rolAdmin = Rol::firstOrCreate(
            ['slug' => 'admin'],
            ['nombre' => 'Administrador', 'descripcion' => 'Acceso total: usuarios, roles, zonas, proveedores, compras y reportes']
        );
        $rolSecretaria = Rol::firstOrCreate(
            ['slug' => 'secretaria'],
            ['nombre' => 'Secretaría', 'descripcion' => 'Registro de clientes, servicios, mensualidades, cobros, cortes y reactivaciones']
        );
        $rolTecnico = Rol::firstOrCreate(
            ['slug' => 'tecnico'],
            ['nombre' => 'Técnico', 'descripcion' => 'Equipos en comodato e instalaciones']
        );

        // 2. Usuario Administrador Principal - con rol válido asignado
        $admin = User::firstOrCreate(
            ['email' => 'admin@telcom.com'],
            [
                'name'     => 'Administrador Senior TELCOM',
                'password' => Hash::make('password123'),
                'rol_id'   => $rolAdmin->id,
                'activo'   => true,
            ]
        );

        // Garantiza el rol aunque el usuario ya existiera de una ejecución previa
        if ($admin->rol_id === null) {
            $admin->rol_id = $rolAdmin->id;
            $admin->save();
        }

        // 3. Catálogo de permisos internos (CU03)
        //    - Los permisos de CU01-CU15 ya tienen rutas.
        //    - Los de PLANES/EQUIPOS/INSTALACIONES/PROVEEDORES/COMPRAS/REPORTES
        //      se definen ahora para los módulos previstos; se aplicarán a sus
        //      rutas cuando existan (no se crean endpoints ficticios aquí).
        $permisos = [
            // CU01 - Sesión
            ['slug' => 'auth.login', 'nombre' => 'Iniciar Sesión', 'modulo' => 'CU01'],
            // CU02 - Auditoría
            ['slug' => 'auditoria.view', 'nombre' => 'Consultar Bitácora', 'modulo' => 'CU02'],
            // CU03 - Usuarios / roles / permisos
            ['slug' => 'usuarios.manage', 'nombre' => 'Gestionar Usuarios, Roles y Permisos', 'modulo' => 'CU03'],
            // CU04 - Zonas
            ['slug' => 'zonas.manage', 'nombre' => 'Gestionar Zonas de Cobertura', 'modulo' => 'CU04'],
            // CU05-CU07 - Clientes
            ['slug' => 'clientes.create', 'nombre' => 'Registrar Cliente', 'modulo' => 'CU05'],
            ['slug' => 'clientes.view', 'nombre' => 'Consultar Clientes', 'modulo' => 'CU06'],
            ['slug' => 'clientes.update', 'nombre' => 'Actualizar y Baja de Cliente', 'modulo' => 'CU07'],
            // CU08 - Servicios (lectura y escritura separadas)
            ['slug' => 'servicios.view', 'nombre' => 'Consultar Servicios', 'modulo' => 'CU08'],
            ['slug' => 'servicios.manage', 'nombre' => 'Registrar / Activar Servicio', 'modulo' => 'CU08'],
            // CU09 - Mensualidades (lectura y generación separadas)
            ['slug' => 'mensualidades.view', 'nombre' => 'Consultar Mensualidades', 'modulo' => 'CU09'],
            ['slug' => 'mensualidades.generate', 'nombre' => 'Generar Mensualidades', 'modulo' => 'CU09'],
            // CU10-CU11 - Pagos
            ['slug' => 'pagos.register', 'nombre' => 'Registrar Pago Presencial', 'modulo' => 'CU10'],
            ['slug' => 'pagos.history', 'nombre' => 'Consultar Historial de Pagos', 'modulo' => 'CU11'],
            // CU12 - Alertas
            ['slug' => 'alertas.view', 'nombre' => 'Consultar Alertas de Vencimiento', 'modulo' => 'CU12'],
            // CU13-CU14 - Cortes
            ['slug' => 'cortes.list', 'nombre' => 'Consultar Servicios para Corte', 'modulo' => 'CU13'],
            ['slug' => 'cortes.register', 'nombre' => 'Registrar Corte Realizado', 'modulo' => 'CU14'],
            // CU15 - Reactivaciones
            ['slug' => 'reactivaciones.manage', 'nombre' => 'Gestionar Reactivaciones', 'modulo' => 'CU15'],
            // Planes (módulo previsto)
            ['slug' => 'planes.view', 'nombre' => 'Consultar Planes', 'modulo' => 'PLANES'],
            ['slug' => 'planes.assign', 'nombre' => 'Asignar Planes', 'modulo' => 'PLANES'],
            // Equipos / comodato (módulo previsto)
            ['slug' => 'equipos.view', 'nombre' => 'Consultar Equipos', 'modulo' => 'EQUIPOS'],
            ['slug' => 'equipos.manage', 'nombre' => 'Gestionar Catálogo de Equipos', 'modulo' => 'EQUIPOS'],
            ['slug' => 'equipos.assign', 'nombre' => 'Asignar / Reemplazar / Retirar Equipos en Comodato', 'modulo' => 'EQUIPOS'],
            // Instalaciones (módulo previsto)
            ['slug' => 'instalaciones.view', 'nombre' => 'Consultar Instalaciones', 'modulo' => 'INSTALACIONES'],
            ['slug' => 'instalaciones.schedule', 'nombre' => 'Programar Instalaciones', 'modulo' => 'INSTALACIONES'],
            ['slug' => 'instalaciones.execute', 'nombre' => 'Registrar Ejecución de Instalaciones', 'modulo' => 'INSTALACIONES'],
            // Proveedores y compras (solo administrador)
            ['slug' => 'proveedores.manage', 'nombre' => 'Gestionar Proveedores', 'modulo' => 'PROVEEDORES'],
            ['slug' => 'compras.manage', 'nombre' => 'Gestionar Compras', 'modulo' => 'COMPRAS'],
            // Reportes (dashboard gerencial / reportes inteligentes)
            ['slug' => 'reportes.view', 'nombre' => 'Ver Reportes Gerenciales', 'modulo' => 'REPORTES'],
        ];

        $ids = [];
        foreach ($permisos as $p) {
            $ids[$p['slug']] = Permiso::firstOrCreate(['slug' => $p['slug']], $p)->id;
        }

        // 4. Asignación rol -> permisos (matriz aprobada)
        $slugsSecretaria = [
            'auth.login',
            'clientes.create', 'clientes.view', 'clientes.update',
            'servicios.view', 'servicios.manage',
            'mensualidades.view', 'mensualidades.generate',
            'pagos.register', 'pagos.history',
            'alertas.view',
            'cortes.list', 'cortes.register',
            'reactivaciones.manage',
            'planes.view', 'planes.assign',
            'equipos.view', 'equipos.assign',
            'instalaciones.view', 'instalaciones.schedule',
        ];

        $slugsTecnico = [
            'auth.login',
            'clientes.view', 'servicios.view',
            'equipos.view', 'equipos.manage', 'equipos.assign',
            'instalaciones.view', 'instalaciones.execute',
        ];

        // El administrador conserva TODOS los permisos del catálogo.
        $rolAdmin->permisos()->sync(array_values($ids));

        // Secretaría y Técnico se ajustan exactamente a la matriz.
        $rolSecretaria->permisos()->sync(
            array_values(array_intersect_key($ids, array_flip($slugsSecretaria)))
        );
        $rolTecnico->permisos()->sync(
            array_values(array_intersect_key($ids, array_flip($slugsTecnico)))
        );

        // 5. Zonas de Cobertura iniciales (CU04)
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
        ZonaCobertura::firstOrCreate(
            ['codigo' => 'ZON-SUR'],
            [
                'nombre'          => 'Zona Sur - Anillo Metropolitano',
                'ciudad'          => 'Santa Cruz de la Sierra',
                'tecnologia'      => 'FTTH GPON',
                'capacidad_nodos' => 800,
                'activo'          => true,
            ]
        );

        // 6. Clientes iniciales (CU05)
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

        // 7. Servicio de Internet inicial (CU08)
        $servicio = ServicioInternet::firstOrCreate(
            ['codigo_servicio' => 'SRV-88201'],
            [
                'cliente_id'            => $cliente1->id,
                'plan_nombre'           => 'Fibra 200 Mbps',
                'velocidad_mbps'        => 200,
                'precio_mensual'        => 250.00,
                'ip_asignada'           => '10.10.0.15',
                'mac_router'            => 'AA:BB:CC:DD:EE:01',
                'direccion_instalacion' => 'Av. Siempre Viva #742',
                'fecha_instalacion'     => now()->subMonths(3)->toDateString(),
                'fecha_activacion'      => now()->subMonths(3)->toDateString(),
                'estado_servicio'       => 'ACTIVO',
                'dia_corte'             => 10,
            ]
        );

        // 8. Catálogo de estados de servicio (UML EstadoServicio).
        //    La migración de datos también los crea; aquí se refuerza para que
        //    un entorno recién sembrado quede completo.
        $estadosServicio = [
            'PENDIENTE_INSTALACION' => 'Servicio registrado, pendiente de instalación/verificación técnica.',
            'ACTIVO'                => 'Servicio habilitado y en funcionamiento.',
            'SUSPENDIDO'            => 'Servicio suspendido temporalmente.',
            'CORTADO'               => 'Servicio cortado por falta de pago u otra causa.',
        ];
        foreach ($estadosServicio as $nombre => $descripcion) {
            EstadoServicio::firstOrCreate(
                ['nombre_estado' => $nombre],
                ['descripcion' => $descripcion]
            );
        }

        // Enlaza el servicio sembrado con su EstadoServicio (UML "define").
        if ($servicio->estado_servicio_id === null) {
            $servicio->estado_servicio_id = EstadoServicio::where('nombre_estado', $servicio->estado_servicio)->value('id');
            $servicio->save();
        }

        // 9. Plan de Internet y asignación inicial del servicio (UML).
        //    El precio del plan se toma del propio servicio sembrado, no de los
        //    datos de demostración del sitio público.
        $plan = PlanInternet::firstOrCreate(
            [
                'nombre_plan'    => $servicio->plan_nombre,
                'velocidad_mbps' => $servicio->velocidad_mbps,
            ],
            [
                'precio_mensual' => $servicio->precio_mensual,
                'descripcion'    => 'Plan inicial de datos de ejemplo.',
                'activo'         => true,
            ]
        );

        if ($servicio->asignacionesPlan()->doesntExist()) {
            AsignacionPlan::create([
                'servicio_id'     => $servicio->id,
                'plan_id'         => $plan->id,
                'user_id'         => null, // No se inventa el autor de datos de ejemplo.
                'fecha_inicio'    => $servicio->fecha_activacion?->toDateString()
                    ?? $servicio->fecha_instalacion?->toDateString()
                    ?? now()->toDateString(),
                'fecha_fin'       => null,
                'precio_aplicado' => $servicio->precio_mensual,
                'motivo_cambio'   => 'Carga inicial de datos de ejemplo.',
            ]);
        }
    }
}
