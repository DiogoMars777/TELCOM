<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Transición segura de datos: rol `cajero` -> `secretaria`.
 *
 * Motivo: los actores internos oficiales del proyecto son Administrador,
 * Secretaría y Técnico. El rol denominado `cajero` corresponde funcionalmente
 * a `secretaria`.
 *
 * Esta migración NO cambia el esquema. Solo renombra el mismo registro de
 * `roles` (mismo `id`), por lo que:
 *   - las asignaciones de usuarios (`users.rol_id`) se conservan,
 *   - las relaciones de la tabla pivote `rol_permiso` se conservan,
 *   - no se elimina ni se duplica ningún registro.
 *
 * Es defensiva: si ya existe un rol `secretaria`, no hace nada.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $cajero = DB::table('roles')->where('slug', 'cajero')->first();

        // Solo renombra si el rol antiguo existe y aún no hay un `secretaria`.
        if ($cajero && ! DB::table('roles')->where('slug', 'secretaria')->exists()) {
            DB::table('roles')->where('id', $cajero->id)->update([
                'slug'        => 'secretaria',
                'nombre'      => 'Secretaría',
                'descripcion' => 'Registro de clientes, servicios, mensualidades, cobros, cortes y reactivaciones',
                'updated_at'  => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $secretaria = DB::table('roles')->where('slug', 'secretaria')->first();

        if ($secretaria && ! DB::table('roles')->where('slug', 'cajero')->exists()) {
            DB::table('roles')->where('id', $secretaria->id)->update([
                'slug'       => 'cajero',
                'nombre'     => 'Cajero / Cobranzas',
                'updated_at' => now(),
            ]);
        }
    }
};
