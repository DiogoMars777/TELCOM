<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Migración de DATOS (aditiva e idempotente): permiso `planes.manage`.
 *
 * CU16 (Gestionar catálogo de planes de Internet) corresponde al Administrador
 * según la matriz del proyecto. Los permisos existentes `planes.view` y
 * `planes.assign` los comparten Administrador y Secretaría (necesarios para
 * CU17), pero las operaciones de creación/edición/activación/desactivación del
 * catálogo deben ser EXCLUSIVAS del Administrador.
 *
 * Esta migración:
 *   - crea el permiso si no existe (no duplica),
 *   - lo asigna ÚNICAMENTE al rol `admin`,
 *   - no toca ningún otro rol, permiso ni relación existente.
 *
 * Es defensiva: si el rol `admin` aún no existiera (base recién creada antes
 * del seeder), crea el permiso pero no falla al no haber rol al que asignarlo.
 */
return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $permisoId = DB::table('permisos')->where('slug', 'planes.manage')->value('id');

        if ($permisoId === null) {
            $permisoId = DB::table('permisos')->insertGetId([
                'slug'       => 'planes.manage',
                'nombre'     => 'Gestionar Catálogo de Planes',
                'modulo'     => 'PLANES',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $adminId = DB::table('roles')->where('slug', 'admin')->value('id');

        if ($adminId !== null) {
            $yaAsignado = DB::table('rol_permiso')
                ->where('rol_id', $adminId)
                ->where('permiso_id', $permisoId)
                ->exists();

            if (! $yaAsignado) {
                DB::table('rol_permiso')->insert([
                    'rol_id'     => $adminId,
                    'permiso_id' => $permisoId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        $permisoId = DB::table('permisos')->where('slug', 'planes.manage')->value('id');

        if ($permisoId !== null) {
            DB::table('rol_permiso')->where('permiso_id', $permisoId)->delete();
            DB::table('permisos')->where('id', $permisoId)->delete();
        }
    }
};
