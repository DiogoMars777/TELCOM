<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Cambio de la etiqueta VISIBLE del rol administrador:
 *   "Administrador de Sistema" -> "Administrador".
 *
 * Es una migración de DATOS, no de esquema. Solo actualiza la columna `nombre`
 * del MISMO registro de `roles` con `slug = 'admin'`, por lo que se conservan:
 *   - el id del rol,
 *   - el slug interno `admin` (usado por la autorización y el RBAC),
 *   - las asignaciones de usuarios (`users.rol_id`),
 *   - la matriz de permisos (`rol_permiso`).
 *
 * No crea ni duplica roles. Si el rol todavía no existiese (por ejemplo, en una
 * base recién creada antes del seeder), no hace nada y no falla.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('roles')
            ->where('slug', 'admin')
            ->update(['nombre' => 'Administrador', 'updated_at' => now()]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('roles')
            ->where('slug', 'admin')
            ->update(['nombre' => 'Administrador de Sistema', 'updated_at' => now()]);
    }
};
